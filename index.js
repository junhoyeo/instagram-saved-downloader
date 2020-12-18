const puppeteer = require('puppeteer');
const request_client = require('request-promise-native');

const SAVED_URL = 'https://www.instagram.com/your-username/saved/';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 1080 });

  await page.goto('https://www.instagram.com/accounts/login');
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', 'your-username');
  await page.type('input[name="password"]', 'your-password');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  await page.goto(SAVED_URL);
  await page.waitForTimeout(3000);

  page.on('request', (request) => {
    request_client({
      uri: request.url(),
      resolveWithFullResponse: true,
    })
      .then((response) => {
        const request_url = request.url();
        if (request_url.includes('scontent')) {
          console.log(request_url);
        }
        request.continue();
      })
      .catch((error) => {
        console.error(error);
        request.abort();
      });
  });

  await page.evaluate(() => {
    (async function () {
      await new Promise((resolve) => {
        const distance = 100;
        const delay = 100;
        const timer = setInterval(() => {
          document.scrollingElement.scrollBy(0, distance);
          if (
            document.scrollingElement.scrollTop + window.innerHeight >=
            document.scrollingElement.scrollHeight
          ) {
            clearInterval(timer);
            resolve();
          }
        }, delay);
      });
    })();
  });

  await page.evaluate(scrollToBottom);
  await page.waitForTimeout(3000);
})();
