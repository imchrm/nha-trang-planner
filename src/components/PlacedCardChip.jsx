import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { THEME, CAT } from '../constants/theme.js';

export default function PlacedCardChip({ card, onRemove }) {
  const cat = CAT[card.cat];
  const Icon = cat.icon;
  return (
    <div
      className="rounded-xl p-3 border flex items-start gap-2 group"
      style={{ background: cat.soft, borderColor: cat.light }}
    >
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: cat.main, color: 'white' }}
      >
        <Icon size={16} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cat.main }}>
            {card.code}
          </span>
          <span className="text-[10px]" style={{ color: THEME.textMuted }}>
            {card.duration}
          </span>
        </div>
        <p className="text-sm font-semibold leading-tight font-display" style={{ color: THEME.textDark }}>
          {card.title}
        </p>
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white"
        style={{ color: THEME.textMuted }}
        title="Убрать"
      >
        <X size={14} />
      </button>
    </div>
  );
}

PlacedCardChip.propTypes = {
  card:     PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};
