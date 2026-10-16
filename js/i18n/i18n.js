import { state } from '../core/state.js';

const dicts = { en: {}, el: {}, fr: {}, it: {}, de: {} };

export const LANGS = [
  { code: 'en', name: 'English' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'de', name: 'Deutsch' }
];

export function getLang() {
  const l = state.settings && state.settings.lang;
  return dicts[l] ? l : 'en';
}

export function setLang(code) {
  state.settings.lang = dicts[code] ? code : 'en';
  return state.settings.lang;
}

export function t(s) {
  if (s == null) return '';
  const d = dicts[getLang()];
  return (d && d[s]) || s;
}

export function registerDict(code, map) {
  if (!dicts[code]) dicts[code] = {};
  Object.assign(dicts[code], map);
}

export function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}
