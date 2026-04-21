const XLSX = require('xlsx');
const path = require('path');

// Direct path to Materials folder
const filePath = 'E:\\sq agriculture website\\Materials\\Seed\\Bank Loan plan - seed 2026.xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  console.log('Sheets:', workbook.SheetNames);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(sheet);
  console.log('\nFirst row (headers):', json[0] ? Object.keys(json[0]) : 'Empty');
  console.log('\nFirst 3 rows:');
  json.slice(0, 3).forEach((row, i) => console.log(`Row ${i+1}:`, JSON.stringify(row).substring(0, 200)));
  console.log('\nTotal rows:', json.length);
} catch(e) {
  console.error('Error:', e.message);
}