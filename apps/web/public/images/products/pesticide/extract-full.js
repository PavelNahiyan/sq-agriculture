const fs = require('fs');
const path = require('path');

function extractTextFromXml(xml) {
  const regex = /<a:t>([^<]*)<\/a:t>/g;
  const matches = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function extractImageReferences(slidePath) {
  const content = fs.readFileSync(slidePath, 'utf8');
  const regex = /r:embed="(image\d+)"/g;
  const images = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    images.push(match[1]);
  }
  return images;
}

const slidesDir = 'E:\\sq agriculture website\\pesticide\\extracted\\ppt\\slides';

const slideCategories = {
  'slide1.xml': { type: 'Herbicide', nameBn: 'আগাছানাশক' },
  'slide2.xml': { type: 'Fungicide', nameBn: 'ছত্রাকনাশক' },
  'slide3.xml': { type: 'Herbicide', nameBn: 'আগাছানাশক' },
  'slide4.xml': { type: 'Insecticide', nameBn: 'কীটনাশক' },
  'slide5.xml': { type: 'Insecticide', nameBn: 'কীটনাশক' },
  'slide6.xml': { type: 'Insecticide', nameBn: 'কীটনাশক' },
  'slide7.xml': { type: 'Insecticide', nameBn: 'কীটনাশক' },
  'slide8.xml': { type: 'Micronutrient', nameBn: 'সার (অনু খাদ্য)' },
  'slide9.xml': { type: 'Micronutrient', nameBn: 'সার (অনু খাদ্য)' },
  'slide10.xml': { type: 'Micronutrient', nameBn: 'ডাচ' },
};

console.log('Products from PPTX:\n');

for (const [slideFile, category] of Object.entries(slideCategories)) {
  const slidePath = path.join(slidesDir, slideFile);
  const content = fs.readFileSync(slidePath, 'utf8');
  const allText = extractTextFromXml(content);
  const images = extractImageReferences(slidePath);
  
  console.log(`=== ${slideFile} (${category.type}) ===`);
  console.log('Images:', images);
  console.log('Text:', allText.join(' | '));
  console.log('');
}
