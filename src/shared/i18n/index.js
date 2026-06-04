import i18next from 'i18next';

const resources = {
  fa: {
    translation: require('./locales/fa.json'),
  },
  en: {
    translation: require('./locales/en.json'),
  },
};

const LS_LANG_KEY = 'app-language';

const savedLanguage = localStorage.getItem(LS_LANG_KEY) || 'fa';

i18next.init({
  lng: savedLanguage,
  fallbackLng: 'fa',
  ns: ['translation'],
  defaultNS: 'translation',
  resources,
  interpolation: {
    escapeValue: false,
  },
});

window.i18n = i18next;

export default i18next;

export function changeLanguage(lang) {
  i18next.changeLanguage(lang);
  localStorage.setItem(LS_LANG_KEY, lang);

  // Update document attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.body.setAttribute(LS_LANG_KEY, lang);
}

export function getCurrentLanguage() {
  return i18next.language;
}

export function t(key, defaultValue) {
  return i18next.t(key, defaultValue);
}
