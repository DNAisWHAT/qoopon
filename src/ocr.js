
// 이 코드는 coupon_info.js의 종속성입니다. 쿠폰 사진을 OCR 기능을 통해 저장된 계정별로 쿠폰 현황을 보여주는 텍스트파일을 만드는 코드입니다 
/// login.js         -> coupon_info.js          -> coupon_OCR.js
/// 로그인 후 룰렛 돌리기 -> 룰렛 돌린 계정 쿠폰 사진 찍기  -> 쿠폰 사진 텍스트 인식해서 계정별로 몇장 가지고 있는지 확인하기
const tesseract = require('tesseract.js');
const fs = require('fs');


let combos = fs.readdirSync('../coupons_image_db');
combos.shift();
console.log(combos);
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
        let thirty = coupon.match(/30%/g)?.length;
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
        fs.writeFile(`../${dateString}_coupon list.txt`, JSON.stringify(ranking), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
      }
      )
}

main();







