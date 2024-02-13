const puppeteer = require('puppeteer-extra')
const fs = require('fs');
const Client = require('@infosimples/node_two_captcha');
const { Configuration, NopeCHAApi } = require('nopecha');
const StealthPlugin = require('puppeteer-extra-plugin-stealth') ;
const { errors } = require('puppeteer');

puppeteer.use(StealthPlugin());

const combos = JSON.parse(fs.readFileSync('../combos.json', 'utf8'));


async function main(combo) {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: [
    '--no-sandbox',
    '--disable-dev-shm-usage', // <-- add this one
    ],});
//   const context = await browser.createIncognitoBrowserContext();
  let flag = true;
  browser.on('disconnected', () => {
    console.log('브라우저가 닫혔습니다.');
    flag = false;
  });

  const browserProcess = browser.process();
  browserProcess.on('exit', () => {
  flag = false;
});


  const page = await browser.newPage();
  page.on('dialog', async dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    await dialog.dismiss(); // dismiss 메서드를 사용하여 대화상자를 닫음
  });
  await page.setViewport( { 'width' : 1920, 'height' : 1080 } );
  await page.setUserAgent('Mozilla/5.0 ...');
  const original_combo = combo;
  await navigateToLoginPage(page);

  try {
    await login(page, combo, browser, original_combo);
    // await getOrderInformation(page, browser, combo);
    // await getPhoneNumberVerification(page, browser, combo);
    await getCouponInfo(browser, page, combo);
    while ( flag ) {
        // console.log('while');
        if (!browser.isConnected()) return 0;
    }

    return 0;
    // await playRouletteAndSaveCoupons(page, browser);
    // await fetchDeliveryInfo(page, combo);
  }
   catch (error) {
    console.error(`${combo[0]}: Error occurred - ${error}`);
    console.error(error.stack);
  } finally {
    console.log(`${combo[0]}: Process completed. Closing browser...`);
    await browser.close();
  }
}

async function navigateToLoginPage(page) {
  try {
    await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx', { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 1920, height: 1080 });
    await page.waitForSelector('.lnk');
    await page.click('.lnk');
    await page.waitForSelector('#login_id');

  }

  catch (e) {
    navigateToLoginPage(page);
  }
  
}


async function login (page, combo, browser, original_combo) {
  await new Promise((page) => setTimeout(page, 1000));
//   await page.waitForSelector('.btn_spc', {waitUntil:'networkidle0'});
  await page.evaluate(() => {
    document.querySelector('#login_id').value = '';
    document.querySelector('#passwd').value = '';
  })
//   await page.type('#login_id', '', {delay : 100});
//   await page.type('#passwd', '', {delay : 100});
  await page.type('#login_id', combo[0], { delay: 100 });
  await page.type('#passwd', combo[1], { delay: 100 });

  const imgSrc = await page.evaluate(() => document.querySelector('#qcaptcha_img').src);
  let resultText = await solveCaptcha(imgSrc, page, combo, browser, original_combo);
  console.log(`resultText : ${resultText}`);
//   if (typeof resultText === 'undefined') resultText = await solveCaptcha(imgSrc, page, combo, browser, original_combo);

  await page.type('#recaptcha_response_field', resultText, { delay: 100 });
//   await page.evaluate((resultText) => {
//     // document.querySelector('#recaptcha_response_field').click();
//     // document.querySelector('#recaptcha_response_field').value = resultText;
//   });
  await page.click('.btn_sign');

//   await new Promise((page) => setTimeout(page, 3000));
  await page.waitForNavigation();
  console.log(`로그인 버튼 클릭 후 URL : ${page.url()}`);
//   await new Promise((page) => setTimeout(page, 3000));


  try { // 이메일만 인증했을 경우
//   await new Promise((page) => setTimeout(page, 3000));
  if (page.url().includes('Login')) throw Error;
  await page.waitForSelector('#old_pwd', {timeout : 5000});
  await checkEmailVerification(page, combo, browser, true, original_combo);
  }

  catch (e) { // 인증을 처음부터 다시 해야하는 경우 & 로그인에 실패한 경우
    // console.log(`인증을 처음부터 다시 해야하는 경우 & 로그인에 실패한 경우 : 에러. 하단 참조 \n${e}`);
    if (!page.url().includes('Memberconfirmation') && !page.url().includes('Login')) // 로그인 성공의 경우.
    {
      console.log("로그인에 성공했습니다. 인증 여부를 확인하겠습니다.");
    //   await new Promise((page) => setTimeout(page, 3000));
    //   return 0;
    } 

    else { // 인증에 걸린 경우 | 로그인 실패의 경우 
      console.log(`변경 전 비밀번호 : ${combo[1]}`)
      combo[1] = ( combo[1] === 'Zxcx!!8520' ) ? 'Zxcx!!852020' : 'Zxcx!!8520';
      console.log(`어떤 인증이 필요하거나 비밀번호가 잘못되어 재로그인을 해야 하는 경우입니다. 변경되는 비밀번호 : ${combo[1]}`);
      
    //   await navigateToLoginPage(page);
      await login(page, combo, browser, original_combo);
    }
  }
}

async function solveCaptcha(imgSrc, page, combo, browser, original_combo) {
  let resultText = ''
  const client = new Client('479e6979ef2dc19082f5728d4aef968d', {
    timeout: 600000,
    polling: 10000,
    throwErrors: true,
  });

  try {
    const { text: resultText } = await client.decode({ url: imgSrc });
    // if (resultText && typeof resultText[Symbol.iterator] !== 'function')
    // {
    //     solveCaptcha(imgSrc, page, combo, browser, original_combo);
    // }
    if (typeof resultText === 'undefined') solveCaptcha(imgSrc, page, combo, browser, original_combo);
    return resultText;

  }

  catch (e) {
    if (e.code === "ENOTFOUND")
    {
        console.log('e.code 가 ENOTFOUND입니다. 재로그인을 시작합니다.');
        login(page, combo, browser, original_combo);
    }
    // console.log(`solveCaptcha Error : ${e}`);
    console.log(imgSrc);
    solveCaptcha(imgSrc, page, combo, browser, original_combo);
  }

//   finally {
//     if (resultText) {
//         return resultText;
//     }
  }


//   if ( resultText.includes('We are unable' ) || resultText.includes('100% accuracy' )) {
//   }


async function checkEmailVerification(page, combo, browser, isEmailConfirmed, original_combo) {
    // 1순위 . 이메일 인증을 완료했고 비번만 바꾸면 되는 경우.
    // 2순위 . 이메일 인증도 완료하지 않은 경우.

  console.log(`checkEmailVerification : 페이지 url : ${page.url()}`);
  try { 
    if (isEmailConfirmed) {
        console.log('checkEmailVerification : 이메일 확인 완료. 이제 비밀번호 변경 차례.');
        await page.$eval('#old_pwd', (element, value) => element.value = value, combo[1]);
        combo[1] = original_combo[1];
        combo[1] = combo[1] === 'Zxcx!!8520' ? 'Zxcx!!852020' : 'Zxcx!!8520';
        await page.$eval('#new_pwd', (element, value) => element.value = value, combo[1]);
        await page.$eval('#new_pwd2', (element, value) => element.value = value, combo[1]);
        console.log('checkEmailVerification : 비밀번호 변경 완료 .');
        // page.click('#btn_change', {delay: 300});
        // page.evaluate()
        await page.evaluate(() => document.querySelector('#btn_change').click());
        console.log(`${combo[0]}의 최종 비밀번호 : ${combo[1]}`);
        // await new Promise((page) => setTimeout(page, 3000));
    }

    // return 0;
    
  }
  
  catch (e) {
    console.log(`checkEmailVerification error : ${e}`);
  }

  let emailVerificationLink = 'https://ruu.kr';
  let email = combo[0].split('@')[0];
  let domain = combo[0].split('@')[1];
  let TEN_SECONDS_MS = 10000;
  let ONE_SECOND_MS = 1000;

  if( page.url().includes('Memberconfirmation'))
  {
    console.log('계정 인증 들어감');
    // await new Promise((page) => setTimeout(page, 3000));
    await page.click('#btn_send_email', {delay: 100});
    
    const newPage = await browser.newPage();
    console.log('새 탭 도메인 이동 테스트 중');

    await newPage.goto(emailVerificationLink);
    await newPage.waitForSelector('#id');
    await newPage.type('#id', email);
    await newPage.type('#domain', domain);
    
    // await new Promise((newPage) => setTimeout(newPage, ONE_SECOND_MS)); 
    // await newPage.evaluate((id, domain) => {
    //     document.querySelector('#id').value = id;
    //     document.querySelector('#domain').value = domain;
    // })

    console.log('도메인 입력 완료');
    console.log('이메일 입력 완료');

    await new Promise((newPage) => setTimeout(newPage, TEN_SECONDS_MS)); 
    // await newPage.click('#mailList', {delay: 100});
    await newPage.waitForSelector('#mail');

    // await new Promise((newPage) => setTimeout(newPage, ONE_SECOND_MS)); 

    console.log(`현재 URL : ${newPage.url()}`);
    console.log(`new page url : ${newPage.url()}`);

    let verificationLink = ''
    await newPage.evaluate(( ONE_SECOND_MS) => {
        if (document.querySelector("#mail > table > tbody > tr:nth-child(1) > td:nth-child(2)") && // 메일 2개가 존재하고
        document.querySelector("#mail > table > tbody > tr:nth-child(1) > td:nth-child(2)").textContent === '[Qoo10] Confirm Your E-mail' //1번째 문자가 이메일 인증이라면
          )
          {
            document.querySelector('table > tbody > tr:nth-child(1) > td:nth-child(2)').click(); 
          }
    });

    await newPage.waitForSelector('#view');

    await new Promise((newPage) => setTimeout(newPage, 3000));

    let link = await newPage.evaluate(( ONE_SECOND_MS) => {
        if (document.querySelector("#mail > table > tbody > tr:nth-child(1) > td:nth-child(2)") && // 메일 2개가 존재하고
        document.querySelector("#mail > table > tbody > tr:nth-child(1) > td:nth-child(2)").textContent === '[Qoo10] Confirm Your E-mail' //1번째 문자가 이메일 인증이라면
          )
          {
            document.querySelector('table > tbody > tr:nth-child(1) > td:nth-child(2)').click(); 
            const href = document.querySelector('#view > table > tbody:nth-child(2) > tr:nth-child(4) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > a').href;
            return href;
          }
    });

    await newPage.click('#view > table > tbody:nth-child(2) > tr:nth-child(2) > td:nth-child(1) > h1', {delay: 100});


    console.log(`link : ${link}`);
    // await new Promise((newPage) => setTimeout(newPage, 50000000));
    newPage.goto(link);
    // newPage.on('dialog', async dialog => {
    // console.log(`Dialog message: ${dialog.message()}`);
    //     await dialog.dismiss(); // dismiss 메서드를 사용하여 대화상자를 닫음
    //   });
    await new Promise((newPage) => setTimeout(newPage, 5000));
    await newPage.close();

    await page.click('.mcf_bt', { delay: 100 }); // 이메일 누르기 밑 Next 버튼 클릭
    await page.waitForSelector('#old_pwd');
    await page.$eval('#old_pwd', (element, value) => element.value = value, combo[1]);
    combo[1] = combo[1] === 'Zxcx!!8520' ? 'Zxcx!!852020' : 'Zxcx!!8520';
    await page.$eval('#new_pwd', (element, value) => element.value = value, combo[1]);
    await page.$eval('#new_pwd2', (element, value) => element.value = value, combo[1]);
    await page.click('.mcf_bt', { delay : 100 });
    // await page.click('#btn_change', { delay : 100 });
    await page.evaluate(() => {
        document.querySelector('.mcf_bt_con').childNodes[3].click();
    });
    await new Promise((newPage) => setTimeout(newPage, 5000));
  } 

}

async function getOrderInformation(page, browser, combo) {
    try {

        console.log(`${combo[0]} : 주문 내역 조회에 들어옴.`);
          await page.goto(`https://www.qoo10.com/gmkt.inc/My/OrderContractList.aspx`, {waitUntil: 'load'});
      
          // 배송중인 상품의 상세링크를 가져옵니다.
          const productHrefs = await page.evaluate(() => {
        
            const pages = Object.values(document.querySelectorAll('.item__status')); 
            // pages = Qoo10 주문내역 페이지
            const shippingPagesIndexes = pages
            // shippingPagesIndexes = 주문내역 페이지에서 주문 대기/배송중 제품 노드인덱스 추출
                .map((page, idx) =>
                page.textContent.replace(/\t/g, '').replace(/\n/g, '') === 
                  '배송중' ||
                page.textContent.replace(/\t/g, '').replace(/\n/g, '') ===
                  'Shipping on delivery' ||
                page.textContent.replace(/\t/g, '').replace(/\n/g, '') ===
                  'Shipping delivered'
                // page.textContent.replace(/\t/g, '').replace(/\n/g, '') ===
                //   'Shipping requested' 
                // page.textContent.replace(/\t/g, '').replace(/\n/g, '') ===
                //   'Shipping delivered'
                  ? idx
                  : undefined
                    ).filter((element) => element !== undefined);
      
                console.log(shippingPagesIndexes);
      
                let specificPagesHrefs = [];
      
                for (let idx of shippingPagesIndexes) {
                        const trackingHref = pages[idx].parentNode.parentNode.querySelector('.button--point').onclick.toString().match(/https:\/\/\S+/)[0].slice(0,-2);
                        const orderInfoHref = pages[idx].parentNode.querySelector('.item__dtl').querySelector('.item__link').href;
      
                      specificPagesHrefs.push({trackingHref, orderInfoHref});
                      // href = 주문내역 페이지에서 주문 대기/배송중 제품 노드인덱스 하나씩 꺼내서 상품 URL 추출
                      // specificPagesHrefs.push(trackingHref);
                      // 앞으로 활용할 Href = 메인 요리는 반환된 specificPagesHrefs를 가진 productHrefs  
                    }
                return specificPagesHrefs;
        }) 
        
        // deliverying_logs : 배송 중 상태인 상품 전부의 배송 정보 
        let deliverying_logs = [];
        
        for (let link of productHrefs) {
            await page.goto(link.orderInfoHref, {waitUntil: 'networkidle0'});
            // link[1] 은 상품 상세 주문내역 정보 링크
            const product_info = await page.evaluate(() => {
      
              let product_name = document.querySelector("#contractInfo > table.my_ls_tbl.tbl_ln > tbody > tr:nth-child(1) > td.optionType.g_title_group > p > a").textContent
              let name = document.querySelector("#ctl00_ctl00_MainContentHolder_MainContentHolder_div_ShippingInfo_contents > table > tbody > tr:nth-child(1) > td").textContent.replace(/\t/g, '').replace(/\n/g, '')
              let address = document.querySelector("#ctl00_ctl00_MainContentHolder_MainContentHolder_div_ShippingInfo_contents > table > tbody > tr:nth-child(2) > td > p:nth-child(3)").textContent.replace(/\t/g, '').replace(/\n/g, '')
              let phone_number = document.querySelector("#ctl00_ctl00_MainContentHolder_MainContentHolder_div_ShippingInfo_contents > table > tbody > tr:nth-child(3) > td").textContent;
              phone_number = phone_number.replace('+82-', '');
              let memo = document.querySelector("#memo0").textContent;
              let generatedString = `${product_name}:${name}:${address}:${phone_number}:${memo}`;
              return generatedString;
            })
            await page.screenshot({path: `../timeline/captures/상품정보:${product_info}.jpg`, fullPage: true});
            await new Promise((page) => setTimeout(page, 1000));
            await new Promise((page) => setTimeout(page, 5000));
      
            await page.goto(link.trackingHref, {waitUntil: 'networkidle0'});
            await page.screenshot({path: `../timeline/captures/${combo[0]}:${combo[1]}:운송장정보:${product_info}.jpg`, fullPage: true});
            await new Promise((page) => setTimeout(page, 1000));
            console.log(`${combo[0]} : 운송장, 상품 정보 다 캡쳐 완료했습니다. 확인해보세요.`);
            await new Promise((page) => setTimeout(page, 5000));
            // browser.close();
            console.log('브라우저 종료됨.');
        }
}

catch (e) {
    console.log(`getOrderInformation Error : ${e}`);
}

}


async function getPhoneNumberVerification(page, browser, combo) {
    let myInformationURL = 'https://www.qoo10.com/gmkt.inc/Event/CheckMobileConfirmation.aspx?confirm_type=C&next_url=https://www.qoo10.com/gmkt.inc/My/EditMember.aspx';
    await page.goto(myInformationURL, {waitUntil: 'networkidle0'});

    // 인증번호 받기(SMS) 및 전송 확인 버튼 클릭  
    // await page.click('#btn_get_code');
    // await page.click('.btn');

    await page.waitForSelector('#hp_no1');

    let PHONE_NUMBER = await page.evaluate(() => {
    let ph_no1 = document.querySelector('#hp_no1').value;
    let ph_no2 = document.querySelector('#hp_no2').value;
    let ph_no3 = document.querySelector('#hp_no3').value;
    return '1' + ph_no1 + ph_no2 + ph_no3; // ex) 12085689819
    });
    console.log(`$휴대전화 번호 : ${PHONE_NUMBER}`);
    let PHONE_NUMBER_VERIFICATION_WEBSITE = `https://temp-number.com/temporary-numbers/United-States/${PHONE_NUMBER}/1`;
    let received_today_selector = 'body > main > section.number-main-info > div > div.number-main-info__categories > div:nth-child(1) > div > div:nth-child(3) > p:nth-child(2) > br-span';
    let PHONE_NUMBER_VERIFICATION_WEBSITE_MAINPAGE = 'https://temp-number.com/countries/United-States'
    const newPage = await browser.newPage();
    await newPage.goto(PHONE_NUMBER_VERIFICATION_WEBSITE);
    // await newPage.waitForNavigation({waitUntil: 'networkidle0'});


        try // 번호 삭제 여부 확인하고 삭제됐으면 메인페이지 이동

        {
            await newPage.waitForSelector('.error-message', {timeout : 0});
            await newPage.goto(PHONE_NUMBER_VERIFICATION_WEBSITE_MAINPAGE);
            // await newPage.waitForNavigation({waitUntil : 'networkidle0'});
        }
    
        catch { // 번호가 유지됐으면
            // console.log(`getPhoneNumberVerification : 번호는 유지되고 있습니다.`);
            // if (await newPage.evaluate((received_today_selector) => document.querySelector(received_today_selector).textContent === '0 SMS'), received_today_selector);
            // {
            //     await newPage.goto(PHONE_NUMBER_VERIFICATION_WEBSITE_MAINPAGE);
            // }
        }

        // await browser.close();
    

    // await new Promise((page) => setTimeout(page, 50000000));

}

async function getCouponInfo(browser, page, combo) {
    let couponInfoURL = 'https://www.qoo10.com/gmkt.inc/MyCoupon/MyCouponList.aspx?global_order_type=L'
    console.log(`getCouponInfo : 쿠폰 페이지 진입 중...`);
    await page.goto(couponInfoURL);
    // await page.waitForNavigation();
    var today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var dateString = year + '-' + month + '-' + day;
    await page.setViewport({width: 1920, height: 1080});
    await page.screenshot({path: `../coupons/${combo[0]}_${dateString}.jpg`});
    console.log(`${combo[0]} 쿠폰 캡쳐 완료`);
    await browser.close();
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

async function checkBrowserTurnedOff(flag) {
    if (!flag)
    {
        return 0;
    }
}

async function delay(duration) {
    return  new Promise(resolve => setTimeout(resolve, duration));
  }
  
  async function processCombos(combos) {
    for (const combo of combos) {
      main(combo);
    //   await delay(5000); // 5초 대기
    await new Promise(resolve => setTimeout(resolve, 60000)); // 30초 기다립니다.
    }
  }
  
  // combos 배열을 processCombos 함수에 전달하여 실행
  processCombos(combos);