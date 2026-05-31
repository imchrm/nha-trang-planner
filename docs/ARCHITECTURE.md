# ARCHITECTURE.md — Архитектура и решения

> Фиксируй сюда «почему именно так». Через месяц это дороже, чем сам код.

---

## Обзор

Чистый фронтенд (SPA) без бэкенда. Всё состояние — в React state + localStorage. Шаринг — через URL hash. Развёрнут как статическая папка под nginx.

```
Пользователь
    ↓
nginx (360tur.uz) → /tours/nha_trang_planner/ → dist/index.html
    ↓
React SPA (App.jsx)
    ↓
localStorage (персистентность) + URL hash (шаринг)
```

---

## Решение: монолитный App.jsx

**Что:** Всё приложение — один файл ~2050 строк. Компоненты, данные, утилиты, стили (через Tailwind классы).

**Почему:** Проект разрабатывался как React-артефакт в Claude, который по природе однофайловый. При переносе в Vite сохранена монолитная структура — это упрощает передачу контекста AI-ассистенту и правку в одном месте. Разбивка на модули запланирована при достижении ~3000 строк.

**Компромисс:** Труднее навигация, нет изоляции импортов. Но для проекта такого размера это приемлемо.

---

## Модель данных

### Карточки (CARDS)

```js
{
  id: 'AC1',           // уникальный идентификатор
  code: 'А-1',         // отображаемый код
  cat: 'active',       // 'birthday' | 'active' | 'rest'
  title: 'VinWonders',
  subtitle: 'полный день',
  duration: 'Весь день',
  weight: 4,           // единицы дня (см. систему весов)
  intensity: 8,        // 1–10, для гистограммы и иконок
  impressions: 10,     // 1–10, для иконок
  cost: '~120-125$',
  desc: '...',
  tips: '...',
}
```

Всего 30 карточек: 7 birthday (BD1–BD7), 13 active (AC1–AC13), 10 rest (RS1–RS10).

### Дни (DAYS)

```js
{
  id: 'd7',
  date: new Date(2026, 5, 5),
  label: '5 июня',
  weekday: 'пятница',
  type: 'birthday',   // 'arrival' | 'free' | 'birthday' | 'departure'
  note: 'День рождения Дарьи',
}
```

### Расписание (schedule — основной state)

```js
// Map: dayId → [cardId, cardId, ...]
{
  'd3': ['AC1'],
  'd5': ['RS4', 'AC13'],
  'd7': ['BD3'],
}
```

Плоский объект, легко сериализуется в JSON и base64 для шаринга.

---

## Система весов дня

Каждый день — «контейнер» на 4 единицы.

```
Весь день  → 4  (монопольно)
2 дня      → 8  (особый: занимает 2 слота)
Полдня     → 2
Вечер      → 1
1.5-3 часа → 1
```

**Валидация** (`canPlaceCardOnDay`):
1. Фиксированные дни (arrival/departure) — блокированы
2. День рождения (05.06) принимает только `cat: 'birthday'`
3. Остальные дни не принимают `cat: 'birthday'`
4. Карточка уже размещена — блокирована
5. `weight !== 8`: проверка `usedWeight + card.weight ≤ 4`
6. `weight === 8`: проверка следующего дня (свободен, не занят)

**Почему weight=8 для 2-дневной карточки:** позволяет обойти стандартную проверку веса (0+8>4) через явное условие `card.weight !== 8`. Семантически нечисто, но прагматично — только одна карточка имеет weight=8.

---

## Date-adaptive фазы

```
today < arrival           → 'preparation'
today === birthday        → 'birthday'
today > departure         → 'memories'
иначе                     → 'active'
```

**Определение один раз при монтировании** — не в `useEffect` с интервалом. Достаточно для этого проекта: смена фазы происходит раз в день, перезагрузка страницы обновит фазу.

**DebugPanel** позволяет тестировать все фазы без изменения системной даты. В продакшене скрывается через `import.meta.env.DEV`.

---

## Персистентность и шаринг

### localStorage

Ключ: `nha-trang-planner-schedule`. Значение: `JSON.stringify(schedule)`.

Сохраняется синхронно при каждом изменении `schedule` (через `useEffect`). При пустом `schedule` запись удаляется.

### URL hash sharing

Формат: `https://.../#s=BASE64`

Кодирование: `btoa(unescape(encodeURIComponent(JSON.stringify(schedule))))`

Использован `unescape/encodeURIComponent` вместо простого `btoa` для корректной обработки Unicode (русские символы в значениях, если появятся).

**Логика конфликта (Вариант Б):**
```
Есть URL hash И есть localStorage → LoadConflictModal
Только URL hash                   → загрузить, сохранить в LS, показать баннер
Только localStorage               → загрузить молча
Ничего                            → пустое расписание
```

После обработки hash очищается из URL через `history.replaceState` — чтобы не мешал при следующей загрузке.

### QR-код

`<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=...">` — без библиотек. QR содержит полный share URL.

**Почему внешний API, не библиотека:** экономия ~15–40 КБ бандла, нет нужды в SSR/offline. Если нужен офлайн-QR — добавить `qrcode` npm-пакет.

---

## CSS-архитектура

### index.css (глобальные стили)

```css
/* Шрифты */
@import url('Google Fonts: Fraunces + Nunito');

/* Tailwind */
@tailwind base;       /* Preflight (CSS reset) */
@tailwind components;
@tailwind utilities;

/* Кастомные классы */
.font-display         /* Fraunces для заголовков */
@keyframes confettiFall + .confetti-piece
@keyframes shimmer + .birthday-banner
.scroll-no-bar        /* Скрытый скроллбар для overflow-x */
```

### Inline styles vs Tailwind

Правило: **Tailwind для структуры и отступов, inline style для цветов темы**.

Причина: цвета берутся из констант `THEME` и `CAT` — если задавать их через Tailwind, придётся либо дублировать в `tailwind.config.js extend.colors`, либо использовать arbitrary values вида `bg-[#D85A3E]`. Inline style проще и прозрачнее.

### Tailwind v3 (зафиксирован)

В v4 убран `tailwind.config.js`, изменён CLI и синтаксис директив. Переход потребует:
- Замены `@tailwind base/components/utilities` на `@import "tailwindcss"`
- Замены `tailwind.config.js` на CSS-переменные
- Проверки arbitrary values

---

## Адаптивность

```
≥ 640px (sm:)   hidden sm:block   Одна колонка: каталог сверху → расписание снизу
< 640px          sm:hidden         Таб-система: «Дни» / «Карточки», sticky bottom nav
```

**Почему нет side-by-side (двух колонок)?**
Было реализовано, но пользователь явно попросил убрать — карточки сбоку неудобны для данного контента. Каталог из 30 карточек лучше читается над расписанием.

**Drag & drop на мобильном отключён** — HTML5 Drag and Drop API ненадёжен на touch-устройствах без специальных библиотек. Тап-взаимодействие (CardPickerModal / DayPickerModal) достаточно для мобильного сценария.

---

## Деплой

```
vite.config.js:  base: '/tours/nha_trang_planner/'
```

Без `base` Vite генерирует `/assets/index-HASH.js` — абсолютный путь от корня. С `base` — `/tours/nha_trang_planner/assets/index-HASH.js`.

nginx обслуживает папку `dist/` как статику. SPA-роутинг не нужен (нет React Router), `try_files` для index.html не требуется.

---

## Шрифты

| Шрифт | Использование | Класс |
|---|---|---|
| Fraunces | Заголовки, названия карточек, даты | `.font-display` |
| Nunito | Весь остальной текст | базовый `font-family` на `<div>` |

Загружаются через Google Fonts CDN. Для офлайн-работы — можно переключить на system-ui.
