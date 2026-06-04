import { getCurrentLanguage } from '../../../shared/i18n';

export function localeNumber(num) {
  const lang = getCurrentLanguage();

  if (lang == 'fa') {
    return PN.convertEnToPe(num);
  } else {
    return num;
  }
}
