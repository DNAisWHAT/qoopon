
// 이 코드는 coupon_info.js의 종속성입니다. 쿠폰 사진을 OCR 기능을 통해 저장된 계정별로 쿠폰 현황을 보여주는 텍스트파일을 만드는 코드입니다 
/// login.js         -> coupon_info.js          -> coupon_OCR.js
/// 로그인 후 룰렛 돌리기 -> 룰렛 돌린 계정 쿠폰 사진 찍기  -> 쿠폰 사진 텍스트 인식해서 계정별로 몇장 가지고 있는지 확인하기
const tesseract = require('tesseract.js');
const fs = require('fs');

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
//     ['se8@copyhome.win','Zxcx!!8520'],
//     ['se11@copyhome.win', 'Zxcx!!8520'],
//     ['se12@copyhome.win', 'Zxcx!!8520'],
//     ['se13@copyhome.win', 'Zxcx!!8520'],
//     ['se14@copyhome.win', 'Zxcx!!8520'],
//     ['se15@copyhome.win', 'Zxcx!!8520'],
//     ['se16@copyhome.win', 'Zxcx!!8520'],
//     ['se17@copyhome.win', 'Zxcx!!8520'],
//     ['se18@copyhome.win', 'Zxcx!!8520'],
//     ['se19@copyhome.win', 'Zxcx!!8520'],
//     ['se20@copyhome.win', 'Zxcx!!8520'],
//     ['se21@copyhome.win', 'Zxcx!!8520'],
//     ['se23@copyhome.win', 'Zxcx!!8520'],
//     ['se24@copyhome.win', 'Zxcx!!8520'],
//     ['se25@copyhome.win', 'Zxcx!!8520'],
//     ['nws7114@gmail.com',' zxcx!!8520'],
//     ['se2@copyhome.win','  zxcx!!8520'],
//     ['se3@copyhome.win','  zxcx!!8520'],
//     ['se6@copyhome.win','  zxcx!!8520'],
//     ['se8@copyhome.win','  Zxcx!!8520'],
//     ['se11@copyhome.win', 'Zxcx!!8520'],
//     ['se12@copyhome.win', 'Zxcx!!8520'],
//     ['se17@copyhome.win', 'Zxcx!!8520'],
//     ['se21@copyhome.win', 'Zxcx!!8520'],
//     ['se23@copyhome.win', 'Zxcx!!8520'],
//     ['se24@copyhome.win', 'Zxcx!!8520'],
//     ['se25@copyhome.win', 'Zxcx!!8520'],
// ]

let combos = fs.readdirSync('../coupons_image_db');
combos.shift();
console.log(combos);
// console.log(`combos : ${combos}`);
// return 0;
var today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);
var dateString = year + '-' + month + '-' + day;
let ranking = []

function main()
{
    Promise.all(combos.map(async (combo) => {
        const worker = await tesseract.createWorker('eng');
        const ret = await worker.recognize(`../coupons_image_db/${combo}`);
        const coupon = ret.data.text;
        let thirty = coupon.match(/6,520/g)?.length;
        if (thirty === undefined) {
          thirty = 0;
        }
        obj = {};
        obj['name'] = combo;
        obj['30%'] = thirty;
        ranking.push(obj);
        await worker.terminate();
      })).then(() => {
        console.log(ranking);
      }).catch((error) => {
        console.error('Error:', error);
      }).then(() => {
        fs.writeFile(`${dateString}_coupon list.txt`, JSON.stringify(ranking), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
      }
      )
}

main();







