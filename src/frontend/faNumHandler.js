// in this module, we handling fa-num tags to convert their number to persian characters
import PN from 'persian-number';

const faNumElems = [...document.querySelectorAll('fa-num')];

for (const faEl of faNumElems) {
  const content = faEl.textContent?.trim();
  if (!content) {
    continue;
  }

  faEl.textContent = PN.convertEnToPe(content);
}
