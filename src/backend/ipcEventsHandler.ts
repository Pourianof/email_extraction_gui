import {
  BrowserWindow,
  IpcMainInvokeEvent,
  app,
  dialog,
  ipcMain,
} from 'electron';
import { Events } from './events';
import extractURLS from './scraper';
import path from 'path';
import { CHROME_DIR, CHROME_USER_DATA, TEMP_EXCELS } from './pathes';
import { IPCMessage } from '../shared/IPCMessage';

export default class IPCEventHandler {
  constructor(private win: BrowserWindow) {
    this.handle();
  }

  private static handleInvokation(callback: (data: any) => any) {
    return (event: IpcMainInvokeEvent, d: string) => {
      const data = JSON.parse(d);
      callback(data);
    };
  }

  private async handle() {
    ipcMain.handle(
      Events.EXTRACT_URLS,
      IPCEventHandler.handleInvokation(this.handleExtract)
    );
  }

  private async handleExtract(data: string[]) {
    console.log('Recieved urls: ', data);

    try {
      let filePath: string;
      const report = await extractURLS(data, {
        ouputPath: async () => {
          const res = await dialog.showSaveDialog(this.win, {
            message: 'مسیر ذخیره سازی فایل اکسل را انتخاب کنید',
            buttonLabel: 'انتخاب',
            title: 'مسیر ذخیره سازی فایل اکسل',
            nameFieldLabel: 'emails.xlsx',
          });

          if (!res.canceled) {
            filePath = res.filePath!;
          }

          filePath = path.join(app.getPath('desktop'), 'emails.xlsx');
          return filePath;
        },
        browserPath: path.join(
          CHROME_DIR,
          'chrome',
          'chrome-headless-shell.exe'
        ),
        browserUserDataPath: CHROME_USER_DATA,
        tempPath: TEMP_EXCELS,
      });

      return {
        status: {
          status: {
            message: 'extraction was successful',
            code: 200,
          },
          data: {
            filePath: filePath!,
            title: path.basename(filePath!),
          },
        } as IPCMessage,
      };
    } catch (err) {
      return {
        status: {
          message: 'Extraction broken by error.\n' + (err as Error).message,
        },
      };
    }
  }
}
