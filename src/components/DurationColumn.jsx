import PropTypes from 'prop-types';

export default function DurationColumn({ filled, color, lightColor }) {
  return (
    <div className="flex flex-col" style={{ gap: '2px' }}>
      {Array.from({ length: 4 }, (_, i) => {
        const isFilled = i < filled;
        return (
          <div
            key={i}
            style={{
              width:        '7px',
              height:       '7px',
              borderRadius: '2px',
              background:   isFilled ? color : 'transparent',
              border:       `1.5px solid ${isFilled ? color : lightColor}`,
              opacity:      isFilled ? 1 : 0.45,
            }}
          />
        );
      })}
    </div>
  );
}

DurationColumn.propTypes = {
  filled:     PropTypes.number.isRequired,
  color:      PropTypes.string.isRequired,
  lightColor: PropTypes.string.isRequired,
};
