export class ExtractionState {
  static EXTRACTING = 'extracting';
  static IDOL = 'idol';
  static FINISHED = 'finished';
}

export default class ExtractionHandler {
  static isExtractionOnProgress = false;

  static async start(urls, options) {
    if (this.isExtractionOnProgress) {
      throw new Error('');
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
    this._state = ExtractionState.EXTRACTING;

    window.context.listenToExtractionProgress((progressState) => {
      console.log(progressState);
    });

    this._waitForResponse();
    const res = await window.context.extractURLs({
      urls: this.urls,
      options: this.options,
    });

    this._state = ExtractionState.FINISHED;

    if (res.status.code > 0) {
      this._succefulExtractionHandler(res.data);
    } else {
      this._failedExtractionHandler(res.status.message);
    }
  }

  cancel() {
    // Must implement
    window.context.cancelExtraction();
  }

  _waitForResponse() {
    const journalForm = document.forms['journal-form'];
    const waitingViewElmnt = journalForm.parentElement.firstElementChild;

    waitingViewElmnt.classList.remove('hidden');
  }

  _succefulExtractionHandler(result) {
    const { filePath } = result;

    const extractedContainer = document.getElementById('extracted-excels');

    const newExtracted = createNewExtractedItem(filePath);
    newExtracted.classList.add('newly-extracted');

    extractedContainer.appendChild(newExtracted);
  }

  _createNewExtractedItem(extractedPath, fileName) {
    const temp = document.getElementById('extracted-excel-item-template');
    const tempNode = document.importNode(temp, true).content;

    // set index
    const descriptionElement = tempNode.lastElementChild;
    const createTimeElmnt = descriptionElement.firstElementChild;
    createTimeElmnt.textContent = new Date().toString();
    const fileNameElmnt = createTimeElmnt.nextElementSibling;
    fileNameElmnt.textContent = fileName;
    descriptionElement.lastElementChild.textContent = extractedPath;

    return tempNode;
  }

  _failedExtractionHandler(message) {
    const extractionHintElmnt = document.getElementById('extraction-hint');
    extractionHintElmnt.textContent = message;
    extractionHintElmnt.classList.remove('hidden');
    setTimeout(() => extractionHintElmnt.classList.add('hidden'), 5000);
  }
}
