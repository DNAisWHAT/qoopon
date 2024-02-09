const puppeteer = require('puppeteer');
const fs = require('fs');
const Client = require('@infosimples/node_two_captcha');

const combos = JSON.parse(fs.readFileSync('../combos.json', 'utf8'));

async function main(combo) {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 ...');
  await navigateToLoginPage(page);

  try {
    await login(page, combo);
    await checkEmailVerification(page, combo, browser);
    await playRouletteAndSaveCoupons(page, browser);
    await fetchDeliveryInfo(page, combo);
  } catch (error) {
    console.error(`${combo[0]}: Error occurred - ${error}`);
  } finally {
    console.log(`${combo[0]}: Process completed. Closing browser...`);
    await browser.close();
  }
}

async function navigateToLoginPage(page) {
  await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.waitForSelector('.lnk');
  await page.click('.lnk');
  await page.waitForTimeout(3000);
}

async function login(page, combo) {
  await page.waitForSelector('#login_id');
  await page.type('#login_id', combo[0], { delay: 100 });
  await page.type('#passwd', combo[1], { delay: 100 });

  const imgSrc = await page.evaluate(() => document.querySelector('#qcaptcha_img').src);
  const resultText = await solveCaptcha(imgSrc);

  await page.type('#recaptcha_response_field', resultText, { delay: 100 });
  await page.click('.btn_sign');
  await page.waitForNavigation();
}

async function solveCaptcha(imgSrc) {
  const client = new Client('479e6979ef2dc19082f5728d4aef968d', {
    timeout: 600000,
    polling: 10000,
    throwErrors: false,
  });

  const { text: resultText } = await client.decode({ url: imgSrc });
  return resultText;
}

async function checkEmailVerification(page, combo, browser) {
  // Implement email verification check logic
}

async function playRouletteAndSaveCoupons(page, browser) {
  // Implement roulette play and coupon save logic
}

async function fetchDeliveryInfo(page, combo) {
  // Implement delivery info fetching logic
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function saveToFile(filename, content) {
  fs.writeFile(filename, content, { encoding: 'utf8' }, (err) => {
    if (err) {
      console.error(`Error writing to file ${filename}: ${err}`);
    } else {
      console.log(`File ${filename} written successfully`);
    }
  });
}

for (const combo of combos) {
  main(combo);
}