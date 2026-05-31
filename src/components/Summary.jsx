import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Compass } from 'lucide-react';
import { THEME, CAT } from '../constants/theme.js';
import { CARDS } from '../data/cards.js';
import { extractCostNumber, intensityColor } from '../utils/helpers.js';

export default function Summary({ schedule, daysList }) {
  const stats = useMemo(() => {
    const freeDays = daysList.filter(d => d.type === 'free' || d.type === 'birthday');
    const filledDays = freeDays.filter(d => (schedule[d.id] || []).length > 0);
    const allCards = freeDays.flatMap(d => (schedule[d.id] || []).map(id => CARDS.find(c => c.id === id)).filter(Boolean));
    const totalCost = allCards.reduce((sum, c) => sum + extractCostNumber(c.cost), 0);
    const avgIntensity = allCards.length > 0
      ? (allCards.reduce((s, c) => s + c.intensity, 0) / allCards.length).toFixed(1)
      : '—';
    const avgImpressions = allCards.length > 0
      ? (allCards.reduce((s, c) => s + c.impressions, 0) / allCards.length).toFixed(1)
      : '—';
    return {
      filled: filledDays.length,
      total: freeDays.length,
      cost: totalCost,
      avgIntensity,
      avgImpressions,
    };
  }, [schedule, daysList]);

  if (stats.filled === 0) {
    return (
      <div className="rounded-2xl border p-4" style={{ background: THEME.surface, borderColor: THEME.border }}>
        <h3 className="text-sm font-bold mb-3 font-display flex items-center gap-2" style={{ color: THEME.textDark }}>
          <Compass size={16} style={{ color: CAT.active.main }} />
          Сводка по плану
        </h3>
        <p className="text-sm text-center py-4" style={{ color: THEME.textMuted }}>
          Начните с выбора активностей выше
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-4" style={{ background: THEME.surface, borderColor: THEME.border }}>
      <h3 className="text-sm font-bold mb-3 font-display flex items-center gap-2" style={{ color: THEME.textDark }}>
        <Compass size={16} style={{ color: CAT.active.main }} />
        Сводка по плану
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <div className="text-2xl font-bold font-display" style={{ color: CAT.active.main }}>
            {stats.filled}<span className="text-base" style={{ color: THEME.textMuted }}>/{stats.total}</span>
          </div>
          <div className="text-[11px] uppercase tracking-wider" style={{ color: THEME.textMuted }}>Дней заполнено</div>
        </div>
        <div>
          <div className="text-2xl font-bold font-display" style={{ color: CAT.birthday.main }}>
            ~{stats.cost}<span className="text-base">$</span>
          </div>
          <div className="text-[11px] uppercase tracking-wider" style={{ color: THEME.textMuted }}>Бюджет экскурсий</div>
        </div>
        <div>
          <div className="text-2xl font-bold font-display" style={{ color: intensityColor(parseFloat(stats.avgIntensity) || 0) }}>
            {stats.avgIntensity}
          </div>
          <div className="text-[11px] uppercase tracking-wider" style={{ color: THEME.textMuted }}>Сред. темп</div>
        </div>
        <div>
          <div className="text-2xl font-bold font-display" style={{ color: CAT.rest.main }}>
            {stats.avgImpressions}
          </div>
          <div className="text-[11px] uppercase tracking-wider" style={{ color: THEME.textMuted }}>Сред. впечатл.</div>
        </div>
      </div>
    </div>
  );
}

Summary.propTypes = {
  schedule: PropTypes.object.isRequired,
  daysList: PropTypes.array.isRequired,
};
