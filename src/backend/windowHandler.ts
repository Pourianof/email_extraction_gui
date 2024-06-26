import { app, BrowserWindow } from 'electron';
import path from 'path';
import { STATIC_FILES } from './pathes';
import { resolveHtmlPath } from './util';
import IPCEventHandler from './ipcEventsHandler';

export default class WindowHandler {
  private window!: BrowserWindow;
  private eventHandler: IPCEventHandler;
  async init() {
    console.log('Wait...');
    await app.whenReady();
    console.log('App is ready...');

    this.window = new BrowserWindow({
      width: 1024,
      height: 768,
      title: 'نویسنده یاب',
      // titleBarStyle: 'hidden',
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'mainPreload.preload.js')
          : path.join(__dirname, '..', '..', 'dist', 'mainPreload.preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        webSecurity: false,
      },
      modal: true,
      show: false,
    });
    this.window.loadURL(resolveHtmlPath('index.html'));

    this.window.on('ready-to-show', () => this.window.show());
    this.window.once('close', () => app.exit());

    this.eventHandler = new IPCEventHandler(this.window);
  }
}
