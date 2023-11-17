
//  이 코드는 로그인하여 룰렛을 손수 돌려주는 코드입니다.
/// login.js         -> coupon_info.js          -> coupon_OCR.js
/// 로그인 후 룰렛 돌리기 -> 룰렛 돌린 계정 쿠폰 사진 찍기  -> 쿠폰 사진 텍스트 인식해서 계정별로 몇장 가지고 있는지 확인하기

const { Configuration, NopeCHAApi } = require('nopecha');
const jsdom = require("jsdom");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const { JSDOM } = jsdom;



const ac = require("@antiadmin/anticaptchaofficial");
const fs = require('fs');

const Client = require('@infosimples/node_two_captcha');

// Declare your client


// const Configuration = nopecha.Configuration;
// const NopeCHAApi = nopecha.NopeCHAApi;

const combos = [
    // ['letill905@mbox.re', 'Zxcx!!852020'],
    // ['wineathi@fanclub.pm', 'Zxcx!!852020'],
    // ['atoptbut@hamham.uk', 'Zxcx!!852020'],
    // ['webinmyban@honeys.be', 'Zxcx!!852020'],
    // ['robfog39@quicksend.ch', 'Zxcx!!852020'],
    // ['bangumme@moimoi.re', 'Zxcx!!852020'],
    // ['key215@fuwa.be', 'Zxcx!!852020'],
    // ['potrobget@exdonuts.com', 'Zxcx!!852020'],
    // ['lotfitdie@eay.jp', 'Zxcx!!852020'],
    // ['oweing118@mirai.re', 'Zxcx!!852020'],
    // ['bitusraw@owleyes.ch', 'Zxcx!!852020'],
    // ['duedamkin@magim.be', 'Zxcx!!852020'],
    // ['procryoak@mbox.re', 'Zxcx!!852020'],
    // ['se1@kumli.racing','Zxcx!!852020'],
    // ['se2@kumli.racing','Zxcx!!852020'],
    // ['se3@kumli.racing','Zxcx!!852020'],
    // ['se4@kumli.racing','Zxcx!!852020'],
    // ['se5@kumli.racing','Zxcx!!852020'],
    // ['se8@copyhome.win','Zxcx!!852020'],
    // ['se11@copyhome.win', 'Zxcx!!852020'],
    // ['se12@copyhome.win', 'Zxcx!!852020'],
    // ['se13@copyhome.win', 'Zxcx!!852020'],
    ['se14@copyhome.win', 'Zxcx!!852020'],
    // ['se15@copyhome.win', 'Zxcx!!852020'],
    // ['se16@copyhome.win', 'Zxcx!!852020'],
    // ['se17@copyhome.win', 'Zxcx!!852020'],
    // ['se18@copyhome.win', 'Zxcx!!852020'],
    // ['se19@copyhome.win', 'Zxcx!!852020'],
    // ['se20@copyhome.win', 'Zxcx!!852020'],
    // ['se21@copyhome.win', 'Zxcx!!852020'],
    // ['se23@copyhome.win', 'Zxcx!!852020'],
    // ['se24@copyhome.win', 'Zxcx!!852020'],
    // ['se25@copyhome.win', 'Zxcx!!852020'],

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

            const puppeteer = require('puppeteer-extra');
            const StealthPlugin = require('puppeteer-extra-plugin-stealth');
            puppeteer.use(StealthPlugin());
            const fs = require('fs');
            const Client = require('@infosimples/node_two_captcha');
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
            // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
        
            // 큐텐 출석체크 페이지 이동

            // await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx');
            
            // 로그인 
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

            try {
                new Promise((page) => setTimeout(page, 5000)); // 리다이렉트 기다리기
                await page.waitForSelector('.mcf_ntc'); // 로그인 보안 인증 페이지인지 셀렉터로 확인하는 로직
            }
            
            catch(error) {
                console.log('Maybe this account is free by someone.');
                await browser.close();
            }

            await page.click('#btn_send_email');
  
            // #?.2. 인증메일 발송 후 Enter 키를 눌러 이메일을 확인한다.
            await page.keyboard.press('Enter');
                // TO-DO : 이 로직이 맞는지 다시 한번 확인하자 : 작성 완료 / 테스트 확인 완료 

            const email_verification_page = await browser.newPage();

            await email_verification_page.goto('https://ruu.kr');
            await email_verification_page.waitForSelector('#id');
            await email_verification_page.type('#id', combo[0].match(/^[^@]+/)); // emails[0]은 이메일의 예시 중 하나임
            
            await email_verification_page.select('#domain', 'copyhome.win');
            // #?.4. 조회 버튼을 누르고 가장 최근의 메일을 선택한다.
              // TO-DO : 이 로직이 맞는지 다시 한번 확인하자 : 작성 완료 / 테스트 대기 중
            new Promise((email_verification_page) => setTimeout(email_verification_page, 5000));
            // await email_verification_page.waitForSelector('#mailList');
            await email_verification_page.click('#mailList');
            new Promise((email_verification_page) => setTimeout(email_verification_page, 3000));
            const emailLink = await page.evaluate(() => {
              const mails = document.querySelectorAll('#mail');
              console.log(`mails : ${mails}`);
              const mail_body = mails[0].childNodes[1].childNodes[5];
              const tr = mail_body.getElementsByTagName('tr');
              console.log(`tr : ${tr}`);
            //   return tr[0]; // 최신 이메일 클릭
               tr[0].getElementsByTagName('td')[2].click(); // 최신 이메일 클릭
              new Promise((page) => setTimeout(page, 5000));
              const link_tr = document.getElementsByTagName('tr')[7]; 
              
              return link_tr.childNodes[1].childNodes[2].textContent; // 링크 주소 반환  
            });

            // .getElementsByTagName('td')[2].click();


            console.log(emailLink);
            await new Promise((page) => setTimeout(page, 5000000));
            

            // 새 페이지 이동했을 거임. 만약 인증 페이지라면
            // #1. 인증 페이지인지 확인한다.
            // page.url() 과 인증 페이지 도메인을 비교한다.
            // #?. 만약 맞다면 인증 페이지에서 이메일 인증을 하러 간다.
                // #?.1. 인증메일 발송 버튼을 클릭한다. 
                // #?.2. selector : #btn_send_email -> page.keyboard.press('enter');
                // #?.3. goto 메서드로 ruu.kr 로 접속해 이메일 인풋 창에 이메일을 넣고 기다린다. 
                // #?.4. 조회 버튼을 누르고 가장 최근의 메일을 누른다.
                // #?.5. 거기서 링크를 추출하고 접속한다.
                // #?.6. 창을 닫는다.
                // #?.7. 다시 돌아가서 비밀번호를 변경한다. 만약 국룰이면 국룰 변형 문자로 바꾸기 등....
                // #?.7. 바로 여기를 들어간다. https://www.qoo10.com/gmkt.inc/Event/CheckMobileConfirmation.aspx?confirm_type=C&next_url=https://m.qoo10.com/gmkt.inc/My/EditMember.aspx
                // #??   상세 정보 페이지(https://www.qoo10.com/gmkt.inc/My/EditMember.aspx) 비밀번호로 통과한 뒤 인증번호를 받는다. page.click|type #input, page.click #btn_login
            // #2. 상세정보 페이지에서 휴대전화 번호를 추출한다. document.querySelectorAll('.btn_save')[4].click()
                // #2.1. 인증 페이지에서 인증번호 받기 버튼을 누른다.  
            // #3. 추출한 휴대전화 번호로 인증번호를 받아서 정보를 새로 가져온다. #hp_no1, #hp_no2, #hp_no3 에서 전화번호를 추출한다.
                // #3.1. 새로운 창을 열고 temp-number.com에서 추출한 휴대전화 번호를 쿼리스트링으로 붙인다.예) https://temp-number.com/temporary-numbers/United-States/12066578178/1
                // #3.2. 일정 시간 대기한 뒤 qoo10 문자에서 인증 번호 코드를 추출한다. document.querySelector('.direct-chat-info').childNodes 순회 하면서 qoo10이 들어간 문자를 찾고 regex로 인증번호를 추출한다.
                // #3.3. 추출한 인증번호를 입력한다. page.type #codeWithSeeFullId, page.click #btn_code_confirm
            


            new Promise((page) => setTimeout(page, 6000000));

})()}