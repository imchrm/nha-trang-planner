import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CAT } from '../constants/theme.js';

export default function ConfettiOverlay({ show }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!show) {
      setPieces([]);
      return;
    }
    const colors = [CAT.birthday.main, CAT.active.main, CAT.rest.main, '#E8C547', '#F08672'];
    const generated = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 3 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
    setPieces(generated);
    const t = setTimeout(() => setPieces([]), 6000);
    return () => clearTimeout(t);
  }, [show]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute confetti-piece"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.4}px`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
}

ConfettiOverlay.propTypes = {
  show: PropTypes.bool,
};
