import ElsevierExtracter from './extracters/elsevier';
import {
  BaseBrowser,
  BrowserManager,
  RealBrowserMimicker,
} from './helpers/browserManager';
import ExcelAPI from './helpers/excelAPI';
import BaseExtracter from './extracters/baseExtracter';
import ExtracterUtilsAPI from './helpers/ExtracterUtils';

let browser: BaseBrowser;
let excelAPI: ExcelAPI;

let tempPath: string;

interface ExtractionOption {
  ouputPath: string | (() => string | Promise<string>);
  tempPath: string;
  browserPath?: string;
  chromePath?: string;
  browserUserDataPath: string;
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
  const extractorHandler = new URLExtractor();

  for (let u of urls) {
    extractorHandler.extract(u);
  }

  await extractorHandler.whenExtractionEnd();

  browser.close();
  console.log('*=* Browser CLOSED.');
}

class URLExtractor {
  static provideUtilAPI(id: string) {
    return new ExtracterUtilsAPI(
      'elsevier',
      tempPath,
      excelAPI.provideSheet('elsevier')
    );
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
        URLExtractor.provideUtilAPI('elsevier')
      );
    } else if (hostname.endsWith('springer.com')) {
      extracter = this.extracters.s ??= new ElsevierExtracter(
        browser,
        URLExtractor.provideUtilAPI('springer')
      );
    } else if (hostname.endsWith('wiley.com')) {
      extracter = this.extracters.w ??= new ElsevierExtracter(
        browser,
        URLExtractor.provideUtilAPI('wiley')
      );
    } else {
      throw new Error(`No extracter found for url ${url}`);
    }
    extracter.addURL(url);
  }

  async whenExtractionEnd() {
    return Promise.all(
      Object.values(this.extracters).map((e) => e.waitForExtraction())
    );
  }
}
