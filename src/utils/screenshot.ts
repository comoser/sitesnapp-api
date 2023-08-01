import { chromium } from 'playwright';

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
  await page.screenshot({
    path: `screenshots/${getNameFromUrl(pageUrl)}-${deviceName}.png`,
  });

  await browser.close();
}

export async function takeScreenshots(pageUrl: string) {
  const screenshots = [
    void takeScreenshot(pageUrl, 'iphone13pro', 390, 844, 3),
    void takeScreenshot(pageUrl, 'ipadair', 768, 1024, 2),
    void takeScreenshot(pageUrl, 'macbookproretina', 2560, 1600, 2),
  ];

  await Promise.all(screenshots);
}
