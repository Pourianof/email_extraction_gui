import { getSettedOptions } from './extracterHelper';
import ExtractionHandler from './extractionHandler';

function init() {
  /** @type HTMLFormElement */
  const scholarForm = document.querySelector('#google-schobar-extractor form');

  scholarForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const input = this.querySelector('input');
    const value = input.value.trim();

    if (value) {
      const options = getSettedOptions(scholarForm);
      options.isGoogleScholar = true;
      ExtractionHandler.start(
        [{ search: { expression: value, target: 'google' } }],
        options
      );
    }
  });
}

init();
