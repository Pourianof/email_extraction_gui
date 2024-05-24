import {
  GoToOptions,
  HTTPResponse,
  Page,
  PuppeteerLifeCycleEvent,
} from 'puppeteer';
import { awaitFor, randomBetween, randomSign } from './utils';

async function tryToSolveCaptcha(page: Page) {
  await page.waitForNetworkIdle({ idleTime: 1000 });

  const capPos = await page.evaluate(() => {
    const __cap__ = document.querySelector('#challenge-stage iframe')!;
    const val = __cap__.getBoundingClientRect();
    return {
      top: val.top,
      lef: val.left,
      height: val.height,
      width: val.width,
    };
  });

  const x =
    capPos.lef + capPos.width / 2 + randomSign() * randomBetween(0.5, 5);
  const y =
    capPos.top + capPos.height / 2 + randomSign() * randomBetween(0.5, 5);

  await page.mouse.move(
    x + randomSign() * randomBetween(50, 80),
    y + randomSign() * randomBetween(50, 80),
    {
      steps: 3,
    }
  );

  console.log('click for solve');
  await page.mouse.click(x, y, { delay: 200 });
}

async function handleCapchastate(page: Page) {
  const isCaptchaPage = await page.evaluate(
    () =>
      !!document.getElementById('skipNavigation') ||
      !!document.getElementById('challenge-stage')
  );

  console.log('Capchat : ', isCaptchaPage);

  if (isCaptchaPage) {
    try {
      await tryToSolveCaptcha(page);
    } catch (err) {}
    // try until isCaptchaPage become false
    await awaitFor(() => handleCapchastate(page), 2000);
  }
  return;
}

export function pageCaptchaHandler(page: Page) {
  const oldGoto = page.goto;

  const newGoto = async function (
    url: string,
    options?: GoToOptions
  ): Promise<HTTPResponse | null> {
    const res = await oldGoto.call(page, url, options);
    await handleCapchastate(page);

    return res;
  };

  page.goto = newGoto.bind(page);
}

function _navHandler_(page: Page, navType: PuppeteerLifeCycleEvent) {
  const oldGoto = page.goto;

  const newGoto = async function (
    url: string,
    options?: GoToOptions
  ): Promise<HTTPResponse | null> {
    if (!options) {
      options = { waitUntil: navType };
    } else if (!options?.waitUntil) {
      options.waitUntil = navType;
    }

    return await oldGoto.call(page, url, options);
  };

  page.goto = newGoto;
}

export function onDocumentLoadNavigationPage(page: Page) {
  page.evaluateOnNewDocument(() =>
    document.addEventListener('DOMContentLoaded', () =>
      console.log('Doc is Loaded')
    )
  );
  _navHandler_(page, 'domcontentloaded');
}

export function onNetworkIdleNavigationPage(page: Page) {
  _navHandler_(page, 'networkidle2');
}

export async function pageLogin(page: Page) {
  const chalk = (await import('chalk')).default;
  page.on('console', (log) => {
    switch (log.type()) {
      case 'log':
        {
          console.log(
            chalk.blue(
              `==== Browser Log ====\n${log.text()}\r\n==========================================`
            )
          );
        }
        break;
      case 'error':
        {
          console.log(
            chalk.red(
              `==== Browser Error ====\n${log.text()}\r\n==========================================`
            )
          );
        }
        break;
      default: {
        console.log(
          chalk.green(
            `==== Browser other ====\n${log.text()}\r\n==========================================`
          )
        );
      }
    }
  });
}
