
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
    ['letill905@mbox.re', 'Zxcx!!8520'],
    ['wineathi@fanclub.pm', 'Zxcx!!8520'],
    ['atoptbut@hamham.uk', 'Zxcx!!8520'],
    ['webinmyban@honeys.be', 'Zxcx!!8520'],
    ['robfog39@quicksend.ch', ')wrLUg3nD9qFY2s'],
    ['bangumme@moimoi.re', '+9hlOP4u)Gnd}Rn'],
    ['key215@fuwa.be', 'w,j7Klej7_o'],
    ['potrobget@exdonuts.com', 'xFhk1N9JX#+M'],
    ['lotfitdie@eay.jp', '%3GQE5j&g&)5'],
    ['oweing118@mirai.re', 'c8DAeQLmKOj^'],
    ['bitusraw@owleyes.ch', 'TlL$H4VY'],
    ['duedamkin@magim.be', 'TlL$H4VY'],
    ['procryoak@mbox.re', 'TlL$H4VY'],
    ['se1@kumli.racing','Zxcx!!8520'],
    ['se2@kumli.racing','Zxcx!!8520'],
    ['se3@kumli.racing','Zxcx!!8520'],
    ['se4@kumli.racing','Zxcx!!8520'],
    ['se5@kumli.racing','Zxcx!!8520'],
    ['se8@copyhome.win','Zxcx!!8520'],
    ['se11@copyhome.win', 'Zxcx!!8520'],
    ['se12@copyhome.win', 'Zxcx!!8520'],
    ['se13@copyhome.win', 'Zxcx!!8520'],
    ['se14@copyhome.win', 'Zxcx!!8520'],
    ['se15@copyhome.win', 'Zxcx!!8520'],
    ['se16@copyhome.win', 'Zxcx!!8520'],
    ['se17@copyhome.win', 'Zxcx!!8520'],
    ['se18@copyhome.win', 'Zxcx!!8520'],
    ['se19@copyhome.win', 'Zxcx!!8520'],
    ['se20@copyhome.win', 'Zxcx!!8520'],
    ['se21@copyhome.win', 'Zxcx!!8520'],
    ['se23@copyhome.win', 'Zxcx!!8520'],
    ['se24@copyhome.win', 'Zxcx!!8520'],
    ['se25@copyhome.win', 'Zxcx!!8520'],

    // ['crazyfarmer@kakao.com','zxcx8520'],
    // ['nws7114@gmail.com','zxcx!!8520'],
    // ['se2@copyhome.win','zxcx!!8520'],
    // ['se3@copyhome.win','zxcx!!8520'],
    // ['se6@copyhome.win','zxcx!!8520'],
    // ['se8@copyhome.win','Zxcx!!8520'],
    // ['se11@copyhome.win', 'Zxcx!!8520'],
    // ['se12@copyhome.win', 'Zxcx!!8520'],
    // ['se17@copyhome.win', 'Zxcx!!8520'],
    // ['se21@copyhome.win', 'Zxcx!!8520'],
]

for (let combo of combos)
    {    (async () => {

            const configuration = new Configuration({
                apiKey: 'smhff9hf1gayxjxt',
            });
            const nopecha = new NopeCHAApi(configuration);

            const browser = await puppeteer.launch({
                // product: 'firefox',
                headless: false
            }) 
            // Launch the browser and open a new blank page
            // const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
        
            // 큐텐 출석체크 페이지 이동

            // await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx');
            
            // 로그인 
            let flag = true;

            while(flag) {
                try {
                    await page.goto("https://www.qoo10.com/gmkt.inc/Event/qchance.aspx");
                    await page.setViewport({width: 1920, height: 1080});
                    await new Promise((page) => setTimeout(page, 2000));
                    await page.waitForSelector('.lnk');
                    await page.click('.lnk');
                    await new Promise((page) => setTimeout(page, 2000));
        
                    // await page.goto("https://www.qoo10.com/gmkt.inc/Login/Login.aspx");
        
                    // Set screen size
        
                    // ID/PW 입력하기
                    await page.waitForSelector('#login_id');
                    await page.evaluate(()=>{
                        document.querySelector('#login_id').value = '';
                        document.querySelector('#passwd').value = '';
                    })
                    await page.type('#login_id', combo[0], {delay: 10});
                    await page.waitForSelector('#passwd');
                    await page.type('#passwd', combo[1], {delay: 10});
        
                    const imgSrc = await page.evaluate(async () => {
                        const img = document.querySelector('#qcaptcha_img');
                        return img.src;
                    }); 
                    console.log(`captcha src result is : ${imgSrc}`);
        
                    // 2captcha
                    client = new Client('479e6979ef2dc19082f5728d4aef968d', {
                        timeout: 600000,
                        polling: 5000,
                        throwErrors: false});
        
                    let resultText = '';
        
                    
                    await client.decode({
                        url: imgSrc
                    }).then(function(response) {
                        resultText = response.text;
                        console.log(`2captcha solving : ${response.text}`);
                    })
        
        
                    console.log(`captcha result is : ${resultText}`);
                    // await new Promise((page) => setTimeout(page, 3500));
                    
                    // 캡챠 결과 입력 후 로그인 버튼 클릭
                    await page.waitForSelector('#recaptcha_response_field');
                    await page.click('#recaptcha_response_field');
                    await page.type('#recaptcha_response_field', resultText, {delay: 1000});
                    // await new Promise((page) => setTimeout(page, 1000));
        
                    new Promise((page) => setTimeout(page, 5000));
        
                    // original
                    await page.waitForSelector('.btn_sign');
                    await page.click('.btn_sign');
        
                    flag = false;
                    
                    
                }

                catch (error) {

                }
            }
            new Promise((page) => setTimeout(page, 6000000));

})()}