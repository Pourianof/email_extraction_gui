import { appendNewExtractedExcelItem } from './extracterHelper';
import './validUrlMoreInfoHandler';

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
    if (!target.classList.contains(selectedClass)) {
      lastActiveMainContent.classList.remove(selectedClass);
      target.classList.add(selectedClass);

      const id = target.dataset.id;
      console.log(lastActiveMainContent, lastActiveMainContent.dataset.id);

      mainContentElmnt
        .querySelector(`#${lastActiveMainContent.dataset.id}`)
        .classList.add('hidden');

      lastActiveMainContent = target;
      mainContentElmnt.querySelector(`#${id}`).classList.remove('hidden');
    }
  });
}

displayExtractedItems();
handleActiveMainContent();
