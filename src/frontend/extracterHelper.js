import PN from 'persian-number';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

export function createNewExtractedAuthorItem(
  index,
  firstName,
  lastName,
  affiliations,
  address,
  emails
) {
  const itemTemplate = document.getElementById(
    'extracted-author-info-template'
  );
  const node = document.importNode(itemTemplate, true).content;

  const indexElmnt = node.querySelector('.author-index');
  indexElmnt.textContent = PN.convertEnToPe(index);

  const nameElmnt = node.querySelector('.author-fname');
  nameElmnt.firstElementChild.textContent = firstName;
  nameElmnt.lastElementChild.textContent = lastName;

  function handleListInfos(listInfos, wrapperElmnt) {
    if (listInfos && listInfos.length) {
      const info = listInfos[0];
      wrapperElmnt.classList.remove('hidden');
      wrapperElmnt.lastElementChild.firstElementChild.textContent = info;
      if (listInfos.length > 1) {
        wrapperElmnt.lastElementChild.lastElementChild.textContent = `+${
          listInfos.length - 1
        }مورد دیگر`;
      }
    }
  }

  // handle affiliation
  handleListInfos(affiliations, node.querySelector('.author-affilation'));

  // handle address
  handleListInfos(address, node.querySelector('.author-address'));

  // handle email
  handleListInfos(emails, node.querySelector('.author-email'));

  return node;
}

export function appendNewExtractedExcelItem(
  filePath,
  date,
  numberOfExtractedAuthors,
  fileName
) {
  const extractedContainer = document.getElementById('extracted-excels');

  const newExtracted = createNewExtractedItem(
    filePath,
    date,
    numberOfExtractedAuthors,
    fileName
  );

  extractedContainer.appendChild(newExtracted);
}

export function createNewExtractedItem(
  extractedPath,
  date,
  numberOfExtractedAuthors,
  fileName
) {
  const temp = document.getElementById('extracted-excel-item-template');
  const tempNode = document.importNode(temp, true).content.firstElementChild;

  // set index
  const descriptionElement = tempNode.lastElementChild;
  const createTimeElmnt = descriptionElement.firstElementChild;
  createTimeElmnt.textContent = new DateObject({
    date: date,
    locale: persian_fa,
    calendar: persian,
    format: 'dddd DD MMMM YYYY ساعت HH:MM',
  });
  const fileNameElmnt = createTimeElmnt.nextElementSibling.firstElementChild;
  if (Number.isInteger(numberOfExtractedAuthors)) {
    fileNameElmnt.textContent = `تعداد: ${numberOfExtractedAuthors}`;
  }
  fileNameElmnt.nextElementSibling.textContent = fileName ?? '';

  descriptionElement.lastElementChild.textContent = extractedPath;

  tempNode.title = extractedPath ?? '';
  tempNode.classList.add('newly-extracted');

  return tempNode;
}

export function getSettedOptions(form) {
  // Evaluate options
  const options = {};
  const extractOptionsForm = form;
  const onlyMainOpt = extractOptionsForm['only-main'];
  options.isOnlyMainAuthor = onlyMainOpt.checked;

  const onlyEmailOpt = extractOptionsForm['only-email'];
  options.isOnlyEmail = onlyEmailOpt.checked;

  const authorCountOpt = extractOptionsForm['author-count'].value?.trim();
  if (authorCountOpt) options.authorsCount = Number.parseInt(authorCountOpt);

  options.extractSpeed = Array.from(
    extractOptionsForm['extract-speed'].selectedOptions
  )[0].value;

  return options;
}
