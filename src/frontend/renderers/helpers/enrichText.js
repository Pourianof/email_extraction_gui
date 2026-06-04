/**
 *
 * @param {string} text
 */
export function textEnrich(text) {
  return text.replace(
    /\[_ul_\](.*?)\[_\/ul_\]/gs,
    '<span class="en-in-fa">$1</span>',
  );
}
