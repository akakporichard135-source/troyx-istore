const fs = require('fs');
const path = require('path');

const srcGold = 'C:/Users/akakp/.gemini/antigravity/brain/01530636-9ad3-4c8a-9aef-f05d2c181aee/media__1784676201498.jpg';
const srcOrange = 'C:/Users/akakp/.gemini/antigravity/brain/01530636-9ad3-4c8a-9aef-f05d2c181aee/media__1784676201524.jpg';

const destBase = path.join(__dirname, '../public/images/iphone');

const copyMapping = [
  // iPhone 17 Pro / Pro Max / Air / 17 / 16e gets the Orange/Bronze Pro model image
  { src: srcOrange, folder: 'iphone-17-pro-max', file: 'iphone-17-pro-max.jpg' },
  { src: srcOrange, folder: 'iphone-17-pro', file: 'iphone-17-pro.jpg' },
  { src: srcOrange, folder: 'iphone-17-air', file: 'iphone-17-air.jpg' },
  { src: srcOrange, folder: 'iphone-17', file: 'iphone-17.jpg' },
  { src: srcOrange, folder: 'iphone-16e', file: 'iphone-16e.jpg' },
  
  // iPhone 16/15 Pro/Pro Max gets the Desert Titanium / Gold Pro image
  { src: srcGold, folder: 'iphone-16-pro-max', file: 'iphone-16-pro-max.jpg' },
  { src: srcGold, folder: 'iphone-16-pro', file: 'iphone-16-pro.jpg' },
  { src: srcGold, folder: 'iphone-16-plus', file: 'iphone-16-plus.jpg' },
  { src: srcGold, folder: 'iphone-16', file: 'iphone-16.jpg' },
  
  { src: srcGold, folder: 'iphone-15-pro-max', file: 'iphone-15-pro-max.jpg' },
  { src: srcGold, folder: 'iphone-15-pro', file: 'iphone-15-pro.jpg' },
  { src: srcGold, folder: 'iphone-15-plus', file: 'iphone-15-plus.jpg' },
  { src: srcGold, folder: 'iphone-15', file: 'iphone-15.jpg' },
  
  { src: srcGold, folder: 'iphone-14-pro-max', file: 'iphone-14-pro-max.jpg' },
  { src: srcGold, folder: 'iphone-14-pro', file: 'iphone-14-pro.jpg' },
  { src: srcGold, folder: 'iphone-14-plus', file: 'iphone-14-plus.jpg' },
  { src: srcGold, folder: 'iphone-14', file: 'iphone-14.jpg' },
  
  { src: srcGold, folder: 'iphone-se-3', file: 'iphone-se-3.jpg' },
  
  { src: srcGold, folder: 'iphone-13-pro-max', file: 'iphone-13-pro-max.jpg' },
  { src: srcGold, folder: 'iphone-13-pro', file: 'iphone-13-pro.jpg' },
  { src: srcGold, folder: 'iphone-13', file: 'iphone-13.jpg' },
  { src: srcGold, folder: 'iphone-13-mini', file: 'iphone-13-mini.jpg' },
  
  { src: srcGold, folder: 'iphone-se-2', file: 'iphone-se-2.jpg' },
  
  { src: srcGold, folder: 'iphone-12-pro-max', file: 'iphone-12-pro-max.jpg' },
  { src: srcGold, folder: 'iphone-12-pro', file: 'iphone-12-pro.jpg' },
  { src: srcGold, folder: 'iphone-12', file: 'iphone-12.jpg' },
  { src: srcGold, folder: 'iphone-12-mini', file: 'iphone-12-mini.jpg' },
  
  { src: srcGold, folder: 'iphone-11-pro-max', file: 'iphone-11-pro-max.jpg' },
  { src: srcGold, folder: 'iphone-11-pro', file: 'iphone-11-pro.jpg' },
  { src: srcGold, folder: 'iphone-11', file: 'iphone-11.jpg' },
  
  { src: srcGold, folder: 'iphone-xr', file: 'iphone-xr.jpg' },
  { src: srcGold, folder: 'iphone-xs-max', file: 'iphone-xs-max.jpg' },
  { src: srcGold, folder: 'iphone-xs', file: 'iphone-xs.jpg' },
  { src: srcGold, folder: 'iphone-x', file: 'iphone-x.jpg' },
  
  { src: srcGold, folder: 'iphone-8-plus', file: 'iphone-8-plus.jpg' },
  { src: srcGold, folder: 'iphone-8', file: 'iphone-8.jpg' },
  
  { src: srcGold, folder: 'iphone-7-plus', file: 'iphone-7-plus.jpg' },
  { src: srcGold, folder: 'iphone-7', file: 'iphone-7.jpg' },
  
  { src: srcGold, folder: 'iphone-se', file: 'iphone-se.jpg' },
  
  { src: srcGold, folder: 'iphone-6s-plus', file: 'iphone-6s-plus.jpg' },
  { src: srcGold, folder: 'iphone-6s', file: 'iphone-6s.jpg' },
  
  { src: srcGold, folder: 'iphone-6-plus', file: 'iphone-6-plus.jpg' },
  { src: srcGold, folder: 'iphone-6', file: 'iphone-6.jpg' },
  
  { src: srcGold, folder: 'iphone-5s', file: 'iphone-5s.jpg' },
  { src: srcGold, folder: 'iphone-5c', file: 'iphone-5c.jpg' },
  { src: srcGold, folder: 'iphone-5', file: 'iphone-5.jpg' },
  
  { src: srcGold, folder: 'iphone-4s', file: 'iphone-4s.jpg' },
  { src: srcGold, folder: 'iphone-4', file: 'iphone-4.jpg' },
  
  { src: srcGold, folder: 'iphone-3gs', file: 'iphone-3gs.jpg' },
  { src: srcGold, folder: 'iphone-3g', file: 'iphone-3g.jpg' },
  { src: srcGold, folder: 'iphone-1st-gen', file: 'iphone-1st-gen.jpg' }
];

copyMapping.forEach(item => {
  const destDir = path.join(destBase, item.folder);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const destPath = path.join(destDir, item.file);
  try {
    fs.copyFileSync(item.src, destPath);
    console.log(`Copied successfully to ${destPath}`);
  } catch (err) {
    console.error(`Failed to copy to ${destPath}:`, err.message);
  }
});
