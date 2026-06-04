// in this module, we handling fa-num tags to convert their number to persian characters
import i18next from 'i18next';
import PN from 'persian-number';
import { getCurrentLanguage } from '../shared/i18n';

function numConverter(numProvider) {
  const faNumElems = [...document.querySelectorAll('fa-num')];

  for (const faEl of faNumElems) {
    const content = faEl.textContent?.trim();
    if (!content) {
      continue;
    }

    faEl.textContent = numProvider(content);
  }
}

function faNumConverter() {
  console.log('convert to fa');
  numConverter((num) => PN.convertEnToPe(num));
}

function latinNumberConverter() {
  console.log('convert to en');
  numConverter((num) => PN.convertPeToEn(num));
}

function convertIfNeeded() {
  const lang = getCurrentLanguage();

  if (lang == 'fa') {
    faNumConverter();
  } else {
    latinNumberConverter();
  }
}

convertIfNeeded();

i18next.on('languageChanged', convertIfNeeded);
