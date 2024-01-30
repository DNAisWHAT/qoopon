// 필요한 모듈을 불러옵니다.
const puppeteer = require('puppeteer');
const fs = require('fs');
const Client = require('@infosimples/node_two_captcha');

const ticket_coordinates = {'x' : '346', 'y' : '534'}
const roulette_coordinates = {'x' : '1267', 'y' : '814'}

// 오늘 날짜를 가져옵니다.
var today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);
var dateString = year + '-' + month + '-' + day;

// combos.json 파일을 읽어와 파싱합니다.
const combos = JSON.parse(fs.readFileSync('../combos.json', 'utf8'));

// 메인 함수를 정의합니다.
async function main(combo) {

  // 브라우저를 실행합니다.
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  // 새 페이지를 엽니다.
  const page = await browser.newPage();
  // 사용자 에이전트를 설정합니다.
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
  );

  // 큐텐 출석체크 페이지로 이동합니다.
  await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx');
  await page.setViewport({width: 1920, height: 1080});
  await page.waitForSelector('.lnk');
  await page.click('.lnk');
  await new Promise((page) => setTimeout(page, 3000));

  // 로그인 페이지로 이동합니다.
  try {
    await page.waitForSelector('#login_id');
  }

  catch(e) {
    console.log(`${combo[0]} : #login_id failed`);
  }

  // 로그인을 시도합니다.
  let flag = true;
  while (flag)
  {
    try
    {
  // ID와 비밀번호를 입력합니다.
  await page.evaluate(() => {
    document.querySelector('#login_id').value = '';
    document.querySelector('#passwd').value = '';
  });
  await page.type('#login_id', combo[0], { delay: 100 });
//   await page.waitForSelector('#passwd');
  await page.type('#passwd', combo[1], { delay: 100 });

  // 캡챠 이미지 URL을 추출합니다.
  const imgSrc = await page.evaluate(async () => {
    const img = document.querySelector('#qcaptcha_img');
    return img.src;
  });

  // 2captcha를 이용해 캡챠를 해결합니다.
  const client = new Client('479e6979ef2dc19082f5728d4aef968d', {
    timeout: 600000,
    polling: 10000,
    throwErrors: false,
  });
  let resultText = '';
  await client.decode({ url: imgSrc }).then(function (response) {
    resultText = response.text;
  });

  // 캡챠 결과를 입력하고 로그인 버튼을 클릭합니다.
  await page.click('#recaptcha_response_field');
  await page.type('#recaptcha_response_field', resultText, { delay: 100 });
  await page.evaluate(() => {
    document.querySelector('.btn_sign').click();
  });

  // 리다이렉트를 기다립니다.
  await page.waitForNavigation();

  // 리다이렉트 에러를 확인합니다.
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
  // 상세페이지로 이동해서 배송 중인 녀석들을 다 따오고, 그 녀석들에 한해 배송정보를 따온다.
    

  // 주문내역 페이지로 이동합니다.
    await page.goto('https://www.qoo10.com/gmkt.inc/My/OrderContractList.aspx', {waitUntil: 'load'});

    // 배송중인 상품의 상세링크를 가져옵니다.
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
  }) // songjangs라는 변수에는 배송 중인 웹페이지의 상세 정보 페이지들을 다 담는다
  
  // post_logs : 배송 중 상태인 상품 전부의 배송 정보 
  let post_logs = [];
  
  for (let link of songjangs) {
      // console.log(link);
      await page.goto(link, {waitUntil: 'load'});
      const songjang_result = await page.evaluate(()=> {
          const takbae = document.querySelectorAll('.val')[0].textContent;
          const takbae_number = document.querySelectorAll('.val')[2].textContent;
          const takbae_start_time = document.querySelectorAll('.val')[1].textContent;
          try {
              takbae_status = document.querySelector('.is_on').textContent.replace(/\t/g, '').replace(/\n/g, '');
          }
          catch (error) {
              takbae_status = "배송 중...";
          }
          return `${takbae} : ${takbae_number}\n배송시작일 : ${takbae_start_time}\n배송 현황 : ${takbae_status}\nhttps://trace.cjlogistics.com/web/detail.jsp?slipno=${takbae_number}\n\n`;
      })  
      post_logs.push(songjang_result);
  }  
  
    await page.goto('https://www.qoo10.com/gmkt.inc/My/OrderContractList.aspx', {waitUntil: 'networkidle0'});
  
    // 주문내역 카테고리 전용 셀렉터 확인 절차
    await page.waitForSelector('.my-nav__head', { timeout: 20000 });
  
    // 배송중인 상품 상세링크 배열을 specificPages 라는 변수에 추가하는 로직
    const specificPages = await page.evaluate(() => {
      const pages = Object.values(document.querySelectorAll('.item__status'));
      // pages : 구매 페이지의 nodeIndex
/*       const shippingPages = pages.map(
        (page) =>
          page.textContent.replace(/\t/g, '').replace(/\n/g, '') === '배송중' ||
          page.textContent.replace(/\t/g, '').replace(/\n/g, '') ===
            'Shipping on delivery'
      ); */

      // shippingPagesIndexes : 배송중인 상품의 상세페이지(배송 정보X)의 nodeList 인덱스
      const shippingPagesIndexes = pages
        .map((page, idx) =>
          page.textContent.replace(/\t/g, '').replace(/\n/g, '') === '배송중' ||
          page.textContent.replace(/\t/g, '').replace(/\n/g, '') === 'Shipping on delivery'
          // page.textContent.replace(/\t/g, '').replace(/\n/g, '') === 'Shipping delivered'
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
  
    // 송장 정보를 가져옵니다.
      const postLogs = [];
      let idx = 0;
      for (let link of specificPages) {  

        try {
          await page.goto(link);
          // await page.evaluate(() => {
          //   window.scrollBy(0, window.innerHeight);
          //   window.scrollBy(0, window.innerHeight);
          //   window.scrollBy(0, window.innerHeight);
          //   window.scrollBy(0, window.innerHeight);
          //   window.scrollBy(0, window.innerHeight);
          // });
    
          await page.waitForSelector('#memo0');
          await page.setViewport({ width: 1920, height: 1080 });
          const songjangResult = await page.evaluate(() => {
            console.log(document.querySelector('#memo0').textContent);
            return document.querySelector('#memo0').textContent;
          });
          const product_info = await page.evaluate(() => {
            return document.querySelector('.g_title_group').textContent.replace(/\t/g, '').replace(/\n/g, '');
          });
          const option_info = await page.evaluate(() => {
            return document.querySelector('.option').textContent.replace(/\t/g, '').replace(/\n/g, '');
          });
          const date_info  = await page.evaluate(() => {
              return document.querySelector('.tt').textContent.replace(/\t/g, '').replace(/\n/g, '');
          });
          const addr_info = await page.evaluate(() => {
            return document.querySelectorAll('.addr')[1].textContent.replace(/\t/g, '').replace(/\n/g, '');
          });
          postLogs.push(date_info + '\n' + product_info + '\n' + option_info + '\n' + `주소 : ${addr_info}` + '\n' + `닉네임 : ${songjangResult}` + '\n' + post_logs[idx] + '\n\n'); 
          idx += 1;
          console.log(`${combo}| 송장 결과 : ${songjangResult}`);
        }

        catch (error) {
          await page.screenshot({
            fullPage: true,
            path: `../timeline/captures/${dateString}${combo[0]}.jpg`
          })  
        }
      }


    // const postLogs = [];
    // let idx = 0;
    // for (let link of specificPages) {  
    //   await page.goto(link);
    //   await page.evaluate(() => {
    //     window.scrollBy(0, window.innerHeight);
    //     window.scrollBy(0, window.innerHeight);
    //     window.scrollBy(0, window.innerHeight);
    //     window.scrollBy(0, window.innerHeight);
    //     window.scrollBy(0, window.innerHeight);
    //   });

    //   await page.waitForSelector('#memo0');
    //   await page.setViewport({ width: 1920, height: 1080 });
    //   const songjangResult = await page.evaluate(() => {
    //     console.log(document.querySelector('#memo0').textContent);
    //     return document.querySelector('#memo0').textContent;
    //   });
    //   const product_info = await page.evaluate(() => {
    //     return document.querySelector('.g_title_group').textContent.replace(/\t/g, '').replace(/\n/g, '');
    //   });
    //   const option_info = await page.evaluate(() => {
    //     return document.querySelector('.option').textContent.replace(/\t/g, '').replace(/\n/g, '');
    //   });
    //   const date_info  = await page.evaluate(() => {
    //       return document.querySelector('.tt').textContent.replace(/\t/g, '').replace(/\n/g, '');
    //   });
    //   const addr_info = await page.evaluate(() => {
    //     return document.querySelectorAll('.addr')[1].textContent.replace(/\t/g, '').replace(/\n/g, '');
    //   });
    //   postLogs.push(date_info + '\n' + product_info + '\n' + option_info + '\n' + `주소 : ${addr_info}` + '\n' + `닉네임 : ${songjangResult}` + '\n' + post_logs[idx] + '\n\n'); 
    //   idx += 1;
    //   console.log(`송장 결과 : ${songjangResult}`);
    // }
  
    

    // 파일을 작성합니다.

    if (postLogs.toString() !== '')
    {
        fs.writeFile(`../timeline/${dateString}/${combo[0]}_${dateString}.txt`, postLogs.toString(), { encoding: 'utf8' }, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`${combo[0]} 파일 작성 완료`);
            }
          });          
          console.log(`${combo[0]} : 정상적으로 완료했습니다. 종료합니다.`);
          // await browser.close();
    }

  }

  catch (error) {
    console.log('송장 조회에 문제가 생겼습니다.' + '\n' + error);
    // browser.close();
  }

  // Working : 룰렛 자동 돌리기 
  // await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx', {waitUntil:  "networkidle0"});
  // await page.waitForSelector('.click');
  // await page.evaluate(async ()=> {
  //   await document.querySelector('.click').childNodes[0].click();
  //   await document.querySelector('.qcc-layer__btn').childNodes[0].click();
  // })
  // await new Promise((page) => setTimeout(page, 1000000));
  // browser.close();
}

// 모든 콤보에 대해 메인 함수를 실행합니다.

if (fs.existsSync(`../timeline/${dateString}`)) {
  fs.rmdir(`../timeline/${dateString}`, { recursive: true }, (err) => {
    if (err) {
      console.error('폴더를 삭제할 수 없습니다.', err);
      return;
    }
  });
}
  


fs.mkdir(`../timeline/${dateString}`, (err) => { if (err) throw err; })

for (let combo of combos) {
  main(combo);
}
