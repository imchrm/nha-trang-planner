import PropTypes from 'prop-types';
import { Share2 } from 'lucide-react';
import { THEME, CAT } from '../constants/theme.js';

export default function LoadConflictModal({ onLoadUrl, onKeepLocal }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(45, 31, 26, 0.55)' }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: THEME.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: CAT.active.soft }}
        >
          <Share2 size={22} style={{ color: CAT.active.main }} />
        </div>
        <h3 className="text-lg font-bold font-display text-center mb-2" style={{ color: THEME.textDark }}>
          Два расписания
        </h3>
        <p className="text-sm text-center leading-relaxed mb-6" style={{ color: THEME.textMid }}>
          По ссылке передано новое расписание, но на этом устройстве уже есть сохранённое.
          Что загрузить?
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onLoadUrl}
            className="w-full py-3 rounded-2xl font-semibold text-sm"
            style={{ background: CAT.active.main, color: 'white' }}
          >
            Загрузить из ссылки
          </button>
          <button
            onClick={onKeepLocal}
            className="w-full py-3 rounded-2xl font-semibold text-sm"
            style={{ background: THEME.bgWarm, color: THEME.textMid, border: `1px solid ${THEME.border}` }}
          >
            Оставить моё
          </button>
        </div>
      </div>
    </div>
  );
}

LoadConflictModal.propTypes = {
  onLoadUrl:   PropTypes.func.isRequired,
  onKeepLocal: PropTypes.func.isRequired,
};
