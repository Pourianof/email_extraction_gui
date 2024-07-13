import fs from 'fs';
import { app } from 'electron';
import { TEMP_EXCELS, TEMP_FILES } from './pathes.ts';
import WindowHandler from './windowHandler';
import path from 'path';

function initializeDirectories() {
  const tempPath = app.isPackaged
    ? path.join(__dirname, '..', '..', '..', 'temp')
    : TEMP_FILES;
  const tempSubDirs = ['excels', 'chrome_dir'];

  tempSubDirs.forEach((sd) => {
    // temp
    if (!fs.existsSync(path.join(tempPath, sd))) {
      fs.mkdirSync(TEMP_EXCELS, { recursive: true });
    }
  });
}

async function start() {
  app.once('ready', async () => {
    initializeDirectories();
    const windows = new WindowHandler();
    await windows.init();
  });
}

start();
