export function backURLFormToInitialState() {
  const mainContent = document.querySelector(
    '#extractor-views > div:not(.hidden)'
  );

  /** @type HTMLFormElement */
  const form = mainContent.querySelector('.main-form form');
  const extractBtn = form.querySelector('#extract-btn');
  extractBtn?.classList.add('hidden');

  form.querySelector('#urls')?.replaceChildren([]);

  form.reset();
}
