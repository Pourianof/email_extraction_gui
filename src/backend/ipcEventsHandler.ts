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
import { AuthorsProgressStateNotifier } from './scraper/progressState';
import ExtractionProgressState from '../shared/extractionsProgressState';

export default class IPCEventHandler {
  constructor(private win: BrowserWindow) {
    this.handle();
  }

  private static handleInvokation(callback: (data: any) => Promise<any>) {
    return (event: IpcMainInvokeEvent, d: string) => {
      const data = JSON.parse(d);
      return callback(data);
    };
  }

  private async handle() {
    ipcMain.handle(
      Events.EXTRACT_URLS,
      IPCEventHandler.handleInvokation(
        //  this.handleExtract
        async (data) => {
          return new Promise<void>((res, rej) => {
            let counter = 1;
            const sendProgress = () => {
              this.win.webContents.send(
                Events.EXTRACT_PROGRESS,
                JSON.stringify({
                  author: {
                    firstName: Math.round(Math.random() * 1000) + '-First name',
                    lastName: Math.round(Math.random() * 1000) + '-Last name',
                  },
                  totalAuthorRecieved: counter++,
                } as ExtractionProgressState)
              );
              if (counter > data?.options?.authorsCount ?? 10) {
                res();
              } else {
                setTimeout(sendProgress, 1000);
              }
            };

            setTimeout(sendProgress, 1000);
          });
        }
        //
      )
    );
  }

  private async handleExtract(data: string[]) {
    console.log('Recieved urls: ', data);

    try {
      let filePath: string;
      const progressListener = new AuthorsProgressStateNotifier((state) => {
        this.win.webContents.send(
          Events.EXTRACT_PROGRESS,
          JSON.stringify({
            author: state.newAuthorData,
            totalAuthorRecieved: state.totalAuthorRecieved,
          } as ExtractionProgressState)
        );
      });

      await extractURLS(data, {
        progressMonitor: progressListener,
        saveOnEveryItem: true,
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
