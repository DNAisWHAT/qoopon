const axios = require('axios');
const fs = require("fs");
const { Buffer } = require("buffer");

const imageUrl = "https://www.qoo10.com/gmkt.inc/login/qcaptcha.ashx?qcaptchr_req_no=brHYQDq4NB47h9yZcW51kiRKF2FBqBVHP9qseBgKFuE0dzge6o5opdSBZKzpDofS&chanel_cd=FRONT";

axios
  .get(imageUrl, {
    responseType: "blob",
  })
  .then((response) => {
    const blob = response.data;
    const type = blob.type;
    const fileName = `image.${type}`;

    const file = new File([blob], fileName);

    // 파일 객체의 내용을 Buffer 객체로 변환합니다.
    const fileBuffer = Buffer.from(file);

    // fs.writeFile() 메서드에 Buffer 객체를 전달합니다.
    fs.writeFile(fileName, fileBuffer, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`File saved: ${fileName}`);
      }
    });
  })
  .catch((error) => {
    console.log(error);
  });