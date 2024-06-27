import fs from 'fs';
import path from 'path';
import { TEMP_FILES } from './pathes';

type RegisteredData = {
  filePath: string;
  date: number;
  numberOfExtractedAuthors: number;
}[];

let loadedExtractedItemsJson: RegisteredData;

const EXTRACTED_DB = path.join(TEMP_FILES, 'extracted.json');
const MAX_SAVED_ITEMS_COUNT = 10;

function loadExractedItemsJsonFile() {
  if (!loadedExtractedItemsJson) {
    if (fs.existsSync(EXTRACTED_DB)) {
      const tempLoaded: RegisteredData = JSON.parse(
        fs.readFileSync(EXTRACTED_DB, {
          encoding: 'utf8',
        })
      );

      loadedExtractedItemsJson = [];
      tempLoaded.forEach((l) => {
        if (fs.existsSync(l.filePath)) {
          loadedExtractedItemsJson.push(l);
        }
      });

      if (tempLoaded.length != loadedExtractedItemsJson.length) {
        console.log('registering');
        registerToFile();
      }
    } else {
      loadedExtractedItemsJson = [];
    }
  }
}

function registerToFile() {
  fs.writeFileSync(EXTRACTED_DB, JSON.stringify(loadedExtractedItemsJson));
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
  registerToFile();
}

export function getSavedExtractedExcels() {
  loadExractedItemsJsonFile();

  return loadedExtractedItemsJson;
}
