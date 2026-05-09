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
      const text = extractTextFromXml(cellMatch[1]).join(' ');
      cells.push(text.trim());
    }
    if (cells.length > 0) {
      rows.push(cells);
    }
  }
  return rows;
}

const slidesDir = 'E:\\sq agriculture website\\pesticide\\extracted\\ppt\\slides';
const slides = ['slide1.xml', 'slide2.xml', 'slide3.xml', 'slide4.xml', 'slide5.xml', 'slide6.xml', 'slide7.xml', 'slide8.xml', 'slide9.xml', 'slide10.xml'];

const categoryMap = {
  'slide1.xml': { name: 'Herbicide', nameBn: 'আগাছানাশক', type: 'PESTICIDES' },
  'slide2.xml': { name: 'Fungicide', nameBn: 'ছত্রাকনাশক', type: 'PESTICIDES' },
  'slide3.xml': { name: 'Herbicide', nameBn: 'আগাছানাশক', type: 'PESTICIDES' },
  'slide4.xml': { name: 'Insecticide', nameBn: 'কীটনাশক', type: 'PESTICIDES' },
  'slide5.xml': { name: 'Insecticide', nameBn: 'কীটনাশক', type: 'PESTICIDES' },
  'slide6.xml': { name: 'Insecticide', nameBn: 'কীটনাশক', type: 'PESTICIDES' },
  'slide7.xml': { name: 'Insecticide', nameBn: 'কীটনাশক', type: 'PESTICIDES' },
  'slide8.xml': { name: 'Micronutrient', nameBn: 'সার (অনু খাদ্য)', type: 'MICRONUTRIENTS' },
  'slide9.xml': { name: 'Micronutrient', nameBn: 'সার (অনু খাদ্য)', type: 'MICRONUTRIENTS' },
  'slide10.xml': { name: 'Micronutrient', nameBn: 'ডাচ', type: 'MICRONUTRIENTS' },
};

const products = { pesticides: [], micronutrients: [] };

for (const slideFile of slides) {
  const slidePath = path.join(slidesDir, slideFile);
  const content = fs.readFileSync(slidePath, 'utf8');
  
  const category = categoryMap[slideFile];
  if (!category) continue;
  
  // Extract table from slide
  const tableRegex = /<a:tbl>([\s\S]*?)<\/a:tbl>/g;
  let tableMatch;
  
  while ((tableMatch = tableRegex.exec(content)) !== null) {
    const rows = parseTable(tableMatch[0]);
    
    // Skip header row and process data
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // Common patterns: Product Name, Trade Price, MRP, Pack Size
      let productName = '';
      let tradePrice = 0;
      let mrp = 0;
      let packSize = '';
      
      // Try to identify columns based on content
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        const numMatch = cell.match(/[\d,]+\.?\d*/);
        
        if (j === 0 && cell.length > 2 && !numMatch) {
          productName = cell;
        } else if (j === 1 && numMatch) {
          tradePrice = parseFloat(cell.replace(/,/g, ''));
        } else if (j === 2 && numMatch) {
          mrp = parseFloat(cell.replace(/,/g, ''));
        } else if (j === 3 && !numMatch) {
          packSize = cell;
        }
      }
      
      // If no valid product name found, try other patterns
      if (!productName) {
        for (let j = 0; j < row.length; j++) {
          const cell = row[j];
          if (cell.length > 3 && !/^[\d,.]+$/.test(cell)) {
            productName = cell;
            break;
          }
        }
      }
      
      if (productName && productName.length > 2) {
        const product = {
          name: productName,
          tradePrice,
          mrp,
          packSize,
          category: category.name,
          categoryBn: category.nameBn,
          type: category.type
        };
        
        if (category.type === 'PESTICIDES') {
          products.pesticides.push(product);
        } else if (category.type === 'MICRONUTRIENTS') {
          products.micronutrients.push(product);
        }
      }
    }
  }
}

console.log('=== PESTICIDES ===');
console.log(JSON.stringify(products.pesticides, null, 2));

console.log('\n=== MICRONUTRIENTS ===');
console.log(JSON.stringify(products.micronutrients, null, 2));
