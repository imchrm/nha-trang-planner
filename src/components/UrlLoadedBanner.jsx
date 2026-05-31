import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Check, X } from 'lucide-react';
import { CAT } from '../constants/theme.js';

export default function UrlLoadedBanner({ onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className="fixed top-4 left-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg text-sm font-medium"
      style={{
        transform: 'translateX(-50%)',
        background: CAT.active.main,
        color: 'white',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      <Check size={16} />
      Расписание загружено из ссылки и сохранено
      <button onClick={onDismiss} className="ml-1 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

UrlLoadedBanner.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};
