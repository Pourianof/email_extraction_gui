import { Browser, Page } from 'puppeteer';
// import * as puppeteer from 'puppeteer-core';
import puppeteer from '../helpers/puppeteer';

enum BrowserManagerState {
  NOT_OPENED,
  OPEN,
  IS_OPENING,
  CLOSED,
}

/**
 * An interface which produced for extracters to constraint their accessability like close or run methods.
 */
export interface ConstrainedBrowser {
  newPage(): Promise<Page>;
}

export abstract class BaseBrowser implements ConstrainedBrowser {
  protected state: BrowserManagerState = BrowserManagerState.NOT_OPENED;
  protected browser!: Browser;
  constructor(
    protected browserUserDataDirPath: string,
    protected readonly browserPath?: string
  ) {}
  abstract run(): Promise<void>;
  provideAPI(): ConstrainedBrowser {
    return {
      newPage: () => {
        return this.newPage();
      },
    };
  }
  async close() {
    await this.browser.close();
    this.state = BrowserManagerState.CLOSED;
  }
  abstract newPage(): Promise<Page>;
}

/**
 * A class that handle state of single open browser.
 * If you want multiple browser create multiple instance of this class.
 */
export class BrowserManager extends BaseBrowser {
  async run() {
    if (this.state === BrowserManagerState.NOT_OPENED) {
      this.state = BrowserManagerState.IS_OPENING;
      this.browser = await puppeteer.launch({
        channel: 'chrome',
        headless: false,
        executablePath: process.env.CHROME_PATH ?? this.browserPath,
        // Downloadable from : https://storage.googleapis.com/chrome-for-testing-public/123.0.6312.122/win64/chrome-headless-shell-win64.zip
      });
      this.state = BrowserManagerState.OPEN;
    } else {
      if (this.state === BrowserManagerState.IS_OPENING) {
        throw new Error(
          'Browser is opening. Cannot call run method while opening.'
        );
      } else if (this.state === BrowserManagerState.OPEN) {
        throw new Error(
          'There is an opened browser before. Cannot open it again.'
        );
      }
    }
  }

  newPage() {
    return this.browser.newPage();
  }
}

import {
  type PRBConnectNewPageZoneSetter,
  connect,
} from '../puppeteer-real-browser';
import {
  onDocumentLoadNavigationPage,
  onNetworkIdleNavigationPage,
  pageCaptchaHandler,
  pageLogin,
} from './pagePlugin';

const CUSTOM_UA = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36`;

/**
 * A Controlled browser which act like a real browser.
 * This type can also solve cloudflare captcha automatically.(When turnstile option is set to true)
 */
export class RealBrowserMimicker extends BaseBrowser {
  private cachedPage?: Page;
  private newPageZoneMaker!: PRBConnectNewPageZoneSetter;

  async run(): Promise<void> {
    const isHeadlessEnv = process.env.HEADLESS?.trim();

    let isHeadless: boolean | 'auto';
    if (isHeadlessEnv == 'true') {
      isHeadless = true;
    } else if (isHeadlessEnv == 'false') {
      isHeadless = false;
    } else {
      isHeadless = 'auto';
    }

    const { browser, page, setTarget } = await connect({
      turnstile: false,
      headless: false,
      customConfig: {
        userDataDir: this.browserUserDataDirPath,
        slowMo: 200,
        defaultViewport: null,
      },
      args: [
        '--no-sandbox',
        '--disable-gpu',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
      ],
    });
    this.browser = browser;
    this.cachedPage = page;
    this.newPageZoneMaker = setTarget;
  }

  private cachedPageDelivered = false;
  async newPage(): Promise<Page> {
    if (!this.cachedPage) {
      throw new Error('There is some problem with browser initializing...');
    }

    let newPage: Page;
    if (!this.cachedPageDelivered) {
      this.cachedPageDelivered = true;
      this.cachedPage.setUserAgent(CUSTOM_UA);
      newPage = this.cachedPage;
    } else {
      this.newPageZoneMaker({ status: false });

      newPage = await this.browser.newPage();

      this.newPageZoneMaker({ status: true });
      newPage.setUserAgent(CUSTOM_UA);
    }

    await pageLogin(newPage);
    pageCaptchaHandler(newPage);
    onDocumentLoadNavigationPage(newPage);

    return newPage;
  }
}
