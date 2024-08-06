import {
  appendNewExtractedExcelItem,
  createNewExtractedAuthorItem,
} from './extracterHelper';
import { formatUnixInterval } from './helpers';
import { backURLFormToInitialState } from './sharedFunctions';
export class ExtractionState {
  static EXTRACTING = 'extracting';
  static IDOL = 'idol';
  static FINISHED = 'finished';
}

let isExtractListScrollAway = false;

function handleExtractedItemsListScroll(e) {
  const sHeight = this.scrollHeight;
  const cHeight = this.clientHeight;
  const maxScroll = sHeight - cHeight;
  const scrollTop = this.scrollTop;
  const eps = 5;
  if (scrollTop < maxScroll - eps) {
    isExtractListScrollAway = true;
  } else if (isExtractListScrollAway) {
    isExtractListScrollAway = false;
  }
}

function hideExtractList() {
  const extractListElmnt = document.querySelector('.extracted-list');
  extractListElmnt.classList.add('hidden');
  extractListElmnt.firstElementChild.firstElementChild.removeEventListener(
    'click',
    hideExtractList
  );

  const displayLabel = extractListElmnt.previousElementSibling;
  displayLabel.classList.remove('hidden');
  extractListElmnt.lastElementChild.removeEventListener(
    'scroll',
    handleExtractedItemsListScroll
  );
  displayLabel.addEventListener('click', displayExtractList);
}

function displayExtractList() {
  const extractListElmnt = document.querySelector('.extracted-list');
  extractListElmnt.classList.remove('hidden');
  extractListElmnt.firstElementChild.firstElementChild.addEventListener(
    'click',
    hideExtractList
  );

  extractListElmnt.lastElementChild.addEventListener(
    'scroll',
    handleExtractedItemsListScroll
  );

  const displayLabel = extractListElmnt.previousElementSibling;
  displayLabel.classList.add('hidden');
  displayLabel.removeEventListener('click', displayExtractList);
}

function handleExtractionWaitingView(hide) {
  const journalForm = document.forms['journal-form'];
  const waitingViewElmnt = journalForm.parentElement.firstElementChild;

  if (hide) {
    waitingViewElmnt.classList.add('hidden');
  } else {
    waitingViewElmnt.classList.remove('hidden');
  }
}

export default class ExtractionHandler {
  static isExtractionOnProgress = false;

  static async start(urls, options) {
    if (this.isExtractionOnProgress) {
      throw new Error(
        'Currently another extraction is on progress.\nYou must either cancel the previous one and start a new or wait to previous get finish.'
      );
    }

    const handler = new ExtractionHandler(urls, options);
    this.listenToExtractionProgress = true;
    handler.extract().then(() => {
      this.listenToExtractionProgress = false;
    });
    return handler;
  }

  _state = ExtractionState.IDOL;
  constructor(urls, options) {
    this.urls = urls;
    this.options = options;
  }

  async extract() {
    if (this._state === ExtractionState.FINISHED) {
      throw new Error(
        'This handler finished it extraction.\nYou must use new handler to extracting...'
      );
    }

    this._waitForResponse();

    window.context.listenToExtractionProgress(this._onNewProgressState);
    const res = JSON.parse(
      await window.context.extractURLs({
        urls: this.urls,
        options: this.options,
      })
    );

    this._state = ExtractionState.FINISHED;

    handleExtractionResult(res, this.extractedCount);
  }
  extractedCount = 0;
  stopScrollingDown = false;
  _onNewProgressState = (state) => {
    console.log(state);
    this.extractedCount = state.totalAuthorRecieved;

    const journalForm = document.forms['journal-form'];
    const waitingViewElmnt = journalForm.parentElement.firstElementChild;
    const extractedListElmnt = waitingViewElmnt;

    const { name, lastName, email, affiliations, address } = state.author;
    const newItemElmnt = createNewExtractedAuthorItem(
      state.totalAuthorRecieved,
      name,
      lastName,
      affiliations,
      address,
      email
    );

    /**
     * @type HTMLElement
     */
    const extractedListWrapperView =
      extractedListElmnt.lastElementChild.lastElementChild;
    extractedListWrapperView.appendChild(newItemElmnt);

    handleExtractListItemBounds();

    if (
      !isExtractListScrollAway &&
      extractedListWrapperView.scrollHeight >
        extractedListWrapperView.clientHeight
    ) {
      extractedListWrapperView.scrollTo(
        0,
        extractedListWrapperView.scrollHeight
      );
    }
  };

  cancel() {
    // Must implement
    window.context.cancelExtraction();
  }

  _waitForResponse() {
    this._state = ExtractionState.EXTRACTING;
    handleExtractionWaitingView();
    displayExtractList();
  }
}
function handleExtractListItemBounds() {
  const extractListViewElmnt = document.querySelector('.extracted-list-view');

  const itemBound = 50;
  const availableItemsCount = extractListViewElmnt.children.length;
  if (!isExtractListScrollAway && availableItemsCount > itemBound) {
    if (availableItemsCount > itemBound + 1) {
      const newChildren = Array.from(extractListViewElmnt.children).slice(
        availableItemsCount - itemBound
      );
      extractListViewElmnt.replaceChildren(...newChildren);
    } else {
      extractListViewElmnt.removeChild(extractListViewElmnt.firstElementChild);
    }
  }
}

const waitingViewElmnt = document.querySelector('.waiting-view');

function handleExtractionResult(result, extractedCount) {
  hideExtractList();
  isExtractListScrollAway = false;
  handleExtractListItemBounds();

  if (result.status.code > 0) {
    succefulExtractionHandler(result.data, extractedCount);
  } else {
    failedExtractionHandler(
      result.status.message,
      result.data.filePath,
      extractedCount
    );
  }
}

function succefulExtractionHandler(result, extractedCount) {
  hideExtractList();
  const { filePath, fileName, elapsedTime, numberOfExtractedAuthors, date } =
    result;

  appendNewExtractedExcelItem(
    filePath,
    date,
    numberOfExtractedAuthors,
    fileName
  );

  let loadingImg = waitingViewElmnt.firstElementChild;

  const tree = document.createDocumentFragment();
  // display success message
  const waitingResultElement = document.createElement('div');
  waitingResultElement.classList.add('successful-extraction-result');
  waitingResultElement.classList.add('extraction-result');

  const statusHint = document.createElement('span');
  statusHint.classList.add('--ser-message--');
  const formatedElapsed = formatUnixInterval(elapsedTime);

  statusHint.textContent = `فرآیند جمع آوری با موفقیت در طول ${formatedElapsed} به اتمام رسید.`;
  waitingResultElement.appendChild(statusHint);

  const statusSubHint = document.createElement('span');
  statusSubHint.classList.add('--ser-sub-message--');
  statusSubHint.textContent = `در مجموعه ${extractedCount} آیتم بدست آمده است`;
  waitingResultElement.appendChild(statusSubHint);

  const openExtractedExcelBtn = document.createElement('button');
  openExtractedExcelBtn.classList.add('--ser-btn--');
  openExtractedExcelBtn.classList.add('--ser-open-btn--');
  openExtractedExcelBtn.textContent = 'نمایش فایل ساخته شده';
  openExtractedExcelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.context.openExcelFile(JSON.stringify({ filePath: filePath }));
  });
  waitingResultElement.appendChild(openExtractedExcelBtn);

  extractionFinishHandler(waitingResultElement);

  tree.appendChild(waitingResultElement);

  waitingViewElmnt.replaceChild(tree, loadingImg);
}

function failedExtractionHandler(message, filePath, extractedCount) {
  let loadingImg = waitingViewElmnt.firstElementChild;
  const waitingResultElement = document.createElement('div');
  waitingResultElement.classList.add('failed-extraction-result');
  waitingResultElement.classList.add('extraction-result');

  const statusHint = document.createElement('span');
  statusHint.classList.add('--fer-message--');
  statusHint.textContent = `فرآیند گردآوری باشکست روبرو شد. پیام شکست :\n${message}`;
  waitingResultElement.appendChild(statusHint);

  if (extractedCount > 0) {
    const statusSubHint = document.createElement('span');
    statusSubHint.classList.add('--ser-sub-message--');
    statusSubHint.textContent = `از آنجایی که ${extractedCount} آیتم بدست آمده، امکان دارد فایل اکسل حاوی این آیتم ها ساخته شده باشد. از دکمه زیر برای دسترسی استفاده کنید.`;
    waitingResultElement.appendChild(statusSubHint);

    const openExtractedExcelBtn = document.createElement('button');
    openExtractedExcelBtn.classList.add('--ser-btn--');
    openExtractedExcelBtn.classList.add('--ser-open-btn--');
    openExtractedExcelBtn.textContent = 'نمایش فایل ساخته شده';
    openExtractedExcelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.context.openExcelFile(JSON.stringify({ filePath: filePath }));
    });
    waitingResultElement.appendChild(openExtractedExcelBtn);
  }

  extractionFinishHandler(waitingResultElement);

  waitingViewElmnt.replaceChild(waitingResultElement, loadingImg);
}

function extractionFinishHandler(parent) {
  let loadingImg = waitingViewElmnt.firstElementChild;

  const returnToViewBtn = document.createElement('button');
  returnToViewBtn.classList.add('--rv-btn--');
  returnToViewBtn.textContent = 'بازگشت به فرم قبلی';

  const closeResultViewBtn = document.createElement('button');
  closeResultViewBtn.classList.add('--ser-btn--', '--ser-close-btn--');
  closeResultViewBtn.textContent = 'اتمام و نمایش فرم جدید';
  parent.appendChild(closeResultViewBtn);
  closeResultViewBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleExtractionWaitingView(true);
    waitingViewElmnt.replaceChild(loadingImg, parent);
    backURLFormToInitialState();
    const extractedListWrapperView =
      waitingViewElmnt.lastElementChild.lastElementChild;
    extractedListWrapperView.replaceChildren([]);
  });
  document.getElementById('extract-btn')?.classList.add('hidden');
}
