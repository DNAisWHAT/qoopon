
//  이 코드는 로그인하여 룰렛을 손수 돌려주는 코드입니다.
/// login.js         -> coupon_info.js          -> coupon_OCR.js
/// 로그인 후 룰렛 돌리기 -> 룰렛 돌린 계정 쿠폰 사진 찍기  -> 쿠폰 사진 텍스트 인식해서 계정별로 몇장 가지고 있는지 확인하기

const { Configuration, NopeCHAApi } = require('nopecha');
const jsdom = require("jsdom");
const puppeteer = require('puppeteer');
const { JSDOM } = jsdom;



const ac = require("@antiadmin/anticaptchaofficial");
const fs = require('fs');

const Client = require('@infosimples/node_two_captcha');

// Declare your client


// const Configuration = nopecha.Configuration;
// const NopeCHAApi = nopecha.NopeCHAApi;

const combos = [
       ['nws7114@gmail.com', 'zxcx!!8520'],
    // ['letill905@mbox.re', 'Zxcx!!8520'],
    // ['wineathi@fanclub.pm', 'Zxcx!!8520'],
    // ['atoptbut@hamham.uk', 'Zxcx!!8520'],
    // ['webinmyban@honeys.be', 'Zxcx!!8520'],
    // ['robfog39@quicksend.ch', ')wrLUg3nD9qFY2s'],
    // ['bangumme@moimoi.re', '+9hlOP4u)Gnd}Rn'],
    // ['key215@fuwa.be', 'w,j7Klej7_o'],
    // ['potrobget@exdonuts.com', 'xFhk1N9JX#+M'],
    // ['lotfitdie@eay.jp', '%3GQE5j&g&)5'],
    // ['oweing118@mirai.re', 'c8DAeQLmKOj^'],
    // ['bitusraw@owleyes.ch', 'TlL$H4VY'],
    // ['duedamkin@magim.be', 'TlL$H4VY'],
    // ['procryoak@mbox.re', 'TlL$H4VY'],
    // ['se1@kumli.racing','Zxcx!!8520'],
    // ['se2@kumli.racing','Zxcx!!8520'],
    // ['se3@kumli.racing','Zxcx!!8520'],
    // ['se4@kumli.racing','Zxcx!!8520'],
    // ['se5@kumli.racing','Zxcx!!8520'],
    // ['se8@copyhome.win','Zxcx!!8520'],
    // ['se11@copyhome.win', 'Zxcx!!8520'],
    // ['se12@copyhome.win', 'Zxcx!!8520'],
    // ['se13@copyhome.win', 'Zxcx!!8520'],
    // ['se14@copyhome.win', 'Zxcx!!8520'],
    // ['se15@copyhome.win', 'Zxcx!!8520'],
    // ['se16@copyhome.win', 'Zxcx!!8520'],
    // ['se17@copyhome.win', 'Zxcx!!8520'],
    // ['se18@copyhome.win', 'Zxcx!!8520'],
    // ['se19@copyhome.win', 'Zxcx!!8520'],
    // ['se20@copyhome.win', 'Zxcx!!8520'],
    // ['se21@copyhome.win', 'Zxcx!!8520'],
    // ['se23@copyhome.win', 'Zxcx!!8520'],
    // ['se24@copyhome.win', 'Zxcx!!8520'],
    // ['se25@copyhome.win', 'Zxcx!!8520'],

    // ['crazyfarmer@kakao.com','zxcx8520'],
    // ['nws7114@gmail.com','zxcx!!8520'],
    // ['se2@copyhome.win','zxcx!!8520'],
    // ['se3@copyhome.win','zxcx!!8520'],
    // ['se6@copyhome.win','zxcx!!8520'],
    // ['se8@copyhome.win','Zxcx!!8520'],
    // ['se11@copyhome.win', 'Zxcx!!8520'],
    // ['se12@copyhome.win', 'Zxcx!!8520'],
    // ['se11@copyhome.win', 'Zxcx!!8520'],
    // ['se21@copyhome.win', 'Zxcx!!8520'],
]

const jsonFile = fs.readFileSync('../combos.json', 'utf8');
const jsonData = JSON.parse(jsonFile);


async function captcha() {

}

async function main(combo)  {

        const configuration = new Configuration({
            apiKey: 'smhff9hf1gayxjxt',
        });
        const nopecha = new NopeCHAApi(configuration);

        const browser = await puppeteer.launch({
            // product: 'firefox',
            headless: false,
            defaultViewport: null,
        }) 
        // Launch the browser and open a new blank page
        // const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
    
        let flag = true;
        // 큐텐 출석체크 페이지 이동

        // await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx');
        
        // 로그인 


        // await page.goto("https://www.qoo10.com/gmkt.inc/Login/Login.aspx");

        // Set screen size

        // ID/PW 입력하기

        while (flag) {
            try {   

                // 
                await page.goto("https://www.qoo10.com/gmkt.inc/My/OrderContractList.aspx");
                await new Promise((page) => setTimeout(page, 2000));
                await page.setViewport({width: 1920, height: 1080});
    
                await new Promise((page) => setTimeout(page, 5000));
    
                // ID/PW 입력하기
                await page.waitForSelector('#login_id');

                // ID/PW 입력칸 빈칸으로 초기화
                await page.evaluate(()=>{
                    document.querySelector('#login_id').value = '';
                    document.querySelector('#passwd').value = '';
                });
                await page.type('#login_id', combo[0], {delay: 100});
                await page.waitForSelector('#passwd');
                await page.type('#passwd', combo[1], {delay: 100});
    
                // 캡챠 이미지 URL 추출
                const imgSrc = await page.evaluate(async () => {
                    const img = document.querySelector('#qcaptcha_img');
                    return img.src;
                }); 

                // 2captcha 를 이용해 캡챠 풀기
                client = new Client('479e6979ef2dc19082f5728d4aef968d', {
                    timeout: 600000,
                    polling: 10000,
                    throwErrors: false});
    
                let resultText = '';
    
                
                await client.decode({
                    url: imgSrc
                }).then(function(response) {
                    resultText = response.text;
                })

                console.log(`${combo[0]} : captcha completed`);
    
                // 캡챠 결과 입력 후 로그인 버튼 클릭
                await page.click('#recaptcha_response_field');
                await page.type('#recaptcha_response_field', resultText, {delay: 100});
               
    
    
                // original
                // await page.waitForSelector('.btn_sign');
                // await page.click('.btn_sign');
                // await page.waitForSelector('.btn_sign');
                // await page.click('.btn_sign');

                await page.evaluate(()=>{
                    document.querySelector('.btn_sign').click();
                })

                new Promise((page) => setTimeout(page, 5000));

                // 주문내역 카테고리 전용 셀렉터 확인 절차
                await page.waitForSelector('.my-nav__head', {timeout: 5000});

                console.log(`url : ${page.url()}`);
                // if (page.url() !== "https://www.qoo10.com/gmkt.inc/MyCoupon/MyCouponList.aspx?global_order_type=L") {
                                       https://www.qoo10.com/gmkt.inc/MyCoupon/MyCouponList.aspx?global_order_type=L
                //     throw new Error('captcha is wrong.');
                // }

                flag = false;
            }

            catch (error) {
                console.log(error);
                console.log(`${combo[0]} : maybe this gets strumbled or failed to pass captcha. trying again...`);
            }
        }
        
        // await page.waitForNavigation();
        // await page.goto('https://www.qoo10.com/gmkt.inc/MyCoupon/MyCouponList.aspx?global_order_type=L');


        // 로직 시작 


        // 배송 시작한 송장 주소 따오기
        const songjangs = await page.evaluate(() => {
            let songjangs = []
            const orders = document.querySelectorAll('.button--point');
            for (let order of orders) {
                /// 상품별 배송현황 URL 추출
                const onclick = order.onclick.toString();
                songjangs.push(onclick.match(/https:\/\/\S+/)[0].slice(0,-2));
            }
            return songjangs;
        })

        // 배송중인 상품 상세링크 배열을 specific_pages 라는 변수에 추가하는 로직  
        const specific_pages = await page.evaluate(() => {
            const pages = Object.values(document.querySelectorAll('.item__status'));
            let shipping_pages = pages.map((page) => page.textContent.replace(/\t/g,'').replace(/\n/g, '') === "배송중" ||
            page.textContent.replace(/\t/g,'').replace(/\n/g, '') === "Shipping on delivery");
            // shipping_pages_indexes 는 배송중인 상품 노드 인덱스를 추출함. pages에 적용하면 됨 
            let shipping_pages_indexes = pages.map((page, idx) => page.textContent.replace(/\t/g,'').replace(/\n/g, '') === "배송중" || 
            page.textContent.replace(/\t/g,'').replace(/\n/g, '') === "Shipping on delivery" 
            ? idx : undefined);
            shipping_pages_indexes = shipping_pages_indexes.filter((element) => element !== undefined);

            let specific_pages_hrefs = []

            for (let idx of shipping_pages_indexes) {
                const href = pages[idx].parentNode.querySelector('.item__link').href;
                specific_pages_hrefs.push(href);
            }

            return specific_pages_hrefs;
        });

        specific_pages.map(async (specific_page) => {
            try { 
                const newPage = await browser.newPage();
                // await newPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
                await newPage.goto(specific_page);
                await page.waitForNavigation();

                // await page.setViewport({width: 1920, height: 1080});
                new Promise((page) => setTimeout(page, 5000));
                // await page.waitForSelector('#memo0');
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
                window.scrollBy(0, window.innerHeight);
                window.scrollBy(0, window.innerHeight);
                window.scrollBy(0, window.innerHeight);
                window.scrollBy(0, window.innerHeight);    
            })
            await page.waitForNavigation();
            await page.waitForSelector('#memo0');
            await page.setViewport({width: 1920, height: 1080});
            await page.evaluate(() => {
                console.log(document.querySelector('#memo0').textContent);
            })
        }
            
           
            



            catch(error) {
                console.log(`found an error on extracting nicknames : ${error}`);
            }
            // console.log(`번개장터 닉네임 : ${} `)
        })

        console.log(`배송중인 상품 상세링크: ${specific_pages}`);

        // return 0;
        new Promise((page) => setTimeout(page, 50000));



        // console.log(songjangs);

        var takbae_status = '';

        let post_logs = [];

        // 송장 링크로 방문 후 송장 정보 가져오기
        for (let link of songjangs) {
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

        fs.writeFile(`${combo[0]}.txt`, post_logs.toString(), {encoding: 'utf8'}, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('File written successfully');
            }
          });

        // console.log(post_logs);
        // console.log(songjangs);


        return 0;

    }


// 될 때까지 간다!
for (let combo of jsonData)
    {   
        try {
            main(combo)
        }

        catch (error) {
            console.log(`retrying...  By: \n${error}`);
            main(combo)
        }

  }

  return 0;