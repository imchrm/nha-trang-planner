import PropTypes from 'prop-types';
import { Bug, ChevronUp, ChevronDown } from 'lucide-react';

export default function DebugPanel({ debugDate, setDebugDate, phase, expanded, setExpanded }) {
  const presets = [
    { label: 'До поездки', date: new Date(2026, 4, 15) },
    { label: 'Прилёт',     date: new Date(2026, 4, 30) },
    { label: 'Середина',   date: new Date(2026, 5, 2) },
    { label: 'День Р.',    date: new Date(2026, 5, 5) },
    { label: 'Отъезд',     date: new Date(2026, 5, 9) },
    { label: 'После',      date: new Date(2026, 5, 15) },
    { label: 'Реальная',   date: null },
  ];

  return (
    <div className="rounded-xl border" style={{ background: '#FFF9F0', borderColor: '#E0C896' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-2 flex items-center justify-between text-xs"
        style={{ color: '#8B5A1E' }}
      >
        <span className="flex items-center gap-1.5 font-semibold">
          <Bug size={12} />
          DEBUG · фаза: {phase}
        </span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {expanded && (
        <div className="px-2 pb-2 flex flex-wrap gap-1">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => setDebugDate(p.date)}
              className="text-[10px] px-2 py-1 rounded font-medium transition-colors"
              style={{
                background: (debugDate?.getTime() === p.date?.getTime() || (!debugDate && !p.date)) ? '#8B5A1E' : 'white',
                color: (debugDate?.getTime() === p.date?.getTime() || (!debugDate && !p.date)) ? 'white' : '#8B5A1E',
                border: '1px solid #E0C896',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

DebugPanel.propTypes = {
  debugDate:    PropTypes.instanceOf(Date),
  setDebugDate: PropTypes.func.isRequired,
  phase:        PropTypes.string.isRequired,
  expanded:     PropTypes.bool.isRequired,
  setExpanded:  PropTypes.func.isRequired,
};
