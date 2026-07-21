const fs = require('fs');
const path = require('path');

const src1 = 'C:/Users/akakp/.gemini/antigravity/brain/01530636-9ad3-4c8a-9aef-f05d2c181aee/media__1784677909397.jpg';
const src2 = 'C:/Users/akakp/.gemini/antigravity/brain/01530636-9ad3-4c8a-9aef-f05d2c181aee/media__1784677909404.jpg';
const src3 = 'C:/Users/akakp/.gemini/antigravity/brain/01530636-9ad3-4c8a-9aef-f05d2c181aee/media__1784677909484.jpg';
const src4 = 'C:/Users/akakp/.gemini/antigravity/brain/01530636-9ad3-4c8a-9aef-f05d2c181aee/media__1784677909487.jpg';

const destDir = path.join(__dirname, '../public/images/iphone');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const copyList = [
  { src: src1, name: 'iphone-teal.png' },
  { src: src2, name: 'iphone-pink.png' },
  { src: src3, name: 'iphone-blue.png' },
  { src: src4, name: 'iphone-yellow.png' }
];

copyList.forEach(item => {
  const destPath = path.join(destDir, item.name);
  try {
    fs.copyFileSync(item.src, destPath);
    console.log(`Copied successfully to ${destPath}`);
  } catch (err) {
    console.error(`Failed to copy to ${destPath}:`, err.message);
  }
});
