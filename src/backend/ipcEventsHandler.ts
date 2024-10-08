import {
  BrowserWindow,
  IpcMainInvokeEvent,
  app,
  dialog,
  net,
  ipcMain,
  shell,
  clipboard,
} from "electron";
import { Events } from "./events";
import Extractor, {
  AuthorsProgressStateNotifier,
  ExtractSpeed,
} from "./authoractor";
import path from "path";
import { IPCMessage } from "../shared/IPCMessage";
import ExtractionProgressState from "../shared/extractionsProgressState";
import {
  getSavedExtractedExcels,
  registerExtractedExcel,
} from "./extractedItemsRegisterer";
import RegisteredExtractedExcel from "../shared/models/registeredExcelData";
import { logError, logInfo } from "./logger";
import {
  CHROME_USER_DATA,
  DEPENDENCIES_DIR,
  TEMP_EXCELS,
  TEMP_FILES,
} from "./pathes";
import DateObject from "react-date-object";

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

    ipcMain.handle(
      Events.COPY_TEXT,
      IPCEventHandler.handleInvokation(this.handleCopyText.bind(this))
    );

    ipcMain.addListener(Events.OPEN_LINK, (e, d) => {
      this.openLink(d);
    });

    ipcMain.addListener(Events.WIN_ACTIONS, (e, d) => {
      this.operateWindowActions(d);
    });

    ipcMain.addListener(Events.STOP_EXTRACTION, (e, d) => {
      this.stopExtractor();
    });
  }

  private operateWindowActions(action: string) {
    action = action.trim().toLowerCase();
    if (action == "max") {
      if (this.win.isMaximized()) {
        this.win.unmaximize();
      } else {
        this.win.maximize();
      }
    } else if (action == "min") {
      this.win.minimize();
    } else if (action == "close") {
      this.win.close();
      app.exit();
    }
  }

  private openLink(d: string) {
    d = d.trim().toLowerCase();
    const open = (link: string) => {
      shell.openExternal(link);
    };
    if (d == "springer") {
      open("https://link.springer.com/journals");
    } else if (d == "elsevier") {
      open(
        "https://www.sciencedirect.com/browse/journals-and-books?contentType=JL"
      );
    } else if (d == "wiley") {
      open("https://www.wiley.com/en-it/publish/journal-finder");
    } else if (d == "ausmt") {
      open(`https://ausmt.ac.ir/`);
    } else if (d == "github") {
      open(`https://github.com/Coded-By-Pooria`);
    } else if (d == "ws") {
      open(`https://www.worldscientific.com/page/wsjournals`);
    } else if (d == "tfo") {
      open(
        `https://www.tandfonline.com/action/showPublications?pubType=journal`
      );
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

  private handleCopyText(options: { text: string }) {
    clipboard.writeText(options.text);
  }

  private async handleOpenExcel(openOptions: {
    filePath: string;
  }): Promise<IPCMessage> {
    try {
      logInfo(`Try to open excel file "${openOptions.filePath}"`);
      shell.showItemInFolder(openOptions.filePath);

      return {
        status: {
          code: 200,
          message: "",
        },
        data: {},
      };
    } catch (err) {
      return {
        status: {
          code: -20,
          message: "مشکلی در باز کردن فایل وجود دارد",
        },
        data: {},
      };
    }
  }

  private lastActiveExtractor?: Extractor;

  private async stopExtractor() {
    if (this.lastActiveExtractor && !this.lastActiveExtractor.isStopped) {
      logInfo("Extractor has stopped");
      this.lastActiveExtractor.stop();
    }
  }

  private async handleExtract(data: {
    urls: string[];
    options: {
      extractSpeed: "کم" | "بهینه" | "متوسط" | "زیاد" | "حداکثر";
      isOnlyEmail: boolean;
      isOnlyMainAuthor: boolean;
      authorsCount?: number;
      isGoogleScholar?: boolean;
    };
  }): Promise<IPCMessage> {
    let filePath: string | undefined;
    const tempPath = TEMP_EXCELS;

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
        logError("No internet connection extracting try.");
        return {
          status: {
            code: -10,
            message: "از اتصال خود به اینترنت مطمئن شوید.",
          },
        };
      }

      let extractSpeed: ExtractSpeed | undefined;
      if (data.options.extractSpeed) {
        switch (data.options.extractSpeed) {
          case "بهینه":
            extractSpeed = ExtractSpeed.OPTIMIZED;
            break;
          case "کم":
            extractSpeed = ExtractSpeed.LOW;
            break;
          case "متوسط":
            extractSpeed = ExtractSpeed.MEDIUM;
            break;
          case "زیاد":
            extractSpeed = ExtractSpeed.HIGH;
            break;
        }
      }

      logInfo(
        `Try to extract urls: [${data.urls.join(
          " , "
        )}]\nWith options: ${JSON.stringify(data.options)}`
      );

      this.lastActiveExtractor = new Extractor(data.urls, {
        winHandlerPath: !app.isPackaged
          ? path.join(__dirname, "authoractor", "win_handler.exe")
          : path.join(DEPENDENCIES_DIR, "win_handler.exe"),
        progressMonitor: progressListener,
        saveOnEveryItem: true,
        isGoogleScholar: data.options.isGoogleScholar,
        ouputPath: async () => {
          const defaultName = `authors-${new DateObject().format(
            "YYYY-DD-MM-HH-mm-ss"
          )}`;
          const res = await dialog.showSaveDialog(this.win, {
            message: "مسیر ذخیره سازی فایل اکسل را انتخاب کنید",
            buttonLabel: "ذخیره",
            title: "مسیر ذخیره سازی فایل اکسل",
            nameFieldLabel: `${defaultName}.xslx`,
            filters: [{ name: "Excel", extensions: ["xlsx", "xml"] }],
            defaultPath: path.join(app.getPath("documents"), defaultName),
          });

          if (!res.canceled) {
            filePath = res.filePath;
          } else {
            filePath = path.join(app.getPath("desktop"), `${defaultName}.xlsx`);
          }
          return filePath;
        },
        browserUserDataPath: CHROME_USER_DATA,
        tempPath,
        extractionConf: {
          onlyAuthorsWithEmail: data.options.isOnlyEmail,
          boundary: data.options.authorsCount,
          onlyMainAuthors: data.options.isOnlyMainAuthor,
          extractSpeed: extractSpeed,
        },
      });

      const extractResult = await this.lastActiveExtractor.start();

      console.log("extraction finished");

      if (!filePath) {
        if (this.lastActiveExtractor.isStopped) {
          throw new ExtractError(
            "بنظر میرسد قبل اینکه هیچ داده‌ای بدست بیاید، فرآیند استخراج متوقف شده است"
          );
        }
        logError("No file path registered.");
        throw new ExtractError(
          "مشکلی در فرآیند استخراج پیش آمده. ممکن است دلیل آن، عدم استخراج داده‌ای باشد."
        );
      } else {
        registerExtractedExcel(
          filePath!,
          extractResult.numberOfExtractedAuthors
        );
      }

      return {
        status: {
          message: "extraction was successful",
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
          err.message.includes("WebSocket") ||
          err.message.includes("closed")
        ) {
          message = "بنا به دلایلی اتصال با مرورگر قطع شد.";
        } else if (err.message.includes("net::ERR_ABORTED")) {
          message = "اتصال به شبکه قطع شد.";
        } else if (err.message.trim().includes("lock")) {
          message =
            "امکان ثبت فایل با مسیر داده شده وجود نداشت، ممکن است دلیل آن باز بودن فایل هم نام موجود در این مسیر باشد";
        } else if (err instanceof ExtractError) {
          message = err.message;
        } else {
          message =
            "خطایی رخ داده است. برای اطلاعات بیشتر فایل log را بررسی کنید ودر صورت رخ دادن مجدد فایل log را به پشتیبان ارسال کنید. یا دوباره اجرا کنید.";
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

class ExtractError extends Error {}
