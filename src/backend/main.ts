import fs from 'fs';
import { app, protocol } from 'electron';
import { TEMP_FILES } from './pathes.ts';
import WindowHandler from './windowHandler';
import path from 'path';
import { logError, logInfo } from './logger.ts';

function initializeDirectories() {
  try {
    logInfo(`Initializing temporary directories`);
    const tempPath = TEMP_FILES;
    const tempSubDirs = ['excels', 'chrome_dir'];

    tempSubDirs.forEach((sd) => {
      // temp
      const targetPath = path.join(tempPath, sd);
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
        logInfo(`Temporary directory "${targetPath}" created`);
      }
    });
  } catch (err) {
    logError(
      `Error happened while creating temporary directories. err_msg: ${err?.message}`
    );
  }
}

// function protocolSetter() {
//   protocol.handle('file', (request) => {
//     const url = request.url;
//     console.log(url);
//     logInfo(`request a file with address : ${url}`);
//     return fetch(url);
//   });
// }

async function start() {
  app.once('ready', async () => {
    initializeDirectories();
    // protocolSetter();
    const windows = new WindowHandler();
    await windows.init();
  });
}

start();
