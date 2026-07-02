import { PrismaClient } from '@prisma/client';
import xlsx from 'xlsx';
import path from 'path';

const prisma = new PrismaClient();

type StockItemSeed = {
  name: string;
  category: string;
  stock: number;
  unit: string;
  minStock?: number;
  price?: number;
};

/**
 * Import stock items from Excel file
 * Expected columns: "Item Name (Amazina)" and "STOKER" (quantity in stock)
 */
async function importStockItemsFromExcel(filePath: string) {
  try {
    console.log(`Reading Excel file: ${filePath}`);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet) as Array<any>;

    console.log(`Found ${data.length} items in Excel file`);

    // Category mapping - you can adjust this based on item names
    const categorizItem = (name: string): string => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('pepper') || lowerName.includes('masala') || lowerName.includes('spice')) {
        return 'Spices';
      }
      if (lowerName.includes('oil') || lowerName.includes('butter')) {
        return 'Cooking Oils';
      }
      if (lowerName.includes('salt') || lowerName.includes('sugar')) {
        return 'Seasonings';
      }
      if (lowerName.includes('flour') || lowerName.includes('rice')) {
        return 'Grains';
      }
      if (lowerName.includes('vegetable') || lowerName.includes('onion') || lowerName.includes('garlic')) {
        return 'Vegetables';
      }
      if (lowerName.includes('sauce') || lowerName.includes('paste')) {
        return 'Sauces';
      }
      return 'General Supplies';
    };

    const items: StockItemSeed[] = data.map((row: any) => ({
      name: row['Item Name (Amazina)'] || row['Item Name'] || '',
      category: categorizItem(row['Item Name (Amazina)'] || row['Item Name'] || ''),
      stock: parseInt(row['STOKER'] || 0) || 0,
      unit: 'units', // Default unit, adjust as needed
      minStock: 5,
      price: 0, // Update prices manually if needed
    }));

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const item of items) {
      if (!item.name.trim()) {
        skipped++;
        continue;
      }

      try {
        const existing = await prisma.inventoryItem.findFirst({
          where: {
            name: {
              equals: item.name,
              mode: 'insensitive',
            },
          },
        });

        if (existing) {
          // Update existing stock
          await prisma.inventoryItem.update({
            where: { id: existing.id },
            data: {
              stock: item.stock,
              category: item.category,
              unit: item.unit,
              minStock: item.minStock,
            },
          });
          updated++;
          console.log(`✓ Updated: ${item.name} (stock: ${item.stock})`);
        } else {
          // Create new item
          await prisma.inventoryItem.create({
            data: {
              name: item.name,
              category: item.category,
              stock: item.stock,
              unit: item.unit,
              minStock: item.minStock || 5,
              price: item.price || 0,
            },
          });
          created++;
          console.log(`✓ Created: ${item.name} (stock: ${item.stock})`);
        }
      } catch (error) {
        console.error(`✗ Failed to process ${item.name}:`, error);
        skipped++;
      }
    }

    console.log('\n===== Import Summary =====');
    console.log(`Created: ${created}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Total processed: ${created + updated + skipped}/${items.length}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('Import failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Get file path from command line or use default
const filePath = process.argv[2] || path.join(process.cwd(), 'drinks-inventory.xlsx');
console.log('Starting stock item import...\n');
importStockItemsFromExcel(filePath);
