import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Cake, Share2, RotateCcw, Heart, Calendar,
} from 'lucide-react';

import { THEME, CAT } from './constants/theme.js';
import { TRIP, DAYS } from './data/days.js';
import { CARDS } from './data/cards.js';
import { sameDay, getTripPhase, daysUntil, getDayStatus } from './utils/helpers.js';
import {
  saveScheduleLocally,
  loadScheduleLocally,
  readUrlSchedule,
  clearUrlHash,
} from './utils/persistence.js';
import { canPlaceCard } from './utils/scheduling.js';

import DaySlot from './components/DaySlot.jsx';
import IntensityChart from './components/IntensityChart.jsx';
import Summary from './components/Summary.jsx';
import ConfettiOverlay from './components/ConfettiOverlay.jsx';
import DayPickerModal from './components/DayPickerModal.jsx';
import CardPickerModal from './components/CardPickerModal.jsx';
import DebugPanel from './components/DebugPanel.jsx';
import Header from './components/Header.jsx';
import ShareModal from './components/ShareModal.jsx';
import LoadConflictModal from './components/LoadConflictModal.jsx';
import UrlLoadedBanner from './components/UrlLoadedBanner.jsx';
import BlockingAlertModal from './components/BlockingAlertModal.jsx';
import ResetConfirmModal from './components/ResetConfirmModal.jsx';
import ActivityCard from './components/ActivityCard.jsx';
import CategoryTabsComponent from './components/CategoryTabsComponent.jsx';

// getDayStatus is imported from helpers but not directly used in App render (used in DaySlot)
void getDayStatus; // suppress unused import warning

export default function App() {
  const [schedule, setSchedule] = useState({});
  const [activeCategory, setActiveCategory] = useState('active');
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [dragOverDayId, setDragOverDayId] = useState(null);
  const [pickerCard, setPickerCard] = useState(null);
  const [pickerForDay, setPickerForDay] = useState(null);
  const [mobileTab, setMobileTab] = useState('schedule');
  const [debugDate, setDebugDate] = useState(null);
  const [debugExpanded, setDebugExpanded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [blockingAlert, setBlockingAlert] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLoadConflict, setShowLoadConflict] = useState(false);
  const [pendingUrlSchedule, setPendingUrlSchedule] = useState(null);
  const [urlLoadedBanner, setUrlLoadedBanner] = useState(false);

  // Determine "today" for the app — debug override or real
  const today = useMemo(() => debugDate || new Date(), [debugDate]);
  const phase = useMemo(() => getTripPhase(today), [today]);
  const daysUntilTrip = useMemo(() => daysUntil(TRIP.arrival, today), [today]);
  const currentDayNum = useMemo(() => {
    const idx = DAYS.findIndex(d => sameDay(d.date, today));
    return idx >= 0 ? idx + 1 : null;
  }, [today]);

  // ── On mount: read localStorage + URL hash ─────────────────
  useEffect(() => {
    const urlSchedule   = readUrlSchedule();
    const localSchedule = loadScheduleLocally();
    const hasLocal = localSchedule && Object.keys(localSchedule).length > 0;

    if (urlSchedule) {
      clearUrlHash();
      if (hasLocal) {
        // Both exist — ask user (Variant B)
        setPendingUrlSchedule(urlSchedule);
        setSchedule(localSchedule);
        setShowLoadConflict(true);
      } else {
        // Only URL schedule
        setSchedule(urlSchedule);
        saveScheduleLocally(urlSchedule);
        setUrlLoadedBanner(true);
      }
    } else if (hasLocal) {
      setSchedule(localSchedule);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-save to localStorage on every change ────────────
  useEffect(() => {
    saveScheduleLocally(schedule);
  }, [schedule]);

  // Birthday confetti trigger
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (phase === 'birthday') {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 100);
      return () => clearTimeout(t);
    }
  }, [phase]);
  // re-fire confetti once when entering birthday phase
  useEffect(() => {
    if (phase === 'birthday') {
      setShowConfetti(true);
    }
  }, [phase]);

  // Set of placed card IDs across all days
  const placedIds = useMemo(() => {
    const set = new Set();
    Object.values(schedule).forEach(arr => arr.forEach(id => set.add(id)));
    return set;
  }, [schedule]);

  // Validate placement — delegates to pure canPlaceCard
  const canPlaceCardOnDay = useCallback((cardId, dayId) => {
    return canPlaceCard(cardId, dayId, schedule, placedIds);
  }, [schedule, placedIds]);

  const placeCard = useCallback((dayId, cardId) => {
    const check = canPlaceCardOnDay(cardId, dayId);
    if (!check.ok) {
      // Show contextual alert for 2-day card blocked by occupied next day
      const card = CARDS.find(c => c.id === cardId);
      if (card?.weight === 8 && check.blockingDay !== undefined) {
        const day1 = DAYS.find(d => d.id === dayId);
        setBlockingAlert({ card, day1, day2: check.blockingDay });
      }
      return;
    }
    const card = CARDS.find(c => c.id === cardId);
    setSchedule(prev => {
      const next = { ...prev };
      next[dayId] = [...(prev[dayId] || []), cardId];
      // For 2-day card, occupy next day too
      if (card.weight === 8) {
        const idx = DAYS.findIndex(d => d.id === dayId);
        const nextDay = DAYS[idx + 1];
        if (nextDay) {
          next[nextDay.id] = [...(prev[nextDay.id] || []), cardId];
        }
      }
      return next;
    });
    setDragOverDayId(null);
    setPickerCard(null);
    setPickerForDay(null);
  }, [canPlaceCardOnDay]);

  const removeCardFromDay = useCallback((dayId, cardId) => {
    setSchedule(prev => {
      const next = {};
      // Remove this cardId from ALL days (handles 2-day card)
      Object.entries(prev).forEach(([dId, ids]) => {
        const filtered = ids.filter(id => id !== cardId);
        if (filtered.length > 0) next[dId] = filtered;
      });
      return next;
    });
  }, []);

  const handleResetAll = () => {
    if (Object.keys(schedule).length === 0) return;
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setSchedule({});
    setShowResetConfirm(false);
  };

  const handleConflictLoadUrl = () => {
    if (pendingUrlSchedule) {
      setSchedule(pendingUrlSchedule);
      saveScheduleLocally(pendingUrlSchedule);
      setUrlLoadedBanner(true);
    }
    setPendingUrlSchedule(null);
    setShowLoadConflict(false);
  };

  const handleConflictKeepLocal = () => {
    setPendingUrlSchedule(null);
    setShowLoadConflict(false);
  };

  const handleShareModalClose = (importedSchedule) => {
    if (importedSchedule) {
      setSchedule(importedSchedule);
    }
    setShowShareModal(false);
  };

  // Open day picker for a card (mobile flow)
  const openPickerForCard = (card) => {
    setPickerCard(card);
  };
  // Open card picker for a day (works on all screen sizes via modal)
  const openPickerForDay = (dayId) => {
    setPickerForDay(dayId);
  };

  // Available days for a given card (with reasons)
  const availableDaysFor = useMemo(() => {
    if (!pickerCard) return [];
    return DAYS.map(day => {
      const check = canPlaceCardOnDay(pickerCard.id, day.id);
      return { day, available: check.ok, reason: check.reason };
    });
  }, [pickerCard, canPlaceCardOnDay]);

  const filteredCards = useMemo(() => CARDS.filter(c => c.cat === activeCategory), [activeCategory]);

  // Stats for mobile tab badge
  const filledCount = useMemo(() =>
    DAYS.filter(d => (d.type === 'free' || d.type === 'birthday') && (schedule[d.id] || []).length > 0).length,
    [schedule]
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <div
      className="min-h-screen"
      style={{
        background: phase === 'birthday'
          ? `linear-gradient(180deg, ${CAT.birthday.soft} 0%, ${THEME.bg} 30%)`
          : THEME.bg,
        color: THEME.textDark,
        fontFamily: '"Nunito", system-ui, sans-serif',
      }}
    >

      <ConfettiOverlay show={showConfetti} />

      {/* Birthday banner */}
      {phase === 'birthday' && (
        <div className="birthday-banner text-white text-center py-2 px-4 text-sm font-bold tracking-wider flex items-center justify-center gap-2">
          <Cake size={16} />
          <span>С ДНЁМ РОЖДЕНИЯ, ДАРЬЯ · 14 ЛЕТ</span>
          <button
            onClick={() => { setShowConfetti(false); setTimeout(() => setShowConfetti(true), 50); }}
            className="ml-3 text-[10px] underline opacity-75 hover:opacity-100"
          >
            конфетти ещё раз
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <Header phase={phase} today={today} daysUntilTrip={daysUntilTrip} currentDayNum={currentDayNum} />

        {/* Debug panel — only in development */}
        {import.meta.env.DEV && (
          <div className="px-4 sm:px-6 mb-3 no-print">
            <DebugPanel debugDate={debugDate} setDebugDate={setDebugDate} phase={phase} expanded={debugExpanded} setExpanded={setDebugExpanded} />
          </div>
        )}

        {/* === WIDE LAYOUT (≥ 640px): single column, cards on top === */}
        <div className="hidden sm:block px-4 sm:px-6 pb-10 space-y-5">
          {/* Cards palette — full width on top */}
          <section className="no-print">
            <CategoryTabsComponent active={activeCategory} onChange={setActiveCategory} placedIds={placedIds} />
            <div className="mt-3 space-y-3">
              {filteredCards.map(card => (
                <ActivityCard
                  key={card.id}
                  card={card}
                  expanded={expandedCardId === card.id}
                  onToggle={() => setExpandedCardId(expandedCardId === card.id ? null : card.id)}
                  onDragStart={() => {}}
                  onAddTo={openPickerForCard}
                  placed={placedIds.has(card.id)}
                  draggable
                />
              ))}
            </div>
          </section>

          {/* Schedule below cards */}
          <section className="space-y-4">
            <IntensityChart schedule={schedule} daysList={DAYS} />
            <div className="space-y-2.5">
              {DAYS.map(day => {
                const placedCards = (schedule[day.id] || []).map(id => CARDS.find(c => c.id === id)).filter(Boolean);
                return (
                  <DaySlot
                    key={day.id}
                    day={day}
                    placedCards={placedCards}
                    schedule={schedule}
                    today={today}
                    phase={phase}
                    isDragOver={dragOverDayId === day.id}
                    onDragOver={setDragOverDayId}
                    onDragLeave={() => setDragOverDayId(null)}
                    onDrop={placeCard}
                    onRemove={removeCardFromDay}
                    onPickActivity={openPickerForDay}
                  />
                );
              })}
            </div>
            <Summary schedule={schedule} daysList={DAYS} />
            <div className="flex items-center justify-between pb-4 no-print">
              <button
                onClick={() => setShowShareModal(true)}
                className="text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 font-semibold"
                style={{ color: CAT.active.main, background: CAT.active.soft }}
              >
                <Share2 size={13} />
                Поделиться
              </button>
              <button
                onClick={handleResetAll}
                className="text-xs px-3 py-2 rounded-lg flex items-center gap-1.5"
                style={{ color: THEME.textMuted, background: 'transparent' }}
              >
                <RotateCcw size={12} />
                Сбросить всё
              </button>
            </div>
          </section>
        </div>

        {/* === NARROW LAYOUT (< 640px): tab system === */}
        <div className="sm:hidden pb-24 px-4">
          {mobileTab === 'catalog' && (
            <div className="no-print">
              <CategoryTabsComponent active={activeCategory} onChange={setActiveCategory} compact placedIds={placedIds} />
              <div className="mt-3 space-y-3">
                {filteredCards.map(card => (
                  <ActivityCard
                    key={card.id}
                    card={card}
                    expanded={expandedCardId === card.id}
                    onToggle={() => setExpandedCardId(expandedCardId === card.id ? null : card.id)}
                    onAddTo={openPickerForCard}
                    placed={placedIds.has(card.id)}
                    draggable={false}
                  />
                ))}
              </div>
            </div>
          )}

          {mobileTab === 'schedule' && (
            <div className="space-y-3">
              <IntensityChart schedule={schedule} daysList={DAYS} />
              {DAYS.map(day => {
                const placedCards = (schedule[day.id] || []).map(id => CARDS.find(c => c.id === id)).filter(Boolean);
                return (
                  <DaySlot
                    key={day.id}
                    day={day}
                    placedCards={placedCards}
                    schedule={schedule}
                    today={today}
                    phase={phase}
                    isDragOver={false}
                    onDragOver={() => {}}
                    onDragLeave={() => {}}
                    onDrop={() => {}}
                    onRemove={removeCardFromDay}
                    onPickActivity={openPickerForDay}
                  />
                );
              })}
              <Summary schedule={schedule} daysList={DAYS} />
              <div className="flex gap-2 pb-4 no-print">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex-1 text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-semibold"
                  style={{ color: CAT.active.main, background: CAT.active.soft, border: `1px solid ${CAT.active.light}` }}
                >
                  <Share2 size={13} />
                  Поделиться
                </button>
                <button
                  onClick={handleResetAll}
                  className="flex-1 text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5"
                  style={{ color: THEME.textMuted, background: THEME.surface, border: `1px solid ${THEME.border}` }}
                >
                  <RotateCcw size={12} />
                  Сбросить всё
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom tab bar — narrow only */}
        <nav
          className="sm:hidden fixed bottom-0 left-0 right-0 border-t flex no-print"
          style={{
            background: THEME.surface,
            borderColor: THEME.border,
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <button
            onClick={() => { setMobileTab('catalog'); setPickerForDay(null); }}
            className="flex-1 py-3 flex flex-col items-center gap-0.5"
            style={{ color: mobileTab === 'catalog' ? CAT.active.main : THEME.textMuted }}
          >
            <Heart size={20} strokeWidth={mobileTab === 'catalog' ? 2.5 : 1.8} />
            <span className="text-[11px] font-semibold">Карточки</span>
          </button>
          <button
            onClick={() => { setMobileTab('schedule'); setPickerForDay(null); }}
            className="flex-1 py-3 flex flex-col items-center gap-0.5 relative"
            style={{ color: mobileTab === 'schedule' ? CAT.active.main : THEME.textMuted }}
          >
            <Calendar size={20} strokeWidth={mobileTab === 'schedule' ? 2.5 : 1.8} />
            <span className="text-[11px] font-semibold">Дни</span>
            {filledCount > 0 && (
              <span
                className="absolute top-1 right-[calc(50%-28px)] text-[10px] font-bold rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center"
                style={{ background: CAT.birthday.main, color: 'white' }}
              >
                {filledCount}
              </span>
            )}
          </button>
        </nav>

      </div>

      <DayPickerModal
        card={pickerCard}
        availableDays={availableDaysFor}
        onSelect={(dayId) => placeCard(dayId, pickerCard.id)}
        onClose={() => setPickerCard(null)}
      />

      <CardPickerModal
        dayId={pickerForDay}
        schedule={schedule}
        placedIds={placedIds}
        onSelect={(cardId) => placeCard(pickerForDay, cardId)}
        onClose={() => setPickerForDay(null)}
      />

      {showResetConfirm && (
        <ResetConfirmModal
          onConfirm={confirmReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}

      {blockingAlert && (
        <BlockingAlertModal
          data={blockingAlert}
          onClose={() => setBlockingAlert(null)}
        />
      )}

      {showShareModal && (
        <ShareModal
          schedule={schedule}
          onClose={handleShareModalClose}
        />
      )}

      {showLoadConflict && (
        <LoadConflictModal
          onLoadUrl={handleConflictLoadUrl}
          onKeepLocal={handleConflictKeepLocal}
        />
      )}

      {urlLoadedBanner && (
        <UrlLoadedBanner onDismiss={() => setUrlLoadedBanner(false)} />
      )}
    </div>
  );
}
