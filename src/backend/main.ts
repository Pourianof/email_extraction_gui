import { TEMP_EXCELS } from './pathes.ts';
import WindowHandler from './windowHandler';

async function start() {
  initializeDirectories();
  const windows = new WindowHandler();
  await windows.init();
}

start();

import fs from 'fs';

function initializeDirectories() {
  // temp
  if (!fs.existsSync(TEMP_EXCELS)) {
    fs.mkdirSync(TEMP_EXCELS, { recursive: true });
  }
}
