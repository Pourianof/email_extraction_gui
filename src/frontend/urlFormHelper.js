import PN from 'persian-number';
import ExtractionHandler from './extractionHandler';
import {
  isElsevier,
  isElsevierIssue,
  isSpringer,
  isSpringerArticles,
  isSpringerIssue,
  isTandF,
  isTandFIssue,
  isWiley,
  isWileyArticles,
  isWileyIssue,
  isWileyVolume,
  isWorldScientific,
  isWorldScientificIssue,
  isWorldScientificMainPage,
} from './urlValidator';
import { getSettedOptions } from './extracterHelper';
import { localeNumber } from './renderers/helpers/localeNumber';

const journalForm = document.forms['journal-form'];
const extractBtn = journalForm.firstElementChild.lastElementChild;

export function handleInputBlur(inputElmnt) {
  const val = inputElmnt.value.trim();
  const hintElmnt = reachFromTemplateTo(
    inputElmnt.parentElement.parentElement.parentElement,
    'hint',
  );
  const placeHolderElmnt = inputElmnt.nextElementSibling;

  if (!val) {
    placeHolderElmnt.classList.remove('hidden');
    hintElmnt.replaceChildren([]);
  } else {
    let hintMsg = [];
    let url;

    try {
      url = new URL(val);
      if (!url.protocol.startsWith('https')) {
        hintMsg.push('آدرس نشریه میبایست با https:// شروع بشود.');
      }

      if (
        !isElsevier(val) &&
        !isSpringer(val) &&
        !isWiley(val) &&
        !isWorldScientific(val) &&
        !isTandF(val)
      ) {
        hintMsg.push(
          'آدرس وارد شده مربوط به هیچکدام از سایت های الزویر(Sciencedirect) یا وایلی یا اشپرینگر یا T&F و یا World-Scientific و یا T&F نمیباشد.',
        );
      }

      if (isElsevier(val) && !isElsevierIssue(val)) {
        hintMsg.push(
          'آدرس وارد شده از ساینس دایرک به صفحه Volume یا کتاب از یک نشریه اشاره نمیکند',
        );
      } else if (
        isSpringer(val) &&
        !isSpringerIssue(val) &&
        !isSpringerArticles(val)
      ) {
        hintMsg.push(
          'آدرس وارد شده به یک صفحه از Issue یا صفحه مقالات مربوط به نشریه اشاره نمیکند (ترجیحا آخرین issue)',
        );
      } else if (
        isWiley(val) &&
        !isWileyIssue(val) &&
        !isWileyVolume(val) &&
        !isWileyArticles(val)
      ) {
        hintMsg.push(
          'آدرس وارد شده مربوط به آدرس یک Volume یا Issue یا صفحه مقالات از نشریه نمیباشد',
        );
      } else if (
        isWorldScientific(val) &&
        !isWorldScientificIssue(val) &&
        !isWorldScientificMainPage(val)
      ) {
        hintMsg.push(
          'آدرس وارد شده، یک آدرس معتبر مربوط به انتشارات World-Scientific نمیباشد',
        );
      } else if (isTandF(val) && !isTandFIssue(val)) {
        hintMsg.push(
          'آدرس وارد شده، یک آدرس معتبر مربوط به انتشارات T&F نمیباشد',
        );
      }
    } catch (err) {
      console.log(err);
      const lang = window.i18n?.language || 'fa';
      hintMsg.push(
        lang === 'fa'
          ? 'آدرس وارد شده معتبر نمیباشد.'
          : 'The entered URL is not valid.',
      );
      if (!val.startsWith('https')) {
        hintMsg.push(
          lang === 'fa'
            ? 'لطفا عبارت https:// را در ابتدای آدرس خود قرار دهید'
            : 'Please add https:// at the beginning of your URL',
        );
      }
    }

    if (hintMsg.length) {
      hintElmnt.replaceChildren([]);

      hintMsg.forEach((h) => {
        const el = document.createElement('span');
        el.textContent = h;
        hintElmnt.appendChild(el);
      });
      hintElmnt.classList.remove('hidden');
    } else {
      const oldHints = hintElmnt.textContent.trim();
      if (oldHints) {
        hintElmnt.classList.add('hidden');
      }
    }
  }
  delete inputElmnt.focused;
  inputElmnt.removeEventListener('blur', handleInputBlur);
}

function focusOnURLInput(e) {
  /** @type HTMLInputElement */
  const inputElmnt = this.firstElementChild;
  const placeHolderElmnt = this.lastElementChild;

  if (inputElmnt.focused) {
    return;
  }

  inputElmnt.focus();
  inputElmnt.focused = true;

  placeHolderElmnt.classList.add('hidden');

  inputElmnt.addEventListener('blur', (e) => handleInputBlur(inputElmnt));
  inputElmnt.addEventListener('change', (e) => handleInputBlur(inputElmnt));
  inputElmnt.addEventListener('reset', (e) => handleInputBlur(inputElmnt));
}

export function addNewURLInput() {
  const temp = document.getElementById('journal-url-template');
  const tempNode = document.importNode(temp, true).content;

  // set index
  const indexElmnt = reachFromTemplateTo(tempNode.firstElementChild, 'index');
  const index =
    +(
      reachFromTemplateTo(
        journalForm.lastElementChild.lastElementChild,
        'index',
      )?.index ?? 0
    ) + 1;
  indexElmnt.textContent = localeNumber(index);
  indexElmnt.index = index;

  indexElmnt.nextElementSibling.addEventListener('click', focusOnURLInput);
  journalForm.lastElementChild.appendChild(tempNode);

  extractBtn.classList.remove('hidden');

  handleScrollIfNeeded();
}

function handleScrollIfNeeded() {
  const root = document.getElementById('root');
  const rootHeight = root.getBoundingClientRect().height;

  const scrollHeight = root.scrollHeight;

  if (scrollHeight > rootHeight) {
    (root || document.body).scroll({ top: scrollHeight });
  }
}

/**
 *
 * @param {HTMLElement | null} templateElmnt Root template element
 * @param {'hint' | 'index' | 'URL' | 'input' | 'remove-btn'} target  Which subtree element must return.
 * @returns {HTMLElement | null} The target element which is desired
 */
export function reachFromTemplateTo(templateElmnt, target) {
  if (!templateElmnt) {
    return null;
  }

  const t = target.trim();

  if (typeof t != 'string') {
    throw new Error(`The target specifier must be a string not a ${typeof t}.`);
  }

  if (t == 'hint') {
    return templateElmnt.lastElementChild;
  } else {
    const mainRow = templateElmnt.firstElementChild;
    if (t == 'index') {
      return mainRow.firstElementChild;
    } else if (t == 'input') {
      return mainRow.firstElementChild.nextElementSibling;
    } else if (t == 'URL') {
      return mainRow.firstElementChild.nextElementSibling.firstElementChild;
    } else if (t == 'remove-btn') {
      return mainRow.lastElementChild;
    }
  }

  throw new Error(`The target specifier => ${t} is not valid`);
}

/**
 *
 * @returns {{type:'error' | 'empty'; elmnt:HTMLElement ;}}
 */
function checkURLInValidation() {
  let isAllEmpty = true;

  for (let child of journalForm.lastElementChild.children) {
    const hintsElmnt = reachFromTemplateTo(child, 'hint');
    if (
      !hintsElmnt.classList.contains('hidden') &&
      hintsElmnt.textContent.trim()
    ) {
      return {
        type: 'error',
        elmnt: child,
      };
    }

    if (reachFromTemplateTo(child, 'URL').value.trim()) {
      isAllEmpty = false;
    }
  }

  if (isAllEmpty) {
    return {
      type: 'empty',
      elmnt: journalForm.lastElementChild.firstElementChild,
    };
  }

  return false;
}

function startExtraction() {
  if (!journalForm.lastElementChild.firstElementChild) {
    return;
  }
  let invalidURL;
  if ((invalidURL = checkURLInValidation())) {
    // Display error, at least 1 url must be provided
    if (invalidURL.type == 'empty') {
      const inputElmt = reachFromTemplateTo(invalidURL.elmnt, 'input');
      const highlightAnimationClassName = 'highligt-input-animation';
      inputElmt.classList.add(highlightAnimationClassName);

      setTimeout(() => {
        inputElmt.classList.remove(highlightAnimationClassName);
      }, 600);
    }

    invalidURL.elmnt.classList.add();
    reachFromTemplateTo(invalidURL.elmnt, 'URL').focus();

    return;
  }

  // If all is ok
  const urls = [];
  for (let input of journalForm.lastElementChild.children) {
    const url = reachFromTemplateTo(input, 'URL').value.trim();
    if (url) urls.push(url);
  }

  const options = getSettedOptions(journalForm);

  const extractionHandler = ExtractionHandler.start(urls, options);
}

export function handleExtractOptionsForm() {
  const extractOptionsForm = journalForm;

  extractOptionsForm['author-count'].addEventListener('keydown', function (e) {
    const newDigit = Number.parseInt(e.key);
    if (
      (Number.isNaN(newDigit) && e.keyCode > 31) ||
      (!this.value.length && newDigit === 0)
    ) {
      e.preventDefault();
      return;
    }
  });

  extractBtn.addEventListener('click', (e) => {
    e.preventDefault();
    startExtraction();
  });
}
