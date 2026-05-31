import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Cake, Waves, Leaf, Plus, X, Calendar, MapPin, Sparkles,
  ChevronDown, ChevronUp, RotateCcw, Bug, Sun, Clock,
  TrendingUp, AlertTriangle, Heart, Coffee, Compass,
  Star, Smile, Share2, Upload, Download, Link, Check
} from 'lucide-react';

// ============================================================
// THEME & CATEGORIES
// ============================================================

const THEME = {
  bg:        '#FBF5EC',
  bgWarm:    '#F5EBD8',
  surface:   '#FFFFFF',
  textDark:  '#2D1F1A',
  textMid:   '#5D4A3F',
  textMuted: '#8A7A6E',
  border:    '#E8DCC8',
  borderDark:'#C9B895',
};

const CAT = {
  birthday: { label: 'День рождения', short: 'День рождения', icon: Cake,  main: '#D85A3E', light: '#F5C9BB', soft: '#FDEDE6' },
  active:   { label: 'Активные дни',  short: 'Активные дни',  icon: Waves, main: '#1E7A7A', light: '#9DCDCD', soft: '#E8F4F4' },
  rest:     { label: 'Отдых и релакс',short: 'Отдых',         icon: Leaf,  main: '#6B8E5A', light: '#BFD3B0', soft: '#EEF3E6' },
};

// ============================================================
// TRIP DATA
// ============================================================

const TRIP = {
  arrival:   new Date(2026, 4, 30),
  birthday:  new Date(2026, 5, 5),
  departure: new Date(2026, 5, 9),
};

const DAYS = [
  { id: 'd1',  date: new Date(2026, 4, 30), label: '30 мая', weekday: 'суббота',     type: 'arrival',   note: 'Прилёт' },
  { id: 'd2',  date: new Date(2026, 4, 31), label: '31 мая', weekday: 'воскресенье', type: 'free' },
  { id: 'd3',  date: new Date(2026, 5, 1),  label: '1 июня', weekday: 'понедельник', type: 'free' },
  { id: 'd4',  date: new Date(2026, 5, 2),  label: '2 июня', weekday: 'вторник',     type: 'free' },
  { id: 'd5',  date: new Date(2026, 5, 3),  label: '3 июня', weekday: 'среда',       type: 'free' },
  { id: 'd6',  date: new Date(2026, 5, 4),  label: '4 июня', weekday: 'четверг',     type: 'free' },
  { id: 'd7',  date: new Date(2026, 5, 5),  label: '5 июня', weekday: 'пятница',     type: 'birthday', note: 'День рождения Дарьи' },
  { id: 'd8',  date: new Date(2026, 5, 6),  label: '6 июня', weekday: 'суббота',     type: 'free' },
  { id: 'd9',  date: new Date(2026, 5, 7),  label: '7 июня', weekday: 'воскресенье', type: 'free' },
  { id: 'd10', date: new Date(2026, 5, 8),  label: '8 июня', weekday: 'понедельник', type: 'free' },
  { id: 'd11', date: new Date(2026, 5, 9),  label: '9 июня', weekday: 'вторник',     type: 'departure', note: 'Отъезд' },
];

const CARDS = [
  // === BIRTHDAY (7) ===
  { id: 'BD1', code: 'ДР-1', cat: 'birthday', title: 'Emperor Cruises', subtitle: 'закатный круиз',
    duration: 'Полдня', weight: 2, intensity: 2, impressions: 10, cost: 'По запросу',
    desc: 'Трансфер из отеля в 15:35. Скоростной катер к судну. Коктейли на верхней палубе на закате, живая музыка (скрипка и гитара). Ужин из 5 блюд (лобстер / стейк / лосось). Безлимитные напитки. Wi-Fi на борту. Возврат около 20:00.',
    tips: 'Идеально для эстетичного, статусного празднования.' },
  { id: 'BD2', code: 'ДР-2', cat: 'birthday', title: 'Sailing Club + фаер-шоу', subtitle: 'пляжная вечеринка',
    duration: 'Вечер', weight: 1, intensity: 4, impressions: 8, cost: '~40-60$',
    desc: '326 м от отеля. Бронь столика на пляже к 19:30. Пицца в нью-йоркском стиле, бургеры, десерты. После 21:00 — масштабное огненное шоу на песке, диджей-сеты.',
    tips: 'Молодёжный вайб, громкая музыка. Прийти до 20:00 — после клуб заполняется.' },
  { id: 'BD3', code: 'ДР-3', cat: 'birthday', title: 'Skylight + Sailing Club', subtitle: 'комбо: закат + ужин',
    duration: 'Вечер', weight: 1, intensity: 5, impressions: 9, cost: '~60-80$',
    desc: 'В 17:30 — крыша небоскрёба Skylight, панорама 360°, стеклянный пол над пропастью, фото на закате. В 19:30 спуск и переход в Sailing Club на ужин и фаер-шоу.',
    tips: 'Два контрастных впечатления за один вечер.' },
  { id: 'BD4', code: 'ДР-4', cat: 'birthday', title: 'Частный катер на Хон Там', subtitle: 'остров и снорклинг',
    duration: 'Весь день', weight: 4, intensity: 5, impressions: 8, cost: 'от 100$',
    desc: 'Аренда катера на полдня. Частный пляж, снорклинг, фотосессия на фоне моря и островов. Полная свобода маршрута. Вечером — праздничный ужин в ресторане.',
    tips: 'Торт заказать заранее в ABC Bakery.' },
  { id: 'BD5', code: 'ДР-5', cat: 'birthday', title: 'Адреналин на пляже', subtitle: 'парасейлинг и джетски',
    duration: 'Весь день', weight: 4, intensity: 7, impressions: 7, cost: '~100-150$',
    desc: 'Парасейлинг, банан, таблетка, джетски — активный день на воде, крики и смех. Вечером — праздничный ужин с тортом в Louisiane Brewhouse.',
    tips: 'Бронировать ужин заранее.' },
  { id: 'BD6', code: 'ДР-6', cat: 'birthday', title: 'СПА мама + дочка', subtitle: 'девичий формат',
    duration: 'Весь день', weight: 4, intensity: 2, impressions: 6, cost: '~50-80$',
    desc: 'Массаж, маникюр, уходовые процедуры для мамы и именинницы. Данил в это время — бассейн или прогулка. Вечером — торт и ужин в ресторане.',
    tips: 'Спокойный девичий формат празднования.' },
  { id: 'BD7', code: 'ДР-7', cat: 'birthday', title: 'Louisiane Brewhouse', subtitle: 'классический ужин',
    duration: 'Вечер', weight: 1, intensity: 2, impressions: 5, cost: '~50-80$',
    desc: 'Ресторан прямо на пляже, столики у воды, европейская и вьетнамская кухня, бассейн. Спокойный праздничный ужин с тортом.',
    tips: 'Бронировать заранее. Торт за 1-2 дня в ABC Bakery, от 300 тыс. VND.' },

  // === ACTIVE (13) ===
  { id: 'AC1', code: 'А-1', cat: 'active', title: 'VinWonders', subtitle: 'полный день',
    duration: 'Весь день', weight: 4, intensity: 8, impressions: 10, cost: '~120-125$',
    desc: 'Канатная дорога 3.3 км над морем на остров Хон Тре. Американские горки, аквапарк с горками, океанариум, ботанический сад, игровые зоны. Вечером Tata Show в 19:30.',
    tips: 'Взять купальники, сменную одежду, крем SPF 50+.' },
  { id: 'AC2', code: 'А-2', cat: 'active', title: 'VinWonders вечерний', subtitle: 'билет с 16:00',
    duration: 'Полдня', weight: 2, intensity: 6, impressions: 8, cost: '~80$',
    desc: 'Вход после 16:00 за 660 тыс. VND. Обход пиковой жары, фокус на горках на закате и ночном шоу Tata Show.',
    tips: 'Меньше времени на аквапарк, но экономия и никаких очередей.' },
  { id: 'AC3', code: 'А-3', cat: 'active', title: 'Далат: классика', subtitle: '1 день, обзорная',
    duration: 'Весь день', weight: 4, intensity: 7, impressions: 9, cost: '~90-200$',
    desc: 'Выезд 07:00-08:30, возврат около 20:00. Серпантин 3 часа в одну сторону. Crazy House, пагода Линь Фуок, контактный зоопарк, кофейная плантация, стеклянный мост, рынок Далата.',
    tips: 'Взять лёгкую кофту (+22...+25) и таблетки от укачивания!' },
  { id: 'AC4', code: 'А-4', cat: 'active', title: 'Далат: экстрим', subtitle: 'High Rope и сани',
    duration: 'Весь день', weight: 4, intensity: 9, impressions: 9, cost: '~150-200$',
    desc: 'Ранний выезд 06:30. Верёвочный курс Datanla High Rope, зиплайны, спуск на альпийских санях. Затем Crazy House и Старый железнодорожный вокзал.',
    tips: 'Максимум адреналина за один день.' },
  { id: 'AC5', code: 'А-5', cat: 'active', title: 'Далат: 2 дня / 1 ночь', subtitle: 'без спешки',
    duration: '2 дня', weight: 8, intensity: 7, impressions: 10, cost: '~200-300$',
    desc: 'День 1: Clay Tunnel, Crazy House, озеро Суан Хыонг, вечерний рынок. Ночь в отеле Далата. День 2: водопад Датанла с High Rope с утра в прохладе, пагода Линь Фуок, зоопарк. Возврат к 17:30.',
    tips: 'Занимает два соседних дня. Больше впечатлений, меньше усталости от дороги.' },
  { id: 'AC6', code: 'А-6', cat: 'active', title: 'Южные острова', subtitle: 'снорклинг на рифе',
    duration: 'Весь день', weight: 4, intensity: 6, impressions: 8, cost: '~120-180$',
    desc: 'Экскурсия 08:00-16:00. Снорклинг у кораллового рифа Хон Мун (морской заповедник), аквариум Три Нгуен, плавучий бар. Обед на борту включён.',
    tips: 'Маска и трубка предоставляются, но свои удобнее.' },
  { id: 'AC7', code: 'А-7', cat: 'active', title: 'Северные острова', subtitle: 'обезьяны и слоны',
    duration: 'Весь день', weight: 4, intensity: 5, impressions: 7, cost: '~120-150$',
    desc: 'Остров Обезьян (Hon Lao): цирковое шоу обезьян, кормление. Остров Орхидей (Hon Heo): катание на слонах, мини-зоопарк, джунгли.',
    tips: 'Больше про животных, чем про снорклинг.' },
  { id: 'AC8', code: 'А-8', cat: 'active', title: 'Водопады Ба Хо', subtitle: 'треккинг в джунглях',
    duration: 'Полдня', weight: 2, intensity: 8, impressions: 7, cost: '~10-15$',
    desc: '25 км к северу. Треккинг через джунгли по валунам, три уровня водопадов. Купание в природных бассейнах, прыжки со скал.',
    tips: 'Нужны кроссовки или спортивные сандалии. Подросткам зайдёт.' },
  { id: 'AC9', code: 'А-9', cat: 'active', title: 'Ба Хо + пляж Зоклет', subtitle: 'комбо: горы и море',
    duration: 'Весь день', weight: 4, intensity: 7, impressions: 8, cost: '~50-70$',
    desc: 'Утро: водопады Ба Хо. Днём: пляж Зоклет (Doc Let, 50 км) — белый песок, мелкое спокойное море. Аренда машины с водителем на день.',
    tips: 'Комбо из активности и расслабления.' },
  { id: 'AC10', code: 'А-10', cat: 'active', title: 'Экопарк Янг Бей', subtitle: 'водопады и страусы',
    duration: 'Весь день', weight: 4, intensity: 5, impressions: 7, cost: '~120$',
    desc: '45 км, около часа езды. Водопады, горячие минеральные источники, шоу племени Раглай, мини-зоопарк, катание на страусах (до 70 кг), кормление животных, рыбалка.',
    tips: 'Обед включён в экскурсию.' },
  { id: 'AC11', code: 'А-11', cat: 'active', title: 'Водные аттракционы', subtitle: 'на городском пляже',
    duration: 'Полдня', weight: 2, intensity: 7, impressions: 6, cost: '~60-100$',
    desc: 'Парасейлинг (около 30$ за полёт), банан, таблетка, джетски, каякинг. Всё на городском пляже, можно комбинировать с отдыхом на шезлонге.',
    tips: 'Можно растянуть на полдня.' },
  { id: 'AC12', code: 'А-12', cat: 'active', title: 'Обзорная по городу', subtitle: 'По Нагар, Будда, собор',
    duration: 'Полдня', weight: 2, intensity: 4, impressions: 6, cost: '~10-15$',
    desc: 'Башни По Нагар (чамский храм VIII века), пагода Лонг Шон (гигантский Будда, 2 км от отеля), Католический собор Нячанга. Такси между точками.',
    tips: 'Удобно совмещать с грязями Тхап Ба (рядом с По Нагар).' },
  { id: 'AC13', code: 'А-13', cat: 'active', title: 'Chum Show / Life Puppet', subtitle: 'вечернее шоу',
    duration: 'Вечер', weight: 1, intensity: 2, impressions: 7, cost: '~40-60$',
    desc: 'Театр Do Theatre. Акробатика, народные танцы, визуальное шоу. Языковой барьер не мешает.',
    tips: 'Отличная вечерняя активность после пляжного дня.' },

  // === REST (10) ===
  { id: 'RS1', code: 'Р-1', cat: 'rest', title: 'I-Resort: грязи + аквапарк', subtitle: 'полный комплекс',
    duration: 'Полдня', weight: 2, intensity: 4, impressions: 7, cost: '~40-50$',
    desc: 'Такси около 120 тыс. VND. Грязевые ванны 20 минут, травяные ванны, бассейны с минеральной водой, джакузи, водопады. Аквапарк с горками включён в пакет.',
    tips: 'Провести 3-5 часов. Приезжать к 8:00 или после 15:00.' },
  { id: 'RS2', code: 'Р-2', cat: 'rest', title: 'Тхап Ба', subtitle: 'старейшие грязи',
    duration: 'Полдня', weight: 2, intensity: 3, impressions: 5, cost: '~36$',
    desc: 'Самая старая грязелечебница Нячанга, рядом с башнями По Нагар. Проще и аутентичнее, чем I-Resort, без аквапарка.',
    tips: 'Удобно совмещать с обзорной экскурсией.' },
  { id: 'RS3', code: 'Р-3', cat: 'rest', title: 'Galina Spa', subtitle: 'пешком от отеля',
    duration: 'Полдня', weight: 2, intensity: 2, impressions: 5, cost: '~30-50$',
    desc: '31 Hung Vuong — в шаговой доступности от отеля. Грязи, минеральные ванны, массаж, сауна. Без такси и переездов.',
    tips: 'Самый удобный вариант грязей.' },
  { id: 'RS4', code: 'Р-4', cat: 'rest', title: 'Городской пляж', subtitle: 'у отеля',
    duration: 'Весь день', weight: 4, intensity: 2, impressions: 3, cost: '~10-20$',
    desc: '260 м от отеля. Шезлонг около 2$. Море +29°C, небольшая волна. Кафе на набережной для обеда.',
    tips: 'Уходить с пляжа к 11:00 или использовать SPF 50+.' },
  { id: 'RS5', code: 'Р-5', cat: 'rest', title: 'Зоклет / Бай Зай', subtitle: 'удалённый пляж',
    duration: 'Весь день', weight: 4, intensity: 3, impressions: 6, cost: '~30-50$',
    desc: '50 км к северу. Белый песок, мелкое спокойное море, минимум людей. Контраст с городским пляжем. Такси или аренда машины.',
    tips: 'Можно совместить с водопадами Ба Хо.' },
  { id: 'RS6', code: 'Р-6', cat: 'rest', title: 'Бассейн в отеле', subtitle: 'полный релакс',
    duration: 'Весь день', weight: 4, intensity: 1, impressions: 2, cost: '0$',
    desc: 'Крытый бассейн Libra Hotel, фитнес-зал. Идеален для восстановления после насыщенного дня или для акклиматизации.',
    tips: 'Подростки могут самостоятельно выходить за стрит-фудом.' },
  { id: 'RS7', code: 'Р-7', cat: 'rest', title: 'Шоппинг и рынки', subtitle: 'Vincom + Night Market',
    duration: 'Полдня', weight: 2, intensity: 3, impressions: 5, cost: 'по желанию',
    desc: 'Vincom Plaza (893 м от отеля) — современный ТЦ. Ночной рынок — уличная еда, сувениры, одежда. Рынок Dam Market — фрукты, специи, кофе, подарки.',
    tips: 'Можно растянуть на весь день.' },
  { id: 'RS8', code: 'Р-8', cat: 'rest', title: 'СПА и массаж', subtitle: 'вьетнамский массаж',
    duration: '2-3 часа', weight: 1, intensity: 1, impressions: 4, cost: '~25-40$',
    desc: 'Вьетнамский массаж 8-12$/час. Маникюр, уходовые процедуры. Доступно практически повсеместно.',
    tips: 'Отличное завершение активного дня.' },
  { id: 'RS9', code: 'Р-9', cat: 'rest', title: 'Океанографический музей', subtitle: 'рядом с портом',
    duration: '1.5 часа', weight: 1, intensity: 2, impressions: 4, cost: '~5-10$',
    desc: 'National Oceanographic Museum, рядом с портом. Морские обитатели, скелеты китов. Небольшой.',
    tips: 'Хорошо сочетается с обзорной экскурсией.' },
  { id: 'RS10', code: 'Р-10', cat: 'rest', title: 'Гастроквест', subtitle: 'по стрит-фуду',
    duration: 'Полдня', weight: 2, intensity: 3, impressions: 6, cost: '~15-30$',
    desc: 'Самостоятельный маршрут по кафе и уличным точкам: фо-бо, бан-ми, нэмы, свежие соки, тропические фрукты, морепродукты на гриле.',
    tips: 'Подросткам можно дать автономию с бюджетом.' },
];

// ============================================================
// UTILITIES
// ============================================================

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// ============================================================
// PERSISTENCE & SHARING UTILITIES
// ============================================================

const LS_KEY = 'nha-trang-planner-schedule';

function encodeSchedule(schedule) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(schedule))));
  } catch { return null; }
}

function decodeSchedule(encoded) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))));
  } catch { return null; }
}

function buildShareUrl(schedule) {
  const encoded = encodeSchedule(schedule);
  if (!encoded) return window.location.href;
  const base = window.location.origin + window.location.pathname;
  return `${base}#s=${encoded}`;
}

function saveScheduleLocally(schedule) {
  try {
    if (Object.keys(schedule).length === 0) {
      localStorage.removeItem(LS_KEY);
    } else {
      localStorage.setItem(LS_KEY, JSON.stringify(schedule));
    }
  } catch { /* localStorage unavailable */ }
}

function loadScheduleLocally() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function readUrlSchedule() {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith('#s=')) return null;
    return decodeSchedule(hash.slice(3));
  } catch { return null; }
}

function clearUrlHash() {
  try {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  } catch { /* ignore */ }
}

function getTripPhase(now) {
  if (now < TRIP.arrival && !sameDay(now, TRIP.arrival)) return 'preparation';
  if (now > TRIP.departure && !sameDay(now, TRIP.departure)) return 'memories';
  if (sameDay(now, TRIP.birthday)) return 'birthday';
  return 'active';
}

function getDayStatus(dayDate, now) {
  if (sameDay(dayDate, now)) return 'today';
  if (dayDate < now) return 'past';
  return 'future';
}

function daysUntil(target, from) {
  const ms = target - from;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function extractCostNumber(costStr) {
  const match = costStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function intensityColor(value) {
  if (value <= 3) return '#6B8E5A'; // green - rest
  if (value <= 6) return '#D4A24C'; // yellow - moderate
  if (value <= 8) return '#D87A3E'; // orange - active
  return '#C04A2E'; // red - extreme
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

// ============================================================
// DURATION INDICATOR
// ============================================================

function DurationColumn({ filled, color, lightColor }) {
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

function DurationIndicator({ weight, color, lightColor }) {
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

function IconRating({ value, max = 10, type, color, softColor, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="text-[10px] font-semibold tracking-wide uppercase flex-shrink-0"
        style={{ color: THEME.textMuted, minWidth: '32px' }}
      >
        {label}
      </span>
      <div className="flex items-center" style={{ gap: '2px' }}>
        {Array.from({ length: max }, (_, i) => {
          const filled = i < value;
          return type === 'star' ? (
            <Star
              key={i}
              size={10}
              fill={filled ? color : 'none'}
              stroke={color}
              strokeWidth={1.8}
              style={{ opacity: filled ? 1 : 0.2, display: 'block' }}
            />
          ) : (
            <Smile
              key={i}
              size={10}
              fill={filled ? softColor : 'none'}
              stroke={color}
              strokeWidth={1.8}
              style={{ opacity: filled ? 1 : 0.2, display: 'block' }}
            />
          );
        })}
      </div>
    </div>
  );
}

function ActivityCard({ card, expanded, onToggle, onDragStart, onAddTo, placed, draggable }) {
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

function PlacedCardChip({ card, onRemove }) {
  const cat = CAT[card.cat];
  const Icon = cat.icon;
  return (
    <div
      className="rounded-xl p-3 border flex items-start gap-2 group"
      style={{ background: cat.soft, borderColor: cat.light }}
    >
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: cat.main, color: 'white' }}
      >
        <Icon size={16} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cat.main }}>
            {card.code}
          </span>
          <span className="text-[10px]" style={{ color: THEME.textMuted }}>
            {card.duration}
          </span>
        </div>
        <p className="text-sm font-semibold leading-tight font-display" style={{ color: THEME.textDark }}>
          {card.title}
        </p>
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white"
        style={{ color: THEME.textMuted }}
        title="Убрать"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function DaySlot({ day, placedCards, schedule, today, phase, onDrop, onRemove, onPickActivity, isDragOver, onDragOver, onDragLeave }) {
  const status = getDayStatus(day.date, today);
  const isToday = status === 'today';
  const isPast = status === 'past';
  const isBirthday = day.type === 'birthday';
  const isFixed = day.type === 'arrival' || day.type === 'departure';

  // Birthday glow on actual birthday day in birthday phase
  const birthdayGlow = isBirthday && phase === 'birthday';

  const handleDragOver = (e) => {
    if (isFixed) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver && onDragOver(day.id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isFixed) return;
    const cardId = e.dataTransfer.getData('text/plain');
    onDrop && onDrop(day.id, cardId);
  };

  const totalWeight = placedCards.reduce((sum, c) => sum + c.weight, 0);
  const isFull = totalWeight >= 4;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      className="rounded-2xl border-2 transition-all overflow-hidden"
      style={{
        background: birthdayGlow
          ? `linear-gradient(135deg, ${CAT.birthday.soft} 0%, ${THEME.surface} 100%)`
          : isFixed
          ? THEME.bgWarm
          : isToday
          ? `linear-gradient(135deg, ${CAT.active.soft} 0%, ${THEME.surface} 100%)`
          : isPast
          ? '#F2EADC'
          : THEME.surface,
        borderColor: isDragOver
          ? CAT.active.main
          : isBirthday
          ? CAT.birthday.main
          : isToday
          ? CAT.active.main
          : isFixed
          ? THEME.borderDark
          : THEME.border,
        borderStyle: isDragOver ? 'solid' : isBirthday ? 'solid' : 'solid',
        opacity: isPast && !isToday ? 0.65 : 1,
        boxShadow: birthdayGlow
          ? `0 0 0 4px ${CAT.birthday.light}50, 0 12px 32px ${CAT.birthday.light}40`
          : isToday
          ? `0 0 0 3px ${CAT.active.light}80`
          : 'none',
      }}
    >
      {/* Day header */}
      <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: THEME.border }}>
        <div className="flex items-center gap-3">
          <div className="text-left">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold font-display" style={{ color: THEME.textDark }}>
                {day.label}
              </span>
              <span className="text-xs" style={{ color: THEME.textMuted }}>
                {day.weekday}
              </span>
            </div>
            {day.note && (
              <p className="text-xs mt-0.5" style={{
                color: isBirthday ? CAT.birthday.main : THEME.textMuted,
                fontWeight: isBirthday ? 600 : 400
              }}>
                {isBirthday && <Cake size={11} className="inline mr-1" />}
                {day.note}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isToday && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse" style={{ background: CAT.active.main, color: 'white' }}>
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              СЕГОДНЯ
            </span>
          )}
          {isPast && !isToday && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ color: THEME.textMuted, background: THEME.bgWarm }}>
              прошло
            </span>
          )}
        </div>
      </div>

      {/* Day content */}
      <div className="p-3 space-y-2">
        {isFixed ? (
          <div className="text-center py-4">
            <p className="text-sm" style={{ color: THEME.textMid }}>
              {day.type === 'arrival' ? '✈ Прилёт в 8:00 утра, заселение, акклиматизация' : '✈ Выселение и трансфер в аэропорт'}
            </p>
          </div>
        ) : placedCards.length === 0 ? (
          <button
            onClick={() => onPickActivity(day.id)}
            className="w-full py-5 rounded-xl border-2 border-dashed transition-all hover:bg-white"
            style={{ borderColor: isBirthday ? CAT.birthday.main : THEME.border, color: isBirthday ? CAT.birthday.main : THEME.textMuted }}
          >
            <Plus size={18} className="inline mr-1" />
            <span className="text-sm font-medium">
              {isBirthday ? 'Выберите, как отметить!' : 'Добавить активность'}
            </span>
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              {/* Combined day capacity indicator */}
              <div className="flex-shrink-0 self-center">
                <DurationColumn
                  filled={Math.min(totalWeight, 4)}
                  color="#B8945A"
                  lightColor={THEME.border}
                />
              </div>
              {/* Cards stack */}
              <div className="flex-1 space-y-2 min-w-0">
                {placedCards.map((card) => (
                  <PlacedCardChip key={card.id} card={card} onRemove={() => onRemove(day.id, card.id)} />
                ))}
              </div>
            </div>
            {!isFull && (
              <button
                onClick={() => onPickActivity(day.id)}
                className="w-full mt-1 py-2 rounded-lg border border-dashed text-xs font-medium transition-colors hover:bg-white"
                style={{ borderColor: THEME.border, color: THEME.textMuted }}
              >
                <Plus size={12} className="inline mr-1" />
                Добавить ещё
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function IntensityChart({ schedule, daysList }) {
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

function Summary({ schedule, daysList }) {
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

function ConfettiOverlay({ show, onReplay }) {
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

function DayPickerModal({ card, availableDays, onSelect, onClose }) {
  if (!card) return null;
  const cat = CAT[card.cat];

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(45, 31, 26, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[80vh] overflow-y-auto"
        style={{ background: THEME.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold font-display" style={{ color: THEME.textDark }}>
              В какой день?
            </h3>
            <p className="text-sm mt-1" style={{ color: THEME.textMuted }}>
              <span className="font-semibold" style={{ color: cat.main }}>{card.code}</span> · {card.title}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: THEME.textMuted }}>
            <X size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {availableDays.map(({ day, available, reason }) => (
            <button
              key={day.id}
              disabled={!available}
              onClick={() => onSelect(day.id)}
              className="w-full p-3 rounded-xl border text-left transition-all"
              style={{
                background: available ? THEME.surface : THEME.bgWarm,
                borderColor: available ? THEME.border : THEME.border,
                color: available ? THEME.textDark : THEME.textMuted,
                opacity: available ? 1 : 0.55,
                cursor: available ? 'pointer' : 'not-allowed',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold font-display">{day.label}</div>
                  <div className="text-xs" style={{ color: THEME.textMuted }}>{day.weekday}{day.note ? ` · ${day.note}` : ''}</div>
                </div>
                {!available && (
                  <span className="text-xs italic">{reason}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardPickerModal({ dayId, schedule, placedIds, onSelect, onClose }) {
  if (!dayId) return null;
  const day = DAYS.find(d => d.id === dayId);
  if (!day) return null;

  // Filter: cards available for this day (correct category and not placed)
  const cardsForDay = CARDS.filter(c => {
    if (placedIds.has(c.id)) return false;
    if (day.type === 'birthday') return c.cat === 'birthday';
    return c.cat !== 'birthday';
  });

  // Compute remaining weight in day
  const placedOnDay = (schedule[dayId] || []).map(id => CARDS.find(c => c.id === id)).filter(Boolean);
  const usedWeight = placedOnDay.reduce((s, c) => s + c.weight, 0);
  const remainingWeight = 4 - usedWeight;

  // Card is placeable if weight fits OR it's a 2-day card (special-cased later in canPlaceCardOnDay)
  const fits = (card) => card.weight === 8 || card.weight <= remainingWeight;

  const grouped = day.type === 'birthday'
    ? [{ key: 'birthday', cards: cardsForDay.filter(fits) }]
    : [
        { key: 'active', cards: cardsForDay.filter(c => c.cat === 'active' && fits(c)) },
        { key: 'rest',   cards: cardsForDay.filter(c => c.cat === 'rest'   && fits(c)) },
      ];

  const totalAvailable = grouped.reduce((s, g) => s + g.cards.length, 0);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(45, 31, 26, 0.55)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto"
        style={{ background: THEME.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header inside the scrollable container */}
        <div
          className="sticky top-0 z-10 flex items-start justify-between px-5 pt-5 pb-3 border-b"
          style={{ background: THEME.surface, borderColor: THEME.border }}
        >
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest mb-1" style={{ color: THEME.textMuted }}>
              <Calendar size={12} />
              <span>{day.weekday}</span>
            </div>
            <h3 className="text-xl font-bold font-display" style={{ color: THEME.textDark }}>
              {day.label}
              {day.type === 'birthday' && (
                <span className="ml-2 text-sm font-normal italic" style={{ color: CAT.birthday.main }}>
                  · день рождения Дарьи
                </span>
              )}
            </h3>
            <p className="text-xs mt-1" style={{ color: THEME.textMuted }}>
              {day.type === 'birthday'
                ? 'Только сценарии празднования'
                : `Свободно: ${
                    remainingWeight === 4 ? 'весь день'
                    : remainingWeight === 2 ? 'полдня'
                    : remainingWeight === 1 ? 'короткая активность'
                    : 'нет места'
                  }`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
            style={{ color: THEME.textMuted }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content scrolls naturally */}
        <div className="px-5 pt-3 pb-6">
          {totalAvailable === 0 ? (
            <div className="text-center py-8" style={{ color: THEME.textMuted }}>
              <p className="text-sm">Нет доступных карточек для этого дня.</p>
              <p className="text-xs mt-1">Возможно, день уже занят или все подходящие карточки размещены в других днях.</p>
            </div>
          ) : (
            grouped.map(({ key, cards }) => {
              if (cards.length === 0) return null;
              const catInfo = CAT[key];
              const Icon = catInfo.icon;
              return (
                <div key={key} className="mb-4 last:mb-0">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: catInfo.main }}>
                    <Icon size={13} strokeWidth={2.2} />
                    {catInfo.label}
                    <span className="font-normal opacity-60">· {cards.length}</span>
                  </h4>
                  <div className="space-y-2">
                    {cards.map(card => (
                      <button
                        key={card.id}
                        onClick={() => { onSelect(card.id); onClose(); }}
                        className="w-full text-left p-3 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99]"
                        style={{ borderColor: THEME.border, background: THEME.surface }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = catInfo.main}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = THEME.border}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 mt-0.5"
                            style={{ background: catInfo.light, color: catInfo.main }}
                          >
                            {card.code}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm leading-tight font-display" style={{ color: THEME.textDark }}>
                              {card.title}
                              {card.subtitle && (
                                <span className="font-normal italic text-xs ml-1" style={{ color: THEME.textMuted }}>
                                  · {card.subtitle}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] mt-1 flex items-center gap-2 flex-wrap" style={{ color: THEME.textMuted }}>
                              <span className="inline-flex items-center gap-1">
                                <Clock size={10} />
                                {card.duration}
                              </span>
                              <span>· темп <strong style={{ color: intensityColor(card.intensity) }}>{card.intensity}</strong></span>
                              <span>· впеч. <strong style={{ color: catInfo.main }}>{card.impressions}</strong></span>
                              <span>· {card.cost}</span>
                            </div>
                          </div>
                          <Plus size={16} className="flex-shrink-0 mt-1" style={{ color: catInfo.main }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function DebugPanel({ debugDate, setDebugDate, phase, expanded, setExpanded }) {
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

function Header({ phase, today, daysUntilTrip, currentDayNum }) {
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
      {/* Decorative tropical SVG */}
      <svg className="absolute top-0 right-0 opacity-15 pointer-events-none" width="200" height="200" viewBox="0 0 200 200" fill="none">
        <path d="M100 30 Q 130 60, 120 100 Q 140 80, 170 90 Q 150 110, 130 130 Q 160 140, 160 170 Q 130 150, 110 170 Q 100 140, 80 160 Q 90 130, 60 130 Q 80 110, 60 90 Q 90 100, 80 70 Q 100 80, 100 30 Z" fill={CAT.active.main} />
      </svg>
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

function pluralDays(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'дней';
  if (mod10 === 1) return 'день';
  if (mod10 >= 2 && mod10 <= 4) return 'дня';
  return 'дней';
}

// ============================================================
// MAIN APP
// ============================================================

// ============================================================
// SHARING COMPONENTS
// ============================================================

function ShareModal({ schedule, onClose }) {
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

function LoadConflictModal({ onLoadUrl, onKeepLocal }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(45, 31, 26, 0.55)' }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: THEME.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: CAT.active.soft }}
        >
          <Share2 size={22} style={{ color: CAT.active.main }} />
        </div>
        <h3 className="text-lg font-bold font-display text-center mb-2" style={{ color: THEME.textDark }}>
          Два расписания
        </h3>
        <p className="text-sm text-center leading-relaxed mb-6" style={{ color: THEME.textMid }}>
          По ссылке передано новое расписание, но на этом устройстве уже есть сохранённое.
          Что загрузить?
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onLoadUrl}
            className="w-full py-3 rounded-2xl font-semibold text-sm"
            style={{ background: CAT.active.main, color: 'white' }}
          >
            Загрузить из ссылки
          </button>
          <button
            onClick={onKeepLocal}
            className="w-full py-3 rounded-2xl font-semibold text-sm"
            style={{ background: THEME.bgWarm, color: THEME.textMid, border: `1px solid ${THEME.border}` }}
          >
            Оставить моё
          </button>
        </div>
      </div>
    </div>
  );
}

function UrlLoadedBanner({ onDismiss }) {
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

function BlockingAlertModal({ data, onClose }) {
  if (!data) return null;
  const { card, day1, day2 } = data;

  let body;
  if (!day2) {
    // Next day doesn't exist — selected day is the last available
    body = (
      <>
        Эта поездка занимает два дня подряд, но{' '}
        <strong style={{ color: THEME.textDark }}>{day1?.label}</strong> — последний
        доступный день. Выберите более раннюю дату начала.
      </>
    );
  } else if (day2.type !== 'free') {
    // Next day is birthday or departure — not a regular free slot
    body = (
      <>
        Эта поездка занимает два дня подряд:{' '}
        <strong style={{ color: THEME.textDark }}>{day1?.label}</strong> и{' '}
        <strong style={{ color: THEME.textDark }}>{day2.label}</strong>. Но{' '}
        <strong style={{ color: THEME.textDark }}>{day2.label}</strong> — особый день
        (день рождения или отъезд), он недоступен. Выберите более раннюю дату начала.
      </>
    );
  } else {
    // Next day exists and is free but occupied by another card
    body = (
      <>
        Эта поездка занимает два дня подряд:{' '}
        <strong style={{ color: THEME.textDark }}>{day1?.label}</strong> и{' '}
        <strong style={{ color: THEME.textDark }}>{day2.label}</strong>. Но{' '}
        <strong style={{ color: THEME.textDark }}>{day2.label}</strong> уже занят —
        уберите из него активность и попробуйте снова.
      </>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(45, 31, 26, 0.55)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: THEME.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: '#FEF3E0' }}
        >
          <Calendar size={22} style={{ color: '#B8762A' }} />
        </div>
        <h3
          className="text-lg font-bold font-display text-center mb-1"
          style={{ color: THEME.textDark }}
        >
          Нельзя добавить поездку
        </h3>
        <p
          className="text-xs text-center mb-1 font-medium"
          style={{ color: '#B8762A' }}
        >
          {card?.title}
        </p>
        <p
          className="text-sm text-center leading-relaxed mb-6"
          style={{ color: THEME.textMid }}
        >
          {body}
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-semibold text-sm"
          style={{ background: '#B8762A', color: 'white' }}
        >
          Понятно
        </button>
      </div>
    </div>
  );
}

function ResetConfirmModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(45, 31, 26, 0.55)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: THEME.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: '#FDE8E4' }}
        >
          <RotateCcw size={22} style={{ color: '#C04A2E' }} />
        </div>
        <h3
          className="text-lg font-bold font-display text-center mb-2"
          style={{ color: THEME.textDark }}
        >
          Сбросить расписание?
        </h3>
        <p
          className="text-sm text-center mb-6"
          style={{ color: THEME.textMuted }}
        >
          Все добавленные активности будут удалены. Это действие нельзя отменить.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-colors"
            style={{
              background: THEME.bgWarm,
              color: THEME.textMid,
              border: `1px solid ${THEME.border}`,
            }}
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-colors"
            style={{ background: '#C04A2E', color: 'white' }}
          >
            Сбросить всё
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [schedule, setSchedule] = useState({});
  const [activeCategory, setActiveCategory] = useState('active');
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [dragOverDayId, setDragOverDayId] = useState(null);
  const [pickerCard, setPickerCard] = useState(null);
  const [pickerForDay, setPickerForDay] = useState(null);
  const [mobileTab, setMobileTab] = useState('schedule');
  const [debugDate, setDebugDate] = useState(null);
  const [debugExpanded, setDebugExpanded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [blockingAlert, setBlockingAlert] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLoadConflict, setShowLoadConflict] = useState(false);
  const [pendingUrlSchedule, setPendingUrlSchedule] = useState(null);
  const [urlLoadedBanner, setUrlLoadedBanner] = useState(false);

  // Determine "today" for the app — debug override or real
  const today = useMemo(() => debugDate || new Date(), [debugDate]);
  const phase = useMemo(() => getTripPhase(today), [today]);
  const daysUntilTrip = useMemo(() => daysUntil(TRIP.arrival, today), [today]);
  const currentDayNum = useMemo(() => {
    const idx = DAYS.findIndex(d => sameDay(d.date, today));
    return idx >= 0 ? idx + 1 : null;
  }, [today]);

  // ── On mount: read localStorage + URL hash ─────────────────
  useEffect(() => {
    const urlSchedule   = readUrlSchedule();
    const localSchedule = loadScheduleLocally();
    const hasLocal = localSchedule && Object.keys(localSchedule).length > 0;

    if (urlSchedule) {
      clearUrlHash();
      if (hasLocal) {
        // Both exist — ask user (Variant B)
        setPendingUrlSchedule(urlSchedule);
        setSchedule(localSchedule);
        setShowLoadConflict(true);
      } else {
        // Only URL schedule
        setSchedule(urlSchedule);
        saveScheduleLocally(urlSchedule);
        setUrlLoadedBanner(true);
      }
    } else if (hasLocal) {
      setSchedule(localSchedule);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-save to localStorage on every change ────────────
  useEffect(() => {
    saveScheduleLocally(schedule);
  }, [schedule]);

  // Birthday confetti trigger
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (phase === 'birthday') {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 100);
      return () => clearTimeout(t);
    }
  }, [phase]);
  // re-fire confetti once when entering birthday phase
  useEffect(() => {
    if (phase === 'birthday') {
      setShowConfetti(true);
    }
  }, [phase]);

  // Set of placed card IDs across all days
  const placedIds = useMemo(() => {
    const set = new Set();
    Object.values(schedule).forEach(arr => arr.forEach(id => set.add(id)));
    return set;
  }, [schedule]);

  // Validate placement
  const canPlaceCardOnDay = useCallback((cardId, dayId) => {
    const card = CARDS.find(c => c.id === cardId);
    const day = DAYS.find(d => d.id === dayId);
    if (!card || !day) return { ok: false, reason: 'нет данных' };
    if (day.type === 'arrival' || day.type === 'departure') return { ok: false, reason: 'фикс. день' };
    if (day.type === 'birthday' && card.cat !== 'birthday') return { ok: false, reason: 'только Д.Р.' };
    if (day.type !== 'birthday' && card.cat === 'birthday') return { ok: false, reason: 'не Д.Р.' };
    if (placedIds.has(cardId)) return { ok: false, reason: 'уже размещено' };
    const placed = (schedule[dayId] || []).map(id => CARDS.find(c => c.id === id)).filter(Boolean);
    const usedWeight = placed.reduce((s, c) => s + c.weight, 0);
    // 2-day cards are handled separately below; skip daily weight check for them
    if (card.weight !== 8 && usedWeight + card.weight > 4) return { ok: false, reason: 'день занят' };
    // А-5 (2 дня) — special: needs next day free too
    if (card.weight === 8) {
      const idx = DAYS.findIndex(d => d.id === dayId);
      const next = DAYS[idx + 1];
      if (!next || next.type !== 'free') {
        return { ok: false, reason: 'нужно 2 свободных дня подряд', blockingDay: next || null };
      }
      const nextUsed = (schedule[next.id] || []).reduce((s, id) => {
        const c = CARDS.find(x => x.id === id);
        return s + (c?.weight || 0);
      }, 0);
      if (nextUsed > 0) return { ok: false, reason: 'следующий день занят', blockingDay: next };
    }
    return { ok: true };
  }, [schedule, placedIds]);

  const placeCard = useCallback((dayId, cardId) => {
    const check = canPlaceCardOnDay(cardId, dayId);
    if (!check.ok) {
      // Show contextual alert for 2-day card blocked by occupied next day
      const card = CARDS.find(c => c.id === cardId);
      if (card?.weight === 8 && check.blockingDay !== undefined) {
        const day1 = DAYS.find(d => d.id === dayId);
        setBlockingAlert({ card, day1, day2: check.blockingDay });
      }
      return;
    }
    const card = CARDS.find(c => c.id === cardId);
    setSchedule(prev => {
      const next = { ...prev };
      next[dayId] = [...(prev[dayId] || []), cardId];
      // For 2-day card, occupy next day too
      if (card.weight === 8) {
        const idx = DAYS.findIndex(d => d.id === dayId);
        const nextDay = DAYS[idx + 1];
        if (nextDay) {
          next[nextDay.id] = [...(prev[nextDay.id] || []), cardId];
        }
      }
      return next;
    });
    setDragOverDayId(null);
    setPickerCard(null);
    setPickerForDay(null);
  }, [canPlaceCardOnDay]);

  const removeCardFromDay = useCallback((dayId, cardId) => {
    setSchedule(prev => {
      const next = {};
      // Remove this cardId from ALL days (handles 2-day card)
      Object.entries(prev).forEach(([dId, ids]) => {
        const filtered = ids.filter(id => id !== cardId);
        if (filtered.length > 0) next[dId] = filtered;
      });
      return next;
    });
  }, []);

  const handleResetAll = () => {
    if (Object.keys(schedule).length === 0) return;
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setSchedule({});
    setShowResetConfirm(false);
  };

  const handleConflictLoadUrl = () => {
    if (pendingUrlSchedule) {
      setSchedule(pendingUrlSchedule);
      saveScheduleLocally(pendingUrlSchedule);
      setUrlLoadedBanner(true);
    }
    setPendingUrlSchedule(null);
    setShowLoadConflict(false);
  };

  const handleConflictKeepLocal = () => {
    setPendingUrlSchedule(null);
    setShowLoadConflict(false);
  };

  const handleShareModalClose = (importedSchedule) => {
    if (importedSchedule) {
      setSchedule(importedSchedule);
    }
    setShowShareModal(false);
  };

  // Open day picker for a card (mobile flow)
  const openPickerForCard = (card) => {
    setPickerCard(card);
  };
  // Open card picker for a day (works on all screen sizes via modal)
  const openPickerForDay = (dayId) => {
    setPickerForDay(dayId);
  };

  // Available days for a given card (with reasons)
  const availableDaysFor = useMemo(() => {
    if (!pickerCard) return [];
    return DAYS.map(day => {
      const check = canPlaceCardOnDay(pickerCard.id, day.id);
      return { day, available: check.ok, reason: check.reason };
    });
  }, [pickerCard, canPlaceCardOnDay]);

  const filteredCards = useMemo(() => CARDS.filter(c => c.cat === activeCategory), [activeCategory]);

  // Stats for mobile tab badge
  const filledCount = useMemo(() =>
    DAYS.filter(d => (d.type === 'free' || d.type === 'birthday') && (schedule[d.id] || []).length > 0).length,
    [schedule]
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <div
      className="min-h-screen"
      style={{
        background: phase === 'birthday'
          ? `linear-gradient(180deg, ${CAT.birthday.soft} 0%, ${THEME.bg} 30%)`
          : THEME.bg,
        color: THEME.textDark,
        fontFamily: '"Nunito", system-ui, sans-serif',
      }}
    >

      <ConfettiOverlay show={showConfetti} />

      {/* Birthday banner */}
      {phase === 'birthday' && (
        <div className="birthday-banner text-white text-center py-2 px-4 text-sm font-bold tracking-wider flex items-center justify-center gap-2">
          <Cake size={16} />
          <span>С ДНЁМ РОЖДЕНИЯ, ДАРЬЯ · 14 ЛЕТ</span>
          <button
            onClick={() => { setShowConfetti(false); setTimeout(() => setShowConfetti(true), 50); }}
            className="ml-3 text-[10px] underline opacity-75 hover:opacity-100"
          >
            конфетти ещё раз
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <Header phase={phase} today={today} daysUntilTrip={daysUntilTrip} currentDayNum={currentDayNum} />

        {/* Debug panel — small, top-right */}
        {/* <div className="px-4 sm:px-6 mb-3">
          <DebugPanel debugDate={debugDate} setDebugDate={setDebugDate} phase={phase} expanded={debugExpanded} setExpanded={setDebugExpanded} />
        </div> */}

        {/* === WIDE LAYOUT (≥ 640px): single column, cards on top === */}
        <div className="hidden sm:block px-4 sm:px-6 pb-10 space-y-5">
          {/* Cards palette — full width on top */}
          <section>
            <CategoryTabsComponent active={activeCategory} onChange={setActiveCategory} />
            <div className="mt-3 space-y-3">
              {filteredCards.map(card => (
                <ActivityCard
                  key={card.id}
                  card={card}
                  expanded={expandedCardId === card.id}
                  onToggle={() => setExpandedCardId(expandedCardId === card.id ? null : card.id)}
                  onDragStart={() => {}}
                  onAddTo={openPickerForCard}
                  placed={placedIds.has(card.id)}
                  draggable
                />
              ))}
            </div>
          </section>

          {/* Schedule below cards */}
          <section className="space-y-4">
            <IntensityChart schedule={schedule} daysList={DAYS} />
            <div className="space-y-2.5">
              {DAYS.map(day => {
                const placedCards = (schedule[day.id] || []).map(id => CARDS.find(c => c.id === id)).filter(Boolean);
                return (
                  <DaySlot
                    key={day.id}
                    day={day}
                    placedCards={placedCards}
                    schedule={schedule}
                    today={today}
                    phase={phase}
                    isDragOver={dragOverDayId === day.id}
                    onDragOver={setDragOverDayId}
                    onDragLeave={() => setDragOverDayId(null)}
                    onDrop={placeCard}
                    onRemove={removeCardFromDay}
                    onPickActivity={openPickerForDay}
                  />
                );
              })}
            </div>
            <Summary schedule={schedule} daysList={DAYS} />
            <div className="flex items-center justify-between pb-4">
              <button
                onClick={() => setShowShareModal(true)}
                className="text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 font-semibold"
                style={{ color: CAT.active.main, background: CAT.active.soft }}
              >
                <Share2 size={13} />
                Поделиться
              </button>
              <button
                onClick={handleResetAll}
                className="text-xs px-3 py-2 rounded-lg flex items-center gap-1.5"
                style={{ color: THEME.textMuted, background: 'transparent' }}
              >
                <RotateCcw size={12} />
                Сбросить всё
              </button>
            </div>
          </section>
        </div>

        {/* === NARROW LAYOUT (< 640px): tab system === */}
        <div className="sm:hidden pb-24 px-4">
          {mobileTab === 'catalog' && (
            <div>
              <CategoryTabsComponent active={activeCategory} onChange={setActiveCategory} compact />
              <div className="mt-3 space-y-3">
                {filteredCards.map(card => (
                  <ActivityCard
                    key={card.id}
                    card={card}
                    expanded={expandedCardId === card.id}
                    onToggle={() => setExpandedCardId(expandedCardId === card.id ? null : card.id)}
                    onAddTo={openPickerForCard}
                    placed={placedIds.has(card.id)}
                    draggable={false}
                  />
                ))}
              </div>
            </div>
          )}

          {mobileTab === 'schedule' && (
            <div className="space-y-3">
              <IntensityChart schedule={schedule} daysList={DAYS} />
              {DAYS.map(day => {
                const placedCards = (schedule[day.id] || []).map(id => CARDS.find(c => c.id === id)).filter(Boolean);
                return (
                  <DaySlot
                    key={day.id}
                    day={day}
                    placedCards={placedCards}
                    schedule={schedule}
                    today={today}
                    phase={phase}
                    isDragOver={false}
                    onDragOver={() => {}}
                    onDragLeave={() => {}}
                    onDrop={() => {}}
                    onRemove={removeCardFromDay}
                    onPickActivity={openPickerForDay}
                  />
                );
              })}
              <Summary schedule={schedule} daysList={DAYS} />
              <div className="flex gap-2 pb-4">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex-1 text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-semibold"
                  style={{ color: CAT.active.main, background: CAT.active.soft, border: `1px solid ${CAT.active.light}` }}
                >
                  <Share2 size={13} />
                  Поделиться
                </button>
                <button
                  onClick={handleResetAll}
                  className="flex-1 text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5"
                  style={{ color: THEME.textMuted, background: THEME.surface, border: `1px solid ${THEME.border}` }}
                >
                  <RotateCcw size={12} />
                  Сбросить всё
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom tab bar — narrow only */}
        <nav
          className="sm:hidden fixed bottom-0 left-0 right-0 border-t flex"
          style={{
            background: THEME.surface,
            borderColor: THEME.border,
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <button
            onClick={() => { setMobileTab('catalog'); setPickerForDay(null); }}
            className="flex-1 py-3 flex flex-col items-center gap-0.5"
            style={{ color: mobileTab === 'catalog' ? CAT.active.main : THEME.textMuted }}
          >
            <Heart size={20} strokeWidth={mobileTab === 'catalog' ? 2.5 : 1.8} />
            <span className="text-[11px] font-semibold">Карточки</span>
          </button>
          <button
            onClick={() => { setMobileTab('schedule'); setPickerForDay(null); }}
            className="flex-1 py-3 flex flex-col items-center gap-0.5 relative"
            style={{ color: mobileTab === 'schedule' ? CAT.active.main : THEME.textMuted }}
          >
            <Calendar size={20} strokeWidth={mobileTab === 'schedule' ? 2.5 : 1.8} />
            <span className="text-[11px] font-semibold">Дни</span>
            {filledCount > 0 && (
              <span
                className="absolute top-1 right-[calc(50%-28px)] text-[10px] font-bold rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center"
                style={{ background: CAT.birthday.main, color: 'white' }}
              >
                {filledCount}
              </span>
            )}
          </button>
        </nav>

      </div>

      <DayPickerModal
        card={pickerCard}
        availableDays={availableDaysFor}
        onSelect={(dayId) => placeCard(dayId, pickerCard.id)}
        onClose={() => setPickerCard(null)}
      />

      <CardPickerModal
        dayId={pickerForDay}
        schedule={schedule}
        placedIds={placedIds}
        onSelect={(cardId) => placeCard(pickerForDay, cardId)}
        onClose={() => setPickerForDay(null)}
      />

      {showResetConfirm && (
        <ResetConfirmModal
          onConfirm={confirmReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}

      {blockingAlert && (
        <BlockingAlertModal
          data={blockingAlert}
          onClose={() => setBlockingAlert(null)}
        />
      )}

      {showShareModal && (
        <ShareModal
          schedule={schedule}
          onClose={handleShareModalClose}
        />
      )}

      {showLoadConflict && (
        <LoadConflictModal
          onLoadUrl={handleConflictLoadUrl}
          onKeepLocal={handleConflictKeepLocal}
        />
      )}

      {urlLoadedBanner && (
        <UrlLoadedBanner onDismiss={() => setUrlLoadedBanner(false)} />
      )}
    </div>
  );
}

// Inline CategoryTabs (used in both layouts)
function CategoryTabsComponent({ active, onChange, compact = false }) {
  const keys = ['birthday', 'active', 'rest'];
  return (
    <div className={`flex gap-1.5 ${compact ? 'overflow-x-auto scroll-no-bar' : 'flex-wrap'}`}>
      {keys.map(k => {
        const cat = CAT[k];
        const Icon = cat.icon;
        const isActive = active === k;
        return (
          <button
            key={k}
            onClick={() => onChange(k)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
            style={{
              background: isActive ? cat.main : cat.soft,
              color: isActive ? 'white' : cat.main,
              boxShadow: isActive ? `0 4px 12px ${cat.main}40` : 'none',
            }}
          >
            <Icon size={14} strokeWidth={2} />
            <span>{compact ? cat.short : cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
