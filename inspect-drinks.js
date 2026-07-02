const xlsx = require('xlsx');
const wb = xlsx.readFile('c:\\Users\\treso\\Downloads\\DRINKS PRICE (2).xlsx');
console.log('Sheets:', wb.SheetNames);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws);
console.log('First 5 rows:');
console.log(JSON.stringify(data.slice(0, 5), null, 2));
console.log('Total rows:', data.length);
