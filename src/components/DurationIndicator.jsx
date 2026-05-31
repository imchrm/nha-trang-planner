import PropTypes from 'prop-types';
import DurationColumn from './DurationColumn.jsx';

export default function DurationIndicator({ weight, color, lightColor }) {
  // 2-day card (weight 8): two full columns side by side
  if (weight >= 8) {
    return (
      <div className="flex" style={{ gap: '3px' }}>
        <DurationColumn filled={4} color={color} lightColor={lightColor} />
        <DurationColumn filled={4} color={color} lightColor={lightColor} />
      </div>
    );
  }
  // Single column: fill min(weight, 4) squares from top
  return <DurationColumn filled={Math.min(weight, 4)} color={color} lightColor={lightColor} />;
}

DurationIndicator.propTypes = {
  weight:     PropTypes.number.isRequired,
  color:      PropTypes.string.isRequired,
  lightColor: PropTypes.string.isRequired,
};
