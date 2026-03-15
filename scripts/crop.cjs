const sharp = require('sharp');
const path = require('path');

const inputPath = '/Users/ballembs/.gemini/antigravity/brain/705bc5e4-ba75-44fd-8dc2-caebeeb152bb/chapter_8_megham_chatram_illustration_1773538218108.png';
const outputPath = '/Users/ballembs/my-projects/koorma/public/book-illustrations/class-1/chapter-8-megham-chatram.png';

async function cropImage() {
  try {
    await sharp(inputPath)
      .extract({ left: 830, top: 124, width: 1200, height: 1442 })
      .toFile(outputPath);
    console.log('Cropped successfully again!');
  } catch (err) {
    console.error(err);
  }
}

cropImage();
