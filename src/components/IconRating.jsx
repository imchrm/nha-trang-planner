import PropTypes from 'prop-types';
import { Star, Smile } from 'lucide-react';
import { THEME } from '../constants/theme.js';

export default function IconRating({ value, max = 10, type, color, softColor, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="text-[10px] font-semibold tracking-wide uppercase flex-shrink-0"
        style={{ color: THEME.textMuted, minWidth: '32px' }}
      >
        {label}
      </span>
      <div className="flex items-center" style={{ gap: '2px' }}>
        {Array.from({ length: max }, (_, i) => {
          const filled = i < value;
          return type === 'star' ? (
            <Star
              key={i}
              size={10}
              fill={filled ? color : 'none'}
              stroke={color}
              strokeWidth={1.8}
              style={{ opacity: filled ? 1 : 0.2, display: 'block' }}
            />
          ) : (
            <Smile
              key={i}
              size={10}
              fill={filled ? softColor : 'none'}
              stroke={color}
              strokeWidth={1.8}
              style={{ opacity: filled ? 1 : 0.2, display: 'block' }}
            />
          );
        })}
      </div>
    </div>
  );
}

IconRating.propTypes = {
  value:     PropTypes.number.isRequired,
  max:       PropTypes.number,
  type:      PropTypes.oneOf(['star', 'smile']).isRequired,
  color:     PropTypes.string.isRequired,
  softColor: PropTypes.string,
  label:     PropTypes.string.isRequired,
};
