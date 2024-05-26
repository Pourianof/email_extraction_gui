import PN from 'persian-number';

import {
  addNewURLInput,
  handleExtractOptionsForm,
  reachFromTemplateTo,
} from './urlFormHelper';

/**
 * @type HTMLElement
 */
const journalForm = document.forms['journal-form'];
const extractBtn =
  journalForm.previousElementSibling.previousElementSibling.lastElementChild;

function handleRemoveIndexMofication(removedElmnt) {
  let index = +reachFromTemplateTo(removedElmnt, 'index').index;

  let sib = removedElmnt;
  while ((sib = sib.nextElementSibling)) {
    const indexElemnt = reachFromTemplateTo(sib, 'index');
    const i = index++;
    indexElemnt.index = i;
    indexElemnt.textContent = PN.convertEnToPe(i);
  }
}

(function () {
  const addBtn = document.getElementById('add-new-url-btn');

  addBtn.addEventListener('click', addNewURLInput);

  journalForm.addEventListener('click', (e) => {
    const { target } = e;
    if (target.classList.contains('remove-url-btn')) {
      e.preventDefault();
      const removingElmnt = target.parentElement.parentElement;
      handleRemoveIndexMofication(removingElmnt);
      journalForm.removeChild(removingElmnt);
      if (!journalForm.firstElementChild) {
        extractBtn.classList.add('hidden');
      }
    }
  });

  let initialBtnPosition;

  document.addEventListener('scroll', function (e) {
    const extractBtnWrapper = extractBtn.parentElement;

    const { top } = extractBtnWrapper.getBoundingClientRect();
    initialBtnPosition ??= top;

    const lastTrans = extractBtnWrapper.__translateY__ ?? 0;

    const offset = 20;

    if (top <= offset) {
      const translateY = offset - top;

      const newTrans = translateY + lastTrans;
      extractBtnWrapper.__translateY__ = newTrans;

      extractBtnWrapper.style.transform = `translateY(${newTrans}px)`;
    } else if (top > offset && lastTrans > 0) {
      let newTrans = lastTrans - top + offset;

      newTrans = newTrans < 0 ? 0 : newTrans;

      extractBtnWrapper.__translateY__ = newTrans;

      extractBtnWrapper.style.transform = `translateY(${newTrans}px)`;
    }
  });

  handleExtractOptionsForm();
})();
