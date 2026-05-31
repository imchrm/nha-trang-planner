import PropTypes from 'prop-types';
import { THEME, CAT } from '../constants/theme.js';
import { CARDS } from '../data/cards.js';

export default function CategoryTabsComponent({ active, onChange, compact = false, placedIds }) {
  const keys = ['birthday', 'active', 'rest'];
  return (
    <div className={`flex gap-1.5 ${compact ? 'overflow-x-auto scroll-no-bar' : 'flex-wrap'}`}>
      {keys.map(k => {
        const cat = CAT[k];
        const Icon = cat.icon;
        const isActive = active === k;
        // Count cards in this category that are NOT yet placed
        const remaining = placedIds
          ? CARDS.filter(c => c.cat === k && !placedIds.has(c.id)).length
          : 0;
        return (
          <button
            key={k}
            onClick={() => onChange(k)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
            style={{
              background: isActive ? cat.main : cat.soft,
              color: isActive ? 'white' : cat.main,
              boxShadow: isActive ? `0 4px 12px ${cat.main}40` : 'none',
            }}
          >
            <Icon size={14} strokeWidth={2} />
            <span>{compact ? cat.short : cat.label}</span>
            {remaining > 0 && (
              <span
                className="text-[10px] font-bold rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.3)' : cat.main,
                  color: 'white',
                }}
              >
                {remaining}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

CategoryTabsComponent.propTypes = {
  active:    PropTypes.string.isRequired,
  onChange:  PropTypes.func.isRequired,
  compact:   PropTypes.bool,
  placedIds: PropTypes.instanceOf(Set),
};
