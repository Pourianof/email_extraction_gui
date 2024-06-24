import {
  BrowserWindow,
  IpcMainInvokeEvent,
  app,
  dialog,
  net,
  ipcMain,
  shell,
} from 'electron';
import { Events } from './events';
import extractURLS, {
  AuthorsProgressStateNotifier,
  ExtractSpeed,
} from './authoractor';
import path from 'path';
import { CHROME_DIR, CHROME_USER_DATA, TEMP_EXCELS } from './pathes';
import { IPCMessage } from '../shared/IPCMessage';
import ExtractionProgressState from '../shared/extractionsProgressState';

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
    ipcMain.on(
      Events.OPEN_EXCEL,
      IPCEventHandler.handleInvokation(this.handleOpenExcel)
    );
    ipcMain.handle(
      Events.EXTRACT_URLS,
      IPCEventHandler.handleInvokation(this.handleExtract)
    );
  }

  private async handleOpenExcel(filePath: string): Promise<IPCMessage> {
    try {
      shell.showItemInFolder(filePath);

      return {
        status: {
          code: 200,
          message: '',
        },
        data: {},
      };
    } catch (err) {
      return {
        status: {
          code: -20,
          message: 'مشکلی در باز کردن فایل وجود دارد',
        },
        data: {},
      };
    }
  }

  private async handleExtract(data: {
    urls: string[];
    options: {
      extractSpeed: 'کم' | 'بهینه' | 'متوسط' | 'زیاد' | 'حداکثر';
      isOnlyEmail: boolean;
      isOnlyMainAuthor: boolean;
      authorsCount?: number;
    };
  }): Promise<IPCMessage> {
    console.log('Recieved urls: ', data);

    let filePath: string | undefined;

    try {
      const progressListener = new AuthorsProgressStateNotifier((state) => {
        console.log(this);
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

      let extractSpeed: ExtractSpeed | undefined;
      if (data.options.extractSpeed) {
        switch (data.options.extractSpeed) {
          case 'بهینه':
            extractSpeed = ExtractSpeed.OPTIMIZED;
            break;
          case 'کم':
            extractSpeed = ExtractSpeed.LOW;
            break;
          case 'متوسط':
            extractSpeed = ExtractSpeed.MEDIUM;
            break;
          case 'زیاد':
            extractSpeed = ExtractSpeed.HIGH;
            break;
        }
      }

      await extractURLS(data.urls, {
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
        browserUserDataPath: CHROME_USER_DATA,
        tempPath: TEMP_EXCELS,
        extractionConf: {
          onlyAuthorsWithEmail: data.options.isOnlyEmail,
          boundary: data.options.authorsCount,
          onlyMainAuthors: data.options.isOnlyMainAuthor,
          extractSpeed: extractSpeed,
        },
      });

      return {
        status: {
          message: 'extraction was successful',
          code: 200,
        },
        data: {
          filePath: filePath!,
          title: path.basename(filePath!),
        },
      } as IPCMessage;
    } catch (err) {
      console.log('Extraction Failed : ', err);
      return {
        status: {
          message: 'Extraction broken by error.\n' + (err as Error).message,
          code: -10,
        },
        data: {
          filePath,
        },
      };
    }
  }
}
