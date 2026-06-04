import i18next, {
  changeLanguage,
  getCurrentLanguage,
} from '../shared/i18n/index.js';
import { textEnrich } from './renderers/helpers/enrichText.js';

export function initLanguageSwitcher() {
  const lang = getCurrentLanguage();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.body.setAttribute('data-language', lang);

  const toggle = document.getElementById('language-toggle');

  toggle.querySelector(`[data-lang="${lang}"]`).classList.add('active');

  toggle.addEventListener('click', async () => {
    const current = i18next.language;

    const next = current === 'fa' ? 'en' : 'fa';

    await i18next.changeLanguage(next);

    localStorage.setItem('language', next);

    document.querySelectorAll('.lang-option').forEach((el) => {
      el.classList.toggle('active', el.dataset.lang === next);
    });

    updatePageLanguage();
  });
}

export function updatePageLanguage() {
  const lang = getCurrentLanguage();

  // Update document attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.body.setAttribute('data-language', lang);
  updateUIText();
}

document.addEventListener('DOMContentLoaded', () => {
  // Update all translatable elements
  updateUIText();
});

export function updateUIText() {
  const lang = getCurrentLanguage();

  // Update document title
  document.title = i18next.t('app.title');

  // Update all elements with data-i18n attribute

  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    el.innerHTML = textEnrich(i18next.t(key));
  });

  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;

    el.innerHTML = i18next.t(key);
  });

  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;

    el.placeholder = i18next.t(key);
  });

  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;

    el.title = i18next.t(key);
  });

  root.querySelectorAll('[data-i18n-value]').forEach((el) => {
    const key = el.dataset.i18nValue;

    el.value = i18next.t(key);
  });
}

export default { initLanguageSwitcher, updatePageLanguage, updateUIText };
