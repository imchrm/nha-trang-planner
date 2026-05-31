import PropTypes from 'prop-types';
import { RotateCcw } from 'lucide-react';
import { THEME } from '../constants/theme.js';

export default function ResetConfirmModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(45, 31, 26, 0.55)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: THEME.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: '#FDE8E4' }}
        >
          <RotateCcw size={22} style={{ color: '#C04A2E' }} />
        </div>
        <h3
          className="text-lg font-bold font-display text-center mb-2"
          style={{ color: THEME.textDark }}
        >
          Сбросить расписание?
        </h3>
        <p
          className="text-sm text-center mb-6"
          style={{ color: THEME.textMuted }}
        >
          Все добавленные активности будут удалены. Это действие нельзя отменить.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-colors"
            style={{
              background: THEME.bgWarm,
              color: THEME.textMid,
              border: `1px solid ${THEME.border}`,
            }}
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-colors"
            style={{ background: '#C04A2E', color: 'white' }}
          >
            Сбросить всё
          </button>
        </div>
      </div>
    </div>
  );
}

ResetConfirmModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel:  PropTypes.func.isRequired,
};
