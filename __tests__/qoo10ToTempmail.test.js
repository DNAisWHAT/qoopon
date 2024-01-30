// const login = require('../src/login');

describe('Login', () => {
    beforeAll(async () => {

    });

    beforeEach(async () => {
        jest.setTimeout(600000);
        const puppeteer = require('puppeteer-extra');
        const StealthPlugin = require('puppeteer-extra-plugin-stealth');
        puppeteer.use(StealthPlugin());
        const fs = require('fs');
        const Client = require('@infosimples/node_two_captcha');
/*         const configuration = new Configuration({
            apiKey: 'smhff9hf1gayxjxt',
        });
        const nopecha = new NopeCHAApi(configuration);
 */
        const browser = await puppeteer.launch({
            // product: 'firefox',
            headless: false
        }) 

        const page = await browser.newPage();

        let flag = true;

        while(flag) {

            try {

                await page.goto("https://www.qoo10.com/gmkt.inc/Event/qchance.aspx");
                await page.setViewport({width: 1920, height: 1080});
                await new Promise((page) => setTimeout(page, 5000));
                await page.waitForSelector('.lnk');
                await page.click('.lnk');
                await new Promise((page) => setTimeout(page, 10000));
    
                // await page.goto("https://www.qoo10.com/gmkt.inc/Login/Login.aspx");
    
                // Set screen size
    
                // ID/PW 입력하기
                await page.waitForSelector('#login_id');
                await page.evaluate(()=>{
                    document.querySelector('#login_id').value = '';
                    document.querySelector('#passwd').value = '';
                })
                await page.type('#login_id', 'se14@copyhome.win', {delay: 10});
                await page.waitForSelector('#passwd');
                await page.type('#passwd', 'Zxcx!!852020', {delay: 10});
    
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
    
    
                // console.log(`captcha result is : ${resultText}`);
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
    });

    it('does it distinguish if current page is verification page or not?', async () => {
        await page.goto();
        const URL = await page.url();
        console.log(URL);
        console.log(URL.match(/https:\/\/www.qoo10\.(com|sg)\/gmkt\.inc\/.*enc_cust_no=.*/));
        expect(URL).toMatch(/https:\/\/www.qoo10\.(com|sg)\/gmkt\.inc\/.*enc_cust_no=.*/); 
    });

    /* it('does it extract phone number?');
    it('does it crawl verification number?');
    it('does it type something?'); */
});

/* describe('Enter to Temp-mail website', () => {
    
});

describe('get Phone Number from my Info page', () => {
    
}); */