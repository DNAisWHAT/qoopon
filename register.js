// const puppeteer = require('puppeteer')
// import puppeteer from "puppeteer";

// import nopecha from 'nopecha'
const { Configuration, NopeCHAApi } = require('nopecha');
const jsdom = require("jsdom");
const puppeteer = require('puppeteer');
const { JSDOM } = jsdom;



const ac = require("@antiadmin/anticaptchaofficial");
const fs = require('fs');

const Client = require('@infosimples/node_two_captcha');
const randomUseragent = require('random-useragent');
// Declare your client


// const Configuration = nopecha.Configuration;
// const NopeCHAApi = nopecha.NopeCHAApi;

// const combos = [
//     ['letill905@mbox.re', 'Zxcx!!8520'],
//     ['wineathi@fanclub.pm', 'Zxcx!!8520'],
//     ['atoptbut@hamham.uk', 'Zxcx!!8520'],
//     ['webinmyban@honeys.be', 'Zxcx!!8520'],
//     ['robfog39@quicksend.ch', ')wrLUg3nD9qFY2s'],
//     ['bangumme@moimoi.re', '+9hlOP4u)Gnd}Rn'],
//     ['key215@fuwa.be', 'w,j7Klej7_o'],
//     ['potrobget@exdonuts.com', 'xFhk1N9JX#+M'],
//     ['lotfitdie@eay.jp', '%3GQE5j&g&)5'],
//     ['oweing118@mirai.re', 'c8DAeQLmKOj^'],
//     ['bitusraw@owleyes.ch', 'TlL$H4VY'],
//     ['duedamkin@magim.be', 'TlL$H4VY'],
//     ['procryoak@mbox.re', 'TlL$H4VY'],
//     ['se1@kumli.racing','Zxcx!!8520'],
//     ['se2@kumli.racing','Zxcx!!8520'],
//     ['se3@kumli.racing','Zxcx!!8520'],
//     ['se4@kumli.racing','Zxcx!!8520'],
//     ['se5@kumli.racing','Zxcx!!8520'],
//     ['se2@copyhome.win','Zxcx!!8520'],
//     ['se3@copyhome.win','Zxcx!!8520'],
//     ['se6@copyhome.win','Zxcx!!8520'],

// ]

const combos = [
    ['se26@copyhome.win', 'Zxcx!!8520'],
    ['se27@copyhome.win', 'Zxcx!!8520'],
    // ['se3@copyhome.win', 'Zxcx!!8520'],
    // ['se4@copyhome.win', 'Zxcx!!8520'],
    // ['se5@copyhome.win', 'Zxcx!!8520'],
    
    // ['se21@kumli.racing', 'Zxcx!!8520'],
    // ['se22@kumli.racing', 'Zxcx!!8520'],
    // ['se23@kumli.racing', 'Zxcx!!8520'],
    // ['se24@kumli.racing', 'Zxcx!!8520'],
    // ['se25@kumli.racing', 'Zxcx!!8520'],
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
            await page.setUserAgent(randomUseragent.getRandom());
        
            // 큐텐 출석체크 페이지 이동

            // await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx');
            
            // 로그인 

            await page.goto("https://www.qoo10.com/gmkt.inc/Login/Login.aspx");
            await page.setViewport({width: 1920, height: 1080});

            await page.waitForSelector('#tab_simple_register');
            await page.click('#tab_simple_register');

            await new Promise((page) => setTimeout(page, 1000));

            // 커스텀 E-mail 사용 체크 
            await page.waitForSelector('#email_id_domain');
            await page.select('#email_id_domain', 'type email');

            // 커스텀 E-mail 입력
            await page.click('#email_id');
            await page.type('#email_id', combo[0], {delay: 10});
            await page.click('#btn_email_precheck');

            await new Promise((page) => setTimeout(page, 1000));
            
            // Name
            await page.type('#cust_nm', "somethingNew");

            // PW
            await page.type('#passwd1', combo[1]);

            // re-PW
            await page.type('#confirm_pwd', combo[1]);

            // YYYY-MM-DD
            await page.select('#reg_birth_year', '1997');
            await page.select('#reg_birth_month', '06');
            await page.select('#reg_birth_day', '11');
            
            // SEX
            await page.click('#gender_male');

            const imgSrc = await page.evaluate(async () => {
                const img = document.querySelector('#qcaptcha_img');
                return img.src;
            });

            // Login with Phone number?
            // Check private Information All
            await page.evaluate(() => {
                let phoneNumber = document.querySelector('#rdo_login_hp_no');
                phoneNumber.click();
                let information = document.querySelector('#chk_all');
                information.click();
            });

            // captcha Solving
            client = new Client('479e6979ef2dc19082f5728d4aef968d', {
                timeout: 60000,
                polling: 5000,
                throwErrors: false});

            resultText = '';

            await client.decode({
                url: imgSrc
            }).then(function(response) {
                resultText = response.text;
                console.log(`2captcha solving : ${response.text}`);
            })

            await page.waitForSelector('#recaptcha_response_field');
            await page.click("#recaptcha_response_field");
            await page.type("#recaptcha_response_field", resultText, {delay: 1000});
            // await new Promise((page) => setTimeout(page, 5000));

            // Click Register Button
            page.evaluate(() => {
                let btn_sign = document.querySelector('#dv_register > fieldset > button');
                btn_sign.click();
            })

            console.log(`${combo[0]}: done!`)

            new Promise((page) => setTimeout(page, 100000));

        })();
}