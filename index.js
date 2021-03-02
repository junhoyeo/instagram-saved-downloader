const puppeteer = require('puppeteer');
const constants = require('./constants');

const TARGET_TAG_URL =
  'https://www.instagram.com/explore/tags/%EA%B3%A8%ED%94%84%EC%8A%A4%EC%9C%99/';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 1080 });

  await page.goto('https://www.instagram.com/accounts/login');
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', constants.username);
  await page.type('input[name="password"]', constants.password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  await page.goto(TARGET_TAG_URL);
  await page.waitForTimeout(3000);

  // 첫 번째 포스트 누르기
  await page.evaluate(() => {
    const firstPost = document.querySelector('article a');
    firstPost.click();
  });

  // 사용자 이름 가져오기
  await page.waitForSelector('article header span a');
  const username = await page.evaluate(() => {
    console.log(document)
    const usernameWrapper = document.querySelector('article header span a');
    console.log(usernameWrapper);
    return usernameWrapper?.innerText.trim();
  });
  console.log(username);
})();
