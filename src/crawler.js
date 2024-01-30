const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const download = require('image-downloader');

const baseUrl = 'https://www.qoo10.com/gmkt.inc/MiniShop/Default.aspx?sell_cust_no=rgsBJzbvXgbdi78Hbp%2ffYQ%3d%3d&cit=953191044&oicd=QW';

async function downloadImagesFromSubUrls(baseUrl) {
  try {
    const baseResponse = await axios.get(baseUrl);
    const base$ = cheerio.load(baseResponse.data);
    const subUrls = base$('a').map((i, el) => base$(el).attr('href')).get().filter(url => url.startsWith('http'));

    for (const url of subUrls) {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const images = $('img').map((i, el) => $(el).attr('src')).get();
      
      const imageDir = path.join(__dirname, 'images');
      if (!fs.existsSync(imageDir)){
        fs.mkdirSync(imageDir);
      }

      images.forEach(image => {
        const imageName = path.basename(image).split('?')[0];
        const options = {
          url: image.startsWith('http') ? image : `${url}/${image}`,
          dest: path.join(imageDir, imageName)
        };
        download.image(options)
          .then(({ filename }) => {
            console.log('Saved to', filename);
          })
          .catch((err) => console.error(err));
      });
    }
  } catch (error) {
    console.error('Error downloading images from sub URLs:', error);
  }
}

downloadImagesFromSubUrls(baseUrl);

