import { Cake, Waves, Leaf } from 'lucide-react';

export const THEME = {
  bg:        '#FBF5EC',
  bgWarm:    '#F5EBD8',
  surface:   '#FFFFFF',
  textDark:  '#2D1F1A',
  textMid:   '#5D4A3F',
  textMuted: '#8A7A6E',
  border:    '#E8DCC8',
  borderDark:'#C9B895',
};

export const CAT = {
  birthday: { label: 'День рождения', short: 'День рождения', icon: Cake,  main: '#D85A3E', light: '#F5C9BB', soft: '#FDEDE6' },
  active:   { label: 'Активные дни',  short: 'Активные дни',  icon: Waves, main: '#1E7A7A', light: '#9DCDCD', soft: '#E8F4F4' },
  rest:     { label: 'Отдых и релакс',short: 'Отдых',         icon: Leaf,  main: '#6B8E5A', light: '#BFD3B0', soft: '#EEF3E6' },
};
