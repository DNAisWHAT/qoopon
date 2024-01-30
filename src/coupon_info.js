
// 이 코드는 login.js의 종속성입니다. 계정별 쿠폰 현황을 사진으로 저장하는 코드입니다.
/// login.js         -> coupon_info.js          -> coupon_OCR.js
/// 로그인 후 룰렛 돌리기 -> 룰렛 돌린 계정 쿠폰 사진 찍기  -> 쿠폰 사진 텍스트 인식해서 계정별로 몇장 가지고 있는지 확인하기

const { Configuration, NopeCHAApi } = require('nopecha');
const jsdom = require("jsdom");
const puppeteer = require('puppeteer');
const { JSDOM } = jsdom;
// const { TimeoutError } = require('puppeteer/errors');


const ac = require("@antiadmin/anticaptchaofficial");
const fs = require('fs');

const Client = require('@infosimples/node_two_captcha');

// Declare your client


// const Configuration = nopecha.Configuration;
// const NopeCHAApi = nopecha.NopeCHAApi;

const combos = [
    ['letill905@mbox.re', 'Zxcx!!852020'],
    ['wineathi@fanclub.pm', 'Zxcx!!852020'],
    ['atoptbut@hamham.uk', 'Zxcx!!852020'],
    ['webinmyban@honeys.be', 'Zxcx!!852020'],
    ['robfog39@quicksend.ch', 'Zxcx!!852020'],
    ['bangumme@moimoi.re', 'Zxcx!!852020'],
    ['key215@fuwa.be', 'Zxcx!!852020'],
    ['potrobget@exdonuts.com', 'Zxcx!!852020'],
    ['lotfitdie@eay.jp', 'Zxcx!!852020'],
    ['oweing118@mirai.re', 'Zxcx!!852020'],
    ['bitusraw@owleyes.ch', 'Zxcx!!852020'],
    ['duedamkin@magim.be', 'Zxcx!!852020'],
    ['procryoak@mbox.re', 'Zxcx!!852020'],
    ['se1@kumli.racing','Zxcx!!852020'],
    ['se2@kumli.racing','Zxcx!!852020'],
    ['se3@kumli.racing','Zxcx!!852020'],
    ['se4@kumli.racing','Zxcx!!852020'],
    ['se5@kumli.racing','Zxcx!!852020'],
    ['se8@copyhome.win','Zxcx!!852020'],
    ['se11@copyhome.win', 'Zxcx!!852020'],
    ['se12@copyhome.win', 'Zxcx!!852020'],
    ['se13@copyhome.win', 'Zxcx!!852020'],
    ['se14@copyhome.win', 'Zxcx!!852020'],
    ['se15@copyhome.win', 'Zxcx!!852020'],
    ['se16@copyhome.win', 'Zxcx!!852020'],
    ['se17@copyhome.win', 'Zxcx!!852020'],
    ['se18@copyhome.win', 'Zxcx!!852020'],
    ['se19@copyhome.win', 'Zxcx!!852020'],
    ['se20@copyhome.win', 'Zxcx!!852020'],
    ['se21@copyhome.win', 'Zxcx!!852020'],
    ['se23@copyhome.win', 'Zxcx!!852020'],
    ['se24@copyhome.win', 'Zxcx!!852020'],
    ['se25@copyhome.win', 'Zxcx!!852020'],
]

const jsonFile = fs.readFileSync('../combos.json', 'utf8');
const jsonData = JSON.parse(jsonFile);

for (let combo of jsonData)
    {    (async () => {


            const configuration = new Configuration({
                apiKey: 'smhff9hf1gayxjxt',
            });
            const nopecha = new NopeCHAApi(configuration);

            const browser = await puppeteer.launch({
                // product: 'firefox',
                headless: true,
            }) 
            // Launch the browser and open a new blank page
            // const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

            let flag = true;

            while (flag) {
                try {
                    await page.goto("https://www.qoo10.com/gmkt.inc/Login/PopupLogin.aspx?nextUrl=https%3a%2f%2fwww.qoo10.com%2fgmkt.inc%2fMyCoupon%2fMyCouponList.aspx%3fglobal_order_type%3dL");
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
                    
                    await page.waitForSelector('#coupon_list_title', {timeout: 5000});

                    console.log(`url : ${page.url()}`);
                    // if (page.url() !== "https://www.qoo10.com/gmkt.inc/MyCoupon/MyCouponList.aspx?global_order_type=L") {
                                           https://www.qoo10.com/gmkt.inc/MyCoupon/MyCouponList.aspx?global_order_type=L
                    //     throw new Error('captcha is wrong.');
                    // }

                    flag = false;
                }

                catch (error) {
                    console.log(`${combo[0]} : maybe this gets strumbled or failed to pass captcha. trying again...`);
                }
            }

           
            // 쿠폰 페이지 이동 확인 
                // try {
                //     await page.waitForSelector('#coupon_list_title', {timeout: 5000});
                // }
                
                // catch (error) {
                //     console.log(`current page : ${page.url()}\n${combo[0]} : not found coupon selector!`);
                // }


            // 스크린샷 캡쳐 
            var today = new Date();
            var year = today.getFullYear();
            var month = ('0' + (today.getMonth() + 1)).slice(-2);
            var day = ('0' + today.getDate()).slice(-2);
            var dateString = year + '-' + month + '-' + day;
            await page.setViewport({width: 1920, height: 1080});
            await page.screenshot({path: `../coupons/${combo[0]}_${dateString}.jpg`});
            console.log(`${combo[0]} done.`);
            browser.close();
        })();
}



// let coupons = fs.readdirSync('./coupons_db');
// combos.shift();
// console.log(combos);
// // console.log(`combos : ${combos}`);
// // return 0;
// var today = new Date();
// var year = today.getFullYear();
// var month = ('0' + (today.getMonth() + 1)).slice(-2);
// var day = ('0' + today.getDate()).slice(-2);
// var dateString = year + '-' + month + '-' + day;
// let ranking = []

// function main()
// {
//     Promise.all(coupons.map(async (coupon) => {
//         const worker = await tesseract.createWorker('eng');
//         const ret = await worker.recognize(`./coupons_db/${coupon}`);
//         const coupon_text = ret.data.text;
//         let thirty = coupon_text.match(/6,630/g)?.length;
//         if (thirty === undefined) {
//           thirty = 0;
//         }
//         obj = {};
//         obj['name'] = coupon;
//         obj['30%'] = thirty;
//         ranking.push(obj);
//         await worker.terminate();
//       })).then(() => {
//         console.log(ranking);
//       }).catch((error) => {
//         console.error('Error:', error);
//       }).then(() => {
//         fs.writeFile(`${dateString}_coupon list.txt`, JSON.stringify(ranking), (err) => {
//             if (err) throw err;
//             console.log('The file has been saved!');
//         });
//       }
//       )
// }

// main();