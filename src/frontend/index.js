import PN from 'persian-number';

import {
  addNewURLInput,
  handleExtractOptionsForm,
  reachFromTemplateTo,
} from './urlFormHelper';
import { availableWhatNotes } from './DATA';

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

  uxHandler();

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

let activeDialogBox;

function uxHandler() {
  const whatElmnts = document.querySelectorAll('.what');

  window.addEventListener('mousemove', (e) => {
    const target = e.target;
    if (!('mouseMoveSensitive' in target.dataset)) {
      activeDialogBox?.classList.add('hidden');
      return;
    }
  });
  whatElmnts.forEach((we) => we.addEventListener('mouseover', whatHandler));
}

function whatHandler(e) {
  const name = this.dataset.name;

  openWhatDialogBox(name, this);
}

/**
 * @param {string} id Name or identifier of what note
 * @param {HTMLElement} bindedElement The target element which dialog box position must binded with it
 */
function openWhatDialogBox(id, bindedElement) {
  const targetWhat = availableWhatNotes[id];
  if (!targetWhat) {
    return;
  }

  /**
   * @type HTMLDivElement
   */
  let dialogBoxElement = targetWhat.cachedDB;
  if (!dialogBoxElement) {
    dialogBoxElement = document.createElement('div');
    dialogBoxElement.replaceChildren([]);
    // dialogBoxElement.dataset['mouse-move-sesitive'] = true;

    dialogBoxElement.classList.add('what-db');

    const descriptionParts = processWhatDBDescriptions(targetWhat.description);

    dialogBoxElement.appendChild(descriptionParts);
    targetWhat.cachedDB = dialogBoxElement;

    bindedElement.appendChild(dialogBoxElement);
  }

  const { top, left, width, bottom } = bindedElement.getBoundingClientRect();

  // const height = dialogBoxElement.computedStyleMap().get('height');

  // dialogBoxElement.style.top = `${top + 10}px`;

  activeDialogBox = dialogBoxElement;
  activeDialogBox.classList.remove('hidden');
}

/**
 *
 * @param {(string|string[])[]} description
 */
function processWhatDBDescriptions(description, level = 0) {
  const wrapper = document.createDocumentFragment();
  for (let desc of description) {
    if (desc instanceof Array) {
      const childWrapper = processWhatDBDescriptions(desc, level + 1);
      wrapper.appendChild(childWrapper);
    } else if (typeof desc == 'object') {
      const descElm = document.createElement('div');
      const title = document.createElement('span');
      title.textContent = desc.title;
      title.classList.add('what-db-title');

      const detail = document.createElement('span');
      detail.textContent = desc.detail;
      detail.classList.add('what-db-detail');

      descElm.replaceChildren(...[title, detail]);
      descElm.style.paddingRight = `${level * 10}px`;
      wrapper.appendChild(descElm);
    } else if (typeof desc == 'string') {
      const descElm = document.createElement('div');
      descElm.textContent = desc;

      descElm.style.marginRight = `${level * 5}px`;
      descElm.style.fontSize = `${1 - 0.05 * level}em`;
      wrapper.appendChild(descElm);
    }
  }
  return wrapper;
}
