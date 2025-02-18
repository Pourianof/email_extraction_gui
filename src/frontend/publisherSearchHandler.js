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
});
