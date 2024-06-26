import fs from 'fs';
import path from 'path';
import { TEMP_FILES } from './pathes';

let loadedExtractedItemsJson: {
  filePath: string;
  date: number;
  numberOfExtractedAuthors: number;
}[];

const EXTRACTED_DB = path.join(TEMP_FILES, 'extracted.json');
const MAX_SAVED_ITEMS_COUNT = 10;

function loadExractedItemsJsonFile() {
  if (!loadedExtractedItemsJson) {
    if (fs.existsSync(EXTRACTED_DB)) {
      loadedExtractedItemsJson = JSON.parse(
        fs.readFileSync(EXTRACTED_DB, {
          encoding: 'utf8',
        })
      );
    } else {
      loadedExtractedItemsJson = [];
    }
  }
}

export function registerExtractedExcel(
  filePath: string,
  numberOfExtractedAuthors: number
) {
  const newDate = Date.now();

  loadExractedItemsJsonFile();

  const index = loadedExtractedItemsJson.findIndex(
    (v) => v.filePath === filePath
  );

  if (index >= 0) {
    if (
      loadedExtractedItemsJson[index].numberOfExtractedAuthors !=
      numberOfExtractedAuthors
    ) {
      loadedExtractedItemsJson[index].numberOfExtractedAuthors =
        numberOfExtractedAuthors;
    } else {
      return;
    }
  } else {
    loadedExtractedItemsJson.push({
      date: newDate,
      filePath,
      numberOfExtractedAuthors,
    });

    if (loadedExtractedItemsJson.length >= MAX_SAVED_ITEMS_COUNT) {
      loadedExtractedItemsJson.splice(
        0,
        loadedExtractedItemsJson.length - MAX_SAVED_ITEMS_COUNT
      );
    }
  }
  fs.writeFileSync(EXTRACTED_DB, JSON.stringify(loadedExtractedItemsJson));
}

export function getSavedExtractedExcels() {
  loadExractedItemsJsonFile();

  return loadedExtractedItemsJson;
}
