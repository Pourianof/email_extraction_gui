import pn from 'persian-number';

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
    format.push(`${pn.convertEnToPe(~~hours)} ساعت`);
  }
  if (minutes != 0) {
    format.push(`${pn.convertEnToPe(~~minutes)} دقیقه`);
  }
  if (seconds != 0) {
    format.push(`${pn.convertEnToPe(~~seconds)} ثانیه`);
  }

  return format.join(' و ');
}
