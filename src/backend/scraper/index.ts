import ElsevierExtracter from './extracters/elsevier';
import { BaseBrowser, RealBrowserMimicker } from './helpers/browserManager';
import ExcelAPI from './helpers/excelAPI';
import BaseExtracter from './extracters/baseExtracter';
import ExtracterUtilsAPI from './helpers/ExtracterUtils';
import { AuthorsProgressStateNotifier } from './progressState';

let browser: BaseBrowser;
let excelAPI: ExcelAPI;

let tempPath: string;

interface ExtractionOption {
  ouputPath: string | (() => string | Promise<string>);
  tempPath: string;
  browserPath?: string;
  chromePath?: string;
  browserUserDataPath: string;
  progressMonitor?: AuthorsProgressStateNotifier;
  saveOnEveryItem?: boolean;
}

export default async function extractURLS(
  urls: string[],
  options: ExtractionOption
) {
  try {
    await _extract(urls, options);
  } catch (err) {
    console.error(`Some error occured: \nMessage:${err}`);
  }
}

async function _extract(
  urls: string[],
  options: ExtractionOption
): Promise<void> {
  tempPath = options.tempPath;
  browser = new RealBrowserMimicker(
    options.browserUserDataPath,
    options.browserPath
  );

  excelAPI = new ExcelAPI(options.ouputPath, options.tempPath);

  await browser.run();
  const extractorHandler = new URLExtractor(
    options.progressMonitor,
    options.saveOnEveryItem
  );

  for (let u of urls) {
    extractorHandler.extract(u);
  }

  await extractorHandler.whenExtractionEnd();

  browser.close();
  console.log('*=* Browser CLOSED.');
}

class URLExtractor {
  constructor(
    private progressConsumer?: AuthorsProgressStateNotifier,
    private saveOnEveryNewItem: boolean = false
  ) {}
  private provideUtilAPI(id: string) {
    const api = new ExtracterUtilsAPI(
      'elsevier',
      tempPath,
      excelAPI.provideSheet('elsevier'),
      {
        saveOnAdd: this.saveOnEveryNewItem,
      }
    );
    this.progressConsumer?.setProvider(api);
    return api;
  }
  private extracters: {
    e?: BaseExtracter;
    w?: BaseExtracter;
    s?: BaseExtracter;
    t?: BaseExtracter;
  } = {};
  extract(url: string) {
    const { hostname } = new URL(url);
    let extracter: BaseExtracter;

    if (
      hostname.toLowerCase().endsWith('elsevier.com') ||
      hostname.toLowerCase().endsWith('sciencedirect.com')
    ) {
      extracter = this.extracters.e ??= new ElsevierExtracter(
        browser,
        this.provideUtilAPI('elsevier')
      );
    } else if (hostname.endsWith('springer.com')) {
      extracter = this.extracters.s ??= new ElsevierExtracter(
        browser,
        this.provideUtilAPI('springer')
      );
    } else if (hostname.endsWith('wiley.com')) {
      extracter = this.extracters.w ??= new ElsevierExtracter(
        browser,
        this.provideUtilAPI('wiley')
      );
    } else {
      throw new Error(`No extracter found for url ${url}`);
    }
    extracter.addURL(url);
  }

  /*
    Because of single tab(page), we run tasks in semi synchron way,
    then we wait to one extracter do it jobs, then we go to next extracter.
  */
  async whenExtractionEnd() {
    return new Promise(async (res, rej) => {
      for (let e of Object.values(this.extracters)) {
        await e.waitForExtraction();
      }
    });
  }
}

process.on('unhandledRejection', (err) => {
  browser.close();
  console.error(err);
});
process.on('uncaughtException', (err) => {
  browser.close();
  console.error(err);
});
process.on('exit', () => browser.close());
