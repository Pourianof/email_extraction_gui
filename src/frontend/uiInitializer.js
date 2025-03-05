import { appendNewExtractedExcelItem } from './extracterHelper';
import './validUrlMoreInfoHandler';
import './googleScholarHandler';

export async function displayExtractedItems() {
  try {
    /**
     * @type {{filePath:string; date:number, fileName:string, numberOfExtractedAuthors:number}[]}
     */
    const extractedItems = await window.context.getExtractedItems();
    extractedItems.forEach((i) => {
      appendNewExtractedExcelItem(
        i.filePath,
        i.date,
        i.numberOfExtractedAuthors,
        i.fileName
      );
    });
  } catch (err) {
    console.error(err);
  }
}

let lastActiveMainContent;

function moveSubPartsToNewExtractorView(activatedMainContent) {
  const waitingView = document.getElementsByClassName('waiting-view')[0];
  const optionsForm = document.getElementById('extraction-options');

  /** @type HTMLElement */
  const waitingViewParent = activatedMainContent.querySelector('.main-form');

  const formOptionsParent =
    activatedMainContent.querySelector('.options-container');

  formOptionsParent.prepend(optionsForm);
  waitingViewParent.prepend(waitingView);
}

function handleActiveMainContent() {
  const selectedClass = 'selected-extractor-item';
  const mainContentElmnt = document.getElementById('main-content');

  lastActiveMainContent = mainContentElmnt
    .getElementsByClassName(`extracter-item-title ${selectedClass}`)
    .item(0);

  const itemsBox = mainContentElmnt.querySelector('#extractor-items');
  itemsBox.addEventListener('click', function (e) {
    e.preventDefault();

    const target = e.target;
    if (
      target.classList.contains('extracter-item-title') &&
      !target.classList.contains(selectedClass)
    ) {
      lastActiveMainContent.classList.remove(selectedClass);
      target.classList.add(selectedClass);

      const id = target.dataset.id;
      const newExtractorView = document.getElementById(id);

      mainContentElmnt
        .querySelector(`#${lastActiveMainContent.dataset.id}`)
        .classList.add('hidden');

      lastActiveMainContent = target;
      newExtractorView.classList.remove('hidden');
      moveSubPartsToNewExtractorView(newExtractorView);
    }
  });
}

displayExtractedItems();
handleActiveMainContent();
