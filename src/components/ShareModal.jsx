import { useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Share2, X, Link, Check, Download, Upload } from 'lucide-react';
import { THEME, CAT } from '../constants/theme.js';
import { CARDS } from '../data/cards.js';
import { DAYS } from '../data/days.js';
import { buildShareUrl } from '../utils/persistence.js';

export default function ShareModal({ schedule, onClose }) {
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);

  const isEmpty = Object.keys(schedule).length === 0;
  const shareUrl = useMemo(() => isEmpty ? null : buildShareUrl(schedule), [schedule, isEmpty]);

  const copyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const downloadJSON = () => {
    const filledDays = Object.keys(schedule).filter(k => schedule[k].length > 0);
    const data = {
      title: 'Нячанг 2026 — расписание',
      exportedAt: new Date().toISOString(),
      schedule,
      summary: {
        filledDays: filledDays.length,
        activities: filledDays.flatMap(d =>
          schedule[d].map(id => {
            const card = CARDS.find(c => c.id === id);
            const day  = DAYS.find(dy => dy.id === d);
            return { day: day?.label, activity: card?.title };
          })
        ),
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'nha-trang-2026.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleFileImport = (e) => {
    setImportError('');
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const loaded = parsed.schedule || parsed;
        if (typeof loaded !== 'object' || Array.isArray(loaded)) throw new Error();
        onClose(loaded); // pass loaded schedule back
      } catch {
        setImportError('Неверный формат файла. Используйте JSON, сохранённый этим приложением.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(45, 31, 26, 0.55)' }}
      onClick={() => onClose(null)}
    >
      <div
        className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: THEME.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b" style={{ borderColor: THEME.border }}>
          <h3 className="text-lg font-bold font-display flex items-center gap-2" style={{ color: THEME.textDark }}>
            <Share2 size={18} style={{ color: CAT.active.main }} />
            Поделиться расписанием
          </h3>
          <button
            onClick={() => onClose(null)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"
            style={{ color: THEME.textMuted }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {isEmpty ? (
            <p className="text-sm text-center py-4" style={{ color: THEME.textMuted }}>
              Расписание пустое — добавьте хотя бы одну активность, чтобы поделиться.
            </p>
          ) : (
            <>
              {/* QR code */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: THEME.textMuted }}>
                  QR-код для телефона
                </p>
                <div
                  className="p-2 rounded-2xl border"
                  style={{ borderColor: THEME.border }}
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}&bgcolor=FBF5EC&color=2D1F1A&margin=10`}
                    alt="QR код для открытия расписания"
                    width={180}
                    height={180}
                    className="rounded-xl"
                    style={{ display: 'block' }}
                  />
                </div>
                <p className="text-[11px] text-center" style={{ color: THEME.textMuted }}>
                  Наведи камеру телефона — расписание откроется сразу
                </p>
              </div>

              {/* Copy link */}
              <button
                onClick={copyLink}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all"
                style={{
                  background: copied ? CAT.rest.soft : CAT.active.soft,
                  color: copied ? CAT.rest.main : CAT.active.main,
                  border: `1.5px solid ${copied ? CAT.rest.light : CAT.active.light}`,
                }}
              >
                {copied
                  ? <><Check size={16} /> Ссылка скопирована!</>
                  : <><Link size={16} /> Скопировать ссылку</>}
              </button>
            </>
          )}

          <div className="border-t pt-4 space-y-2" style={{ borderColor: THEME.border }}>
            <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: THEME.textMuted }}>
              Файл JSON
            </p>

            {/* Export JSON */}
            {!isEmpty && (
              <button
                onClick={downloadJSON}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: THEME.bgWarm, color: THEME.textMid, border: `1px solid ${THEME.border}` }}
              >
                <Download size={15} />
                Сохранить расписание в файл
              </button>
            )}

            {/* Import JSON */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: THEME.bgWarm, color: THEME.textMid, border: `1px solid ${THEME.border}` }}
            >
              <Upload size={15} />
              Загрузить расписание из файла
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileImport}
            />

            {importError && (
              <p className="text-xs text-center" style={{ color: CAT.birthday.main }}>
                {importError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ShareModal.propTypes = {
  schedule: PropTypes.object.isRequired,
  onClose:  PropTypes.func.isRequired,
};
