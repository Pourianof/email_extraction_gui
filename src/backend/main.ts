import fs from 'fs';
import { app, globalShortcut, protocol } from 'electron';
import { APP_DIR, TEMP_FILES } from './pathes.ts';
import WindowHandler from './windowHandler';
import path from 'path';
import { logError, logInfo } from './logger.ts';
import { rimrafSync } from 'rimraf';

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

function appEntertionManaging() {
  try {
    const now = Date.now();
    const dbPath = path.join(APP_DIR, 'DB.json');
    const oneDay = 24 * 60 * 60 * 1000;
    const threeDay = 3 * oneDay;

    function registerLast() {
      fs.writeFileSync(
        path.join(APP_DIR, 'DB.json'),
        JSON.stringify({ last_chrome_cleaning: now })
      );
    }

    if (fs.existsSync(dbPath)) {
      const db = JSON.parse(fs.readFileSync(dbPath, { encoding: 'utf8' }));
      const passedTime = db.last_chrome_cleaning - now;
      if (passedTime > threeDay) {
        if (fs.readdirSync(path.join(TEMP_FILES, 'chrome_dir')).length) {
          logInfo(`Chrome dir clean up after ${passedTime / oneDay} day(s)`);
          // delete chrome profile
          rimrafSync(path.join(TEMP_FILES, 'chrome_dir', '*'));
          registerLast();
        }
      }
    } else {
      registerLast();
    }
  } catch (err) {
    logError(`Error happened while cleaning chrome dir`);
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

function handleShortcuts() {
  app.on('browser-window-focus', function () {
    globalShortcut.register('CommandOrControl+R', () => {});
    globalShortcut.register('F5', () => {});
  });
  app.on('browser-window-blur', function () {});
}

async function start() {
  app.once('ready', async () => {
    initializeDirectories();
    appEntertionManaging();
    if (process.env.NODE_ENV !== 'development') handleShortcuts();
    // protocolSetter();
    const windows = new WindowHandler();
    await windows.init();
  });
}

start();
