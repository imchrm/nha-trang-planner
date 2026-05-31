import PropTypes from 'prop-types';
import { X, Calendar, Clock, Plus } from 'lucide-react';
import { THEME, CAT } from '../constants/theme.js';
import { CARDS } from '../data/cards.js';
import { DAYS } from '../data/days.js';
import { intensityColor } from '../utils/helpers.js';

export default function CardPickerModal({ dayId, schedule, placedIds, onSelect, onClose }) {
  if (!dayId) return null;
  const day = DAYS.find(d => d.id === dayId);
  if (!day) return null;

  // Filter: cards available for this day (correct category and not placed)
  const cardsForDay = CARDS.filter(c => {
    if (placedIds.has(c.id)) return false;
    if (day.type === 'birthday') return c.cat === 'birthday';
    return c.cat !== 'birthday';
  });

  // Compute remaining weight in day
  const placedOnDay = (schedule[dayId] || []).map(id => CARDS.find(c => c.id === id)).filter(Boolean);
  const usedWeight = placedOnDay.reduce((s, c) => s + c.weight, 0);
  const remainingWeight = 4 - usedWeight;

  // Card is placeable if weight fits OR it's a 2-day card (special-cased later in canPlaceCardOnDay)
  const fits = (card) => card.weight === 8 || card.weight <= remainingWeight;

  const grouped = day.type === 'birthday'
    ? [{ key: 'birthday', cards: cardsForDay.filter(fits) }]
    : [
        { key: 'active', cards: cardsForDay.filter(c => c.cat === 'active' && fits(c)) },
        { key: 'rest',   cards: cardsForDay.filter(c => c.cat === 'rest'   && fits(c)) },
      ];

  const totalAvailable = grouped.reduce((s, g) => s + g.cards.length, 0);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(45, 31, 26, 0.55)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto"
        style={{ background: THEME.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header inside the scrollable container */}
        <div
          className="sticky top-0 z-10 flex items-start justify-between px-5 pt-5 pb-3 border-b"
          style={{ background: THEME.surface, borderColor: THEME.border }}
        >
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest mb-1" style={{ color: THEME.textMuted }}>
              <Calendar size={12} />
              <span>{day.weekday}</span>
            </div>
            <h3 className="text-xl font-bold font-display" style={{ color: THEME.textDark }}>
              {day.label}
              {day.type === 'birthday' && (
                <span className="ml-2 text-sm font-normal italic" style={{ color: CAT.birthday.main }}>
                  · день рождения Дарьи
                </span>
              )}
            </h3>
            <p className="text-xs mt-1" style={{ color: THEME.textMuted }}>
              {day.type === 'birthday'
                ? 'Только сценарии празднования'
                : `Свободно: ${
                    remainingWeight === 4 ? 'весь день'
                    : remainingWeight === 2 ? 'полдня'
                    : remainingWeight === 1 ? 'короткая активность'
                    : 'нет места'
                  }`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
            style={{ color: THEME.textMuted }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content scrolls naturally */}
        <div className="px-5 pt-3 pb-6">
          {totalAvailable === 0 ? (
            <div className="text-center py-8" style={{ color: THEME.textMuted }}>
              <p className="text-sm">Нет доступных карточек для этого дня.</p>
              <p className="text-xs mt-1">Возможно, день уже занят или все подходящие карточки размещены в других днях.</p>
            </div>
          ) : (
            grouped.map(({ key, cards }) => {
              if (cards.length === 0) return null;
              const catInfo = CAT[key];
              const Icon = catInfo.icon;
              return (
                <div key={key} className="mb-4 last:mb-0">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: catInfo.main }}>
                    <Icon size={13} strokeWidth={2.2} />
                    {catInfo.label}
                    <span className="font-normal opacity-60">· {cards.length}</span>
                  </h4>
                  <div className="space-y-2">
                    {cards.map(card => (
                      <button
                        key={card.id}
                        onClick={() => { onSelect(card.id); onClose(); }}
                        className="w-full text-left p-3 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99]"
                        style={{ borderColor: THEME.border, background: THEME.surface }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = catInfo.main}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = THEME.border}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 mt-0.5"
                            style={{ background: catInfo.light, color: catInfo.main }}
                          >
                            {card.code}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm leading-tight font-display" style={{ color: THEME.textDark }}>
                              {card.title}
                              {card.subtitle && (
                                <span className="font-normal italic text-xs ml-1" style={{ color: THEME.textMuted }}>
                                  · {card.subtitle}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] mt-1 flex items-center gap-2 flex-wrap" style={{ color: THEME.textMuted }}>
                              <span className="inline-flex items-center gap-1">
                                <Clock size={10} />
                                {card.duration}
                              </span>
                              <span>· темп <strong style={{ color: intensityColor(card.intensity) }}>{card.intensity}</strong></span>
                              <span>· впеч. <strong style={{ color: catInfo.main }}>{card.impressions}</strong></span>
                              <span>· {card.cost}</span>
                            </div>
                          </div>
                          <Plus size={16} className="flex-shrink-0 mt-1" style={{ color: catInfo.main }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

CardPickerModal.propTypes = {
  dayId:     PropTypes.string,
  schedule:  PropTypes.object.isRequired,
  placedIds: PropTypes.instanceOf(Set).isRequired,
  onSelect:  PropTypes.func.isRequired,
  onClose:   PropTypes.func.isRequired,
};
