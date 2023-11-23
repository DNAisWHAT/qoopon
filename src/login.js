
//  이 코드는 로그인하여 룰렛을 손수 돌려주는 코드입니다.
/// login.js         -> coupon_info.js          -> coupon_OCR.js
/// 로그인 후 룰렛 돌리기 -> 룰렛 돌린 계정 쿠폰 사진 찍기  -> 쿠폰 사진 텍스트 인식해서 계정별로 몇장 가지고 있는지 확인하기

const { Configuration, NopeCHAApi } = require('nopecha');
const jsdom = require("jsdom");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');

const jsonFile = fs.readFileSync('../combos.json', 'utf8');
const jsonData = JSON.parse(jsonFile);

for (let combo of jsonData) {
    console.log(`result : ${combo[0]}, ${combo[1]} type : ${typeof(combo)}`);
}

console.log(jsonData);

const { JSDOM } = jsdom;

const ac = require("@antiadmin/anticaptchaofficial");

const Client = require('@infosimples/node_two_captcha');

var userAgent = require('user-agents');

for (let combo of jsonData)
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
                headless: false,
                // args: ['--auto-open-devtools-for-tabs']
                // targetFilter: (target) => !!target.url()

            }) 
            // Launch the browser and open a new blank page
            // const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            // await page.setUserAgent(userAgent.random().toString());
            // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
        
            // 큐텐 출석체크 페이지 이동

            // await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx');
            
            // 로그인 
            let flag = true;

            // init.
            await page.goto("https://www.qoo10.com/gmkt.inc/Event/qchance.aspx", { waitUntil: "networkidle0" });
            try {
                await page.setViewport({width: 1920, height: 1080});
                await page.waitForSelector('.lnk');
                await page.click('.lnk');
                await new Promise((page) => setTimeout(page, 3000));
            }
            

            catch (error) {
                console.log(error);
            }

            while(flag) {

                try {        

                    // ID, PW 입력 
                    await page.evaluate(()=>{
                        document.querySelector('#login_id').value = '';
                        document.querySelector('#passwd').value = '';
                    })
                    await page.type('#login_id', combo[0], {delay: 10});
                    await page.waitForSelector('#passwd');
                    await page.type('#passwd', combo[1], {delay: 10});
                    
                    // Captcha 주소 추출
                    const imgSrc = await page.evaluate(async () => {
                        const img = document.querySelector('#qcaptcha_img');
                        return img.src;
                    }); 

                    // Captcha Solving
                    client = new Client('479e6979ef2dc19082f5728d4aef968d', {
                        timeout: 600000,
                        polling: 5000,
                        throwErrors: false});
        
                    let resultText = '';

                    await client.decode({
                        url: imgSrc
                    }).then(function(response) {
                        resultText = response.text;
                        // console.log(`2captcha solving : ${response.text}`);
                    })
        
                    // 캡챠 결과 입력 후 로그인 버튼 클릭
                    await page.waitForSelector('#recaptcha_response_field');
                    await page.click('#recaptcha_response_field');
                    await page.type('#recaptcha_response_field', resultText, {delay: 100});

                    // original
                    await page.waitForSelector('.btn_sign');
                    await page.click('.btn_sign');
                    await page.waitForNavigation(); // 어쨌든 리다이렉트 되기를 기다리는 중...
        
                    if (page.url() !== 'https://www.qoo10.com/gmkt.inc/Event/qchance.aspx')
                    {
                        throw new Error('redirection error');
                    }

                    flag = false;
                    
                    
                }

                catch (error) {

                }
            }

            // 로그인 버튼을 누른 후...

            try {

                // new Promise((page) => setTimeout(page, 5000)); 
                // 추가로 리다이렉트 기다리기. 위 코드가 안되는 경우 풀어 사용해보자

            /* 만약 제대로 리다이렉트 됐을 때 URL 체킹을 해서 정상적으로 로그인이 됐다? 일단 상세정보 페이지로 이동하자.
             그리고 휴대폰 인증 카테고리로 가서 인증인지 미인증인지 먼저 확인한다
            상세 정보 페이지 : https://www.qoo10.com/gmkt.inc/My/EditMember.aspx
            휴대폰 인증 페이지 : https://www.qoo10.com/gmkt.inc/Event/CheckMobileConfirmation.aspx?confirm_type=C&next_url=https://m.qoo10.com/gmkt.inc/My/EditMember.aspx
            evaluate() => span .txt_cnfm의 값이 '인증 완료'인지 아닌지를 체크해서, 인증이 필요한 경우 휴대폰 인증 웹사이트를 가서 인증번호를 받도록 하자.
            그 이후는 내가 직접 휴대폰 인증도 하고 리다이렉트도 하도록 하자. */
            
            // TO-DO : 상세정보 페이지를 goto()로 바로 들어갈 수 있는지부터 체크해보자. 그게 안된다면 비밀번호를 입력해서 리다이렉트하도록 하자.
            if(page.url() === 'https://www.qoo10.com/gmkt.inc/Event/qchance.aspx')
                    {
                        const  INFO_URL = 'https://www.qoo10.com/gmkt.inc/My/CheckPasswd.aspx';
                        const PHONE_URL = 'https://www.qoo10.com/gmkt.inc/Event/CheckMobileConfirmation.aspx?confirm_type=C&next_url=https://m.qoo10.com/gmkt.inc/My/EditMember.aspx';
                        
                        // 일단 상세정보 페이지로 이동하고 웹페이지가 어떻게 돼있는지 확인한다.
                        await page.goto(INFO_URL, {waitUntil :'networkidle0'});
                        // await page.waitForNavigation({waitUntil: 'load'});
                        // await new Promise((page) => setTimeout(page, 500000));

                        // 상세페이지에서 로그인이 필요하면 로그인하기                        
                        try {
                          await page.waitForSelector('.input', {timeout: 3000});
                          if (combo[1] === 'Zxcx!!852020')
                            {await page.evaluate(() => {
                                document.querySelector('.input').value = 'Zxcx!!852020';
                                document.querySelector('.btn_login').click();
                            })}

                            else
                            {await page.evaluate(() => {
                                document.querySelector('.input').value = 'Zxcx!!8520';
                                document.querySelector('.btn_login').click();
                            })}
                            await page.waitForNavigation({timeout : 5000, });
                            console.log('Logically I am getting into the INFO_URL.');
                            }
                        // 상세페이지에서 로그인이 필요하면 로그인하기 에러 감지 
                        catch (error) {
                            console.log(`class_selector_not_found or couldnt_navigation_error\n${error}`);
                            await browser.close();
                            return 0;
                            }

                            

//              evaluate() => span .txt_cnfm의 값이 '인증 완료'인지 아닌지를 체크해서, 인증이 필요한 경우 휴대폰 인증 웹사이트를 가서 인증번호를 받도록 하자.
//                          .txt_wrn 셀렉터가 존재한다면 인증 미완료로 간주, NOT VERIFIED 반환하기 
                        //     var URL_flag = '';

                        let URL_flag = '';

                        try {
                            const text = await page.$eval('.txt_cnfm', element => element.textContent);
                            await page.waitForSelector('.txt_cnfm', {timeout: 10000});
                            URL_flag = 'VERIFIED';
                        } catch (error) {
                            const catch_text = await page.$eval('.txt_wrn', element => element.textContent);
                            console.log(`catch->try text : ${catch_text}`);
                            if (catch_text !== '*Confirmed') {
                                URL_flag = 'NOT VERIFIED';
                            }
                        }

                        console.log(URL_flag);

                        if (URL_flag === 'VERIFIED') {
                            await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx');
                            console.log(`${combo[0]} : now It is possible to round a roulette!`);
                            await new Promise((page) => setTimeout(page, 50000000));
                            console.log(`${combo[0]} : now It is possible to round a roulette!`);
                            await browser.close();
                        } else if (URL_flag === 'NOT VERIFIED') {
                            // 휴대폰 인증 로직
                            await page.goto(PHONE_URL, {waitUntil: 'load'});
                                // await page.waitForNavigation({timeout: 5000});
                                await page.evaluate(async () => {
                                    await document.querySelector('.bt_cnf').click();
                                    await document.querySelector('.btn').click();
                                    });

                                const phoneNumbers = await page.evaluate(() => {
                                        const hpNo1 = document.querySelector('#hp_no1').value;
                                        const hpNo2 = document.querySelector('#hp_no2').value;
                                        const hpNo3 = document.querySelector('#hp_no3').value;
                                        const hp = hpNo1 + hpNo2 + hpNo3;
                                        if (hp.length !== 10) {
                                            return hp;
                                        }
                                        return '1' + hp;
                                    });
    
                                const verificationURL = `https://temp-number.com/temporary-numbers/United-States/${phoneNumbers}/1`;
                                const PHONEnewPage = await browser.newPage();
                                await PHONEnewPage.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36");
                                await PHONEnewPage.goto(verificationURL, { waitUntil: "load", });
                                // await PHONEnewPage.waitForNavigation({ waitUntil: "networkidle0" });
                                console.log(`${combo[0]} : get a verification code and verificate it!`);
                                await new Promise((PHONEnewPage) => setTimeout(PHONEnewPage, 60000000));         
                                console.log(`${combo[0]} : get a verification code and verificate it!`);
                        }
                        //     try {
                        //     let try_text = await page.evaluate(async () => {
                        //         let text = await document.querySelector('.txt_cnfm').textContent;
                        //         return text;
                        //     })
                        //     await page.waitForSelector('.txt_cnfm', {timeout: 10000});
                        //         URL_flag = 'VERIFIED';
                        //     }

                        //     catch(error) {
   
                        //             let catch_text = await page.evaluate(async () => {
                        //                 let text = await document.querySelectorAll('.txt_wrn')[2].textContent;
                        //                 return text;
                        //             })
                        //         console.log(`catch->try text : ${catch_text}`);
                        //             // await page.waitForSelector('txt_wrn', {timeout: 10000});
                        //             if (catch_txt !== '*Confirmed')
                        //             URL_flag = 'NOT VERIFIED';
                        //     }
                        
                        // //  URL_flag = await page.evaluate(async () => {
                        // //     console.log(` 인증 텍스트 : ${document.querySelector('.txt_cnfm').textContent}`);
                        // //     if (document.querySelector('.txt_cnfm').textContent === '*인증 완료' || 
                        // //     document.querySelector('.txt_cnfm').textContent === '*confirmed')
                        // //     {
                        // //         return 'VERIFIED';
                        // //         /* await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx');
                        // //         console.log(`${combo[0]} : now It is possible to round a roulette!`);
                        // //         await new Promise((page) => setTimeout(page, 500000)); */
                        // //     }
                        // //     // 만약 미인증 이라면 인증 페이지 이동 및 로직 수행. 
                        // //     else 
                        // //     {
                        // //         // 인증 페이지 이동
                        // //        /*  await page.goto(PHONE_URL);
                        // //         await page.waitForNavigation({timeout: 5000});
                        // //         await page.evaluate(() => {
                        // //             document.querySelector('.bt_cnf').click();
                        // //             document.querySelector('.btn').click(); */
                        // //             return 'NOT VERIFIED';
                        // //     }
                        // // })

                        // console.log(URL_flag);

                        //     // 만약 휴대폰 인증 완료라면 룰렛 페이지 이동하고 로직 종료하기
                        //     if (URL_flag === 'VERIFIED') 
                        //     {
                        //         await page.goto('https://www.qoo10.com/gmkt.inc/Event/qchance.aspx');
                        //         console.log(`${combo[0]} : now It is possible to round a roulette!`);
                        //         await new Promise((page) => setTimeout(page, 50000000));
                        //         console.log(`${combo[0]} : now It is possible to round a roulette!`);
                        //         await browser.close();
                        //     }

                        //     // 그게 아니라면 인증 페이지로 이동한 다음 휴대폰 인증을 보내고 새 탭 열어서 휴대폰 인증 확인 가능한 웹페이지로 이동하기
                        //     else if (URL_flag === 'NOT VERIFIED')
                        //     {
                        //         await page.goto(PHONE_URL, {waitUntil: 'load'});
                        //         await page.waitForNavigation({timeout: 5000});
                        //         await page.evaluate(() => {
                        //             document.querySelector('.bt_cnf').click();
                        //             document.querySelector('.btn').click();
                        //             });

                        //         const phoneNumbers = await page.evaluate(() => {
                        //                 const hpNo1 = document.querySelector('#hp_no1').value;
                        //                 const hpNo2 = document.querySelector('#hp_no2').value;
                        //                 const hpNo3 = document.querySelector('#hp_no3').value;
                        //                 const hp = hpNo1 + hpNo2 + hpNo3;
                        //                 if (hp.length !== 10) {
                        //                     return hp;
                        //                 }
                        //                 return '1' + hp;
                        //             });
    
                        //         const verificationURL = `https://temp-number.com/temporary-numbers/United-States/${phoneNumbers}/1`;
                        //         const PHONEnewPage = await browser.newPage();
                        //         await PHONEnewPage.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36");
                        //         await PHONEnewPage.goto(verificationURL, { waitUntil: "load", });
                        //         // await PHONEnewPage.waitForNavigation({ waitUntil: "networkidle0" });
                        //         console.log(`${combo[0]} : get a verification code and verificate it!`);
                        //         await new Promise((PHONEnewPage) => setTimeout(PHONEnewPage, 60000000));         
                        //         console.log(`${combo[0]} : get a verification code and verificate it!`);
                        //     }

                            // 휴대폰 인증번호 발신 및 URL 쿼리스트링 추출 
                            
                };

                    // 만약 성공적으로 리다이렉트된 주소가 여기가 아니라면,,,  
                   /*  else {
                        console.log(`redirected page URL : ${page.url()}`);
                        await new Promise((page) => setTimeout(page, 500000));

                     } */
                            //  await page.waitForSelector('.mcf_ntc'); // 로그인 보안 인증 페이지인지 셀렉터로 확인하는 로직
            }
            
            catch(error) {
                     await new Promise((page) => setTimeout(page, 500000));
                     console.log(error);
                // console.log('Maybe this account is free by someone.');
                // await browser.close();
                        }

            // await page.click('#btn_send_email');
  
            await new Promise((page) => setTimeout(page, 50000000));

            const URL = await page.url();
            // #?.2. 인증메일 발송 후 Enter 키를 눌러 이메일을 확인한다.

                // TO-DO : 이 로직이 맞는지 다시 한번 확인하자 : 작성 완료 / 테스트 확인 완료 

            const email_verification_page = await browser.newPage();

            await email_verification_page.goto('https://ruu.kr', { waitUntil: "networkidle0" });
            await new Promise((email_verification_page) => setTimeout(email_verification_page, 500));
            await email_verification_page.waitForSelector('#id');
            await email_verification_page.type('#id', combo[0].match(/^[^@]+/)); // emails[0]은 이메일의 예시 중 하나임
            
            await email_verification_page.select('#domain', 'copyhome.win');
            // #?.4. 조회 버튼을 누르고 가장 최근의 메일을 선택한다.
              // TO-DO : 이 로직이 맞는지 다시 한번 확인하자 : 작성 완료 / 테스트 대기 중
            await new Promise((email_verification_page) => setTimeout(email_verification_page, 6000));
            // await email_verification_page.waitForSelector('#mailList');
            await email_verification_page.click('#mailList');

            // 이메일 인증 링크 받아오기
            const emailLink = await email_verification_page.evaluate(() => {
                const mails = document.querySelectorAll('#mail');
                mails[0].children[0].children[2].children[0].children[2].click();
                return new Promise((resolve) => {
                  setTimeout(() => {
                    const link_tr = document.getElementsByTagName('tr')[7];
                    resolve(link_tr.children[0].children[1].textContent);
                  }, 5000);
                });
              });

            // console.log(emailLink);

        try {
            await email_verification_page.goto(emailLink, {timeout : 1000});
        }

        catch (error) {

        }

        const new_page = await browser.newPage();
        await new_page.goto(URL, {timeout : 10000, waitUntil: "networkidle0" });
        // await new_page.waitForNavigation();
            // 인증 페이지 이동
            // await new Promise((email_verification_page) => setTimeout(email_verification_page, 5000));
                /* new_page.on('dialog', async dialog => {
                    await new_page.close();
                }); */




            // await page.click('#btn_next');

            // await new Promise((new_page) => setTimeout(new_page, 10000));

            // 만약 현재 비밀번호가 Zxcx!!8520 이면 -> Zxcx!!852020으로 바꿔라. 그 반대도 생각해라.
            // #old_pwd
            // #new_pwd
            // #new_pwd2
            // #btn_change <- 확인 버튼 클래스 셀렉터
            // 그 다음에는 await page.keyboard.press('Enter'); 를 사용해서 리다이렉트를 기다려야 함. 그래야 로그인 세션을 유지할 수 있음.

            new Promise((new_page) => setTimeout(new_page, 5000));
            // await new_page.waitForSelector('#old_pwd');

            let combos = JSON.parse(fs.readFileSync('../combos.json', 'utf8'));

            if (combo[1] === 'Zxcx!!852020') {
                await new_page.evaluate(() => {
                    document.querySelector('#old_pwd').value = 'Zxcx!!852020';
                    document.querySelector('#new_pwd').value = 'Zxcx!!8520';
                    document.querySelector('#new_pwd2').value = 'Zxcx!!8520';
                })
                combos = combos.map(item => {
                    if (item[0] === combo[0]) {
                        item[1] = 'Zxcx!!8520';
                    }
                    return item;
                });
            } else {
                await new_page.evaluate(() => {
                    document.querySelector('#old_pwd').value = 'Zxcx!!8520';
                    document.querySelector('#new_pwd').value = 'Zxcx!!852020';
                    document.querySelector('#new_pwd2').value = 'Zxcx!!852020';
                })
                combos = combos.map(item => {
                    if (item[0] === combo[0]) {
                        item[1] = 'Zxcx!!852020';
                    }
                    return item;
                });
            }
            fs.writeFileSync('../combos.json', JSON.stringify(combos, null, 2));
            

            new_page.click('#btn_change');
            console.log('clicked change PW button');

            new Promise((new_page) => setTimeout(new_page, 500000));

            // await page.

            //  new Promise((page) => setTimeout(page, 5000000));
            

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



            await new_page.goto('https://www.qoo10.com/gmkt.inc/Event/CheckMobileConfirmation.aspx?confirm_type=C&next_url=https://m.qoo10.com/gmkt.inc/My/EditMember.aspx', {timeout : 10000, waitUntil: "networkidle0" });
            new Promise((new_page) => setTimeout(new_page, 5000));
            await new_page.evaluate(() => {
                document.querySelector('.bt_cnf').click();
                document.querySelector('.btn').click();
              })

              const phoneNumbers = await new_page.evaluate(() => {
                const hpNo1 = document.querySelector('#hp_no1').value;
                const hpNo2 = document.querySelector('#hp_no2').value;
                const hpNo3 = document.querySelector('#hp_no3').value;
                    // TO-DO : 만약 자릿수가 11자리다 == 앞에 1이 있다 => 그냥 값을 반환해라 : 작성 완료 / 테스트 대기 중
                const hp = hpNo1 + hpNo2 + hpNo3;
                if (hp.length !== 10) {
                    return hp;
                }
                return '1' + hp;
              });
              const verificationUrl = `https://temp-number.com/temporary-numbers/United-States/${phoneNumbers}/1`;
              const PHONEnewPage = await browser.newPage();
              await PHONEnewPage.goto(verificationUrl);

              new Promise((PHONEnewPage) => setTimeout(PHONEnewPage, 10000));  // 적절한 대기 시간을 설정하여 진행
                const verificationCode = await PHONEnewPage.evaluate(() => {
                    const chats = Array.from(document.querySelectorAll('.direct-chat-info'));
                    const regex = /\bqoo10\b/gi;
                    return chats.find(chat => regex.test(chat.textContent)).textContent.match(/\d+/)[0];
                });

            new Promise((page) => setTimeout(page, 6000000));



})()}