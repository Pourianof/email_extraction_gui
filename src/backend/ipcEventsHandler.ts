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
import { IPCMessage } from '../shared/IPCMessage';
import ExtractionProgressState from '../shared/extractionsProgressState';
import {
  getSavedExtractedExcels,
  registerExtractedExcel,
} from './extractedItemsRegisterer';
import RegisteredExtractedExcel from '../shared/models/registeredExcelData';
import { logError } from './logger';

export default class IPCEventHandler {
  constructor(private win: BrowserWindow) {
    this.handle();
  }

  private static handleInvokation(
    callback: (data: any) => Promise<IPCMessage>
  ) {
    return async (event: IpcMainInvokeEvent, d: string) => {
      let data: any;
      if (d) {
        data = JSON.parse(d);
      }
      return JSON.stringify(await callback(data));
    };
  }

  private async handle() {
    ipcMain.on(
      Events.OPEN_EXCEL,
      IPCEventHandler.handleInvokation(this.handleOpenExcel.bind(this))
    );
    ipcMain.handle(
      Events.EXTRACT_URLS,
      IPCEventHandler.handleInvokation(this.handleExtract.bind(this))
    );
    ipcMain.handle(
      Events.GET_EXTRACTED,
      IPCEventHandler.handleInvokation(
        this.sendAvailableExtractedItemsData.bind(this)
      )
    );

    ipcMain.addListener(Events.OPEN_LINK, (e, d) => {
      this.openLink(d);
    });

    ipcMain.addListener(Events.WIN_ACTIONS, (e, d) => {
      this.operateWindowActions(d);
    });
  }

  private operateWindowActions(action: string) {
    action = action.trim().toLowerCase();
    if (action == 'max') {
      if (this.win.isMaximized()) {
        this.win.unmaximize();
      } else {
        this.win.maximize();
      }
    } else if (action == 'min') {
      this.win.minimize();
    } else if (action == 'close') {
      this.win.close();
      app.exit();
    }
  }

  private openLink(d: string) {
    d = d.trim().toLowerCase();
    const open = (link: string) => {
      shell.openExternal(link);
    };
    if (d == 'springer') {
      open('https://link.springer.com/journals');
    } else if (d == 'elsevier') {
      open(
        'https://www.sciencedirect.com/browse/journals-and-books?contentType=JL'
      );
    } else if (d == 'wiley') {
      open('https://www.wiley.com/en-it/publish/journal-finder');
    } else if (d == 'ausmt') {
      open(`https://ausmt.ac.ir/`);
    }
  }

  private sendAvailableExtractedItemsData() {
    try {
      const registeredItems = getSavedExtractedExcels();
      return {
        status: {
          code: 200,
        },
        data: registeredItems.map(
          (r) =>
            ({
              date: r.date,
              fileName: path.basename(r.filePath),
              filePath: r.filePath,
              numberOfExtractedAuthors: r.numberOfExtractedAuthors,
            } as RegisteredExtractedExcel)
        ),
      };
    } catch (err) {
      return {
        status: { code: -10, message: (err as Error).message },
      };
    }
  }

  private async handleOpenExcel(openOptions: {
    filePath: string;
  }): Promise<IPCMessage> {
    try {
      shell.showItemInFolder(openOptions.filePath);

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
    let filePath: string | undefined;
    const tempPath =
      process.env.NODE_ENV == 'development'
        ? path.join(app.getPath('desktop'), 'authoractor_gui', 'temp')
        : path.join(__dirname, '..', '..', '..', 'temp', 'excels');

    try {
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

      const extractResult = await extractURLS(data.urls, {
        progressMonitor: progressListener,
        saveOnEveryItem: true,
        ouputPath: async () => {
          const res = await dialog.showSaveDialog(this.win, {
            message: 'مسیر ذخیره سازی فایل اکسل را انتخاب کنید',
            buttonLabel: 'ذخیره',
            title: 'مسیر ذخیره سازی فایل اکسل',
            nameFieldLabel: 'authors.xslx',
            filters: [{ name: 'Excel', extensions: ['xlsx', 'xml'] }],
            defaultPath: path.join(app.getPath('documents'), 'authors'),
          });

          if (!res.canceled) {
            filePath = res.filePath;
          } else {
            filePath = path.join(app.getPath('desktop'), 'emails.xlsx');
          }
          return filePath;
        },
        browserUserDataPath: !app.isPackaged
          ? path.join(app.getPath('desktop'), 'authoractor_gui', 'chrome_dir')
          : path.join(__dirname, '..', '..', '..', 'temp', 'chrome_dir'),
        tempPath,
        extractionConf: {
          onlyAuthorsWithEmail: data.options.isOnlyEmail,
          boundary: data.options.authorsCount,
          onlyMainAuthors: data.options.isOnlyMainAuthor,
          extractSpeed: extractSpeed,
        },
      });

      console.log('extraction finished');

      if (!filePath) {
        throw new Error('مشکلی در فرآیند استخراج پیش آمده. ');
      } else {
        registerExtractedExcel(
          filePath!,
          extractResult.numberOfExtractedAuthors
        );
      }

      return {
        status: {
          message: 'extraction was successful',
          code: 200,
        },
        data: {
          filePath: filePath!,
          fileName: path.basename(filePath!),
          elapsedTime: extractResult.elapsedTime,
          numberOfExtractedAuthors: extractResult.numberOfExtractedAuthors,
          date: Date.now(),
        } as RegisteredExtractedExcel,
      } as IPCMessage;
    } catch (err) {
      let message: string;
      if (err instanceof Error) {
        logError(`Error while extraction. error_msg:\n ${err.message}`);
        if (
          err.message.includes('WebSocket') ||
          err.message.includes('closed')
        ) {
          message = 'بنا به دلایلی اتصال با مرورگر قطع شد.';
        } else if (err.message.includes('net::ERR_ABORTED')) {
          message = 'اتصال به شبکه قطع شد.';
        } else {
          message = err.message;
        }
      }
      return {
        status: {
          message: message!,
          code: -10,
        },
        data: {
          filePath: tempPath,
        },
      };
    }
  }
}
