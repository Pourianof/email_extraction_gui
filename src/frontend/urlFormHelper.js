import PN from 'persian-number';
import ExtractionHandler from './extractionHandler';

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
        let { hostname, pathname } = url;
        if (hostname.startsWith('www.')) {
          hostname = hostname.substring(4);
        }
        console.log(hostname);
        if (
          hostname !== 'elsevier.com' &&
          hostname !== 'sciencedirect.com' &&
          hostname !== 'springer.com' &&
          hostname !== 'link.springer.com'
          //  && hostname !== 'wiley.com'
        ) {
          hintMsg.push(
            'آدرس وارد شده مربوط به هیچکدام از سایت های الزویر(Sciencedirect) یا ویلی یا اشپرینگر نمیباشد.'
          );
        }

        if (
          hostname == 'sciencedirect.com' &&
          !(
            /^\/journal\//g.test(pathname) &&
            /vol\/\d+(\/issue\/\d+)?\/?$/g.test(pathname)
          )
        ) {
          hintMsg.push(
            'آدرس وارد شده از ساینس دایرک به صفحه Volume از یک ژورنال اشاره نمیکند'
          );
        } else if (
          (hostname == 'springer.com' || hostname == 'link.springer.com') &&
          !(
            /^\/?journal/g.test(pathname) &&
            /volumes-and-issues\/\d+-\d+$/g.test(pathname)
          )
        ) {
          hintMsg.push(
            'آدرس وارد شده به یک صفحه از Issue مربوط به ژورنال اشاره نمیکند (ترجیحا آخرین issue)'
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

export function addNewURLInput() {
  const temp = document.getElementById('journal-url-template');
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

  const scrollHeight = root.scrollHeight;

  if (scrollHeight > rootHeight) {
    (root || document.body).scroll({ top: scrollHeight });
  }
}

export /**
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

function startExtraction() {
  if (!journalForm.firstElementChild) {
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
  for (let input of journalForm.children) {
    const url = reachFromTemplateTo(input, 'URL').value.trim();
    if (url) urls.push(url);
  }

  // Evaluate options
  const options = {};
  const extractOptionsForm = extractBtn.previousElementSibling;
  const onlyMainOpt = extractOptionsForm['only-main'];
  options.isOnlyMainAuthor = onlyMainOpt.checked;

  const onlyEmailOpt = extractOptionsForm['only-email'];
  options.isOnlyEmail = onlyEmailOpt.checked;

  const authorCountOpt = extractOptionsForm['author-count'].value?.trim();
  if (authorCountOpt) options.authorsCount = Number.parseInt(authorCountOpt);

  options.extractSpeed = Array.from(
    extractOptionsForm['extract-speed'].selectedOptions
  )[0].value;

  console.log('start');
  const extractionHandler = ExtractionHandler.start(urls, options);
}

export function handleExtractOptionsForm() {
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

  extractBtn.addEventListener('click', () => startExtraction());
}

export function backURLFormToInitialState() {
  journalForm.replaceChildren([]);
  const extractOptionsForm = extractBtn.previousElementSibling;

  extractOptionsForm['only-email'].checked = false;
  extractOptionsForm['only-main'].checked = false;
  extractOptionsForm['author-count'].value = '';
}
