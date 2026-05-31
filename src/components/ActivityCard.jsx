import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp, Plus, Sparkles } from 'lucide-react';
import { THEME, CAT } from '../constants/theme.js';
import { intensityColor } from '../utils/helpers.js';
import DurationIndicator from './DurationIndicator.jsx';
import IconRating from './IconRating.jsx';

export default function ActivityCard({ card, expanded, onToggle, onDragStart, onAddTo, placed, draggable }) {
  const cat = CAT[card.cat];
  const Icon = cat.icon;

  const handleDragStart = (e) => {
    if (!draggable || placed) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.id);
    onDragStart && onDragStart(card.id);
  };

  return (
    <div
      draggable={draggable && !placed}
      onDragStart={handleDragStart}
      className="rounded-2xl border transition-all"
      style={{
        background: placed ? '#F5EEDE' : THEME.surface,
        borderColor: expanded ? cat.main : THEME.border,
        opacity: placed ? 0.45 : 1,
        cursor: draggable && !placed ? 'grab' : 'default',
        boxShadow: expanded ? `0 8px 24px ${cat.light}55` : '0 2px 8px rgba(45, 31, 26, 0.04)',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 text-left"
        style={{ color: THEME.textDark }}
      >
        <div className="flex items-start gap-2.5">
          {/* Duration indicator: vertically centered to match icon height */}
          <div className="flex-shrink-0 h-10 flex items-center">
            <DurationIndicator weight={card.weight} color={cat.main} lightColor={cat.light} />
          </div>
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: cat.soft, color: cat.main }}
          >
            <Icon size={20} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                style={{ background: cat.light, color: cat.main }}
              >
                {card.code}
              </span>
              <span className="text-[11px]" style={{ color: THEME.textMuted }}>
                {card.duration}
              </span>
            </div>
            <h3 className="font-semibold text-[15px] leading-tight font-display" style={{ color: THEME.textDark }}>
              {card.title}
            </h3>
            {card.subtitle && (
              <p className="text-xs mt-0.5" style={{ color: THEME.textMuted }}>
                {card.subtitle}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <IconRating
                value={card.intensity}
                type="star"
                color={intensityColor(card.intensity)}
                softColor={intensityColor(card.intensity)}
                label="Темп"
              />
              <IconRating
                value={card.impressions}
                type="smile"
                color={cat.main}
                softColor={cat.soft}
                label="Впеч."
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            {expanded ? <ChevronUp size={18} style={{ color: THEME.textMuted }} /> : <ChevronDown size={18} style={{ color: THEME.textMuted }} />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t" style={{ borderColor: THEME.border }}>
          <p className="text-sm leading-relaxed pt-2" style={{ color: THEME.textMid }}>
            {card.desc}
          </p>
          {card.tips && (
            <div className="text-xs italic px-3 py-2 rounded-lg" style={{ background: cat.soft, color: THEME.textMid }}>
              <Sparkles size={12} className="inline mr-1" style={{ color: cat.main }} />
              {card.tips}
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold" style={{ color: cat.main }}>
              {card.cost}
            </span>
            {!placed && onAddTo && (
              <button
                onClick={(e) => { e.stopPropagation(); onAddTo(card); }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                style={{ background: cat.main, color: 'white' }}
              >
                <Plus size={14} className="inline mr-1" />
                Добавить в день
              </button>
            )}
            {placed && (
              <span className="text-xs italic" style={{ color: THEME.textMuted }}>
                уже в расписании
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

ActivityCard.propTypes = {
  card:        PropTypes.object.isRequired,
  expanded:    PropTypes.bool,
  onToggle:    PropTypes.func,
  onDragStart: PropTypes.func,
  onAddTo:     PropTypes.func,
  placed:      PropTypes.bool,
  draggable:   PropTypes.bool,
};
