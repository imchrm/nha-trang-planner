import PropTypes from 'prop-types';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { THEME, CAT } from '../constants/theme.js';
import { CARDS } from '../data/cards.js';
import { intensityColor } from '../utils/helpers.js';

export default function IntensityChart({ schedule, daysList }) {
  const intensities = daysList.map(d => {
    if (d.type === 'arrival' || d.type === 'departure') return null;
    const cards = (schedule[d.id] || []).map(id => CARDS.find(c => c.id === id)).filter(Boolean);
    if (cards.length === 0) return 0;
    return Math.max(...cards.map(c => c.intensity));
  });

  const warnings = [];
  for (let i = 1; i < daysList.length - 1; i++) {
    const prev = intensities[i - 1];
    const curr = intensities[i];
    if (prev !== null && curr !== null && prev >= 7 && curr >= 7) {
      warnings.push(daysList[i].label);
    }
  }

  return (
    <div className="rounded-2xl border p-4" style={{ background: THEME.surface, borderColor: THEME.border }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold font-display flex items-center gap-2" style={{ color: THEME.textDark }}>
          <TrendingUp size={16} style={{ color: CAT.active.main }} />
          Ритм нагрузки
        </h3>
        <div className="flex items-center gap-2 text-[10px]" style={{ color: THEME.textMuted }}>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background:'#6B8E5A'}} />отдых</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background:'#D4A24C'}} />умеренно</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background:'#C04A2E'}} />активно</span>
        </div>
      </div>
      <div className="flex items-end gap-1 h-20">
        {daysList.map((d, idx) => {
          const intensity = intensities[idx];
          const isFixed = intensity === null;
          const height = isFixed ? 100 : intensity === 0 ? 8 : (intensity / 10) * 100;
          const color = isFixed ? THEME.borderDark : intensity === 0 ? THEME.border : intensityColor(intensity);
          return (
            <div key={d.id} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end" style={{ height: '64px' }}>
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${height}%`,
                    background: color,
                    opacity: isFixed ? 0.3 : intensity === 0 ? 0.4 : 0.9,
                    minHeight: '4px',
                  }}
                  title={isFixed ? d.note : intensity === 0 ? 'пусто' : `Интенсивность: ${intensity}`}
                />
              </div>
              <span className="text-[9px] font-medium" style={{ color: THEME.textMuted }}>
                {d.label.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
      {warnings.length > 0 && (
        <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg text-xs" style={{ background: '#FDF4E8', color: '#8B5A1E' }}>
          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
          <span>Подряд несколько активных дней ({warnings.join(', ')}). Стоит добавить день отдыха между ними.</span>
        </div>
      )}
    </div>
  );
}

IntensityChart.propTypes = {
  schedule: PropTypes.object.isRequired,
  daysList: PropTypes.array.isRequired,
};
