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

// 1. Copy flat files to public/images/iphone/
const flatFiles = [
  { src: srcBlack, dest: 'iphone-black.png' },
  { src: srcGold, dest: 'iphone-gold.png' },
  { src: srcPurple, dest: 'iphone-purple.png' },
  { src: srcOrange, dest: 'iphone-orange.png' },
  { src: srcSilver, dest: 'iphone-silver.png' },
  
  // Specific model color variations
  { src: srcOrange, dest: 'iphone-17-pro-max-bronze.png' },
  { src: srcOrange, dest: 'iphone-17-pro-bronze.png' },
  { src: srcOrange, dest: 'iphone-17-air-bronze.png' },
  { src: srcOrange, dest: 'iphone-17-bronze.png' },
  { src: srcOrange, dest: 'iphone-16e-bronze.png' },
  
  { src: srcGold, dest: 'iphone-16-pro-max-natural.png' },
  { src: srcGold, dest: 'iphone-16-pro-natural.png' },
  { src: srcGold, dest: 'iphone-16-plus-natural.png' },
  { src: srcGold, dest: 'iphone-16-natural.png' },
  
  { src: srcGold, dest: 'iphone-15-pro-max-natural.png' },
  { src: srcGold, dest: 'iphone-15-pro-natural.png' },
  { src: srcGold, dest: 'iphone-15-plus-natural.png' },
  { src: srcGold, dest: 'iphone-15-natural.png' },
  
  { src: srcGold, dest: 'iphone-14-pro-max-natural.png' },
  { src: srcGold, dest: 'iphone-14-pro-natural.png' },
  { src: srcGold, dest: 'iphone-14-plus-natural.png' },
  { src: srcGold, dest: 'iphone-14-natural.png' }
];

flatFiles.forEach(item => {
  const destPath = path.join(destDir, item.dest);
  try {
    fs.copyFileSync(item.src, destPath);
    console.log(`Copied successfully to ${destPath}`);
  } catch (err) {
    console.error(`Failed to copy to ${destPath}:`, err.message);
  }
});

// 2. Also copy to public/images/iphone/[model-id]/ folder
const models = [
  "iphone-17-pro-max", "iphone-17-pro", "iphone-17-air", "iphone-17", "iphone-16e",
  "iphone-16-pro-max", "iphone-16-pro", "iphone-16-plus", "iphone-16",
  "iphone-15-pro-max", "iphone-15-pro", "iphone-15-plus", "iphone-15",
  "iphone-14-pro-max", "iphone-14-pro", "iphone-14-plus", "iphone-14", "iphone-se-3",
  "iphone-13-pro-max", "iphone-13-pro", "iphone-13", "iphone-13-mini", "iphone-se-2",
  "iphone-12-pro-max", "iphone-12-pro", "iphone-12", "iphone-12-mini",
  "iphone-11-pro-max", "iphone-11-pro", "iphone-11", "iphone-xr",
  "iphone-xs-max", "iphone-xs", "iphone-x", "iphone-8-plus", "iphone-8",
  "iphone-7-plus", "iphone-7", "iphone-se", "iphone-6s-plus", "iphone-6s",
  "iphone-6-plus", "iphone-6", "iphone-5s", "iphone-5c", "iphone-5",
  "iphone-4s", "iphone-4", "iphone-3gs", "iphone-3g", "iphone-1st-gen"
];

// Helper mapping to choose correct source based on modelId
function getSourceForModel(modelId) {
  const id = modelId.toLowerCase();
  if (id.includes("17") || id.includes("16e")) return srcOrange;
  if (id.includes("16") || id.includes("15") || id.includes("xs") || id.includes("8") || id.includes("6") || id.includes("5s")) {
    return srcGold;
  }
  if (id.includes("14") || id.includes("13") || id.includes("12") || id.includes("11") || id.includes("xr") || id.includes("7") || id.includes("se") || id.includes("5c")) {
    return srcPurple;
  }
  if (id.includes("5") || id.includes("4") || id.includes("3") || id.includes("gen")) {
    return srcSilver;
  }
  return srcGold;
}

models.forEach(model => {
  const modelFolder = path.join(destDir, model);
  if (!fs.existsSync(modelFolder)) {
    fs.mkdirSync(modelFolder, { recursive: true });
  }
  
  const srcFile = getSourceForModel(model);
  const destPathJpg = path.join(modelFolder, `${model}.jpg`);
  const destPathPng = path.join(modelFolder, `${model}.png`);
  
  try {
    fs.copyFileSync(srcFile, destPathJpg);
    fs.copyFileSync(srcFile, destPathPng);
    console.log(`Copied successfully to ${modelFolder}`);
  } catch (err) {
    console.error(`Failed to copy to ${modelFolder}:`, err.message);
  }
});
