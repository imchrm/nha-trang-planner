export const TRIP = {
  arrival:   new Date(2026, 4, 30),
  birthday:  new Date(2026, 5, 5),
  departure: new Date(2026, 5, 9),
};

export const DAYS = [
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
