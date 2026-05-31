import PropTypes from 'prop-types';
import { Calendar } from 'lucide-react';
import { THEME } from '../constants/theme.js';

export default function BlockingAlertModal({ data, onClose }) {
  if (!data) return null;
  const { card, day1, day2 } = data;

  let body;
  if (!day2) {
    // Next day doesn't exist — selected day is the last available
    body = (
      <>
        Эта поездка занимает два дня подряд, но{' '}
        <strong style={{ color: THEME.textDark }}>{day1?.label}</strong> — последний
        доступный день. Выберите более раннюю дату начала.
      </>
    );
  } else if (day2.type !== 'free') {
    // Next day is birthday or departure — not a regular free slot
    body = (
      <>
        Эта поездка занимает два дня подряд:{' '}
        <strong style={{ color: THEME.textDark }}>{day1?.label}</strong> и{' '}
        <strong style={{ color: THEME.textDark }}>{day2.label}</strong>. Но{' '}
        <strong style={{ color: THEME.textDark }}>{day2.label}</strong> — особый день
        (день рождения или отъезд), он недоступен. Выберите более раннюю дату начала.
      </>
    );
  } else {
    // Next day exists and is free but occupied by another card
    body = (
      <>
        Эта поездка занимает два дня подряд:{' '}
        <strong style={{ color: THEME.textDark }}>{day1?.label}</strong> и{' '}
        <strong style={{ color: THEME.textDark }}>{day2.label}</strong>. Но{' '}
        <strong style={{ color: THEME.textDark }}>{day2.label}</strong> уже занят —
        уберите из него активность и попробуйте снова.
      </>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(45, 31, 26, 0.55)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: THEME.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: '#FEF3E0' }}
        >
          <Calendar size={22} style={{ color: '#B8762A' }} />
        </div>
        <h3
          className="text-lg font-bold font-display text-center mb-1"
          style={{ color: THEME.textDark }}
        >
          Нельзя добавить поездку
        </h3>
        <p
          className="text-xs text-center mb-1 font-medium"
          style={{ color: '#B8762A' }}
        >
          {card?.title}
        </p>
        <p
          className="text-sm text-center leading-relaxed mb-6"
          style={{ color: THEME.textMid }}
        >
          {body}
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-semibold text-sm"
          style={{ background: '#B8762A', color: 'white' }}
        >
          Понятно
        </button>
      </div>
    </div>
  );
}

BlockingAlertModal.propTypes = {
  data:    PropTypes.shape({
    card: PropTypes.object,
    day1: PropTypes.object,
    day2: PropTypes.object,
  }),
  onClose: PropTypes.func.isRequired,
};
