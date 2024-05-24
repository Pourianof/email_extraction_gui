import PN from 'persian-number';
import ExtractionHandler from './extractionHandler';

const temp = document.getElementById('journal-url-template');
/**
 * @type HTMLElement
 */
const journalForm = document.forms['journal-form'];
const extractBtn =
  journalForm.previousElementSibling.previousElementSibling.lastElementChild;

function focusOnURLInput(e) {
  const inputElmnt = this.firstElementChild;
  const placeHolderElmnt = this.lastElementChild;

  if (inputElmnt.focused) {
    return;
  }

  inputElmnt.focus();
  inputElmnt.focused = true;

  function handleInputBlur() {
    const val = inputElmnt.value.trim();
    const hintElmnt = reachFromTemplateTo(
      this.parentElement.parentElement.parentElement,
      'hint'
    );

    if (!val) {
      placeHolderElmnt.classList.remove('hidden');
      hintElmnt.replaceChildren([]);
    } else {
      let hintMsg = [];
      let url;

      try {
        url = new URL(val);
        if (!url.protocol.startsWith('https')) {
          hintMsg.push('آدرس ژورنال میبایست با https:// شروع بشود.');
        }
        let { hostname } = url;
        if (hostname.startsWith('www.')) {
          hostname = hostname.substring(4);
        }
        if (
          hostname !== 'elsevier.com' &&
          hostname !== 'sciencedirect.com' &&
          hostname !== 'springer.com' &&
          hostname !== 'wiley.com'
        ) {
          hintMsg.push(
            'آدرس وارد شده مربوط به هیچکدام از سایت های الزویر(Sciencedirect) یا ویلی یا اشپرینگر نمیباشد.'
          );
        }
      } catch (err) {
        hintMsg.push('آدرس وارد شده معتبر نمیباشد.');
        if (!val.startsWith('https')) {
          hintMsg.push('لطفا عبارت https:// را در ابتدای آدرس خود قرار دهید');
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
    this.removeEventListener('blur', handleInputBlur);
  }

  placeHolderElmnt.classList.add('hidden');

  inputElmnt.addEventListener('blur', handleInputBlur);
}

/**
 *
 * @param {HTMLElement | null} templateElmnt Root template element
 * @param {'hint' | 'index' | 'URL' | 'input' | 'remove-btn'} target  Which subtree element must return.
 * @returns {HTMLElement | null} The target element which is desired
 */
function reachFromTemplateTo(templateElmnt, target) {
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

function addNewURLInput() {
  const tempNode = document.importNode(temp, true).content;

  // set index
  const indexElmnt = reachFromTemplateTo(tempNode.firstElementChild, 'index');
  const index =
    +(reachFromTemplateTo(journalForm.lastElementChild, 'index')?.index ?? 0) +
    1;
  indexElmnt.textContent = PN.convertEnToPe(index);
  indexElmnt.index = index;

  indexElmnt.nextElementSibling.addEventListener('click', focusOnURLInput);
  journalForm.appendChild(tempNode);

  extractBtn.classList.remove('hidden');

  handleScrollIfNeeded();
}

function handleScrollIfNeeded() {
  const root = document.getElementById('root');
  const rootHeight = root.getBoundingClientRect().height;

  const availableHeight = window.innerHeight;

  if (rootHeight > availableHeight) {
    (document.scrollingElement || document.body).scroll({ top: rootHeight });
  }
}

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
/**
 *
 * @returns {{type:'error' | 'empty'; elmnt:HTMLElement ;}}
 */
function checkURLInValidation() {
  let isAllEmpty = true;

  for (let child of journalForm.children) {
    const hintsElmnt = reachFromTemplateTo(child, 'hint');
    if (hintsElmnt.textContent.trim()) {
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
      elmnt: journalForm.firstElementChild,
    };
  }

  return false;
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

  let isExtracting = false;

  const extractionOptions = {};

  const extractOptionsForm = extractBtn.previousElementSibling;

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
  extractOptionsForm?.addEventListener('change', (e) => {
    const input = e.target;

    switch (input.name) {
      case 'only-email':
        {
          extractionOptions.isOnlyEmail = input.checked;
        }
        break;
      case 'only-main':
        {
          extractionOptions.isOnlyMail = input.checked;
        }
        break;
      case 'author-count':
        {
          const newVal = input.value?.trim();
          if (newVal) {
            extractionOptions.authorsCount = Number.parseInt(newVal);
          } else {
            delete extractionOptions.authorsCount;
          }
        }
        break;
    }
  });

  extractBtn.addEventListener('click', () =>
    startExtraction(extractionOptions)
  );
})();

function startExtraction(options) {
  let invalidURL;
  if (!journalForm.firstElementChild || (invalidURL = checkURLInValidation())) {
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
  for (let input of journalForm.children) {
    const url = reachFromTemplateTo(input, 'URL').value.trim();
    if (url) urls.push(url);
  }

  const extractionHandler = ExtractionHandler.start(urls, options);
}
