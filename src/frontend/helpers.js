import pn from 'persian-number';
import { localeNumber } from './renderers/helpers/localeNumber';

export function parseUnixInterval(interval) {
  const totalSeconds = interval / 1000;
  const seconds = totalSeconds % 60;
  const totalMinutes = ~~(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = ~~(totalMinutes / 60);

  return { hours, minutes, seconds };
}

export function formatUnixInterval(interval) {
  const { hours, minutes, seconds } = parseUnixInterval(interval);

  let format = [];

  if (hours != 0) {
    format.push(`${localeNumber(~~hours)} ساعت`);
  }
  if (minutes != 0) {
    format.push(`${localeNumber(~~minutes)} دقیقه`);
  }
  if (seconds != 0) {
    format.push(`${localeNumber(~~seconds)} ثانیه`);
  }

  return format.join(' و ');
}

export function selectedTab() {
  return document.querySelector('.selected-extractor-item').dataset.id;
}
