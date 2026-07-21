const fs = require('fs');
const path = require('path');

const srcBlack = 'C:/Users/akakp/.gemini/antigravity/brain/01530636-9ad3-4c8a-9aef-f05d2c181aee/media__1784676777246.jpg';
const srcGold = 'C:/Users/akakp/.gemini/antigravity/brain/01530636-9ad3-4c8a-9aef-f05d2c181aee/media__1784676777256.jpg';
const srcPurple = 'C:/Users/akakp/.gemini/antigravity/brain/01530636-9ad3-4c8a-9aef-f05d2c181aee/media__1784676777263.jpg';
const srcOrange = 'C:/Users/akakp/.gemini/antigravity/brain/01530636-9ad3-4c8a-9aef-f05d2c181aee/media__1784676777265.jpg';
const srcSilver = 'C:/Users/akakp/.gemini/antigravity/brain/01530636-9ad3-4c8a-9aef-f05d2c181aee/media__1784676777348.jpg';

const destDir = path.join(__dirname, '../public/images/iphone');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const copyList = [
  { src: srcBlack, destName: 'iphone-black.png' },
  { src: srcGold, destName: 'iphone-gold.png' },
  { src: srcPurple, destName: 'iphone-purple.png' },
  { src: srcOrange, destName: 'iphone-orange.png' },
  { src: srcSilver, destName: 'iphone-silver.png' }
];

copyList.forEach(item => {
  const destPath = path.join(destDir, item.destName);
  try {
    fs.copyFileSync(item.src, destPath);
    console.log(`Copied successfully to ${destPath}`);
  } catch (err) {
    console.error(`Failed to copy to ${destPath}:`, err.message);
  }
});
