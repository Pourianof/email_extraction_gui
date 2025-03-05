import { getSettedOptions } from './extracterHelper';
import ExtractionHandler from './extractionHandler';

/**
 * @type HTMLElement
 */
const optionsWrapper = document.querySelector('.publisher-options');

let lastSelected;

optionsWrapper.addEventListener('click', (e) => {
  e.preventDefault();

  const target = e.target;
  const pubId = target?.dataset?.id?.trim();

  if (!pubId || pubId == lastSelected?.dataset.id) {
    return;
  }

  lastSelected?.classList.remove('selected-publisher');
  target.classList.add('selected-publisher');

  lastSelected = target;
  form.querySelector('.journal-url-hint').classList.add('hidden');
});

const searchOnPubView = document.getElementById('publisher-search-extractor');

/**
 * @type HTMLFormElement
 */
const form = document.getElementById('google-scholar-form');
console.log(form);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  debugger;

  const hintElem = form.querySelector('.journal-url-hint');
  if (!lastSelected) {
    hintElem.classList.remove('hidden');
    return;
  } else if (!hintElem.classList.contains('hidden')) {
    hintElem.classList.add('hidden');
  }

  const input = form.querySelector('.search-input-wrapper input');
  const searchText = input.value?.trim();

  if (!searchText) {
    return;
  }

  const options = getSettedOptions(form);

  ExtractionHandler.start(
    [{ search: { expression: searchText, target: lastSelected.dataset.id } }],
    options
  ).catch((err) => {
    console.error(err);
  });
});
