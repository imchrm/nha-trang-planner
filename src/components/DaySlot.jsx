import PropTypes from 'prop-types';
import { Plus, Cake } from 'lucide-react';
import { THEME, CAT } from '../constants/theme.js';
import { getDayStatus } from '../utils/helpers.js';
import DurationColumn from './DurationColumn.jsx';
import PlacedCardChip from './PlacedCardChip.jsx';

export default function DaySlot({ day, placedCards, schedule, today, phase, onDrop, onRemove, onPickActivity, isDragOver, onDragOver, onDragLeave }) {
  const status = getDayStatus(day.date, today);
  const isToday = status === 'today';
  const isPast = status === 'past';
  const isBirthday = day.type === 'birthday';
  const isFixed = day.type === 'arrival' || day.type === 'departure';

  // Birthday glow on actual birthday day in birthday phase
  const birthdayGlow = isBirthday && phase === 'birthday';

  const handleDragOver = (e) => {
    if (isFixed) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver && onDragOver(day.id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isFixed) return;
    const cardId = e.dataTransfer.getData('text/plain');
    onDrop && onDrop(day.id, cardId);
  };

  const totalWeight = placedCards.reduce((sum, c) => sum + c.weight, 0);
  const isFull = totalWeight >= 4;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      className="rounded-2xl border-2 transition-all overflow-hidden"
      style={{
        background: birthdayGlow
          ? `linear-gradient(135deg, ${CAT.birthday.soft} 0%, ${THEME.surface} 100%)`
          : isFixed
          ? THEME.bgWarm
          : isToday
          ? `linear-gradient(135deg, ${CAT.active.soft} 0%, ${THEME.surface} 100%)`
          : isPast
          ? '#F2EADC'
          : THEME.surface,
        borderColor: isDragOver
          ? CAT.active.main
          : isBirthday
          ? CAT.birthday.main
          : isToday
          ? CAT.active.main
          : isFixed
          ? THEME.borderDark
          : THEME.border,
        borderStyle: isDragOver ? 'solid' : isBirthday ? 'solid' : 'solid',
        opacity: isPast && !isToday ? 0.65 : 1,
        boxShadow: birthdayGlow
          ? `0 0 0 4px ${CAT.birthday.light}50, 0 12px 32px ${CAT.birthday.light}40`
          : isToday
          ? `0 0 0 3px ${CAT.active.light}80`
          : 'none',
      }}
    >
      {/* Day header */}
      <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: THEME.border }}>
        <div className="flex items-center gap-3">
          <div className="text-left">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold font-display" style={{ color: THEME.textDark }}>
                {day.label}
              </span>
              <span className="text-xs" style={{ color: THEME.textMuted }}>
                {day.weekday}
              </span>
            </div>
            {day.note && (
              <p className="text-xs mt-0.5" style={{
                color: isBirthday ? CAT.birthday.main : THEME.textMuted,
                fontWeight: isBirthday ? 600 : 400
              }}>
                {isBirthday && <Cake size={11} className="inline mr-1" />}
                {day.note}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isToday && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse" style={{ background: CAT.active.main, color: 'white' }}>
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              СЕГОДНЯ
            </span>
          )}
          {isPast && !isToday && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ color: THEME.textMuted, background: THEME.bgWarm }}>
              прошло
            </span>
          )}
        </div>
      </div>

      {/* Day content */}
      <div className="p-3 space-y-2">
        {isFixed ? (
          <div className="text-center py-4">
            <p className="text-sm" style={{ color: THEME.textMid }}>
              {day.type === 'arrival' ? '✈ Прилёт в 8:00 утра, заселение, акклиматизация' : '✈ Выселение и трансфер в аэропорт'}
            </p>
          </div>
        ) : placedCards.length === 0 ? (
          <button
            onClick={() => onPickActivity(day.id)}
            className="w-full py-5 rounded-xl border-2 border-dashed transition-all hover:bg-white"
            style={{ borderColor: isBirthday ? CAT.birthday.main : THEME.border, color: isBirthday ? CAT.birthday.main : THEME.textMuted }}
          >
            <Plus size={18} className="inline mr-1" />
            <span className="text-sm font-medium">
              {isBirthday ? 'Выберите, как отметить!' : 'Добавить активность'}
            </span>
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              {/* Combined day capacity indicator */}
              <div className="flex-shrink-0 self-center">
                <DurationColumn
                  filled={Math.min(totalWeight, 4)}
                  color="#B8945A"
                  lightColor={THEME.border}
                />
              </div>
              {/* Cards stack */}
              <div className="flex-1 space-y-2 min-w-0">
                {placedCards.map((card) => (
                  <PlacedCardChip key={card.id} card={card} onRemove={() => onRemove(day.id, card.id)} />
                ))}
              </div>
            </div>
            {!isFull && (
              <button
                onClick={() => onPickActivity(day.id)}
                className="w-full mt-1 py-2 rounded-lg border border-dashed text-xs font-medium transition-colors hover:bg-white"
                style={{ borderColor: THEME.border, color: THEME.textMuted }}
              >
                <Plus size={12} className="inline mr-1" />
                Добавить ещё
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

DaySlot.propTypes = {
  day:            PropTypes.object.isRequired,
  placedCards:    PropTypes.array.isRequired,
  schedule:       PropTypes.object.isRequired,
  today:          PropTypes.instanceOf(Date).isRequired,
  phase:          PropTypes.string.isRequired,
  onDrop:         PropTypes.func,
  onRemove:       PropTypes.func,
  onPickActivity: PropTypes.func,
  isDragOver:     PropTypes.bool,
  onDragOver:     PropTypes.func,
  onDragLeave:    PropTypes.func,
};
