const puppeteer = require('puppeteer');
const fs = require('fs');
const Client = require('@infosimples/node_two_captcha');

const combos = JSON.parse(fs.readFileSync('../combos.json', 'utf8'));

async function main(combo) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
  );

  // 큐텐 출석체크 페이지 이동
  await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx');
  await page.setViewport({width: 1920, height: 1080});
  await page.waitForSelector('.lnk');
  await page.click('.lnk');
  await new Promise((page) => setTimeout(page, 3000));
  // 로그인
//   await page.goto('https://www.qoo10.com/gmkt.inc/Login/Login.aspx');
  await page.waitForSelector('#login_id');

  let flag = true;
  // ID/PW 입력하기
  while (flag)
  {
    try
    {
  await page.evaluate(() => {
    document.querySelector('#login_id').value = '';
    document.querySelector('#passwd').value = '';
  });
  await page.type('#login_id', combo[0], { delay: 100 });
//   await page.waitForSelector('#passwd');
  await page.type('#passwd', combo[1], { delay: 100 });

  // 캡챠 이미지 URL 추출
  const imgSrc = await page.evaluate(async () => {
    const img = document.querySelector('#qcaptcha_img');
    return img.src;
  });

  // 2captcha 를 이용해 캡챠 풀기
  const client = new Client('479e6979ef2dc19082f5728d4aef968d', {
    timeout: 600000,
    polling: 10000,
    throwErrors: false,
  });
  let resultText = '';
  await client.decode({ url: imgSrc }).then(function (response) {
    resultText = response.text;
  });

  // 캡챠 결과 입력 후 로그인 버튼 클릭
  await page.click('#recaptcha_response_field');
  await page.type('#recaptcha_response_field', resultText, { delay: 100 });
  await page.evaluate(() => {
    document.querySelector('.btn_sign').click();
  });

  await page.waitForNavigation(); // 어쨌든 리다이렉트 되기를 기다리는 중...

  if (page.url() !== 'https://www.qoo10.com/gmkt.inc/Event/qchance.aspx')
                    {
                        throw new Error('redirection error');
                    }

  flag = false;
}

catch(error) {

}

}

try {
    await page.goto('https://www.qoo10.com/gmkt.inc/My/OrderContractList.aspx', {waitUntil: 'load'});
    // await page.waitForNavigation();
    const songjangs = await page.evaluate(() => {
  
      const pages = Object.values(document.querySelectorAll('.item__status'));
          const shippingPagesIndexes = pages
          .map((page, idx) =>
          page.textContent.replace(/\t/g, '').replace(/\n/g, '') === '배송중' ||
          page.textContent.replace(/\t/g, '').replace(/\n/g, '') ===
            'Shipping on delivery'
            ? idx
            : undefined
              ).filter((element) => element !== undefined);
          let specificPagesHrefs = [];
      
          for (let idx of shippingPagesIndexes) {
                const href = pages[idx].parentNode.parentNode.querySelector('.button--point').onclick.toString().match(/https:\/\/\S+/)[0].slice(0,-2);
                specificPagesHrefs.push(href);
              }
          return specificPagesHrefs;
      /* let songjangs = []
      const orders = document.querySelectorAll('.button--point');
      for (let order of orders) {
          /// 상품별 배송현황 URL 추출
          const onclick = order.onclick.toString();
          songjangs.push(onclick.match(/https:\/\/\S+/)[0].slice(0,-2));
      }
      return songjangs; */
  })
  
  let post_logs = [];
  
  for (let link of songjangs) {
      console.log(link);
      await page.goto(link);
      const songjang_result = await page.evaluate(()=> {
          const takbae = document.querySelectorAll('.val')[0].textContent;
          const takbae_number = document.querySelectorAll('.val')[2].textContent;
          const takbae_start_time = document.querySelectorAll('.val')[1].textContent;
          try {
              takbae_status = document.querySelector('.is_on').textContent.replace(/\t/g, '').replace(/\n/g, '');
          }
          catch (error) {
              takbae_status = "배송 대기중";
          }
          return `${takbae} : ${takbae_number}\n배송시작일 : ${takbae_start_time}\n배송 현황 : ${takbae_status}\nhttps://trace.cjlogistics.com/web/detail.jsp?slipno=${takbae_number}\n\n`;
      })
      post_logs.push(songjang_result);
  }
  
  console.log(`post_logs : ${post_logs}`);
  
  
    await page.goto('https://www.qoo10.com/gmkt.inc/My/OrderContractList.aspx', {waitUntil: 'networkidle0'});
  
    // 주문내역 카테고리 전용 셀렉터 확인 절차
    await page.waitForSelector('.my-nav__head', { timeout: 20000 });
  
    // 배송중인 상품 상세링크 배열을 specific_pages 라는 변수에 추가하는 로직
    const specificPages = await page.evaluate(() => {
      const pages = Object.values(document.querySelectorAll('.item__status'));
      const shippingPages = pages.map(
        (page) =>
          page.textContent.replace(/\t/g, '').replace(/\n/g, '') === '배송중' ||
          page.textContent.replace(/\t/g, '').replace(/\n/g, '') ===
            'Shipping on delivery'
      );
      const shippingPagesIndexes = pages
        .map((page, idx) =>
          page.textContent.replace(/\t/g, '').replace(/\n/g, '') === '배송중' ||
          page.textContent.replace(/\t/g, '').replace(/\n/g, '') ===
            'Shipping on delivery'
            ? idx
            : undefined
        )
        .filter((element) => element !== undefined);
      const specificPagesHrefs = [];
      
      for (let idx of shippingPagesIndexes) {
        const href = pages[idx].parentNode.querySelector('.item__link').href;
        specificPagesHrefs.push(href);
      }
      return specificPagesHrefs;
    });
  
    // 송장 정보 가져오기
    const postLogs = [];
    let idx = 0;
    for (let link of specificPages) {  
      await page.goto(link);
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
        window.scrollBy(0, window.innerHeight);
        window.scrollBy(0, window.innerHeight);
        window.scrollBy(0, window.innerHeight);
        window.scrollBy(0, window.innerHeight);
      });
      // await page.waitForNavigation(); 
      await page.waitForSelector('#memo0');
      await page.setViewport({ width: 1920, height: 1080 });
      const songjangResult = await page.evaluate(() => {
        console.log(document.querySelector('#memo0').textContent);
        return document.querySelector('#memo0').textContent;
      });
      const product_info = await page.evaluate(() => {
        return document.querySelector('.g_title_group').textContent.replace(/\t/g, '').replace(/\n/g, '');
      })
      const option_info = await page.evaluate(() => {
        return document.querySelector('.option').textContent.replace(/\t/g, '').replace(/\n/g, '');
      })
      const date_info  = await page.evaluate(() => {
          return document.querySelector('.tt').textContent.replace(/\t/g, '').replace(/\n/g, '');
      })
      const addr_info = await page.evaluate(() => {
        return document.querySelectorAll('.addr')[1].textContent.replace(/\t/g, '').replace(/\n/g, '');
      })
      postLogs.push(date_info + '\n' + product_info + '\n' + option_info + '\n' + `주소 : ${addr_info}` + '\n' + `닉네임 : ${songjangResult}` + '\n' + post_logs[idx] + '\n\n'); 
      idx += 1;
      console.log(`송장 결과 : ${songjangResult}`);
    }
  
    var today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var dateString = year + '-' + month + '-' + day;

    // 파일 쓰기

    if (postLogs.toString() !== '')
    {
        fs.writeFile(`${combo[0]}_${dateString}.txt`, postLogs.toString(), { encoding: 'utf8' }, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('File written successfully');
            }
          });
        
          await browser.close();
    }

  }

  catch (error) {
    console.log(`${combo[0]} got an error(s) : \n ${error}`);
    browser.close();
  }
  
}

// 모든 콤보에 대해 main 함수 실행
for (let combo of combos) {
  main(combo);
}