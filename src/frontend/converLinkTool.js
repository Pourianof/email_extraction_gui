import {
  isSpringerArticles,
  isSpringerIssue,
  isSpringerMainPage,
  isWileyArticles,
  isWileyIssue,
  isWileyMainPage,
  isWileyVolume,
} from './urlValidator';

const form = document.getElementById('address-convert-form');
/** @type HTMLSelectElement */
const selectElmnt = form.querySelector('#target-address-select');
const urlInput = form.querySelector('.address-helper-input.--ahi-url--');

function reset() {
  const optgroup = Array.from(form.querySelectorAll(`optgroup`));
  optgroup.forEach((o) => {
    o.disabled = true;
    Array.from(o.querySelectorAll('option')).forEach((opt) => {
      opt.selected = false;
    });
  });
  form
    .querySelectorAll(`.convert-number-inputs .--cni-input--`)
    .forEach((i) => i.classList.add('hidden'));
}

function displayMessage(message, isErr) {
  const msgElmnt = urlInput.nextElementSibling;
  msgElmnt.classList.remove('hidden');
  msgElmnt.textContent = message;
  if (isErr) {
    msgElmnt.classList.add('--svu-hint--');
  } else {
    msgElmnt.classList.remove('--svu-hint--');
  }
}

function convertToolInitializer() {
  /**@type HTMLFormElement */
  const volIssForm = form.querySelector(`.convert-number-inputs`);
  volIssForm.addEventListener('change', function (e) {
    /** @type HTMLInputElement */
    const target = e.target;
    const val = target.value.trim();
    if (val) {
      generateOutputURL();
    }
  });

  form.querySelector('.output-url').addEventListener('click', function (e) {
    window.context.copyToClipBoard({ text: this.textContent });
  });

  /**@type HTMLInputElement */
  urlInput.addEventListener('blur', function (e) {
    reset();
    const url = this.value;

    if (url) {
      try {
        new URL(url);
      } catch (err) {
        displayMessage(`آدرس وارد شده نامعتبر است.`, true);
        return;
      }
      let isSpringer = false;
      let isWiley = false;
      let sourceURLMessage;
      if (isSpringerIssue(url)) {
        isSpringer = true;
        sourceURLMessage = 'آدرس مربوط به صفحه Issue از نشریه Springer است';
      } else if (isSpringerArticles(url)) {
        isSpringer = true;
        sourceURLMessage =
          'آدرس مربوط به صفحه Aricles(مقالات) از نشریه Springer است';
      } else if (isSpringerMainPage(url)) {
        isSpringer = true;
        sourceURLMessage =
          'آدرس مربوط به صفحه اصلی یکی از ژورنال ها در نشریه Springer است';
      } else if (isWileyIssue(url)) {
        isWiley = true;
        sourceURLMessage = 'آدرس مربوط به صفحه Issue در نشریه Wiley است';
      } else if (isWileyMainPage(url)) {
        isWiley = true;
        sourceURLMessage =
          'آدرس مربوط به صفحه اصلی یکی از ژورنال ها در نشریه Wiley است';
      } else if (isWileyArticles(url)) {
        isWiley = true;
        sourceURLMessage = 'آدرس مربوط به صفحه مقالات در نشریه Wiley است';
      } else if (isWileyVolume(url)) {
        isWiley = true;
        sourceURLMessage = 'آدرس مربوط به صفحه Volumes در نشریه Wiley است';
      } else {
        sourceURLMessage =
          'آدرس وارد شده جزو هیچکدام از آدرس های معتبر گفته شده نمیباشد';
        this.nextElementSibling.classList.add('--svu-hint--');
      }

      displayMessage(sourceURLMessage, !isSpringer && !isWiley);

      if (isSpringer) {
        enableOptionGroup('Springer');
      } else if (isWiley) {
        enableOptionGroup('Wiley');
      }
    } else {
      if (!urlInput.nextElementSibling.classList.contains('hidden')) {
        urlInput.nextElementSibling.classList.add('hidden');
      }
    }
  });

  selectElmnt.addEventListener('change', function (e) {
    handleOptions();
  });
}

function handleOptions() {
  const options = selectElmnt.options;
  const index = selectElmnt.selectedIndex;
  const name = options[index].value;
  const type = name.split('-')[1].toLowerCase();

  const visibleParts = form.querySelectorAll(
    `.convert-number-inputs .--cni-input--`
  );
  if (type == 'articles') {
    generateOutputURL();
    visibleParts.forEach((v) => {
      v.classList.add('hidden');
      v.querySelector('input').value = '';
    });
    return;
  }

  visibleParts.forEach((v) => {
    const t = v.attributes.getNamedItem('type').textContent;
    if (t == type) {
      v.classList.remove('hidden');
    } else if (t.includes(type)) {
      v.classList.remove('hidden');
    } else {
      v.classList.add('hidden');
    }
  });
}

function generateOutputURL() {
  /** @type string */
  const baseUrl = urlInput.value.toLowerCase();
  const isSpringer = baseUrl.includes('springer');
  const isWiley = baseUrl.includes('wiley');
  let journalId;
  if (isSpringer) {
    journalId = baseUrl.match(/journal\/([\d\w]+)/)[1];
  } else if (isWiley) {
    journalId = baseUrl.match(/(toc|loi|index|journal)\/([\d\w]+)/)[2];
  } else {
    return;
  }

  const type = selectElmnt.selectedOptions[0].value.split('-')[1].toLowerCase();

  let targetURL;
  if (type == 'articles') {
    if (isWiley) {
      targetURL = `https://www.onlinelibrary.wiley.com/index/${journalId}`;
    } else {
      targetURL = `https://www.link.springer.com/journal/${journalId}/articles`;
    }
  } else {
    let vol = Number(
        form.querySelector('.--cni-input--[type*="volume"] input').value.trim()
      ),
      iss = form
        .querySelector('.--cni-input--[type="issue"] input')
        .value.trim();

    vol = Number.isNaN(vol) || !+vol ? 1 : vol;
    iss = Number.isNaN(iss) || !+iss ? 1 : iss;

    if (type == 'issue') {
      if (isWiley) {
        targetURL = `https://www.onlinelibrary.wiley.com/toc/${journalId}/${vol}/${iss}`;
      } else {
        targetURL = `https://www.link.springer.com/journal/${journalId}/volumes-and-issues/${vol}-${iss}`;
      }
    } else if (type == 'volume') {
      if (isWiley) {
        targetURL = `https://www.onlinelibrary.wiley.com/loi/${journalId}/${vol}`;
      }
    }
  }
  const addressPlace = document.getElementById('generated-address');
  addressPlace.textContent = targetURL;
  addressPlace.parentElement.parentElement.classList.remove('hidden');
}

/**
 * @param {"Springer" | "Wiley"} which
 */
function enableOptionGroup(which) {
  /** @type HTMLOptGroupElement */
  const optgroup = form.querySelector(`optgroup[label="${which}"]`);
  optgroup.disabled = false;
  (
    optgroup.nextElementSibling ?? optgroup.previousElementSibling
  ).firstElementChild.selected = false;
  optgroup.firstElementChild.selected = true;
  optgroup.dispatchEvent(new Event('change', { bubbles: true }));
}

convertToolInitializer();
