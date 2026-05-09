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

function parseTable(tableXml) {
  const rows = [];
  const rowRegex = /<a:tr[^>]*>([\s\S]*?)<\/a:tr>/g;
  let rowMatch;
  
  while ((rowMatch = rowRegex.exec(tableXml)) !== null) {
    const cells = [];
    const cellRegex = /<a:tc>([\s\S]*?)<\/a:tc>/g;
    let cellMatch;
    
    while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
      const texts = extractTextFromXml(cellMatch[1]);
      cells.push(texts.join(' ').trim());
    }
    if (cells.length > 0) {
      rows.push(cells);
    }
  }
  return rows;
}

const slidesDir = 'E:\\sq agriculture website\\pesticide\\extracted\\ppt\\slides';

const slidesToParse = ['slide3.xml', 'slide4.xml', 'slide8.xml', 'slide9.xml', 'slide10.xml'];

for (const slideFile of slidesToParse) {
  const slidePath = path.join(slidesDir, slideFile);
  const content = fs.readFileSync(slidePath, 'utf8');
  
  console.log(`\n=== ${slideFile} ===`);
  
  // Extract ALL text from the slide
  const allText = extractTextFromXml(content);
  console.log('All text:', allText.join(' | '));
  
  // Find tables
  const tableRegex = /<a:tbl>([\s\S]*?)<\/a:tbl>/g;
  let tableMatch;
  let tableNum = 1;
  
  while ((tableMatch = tableRegex.exec(content)) !== null) {
    console.log(`\n--- Table ${tableNum} ---`);
    const rows = parseTable(tableMatch[0]);
    rows.forEach((row, i) => {
      console.log(`Row ${i}:`, row.join(' | '));
    });
    tableNum++;
  }
}
