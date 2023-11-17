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
const { register } = require('module');

// Declare your client


// const Configuration = nopecha.Configuration;
// const NopeCHAApi = nopecha.NopeCHAApi;

const combos = [
    ['horizon71@ruu.kr', 'Zxcx!!8520'],
    ['horizon72@ruu.kr', 'Zxcx!!8520'],
    ['horizon73@ruu.kr', 'Zxcx!!8520'],
    ['horizon74@ruu.kr', 'Zxcx!!8520'],
    ['horizon75@ruu.kr', 'Zxcx!!8520'],
    ['horizon76@ruu.kr', 'Zxcx!!8520'],
    ['horizon77@ruu.kr', 'Zxcx!!8520'],
    ['horizon78@ruu.kr', 'Zxcx!!8520'],
    ['horizon79@ruu.kr', 'Zxcx!!8520'],
    ['horizon80@ruu.kr', 'Zxcx!!8520'],
    ['horizon81@ruu.kr', 'Zxcx!!8520'],
    ['horizon82@ruu.kr', 'Zxcx!!8520'],
    ['horizon83@ruu.kr', 'Zxcx!!8520'],
    ['horizon84@ruu.kr', 'Zxcx!!8520'],
    ['horizon85@ruu.kr', 'Zxcx!!8520'],
    ['horizon86@ruu.kr', 'Zxcx!!8520'],
    ['horizon87@ruu.kr', 'Zxcx!!8520'],
    ['horizon88@ruu.kr', 'Zxcx!!8520'],
    ['horizon89@ruu.kr', 'Zxcx!!8520'],
    ['horizon90@ruu.kr', 'Zxcx!!8520'],
    ['horizon91@ruu.kr', 'Zxcx!!8520'],
    ['horizon92@ruu.kr', 'Zxcx!!8520'],
    ['horizon93@ruu.kr', 'Zxcx!!8520'],
    ['horizon94@ruu.kr', 'Zxcx!!8520'],
    ['horizon95@ruu.kr', 'Zxcx!!8520'],
    ['horizon96@ruu.kr', 'Zxcx!!8520'],
    ['horizon97@ruu.kr', 'Zxcx!!8520'],
    ['horizon98@ruu.kr', 'Zxcx!!8520'],
    ['horizon99@ruu.kr', 'Zxcx!!8520'],
    ['horizon100@ruu.kr', 'Zxcx!!8520'],

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
    // ['se2@copyhome.win','Zxcx!!8520'],
    // ['se3@copyhome.win','Zxcx!!8520'],
    // ['se6@copyhome.win','Zxcx!!8520'],
]

for (let combo of combos)
    {    (async () => {


            const configuration = new Configuration({
                apiKey: 'smhff9hf1gayxjxt',
            });
            const nopecha = new NopeCHAApi(configuration);

            const browser = await puppeteer.launch({
                // product: 'firefox',
                headless: false,
            }) 
            // Launch the browser and open a new blank page
            // const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
        
            // 큐텐 출석체크 페이지 이동

            // await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx');
            
            // 로그인 

            await page.goto("https://member.qoo10.jp/pc/login");
            await page.setViewport({width: 1920, height: 1080});

            // 알림 배너 클릭
            await new Promise((page) => setTimeout(page, 20000));
            await page.click('.aiq-MLWa4b');

            await new Promise((page) => setTimeout(page, 10000));

            await page.evaluate(() => {
                // const register_tab = '#wrap-header > nav.h-10.w-full.flex-none.bg-\[\#517fef\] > ul > li:nth-child(2) > a'
                document.querySelectorAll('.leading-10')[1].click();
                // document.querySelector(register_tab).click();
            })

            await new Promise((page) => setTimeout(page, 3000));

            // await page.goto("https://www.qoo10.com/gmkt.inc/Login/Login.aspx");

            // Set screen size

            // ID/PW 입력하기
            await page.waitForSelector('#join-email');
            await page.type('#join-email', combo[0], {delay: 10});
            await page.waitForSelector('#join-password');
            await page.type('#join-password', combo[1], {delay: 10});
            await page.waitForSelector('#join-passwordchk');
            await page.type('#join-passwordchk', combo[1], {delay: 10});

            // 이름 및 후리가나 입력
            //// 이름
            await page.type('#join-name', 'somethingPlayful');
            //// 후리가나
            await page.type('#join-name1', 'something');
            await page.type('#join-name2', 'playful');

            // 라디오버튼 체크
            await page.evaluate(() => {
                const sex = document.querySelector('#join-sex0'); // 얘다!
                sex.click();
                const newsLetter = document.querySelector('#join-phoneauth1');
                newsLetter.click();
                const privacy = document.querySelector('#join-newsletter');
                privacy.click();
                document.querySelectorAll('.text-center')[3].click(); //이메일 인증
            })
            // DOM 이미지 주소 접근 및 캡챠 풀기
            // const dom = new JSDOM({url: 'https://www.qoo10.com/gmkt.inc/Login/Login.aspx',
            //                           contentType: "text/html",
            //                           includeNodeLocations: true,
            //                           storageQuota: 10000000});



            const imgSrc = await page.evaluate(async () => {
                const img = document.querySelector('.object-contain');
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

            
            // const dom = await JSDOM.fromURL('https://www.qoo10.com/gmkt.inc/Login/Login.aspx');
            
            // const img_url = dom.window.document.querySelector('#qcaptcha_img').src

            // text = await nopecha.solveRecognition({
            //     type: 'textcaptcha',
            //     image_urls: [imgSrc],
            // });

            // await new Promise((page) => setTimeout(page, 1000));

            console.log(`captcha result is : ${resultText}`);
            // await new Promise((page) => setTimeout(page, 3500));
            
            // 캡챠 결과 입력 후 로그인 버튼 클릭
            await page.waitForSelector('#input-captcha');
            await page.click('#input-captcha');
            await page.type('#input-captcha', resultText);

            new Promise((page) => setTimeout(page, 60000));
            await page.evaluate(() => {
                document.querySelectorAll('.font-bold')[1].click(); // 양식 작성 완료 
            })


            console.log(`${combo} : done!`);

            // await page.waitForSelector(clickClassSelector);
            new Promise((page) => setTimeout(page, 6000000));

            // await page.waitForSelector('#td_today');
            // await page.click('#td_today');

            // 이벤트 룰렛 페이지 접근
            // await page.goto("https://www.qoo10.com/gmkt.inc/Event/qchance.aspx");
            // await page.waitForSelector('.btn_sign');
            // await page.click('.click > a');
            // document.querySelector('#today_click');
            // 로그인 창 폼 채우기

            // const idSelector = '#login_id'
            // const pwSelector = '#passwd'
            // await page.waitForSelector(idSelector);
            // await page.type(idSelector, combo[0]);

            // await page.waitForSelector(pwSelector);
            // await page.type(idSelector, combo[1]);
        
            // 캡챠 클릭하고 로그인 버튼 누르기
            
            

            // 다시 출석카드 버튼 누르고 확인 버튼 누르기
            // await page.click('.click')
            // await page.waitForSelector('.btn btn--submit')
            // await page.click('.btn btn--submit')

            // 종료하기
            // await browser.close();

            // // Locate the full title with a unique string
            // const textSelector = await page.waitForSelector(
            //   'text/Customize and automate'
            // );
            // const fullTitle = await textSelector?.evaluate(el => el.textContent);
        
            // // Print the full title
            // console.log('The title of this blog post is "%s".', fullTitle);
        })();
}