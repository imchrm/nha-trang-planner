import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { THEME, CAT } from '../constants/theme.js';

export default function DayPickerModal({ card, availableDays, onSelect, onClose }) {
  if (!card) return null;
  const cat = CAT[card.cat];

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(45, 31, 26, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[80vh] overflow-y-auto"
        style={{ background: THEME.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold font-display" style={{ color: THEME.textDark }}>
              В какой день?
            </h3>
            <p className="text-sm mt-1" style={{ color: THEME.textMuted }}>
              <span className="font-semibold" style={{ color: cat.main }}>{card.code}</span> · {card.title}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: THEME.textMuted }}>
            <X size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {availableDays.map(({ day, available, reason }) => (
            <button
              key={day.id}
              disabled={!available}
              onClick={() => onSelect(day.id)}
              className="w-full p-3 rounded-xl border text-left transition-all"
              style={{
                background: available ? THEME.surface : THEME.bgWarm,
                borderColor: available ? THEME.border : THEME.border,
                color: available ? THEME.textDark : THEME.textMuted,
                opacity: available ? 1 : 0.55,
                cursor: available ? 'pointer' : 'not-allowed',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold font-display">{day.label}</div>
                  <div className="text-xs" style={{ color: THEME.textMuted }}>{day.weekday}{day.note ? ` · ${day.note}` : ''}</div>
                </div>
                {!available && (
                  <span className="text-xs italic">{reason}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

DayPickerModal.propTypes = {
  card:          PropTypes.object,
  availableDays: PropTypes.array.isRequired,
  onSelect:      PropTypes.func.isRequired,
  onClose:       PropTypes.func.isRequired,
};
