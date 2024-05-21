import { Page } from 'puppeteer-core';

export default async function cloudflareCaptchaBypass(page: Page) {
  // 0- wait for ensure that there is a captcha in page
  await page.waitForSelector('.challenge-stage iframe', { timeout: 10000 });

  // 1- Find cloudflare captcha iframe
  const captchaIframe = (await page.evaluate(() =>
    document.querySelector('.challenge-stage iframe')
  )) as HTMLIFrameElement | undefined;
  if (!captchaIframe) {
    throw new NoCapchaDetectionError('No captcha detected');
  }

  // 2- Calculate its getBoundingClientRect for mouse movement simulation(Cloudflare has strict policity of bot detection and cannot pass by simply clicking via .click() method )
  const { top, left } = captchaIframe.getBoundingClientRect();

  // 3- Find cloudflare checkbox button
  const captchaButton = captchaIframe.contentWindow?.document.querySelector(
    '.ctp-checkbox-label'
  );

  if (!captchaButton) {
    throw new NoCapchaDetectionError('No captcha view detected.');
  }

  const captchaBounds = captchaButton.getBoundingClientRect();
  const captchaTop = captchaBounds.top,
    captchaLeft = captchaBounds.left;

  // 4- Calculate its position (via getBoundingClientRect) to further mouse simulation
  const mouseTop = (captchaTop + top) * Math.random();
  const mouseLeft = (captchaLeft + left) * Math.random();

  // 5- Moving mouse to target position
  await page.mouse.move(mouseLeft, mouseTop);

  // 6- Click on button
  await page.mouse.click(mouseLeft, mouseTop, { delay: 200 });
}

export class NoCapchaDetectionError extends Error {}
