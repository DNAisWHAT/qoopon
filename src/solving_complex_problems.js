const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin());

const emails = []

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

//   // #?. 로그인 한 뒤 리다이렉트를 기다리며 보안 인증 페이지인지 확인하기
try {
    new Promise((page) => setTimeout(page, 5000)); // 리다이렉트 기다리기
    await page.waitForSelector('.mcf_ntc'); // 로그인 보안 인증 페이지인지 셀렉터로 확인하는 로직
}

catch(error) {
    console.log('Maybe this account is free by someone.');
    await browser.close();
}

  // #?.1. 인증메일 발송 버튼을 클릭한다. 
    // TO-DO : 이 로직이 맞는지 다시 한번 확인하자 : 작성 완료 / 테스트 대기 중
  await page.click('#btn_send_email');
  
  // #?.2. 인증메일 발송 후 Enter 키를 눌러 이메일을 확인한다.
  await page.keyboard.press('Enter');
    // TO-DO : 이 로직이 맞는지 다시 한번 확인하자 : 작성 완료 / 테스트 대기 중

  const email_verification_page = await browser.newPage();
  
  // #?.3. ruu.kr로 접속해서 이메일 인풋 창에 이메일을 넣고 기다린다.
    // TO-DO : 이 로직이 맞는지 다시 한번 확인하자 : 작성 완료 / 테스트 대기 중

  await email_verification_page.goto('https://ruu.kr');
  await email_verification_page.waitForSelector('#email_input');
  await email_verification_page.type('#email_input', emails[0]); // emails[0]은 이메일의 예시 중 하나임

  // #?.4. 조회 버튼을 누르고 가장 최근의 메일을 선택한다.
    // TO-DO : 이 로직이 맞는지 다시 한번 확인하자 : 작성 완료 / 테스트 대기 중

  await email_verification_page.waitForSelector('#mailList');
  await email_verification_page.click('#mailList');
  new Promise((page) => setTimeout(page, 10000));
  const emailLink = await page.evaluate(() => {
    const mails = document.querySelectorAll('#mail');
    const mail_body = mails[0].childNodes[1].childNodes[5];
    const tr = mail_body.getElementsByTagName('tr');
    tr[0].getElementsByTagName('td')[2].click(); // 최신 이메일 클릭

    // 이메일 상세보기에서 링크 추출 과정
    // TO-DO : 이 로직이 맞는지 다시 한번 확인하자 : 작성 완료 / 테스트 대기 중

    const link_tr = document.getElementsByTagName('tr')[7]; 
    return link_tr.childNodes[1].childNodes[2].textContent; // 링크 주소 반환  
    // const links = document.querySelectorAll('.mailbox_list a');
    // return links[0].href;
  });

 // #?.5. 링크를 추출하고 접속한다. 그리고 창을 닫는다.
  await email_verification_page.goto(emailLink);
  // 필요하면 여기에 팝업 엔터로 씹는 코드를 넣어라.
  await email_verification_page.close();


//   const link = await page.evaluate(() => {
//     return document.querySelector('.email-content a').href;
//   });
//   await page.goto(link);

  // #?.6. 창을 닫는다.
  await page.close();

  // #?.7. 비밀번호 변경 로직을 작성
  new Promise((page) => setTimeout(page, 5000));  // 적절한 대기 시간을 설정하여 진행
  await page.evaluate(() => {
        document.querySelector('.mcf_bt').click();
  })

  // 만약 현재 비밀번호가 Zxcx!!8520 이면 -> Zxcx!!852020으로 바꿔라. 그 반대도 생각해라.
  // #old_pwd
  // #new_pwd
  // #new_pwd2
  // #btn_change <- 확인 버튼 클래스 셀렉터
  // 그 다음에는 await page.keyboard.press('Enter'); 를 사용해서 리다이렉트를 기다려야 함. 그래야 로그인 세션을 유지할 수 있음.

  
  // #?.7. 바로 이곳으로 이동해 비밀번호 변경을 진행합니다.
  await page.goto('https://www.qoo10.com/gmkt.inc/Event/CheckMobileConfirmation.aspx?confirm_type=C&next_url=https://m.qoo10.com/gmkt.inc/My/EditMember.aspx');
  
  
  // #2.1. 인증 페이지에서 인증번호 받기 버튼을 누른다.
  await page.eval(() => {
    document.querySelector('.bt_cnf').click();
    document.querySelector('.btn').click();
  })

  // #3. 추출한 휴대전화 번호로 인증번호를 받아서 정보를 새로 가져온다.
  const phoneNumbers = await page.evaluate(() => {
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
  
  // #3.1. 새로운 창을 열고 temp-number.com에서 추출한 휴대전화 번호를 쿼리스트링으로 붙인다.
  const verificationUrl = `https://temp-number.com/temporary-numbers/United-States/${phoneNumbers}/1`;
  const newPage = await browser.newPage();
  await newPage.goto(verificationUrl);
  
  // #3.2. 일정 시간 대기한 뒤 qoo10 문자에서 인증 번호 코드를 추출한다.
    // TO-DO : 이 로직이 맞는지 다시 한번 확인하자 : 작성 완료 / 테스트 대기 중
  new Promise((page) => setTimeout(page, 10000));  // 적절한 대기 시간을 설정하여 진행
  const verificationCode = await newPage.evaluate(() => {
    const chats = Array.from(document.querySelectorAll('.direct-chat-info'));
    const regex = /\bqoo10\b/gi;
    return chats.find(chat => regex.test(chat.textContent)).textContent.match(/\d+/)[0];
  });
  
  // #3.3. 추출한 인증번호를 qoo10 인증 필드에 입력한다.
  await page.type('#codeWithSeeFullId', verificationCode);
  await page.click('#btn_code_confirm');

  new Promise((page) => setTimeout(page, 6000000));  // 종료 방지 및 결과 확인 대기 코드
  
  // 브라우저 종료
  await browser.close();
})();