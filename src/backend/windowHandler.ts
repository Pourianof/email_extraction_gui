import { app, BrowserWindow } from 'electron';
import path from 'path';
import { resolveHtmlPath } from './util';
import IPCEventHandler from './ipcEventsHandler';
import { RESOURCE_DIR } from './pathes';

export default class WindowHandler {
  private window!: BrowserWindow;
  private eventHandler: IPCEventHandler;
  async init() {
    this.window = new BrowserWindow({
      width: 1024,
      height: 768,
      title: 'نویسنده یاب',
      titleBarStyle: 'hidden',
      icon: path.join(RESOURCE_DIR, 'images', 'icons', 'ausmt.png'),
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(
              __dirname,
              '..',
              '..',
              'configs',
              '.dll',
              'mainPreload.preload.js'
            ),
        contextIsolation: true,
        nodeIntegration: false,
        webSecurity: false,
        devTools: process.env.NODE_ENV == 'development',
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
