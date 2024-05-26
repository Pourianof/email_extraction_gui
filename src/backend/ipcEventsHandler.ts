import {
  BrowserWindow,
  IpcMainInvokeEvent,
  app,
  dialog,
  net,
  ipcMain,
} from 'electron';
import { Events } from './events';
import extractURLS from './scraper';
import path from 'path';
import { CHROME_DIR, CHROME_USER_DATA, TEMP_EXCELS } from './pathes';
import { IPCMessage } from '../shared/IPCMessage';
import { AuthorsProgressStateNotifier } from './scraper/progressState';
import ExtractionProgressState from '../shared/extractionsProgressState';
import { faker } from '@faker-js/faker';
export default class IPCEventHandler {
  constructor(private win: BrowserWindow) {
    this.handle();
  }

  private static handleInvokation(
    callback: (data: any) => Promise<IPCMessage>
  ) {
    return async (event: IpcMainInvokeEvent, d: string) => {
      const data = JSON.parse(d);
      return JSON.stringify(await callback(data));
    };
  }

  private async handle() {
    ipcMain.handle(
      Events.EXTRACT_URLS,
      IPCEventHandler.handleInvokation(
        //  this.handleExtract
        (data) => {
          return new Promise<IPCMessage>((res, rej) => {
            let counter = 1;
            const bound = data?.options?.authorsCount ?? 10;
            const sendProgress = () => {
              this.win.webContents.send(
                Events.EXTRACT_PROGRESS,
                JSON.stringify({
                  author: {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    affiliations: [
                      faker.location.streetAddress({ useFullAddress: true }),
                      faker.location.streetAddress({ useFullAddress: true }),
                    ],
                    address: [
                      faker.location.streetAddress({ useFullAddress: true }),
                    ],
                    email: [faker.internet.email()],
                  },

                  totalAuthorRecieved: counter++,
                } as ExtractionProgressState)
              );

              console.log(counter > data?.options?.authorsCount ?? 10);
              if (counter > bound) {
                res({
                  status: {
                    code: -50,
                    message: 'Extraction Failed.',
                  },
                  data: {
                    filePath: 'A:\\b\\c\\h.xlsx',
                  },
                });
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

      if (!net.isOnline()) {
        return {
          status: {
            code: -10,
            message: 'از اتصال خود به اینترنت مطمئن شوید.',
          },
        };
      }

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
