import { chromium } from 'playwright';
import sharp from 'sharp';

// TODO: create some kind of file naming strategy
function getNameFromUrl(url: string) {
  const urlArray = url.split('.');
  return urlArray[1];
}

async function takeScreenshot(
  pageUrl: string,
  deviceName: string,
  width: number,
  height: number,
  deviceScaleFactor: number,
) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    deviceScaleFactor,
    isMobile: deviceName.includes('iphone') || deviceName.includes('ipad'),
    hasTouch: deviceName.includes('iphone') || deviceName.includes('ipad'),
    viewport: {
      width,
      height,
    },
  });
  const page = await context.newPage();

  await page.goto(pageUrl);

  // wait for animations to finish
  await page.waitForTimeout(3000);

  const selector =
    'a[id*=cookie i], a[class*=cookie i], button[id*=cookie i] , button[class*=cookie i]';
  const expectedCookieAcceptText =
    /^(Accept|Accept all cookies|Accept all|Allow|Allow all|Allow all cookies|OK)$/gi;
  const cookieAcceptElements = page.locator(selector);
  const count = await cookieAcceptElements.count();
  for (let i = 0; i < count; i++) {
    const cookieAcceptElement = cookieAcceptElements.nth(i);
    const textContent = await cookieAcceptElement.textContent();
    if (expectedCookieAcceptText.test(textContent?.trim() ?? '')) {
      if (await cookieAcceptElement.isVisible()) {
        await cookieAcceptElement.click();
        break;
      }
    }
  }

  // wait for banner to fade out
  await page.waitForTimeout(2000);

  const img = await page.screenshot({
    path: `screenshots/${getNameFromUrl(pageUrl)}-${deviceName}.png`,
  });

  await browser.close();

  await composeImage(img);
}

export async function composeImage(img: Buffer) {
  // const rotated = await sharp(img).rotate(10).toBuffer();

  // TODO: think of a layer for the glassy look???
  await sharp('templates/macbook-pro-2888x1908.png')
    .composite([{ input: img, top: 140, left: 360 }])
    .toFile('compositions/combined.png');
}

export async function takeScreenshots(pageUrl: string) {
  const screenshots = [
    // void takeScreenshot(pageUrl, 'iphone13pro', 390, 844, 3),
    // void takeScreenshot(pageUrl, 'ipadair', 768, 1024, 2),
    // void takeScreenshot(pageUrl, 'macbookproretina', 2560, 1600, 1),
    //test
    void takeScreenshot(pageUrl, 'macbookproretina', 2170, 1360, 1),
  ];

  await Promise.all(screenshots);
}
