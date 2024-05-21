import {
  Browser,
  ConnectOptions,
  Page,
  PuppeteerLaunchOptions,
} from 'puppeteer';

export interface PRBConnectOptions {
  /**
   * If there is an additional flag you want to add when starting Chromium, you can send it with this string.
   */
  args?: string[];
  /**
   *  auto can take the values true and false. If auto is set, it uses the option that is stable on the operating system in use.
   */
  headless?: 'auto' | boolean;
  /** When launch is executed, the variables you send in be onje are added. For example, you can specify the browser path with executablePath. */
  customConfig?: {
    executablePath?: string;
    chromePath?: string;
  } & PuppeteerLaunchOptions;

  proxy?: {
    username?: string;
    password?: string;
    host?: string;
    port?: string;
  };
  /**  It uses target filter to avoid detection. You can send the targets you want to allow. This feature is in beta. Its use is not recommended. */
  skipTarget?: string[];
  /**  If set to true, it injects a unique fingerprint ID into the page every time the browser is launched and prevents you from being caught. Not recommended if not mandatory. May cause detection. runs the puppeteer-afp library. */
  fingerprint?: boolean;
  /** Cloudflare Turnstile automatically clicks on Captchas if set to true */
  turnstile?: boolean;
  /** he variables you send when connecting to chromium created with puppeteer.connect are added */
  connectOption?: ConnectOptions;
  /** This setting allows you to reuse fingerprint values that you have previously saved in the puppeteer-afp library. Please refer to the puppeteer-afp library documentation for details. */
  fpconfig?: {};
}

function handleNewPage(options: {}): void;

export type PRBConnectNewPageZoneSetter = (opt: { status: boolean }) => void;
export interface PRBConnectResponse {
  browser: Browser;
  page: Page;
  setTarget: PRBConnectNewPageZoneSetter;
}

export const connect: (opts: PRBConnectOptions) => Promise<PRBConnectResponse>;
