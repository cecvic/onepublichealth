import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the Excel file
const workbook = XLSX.readFile(path.join(__dirname, '../data/courses.xlsx'));
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const jsonData = XLSX.utils.sheet_to_json(worksheet);

// Save to JSON file
fs.writeFileSync(
  path.join(__dirname, '../data/courses.json'),
  JSON.stringify(jsonData, null, 2)
);

console.log('Converted courses.xlsx to courses.json');
console.log('Total courses:', jsonData.length);
console.log('Sample course:', JSON.stringify(jsonData[0], null, 2));

