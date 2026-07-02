const xlsx = require('xlsx');
const wb = xlsx.readFile('c:\\Users\\treso\\Downloads\\DRINKS PRICE (2).xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws);

// Generate TypeScript array
console.log('const stockItems = [');
data.forEach((row, index) => {
  const name = (row['Item Name (Amazina)'] || row['Item Name'] || '').trim();
  const stock = parseInt(row['STOKER'] || 0) || 0;
  if (name) {
    console.log(`  { name: '${name.replace(/'/g, "\\'")}', stock: ${stock} },`);
  }
});
console.log('];');
