import PropTypes from 'prop-types';
import { MapPin } from 'lucide-react';
import { THEME, CAT } from '../constants/theme.js';
import { pluralDays } from '../utils/helpers.js';
import familyPhoto from '../assets/family_back_00.png';

export default function Header({ phase, today, daysUntilTrip, currentDayNum }) {
  let subtitle;
  if (phase === 'preparation') {
    subtitle = daysUntilTrip > 0
      ? `До вылета: ${daysUntilTrip} ${pluralDays(daysUntilTrip)}`
      : 'Вылет уже сегодня!';
  } else if (phase === 'memories') {
    subtitle = 'Воспоминания о поездке';
  } else if (phase === 'birthday') {
    subtitle = 'С днём рождения, Дарья!';
  } else {
    subtitle = currentDayNum
      ? `День ${currentDayNum} из 11 · ${today.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}`
      : 'Активная поездка';
  }

  return (
    <header className="relative overflow-hidden">
      <img
        src={familyPhoto}
        alt=""
        aria-hidden="true"
        className="absolute top-0 right-0 h-full w-auto pointer-events-none select-none"
        style={{ opacity: 0.85 }}
      />
      <svg className="absolute bottom-0 left-0 opacity-10 pointer-events-none" width="150" height="80" viewBox="0 0 150 80" fill="none">
        <path d="M0 60 Q 25 40, 50 55 T 100 55 T 150 50 L 150 80 L 0 80 Z" fill={CAT.birthday.main} />
        <path d="M0 65 Q 25 50, 50 62 T 100 62 T 150 60 L 150 80 L 0 80 Z" fill={CAT.active.main} opacity="0.5" />
      </svg>

      <div className="relative px-4 sm:px-6 py-5 sm:py-7">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest mb-2" style={{ color: CAT.active.main }}>
          <MapPin size={12} />
          <span className="font-semibold">Нячанг · Вьетнам · 2026</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight" style={{ color: THEME.textDark }}>
          Конструктор отдыха
          <span className="block text-base sm:text-lg mt-1 font-normal italic" style={{ color: THEME.textMid }}>
            Оксана, Данил и Дарья
          </span>
        </h1>
        <div className="mt-3 text-sm font-medium" style={{ color: phase === 'birthday' ? CAT.birthday.main : THEME.textMid }}>
          {subtitle}
        </div>
        <p className="mt-3 text-xs sm:text-sm max-w-xl" style={{ color: THEME.textMuted }}>
          Libra Hotel Nha Trang · 04 Hung Vuong · 30 мая — 9 июня. Перетаскивайте карточки активностей в дни (на телефоне — тап и выбор дня).
        </p>
      </div>
    </header>
  );
}

Header.propTypes = {
  phase:          PropTypes.string.isRequired,
  today:          PropTypes.instanceOf(Date).isRequired,
  daysUntilTrip:  PropTypes.number,
  currentDayNum:  PropTypes.number,
};
