import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import xlsx from 'xlsx';

const prisma = new PrismaClient();

type MenuSeed = {
  category: string;
  name: string;
  price: number;
  description?: string;
};

const menu = (category: string, name: string, price: number, description = ''): MenuSeed => ({
  category,
  name,
  price,
  description: description || undefined,
});

const DEFAULT_MENU_ITEMS: MenuSeed[] = [
  menu('Cassava Bread', 'Cassava with whole fish', 15000, 'Pâte de manioc avec poisson 700g/Kawunga fish'),
  menu('Cassava Bread', 'Cassava with sambaza or Kawunga', 8000),
  menu('Cassava Bread', 'Cassava with beef', 8000),
  menu('Cassava Bread', 'Cassava bread with Vegetables', 7000),
  menu('Ubumwe Hotel VIP', "Igisafuriya in koko y'inyarwanda cg ihene", 30000, 'Chicken, goat or beef, banana, potatoes etc'),
  menu('Ubumwe Hotel VIP', "Igisafuriya cy'Inkoko y'Inzungu cg lfi", 25000),
  menu('Dessert', 'Pancake with honey', 3000),
  menu('Dessert', 'Pancake with jam', 3000),
  menu('Dessert', 'Pancake with lemon', 4000),
  menu('Dessert', 'Pancake with chocolate', 3000),
  menu('Dessert', 'Pancake with banana', 4000),
  menu('Dessert', 'Fruits salad', 3000),
  menu('Dessert', 'Seasonal fruits', 5000),
  menu('Accompaniments', 'Mashed potatoes', 4000),
  menu('Accompaniments', 'Plain rice', 3000),
  menu('Accompaniments', 'Curry rice', 3000),
  menu('Accompaniments', 'Fried banana', 4000),
  menu('Accompaniments', 'French fries with Salad', 3000),
  menu('Accompaniments', 'Grilled banana', 4000),
  menu('Accompaniments', 'Salted potatoes', 3000),
  menu('Accompaniments', 'Salted sweet potatoes', 4000),
  menu('Accompaniments', 'French fries with chips', 4000),
  menu('Barbecue', 'Beef brochette 2 pieces', 8000),
  menu('Barbecue', 'Goat brochette 2 pieces', 8000),
  menu('Barbecue', 'Fish brochette 2 pieces', 10000),
  menu('Barbecue', 'Whole grilled fish with accompaniment big', 20000),
  menu('Barbecue', 'Grilled chicken with accompaniment', 25000),
  menu('Barbecue', 'Grilled meat arm or leg', 20000),
  menu('Barbecue', 'Grilled meat from chest cut', 15000),
  menu('Barbecue', 'Grilled chicken brochettes 2 pieces', 10000),
  menu('Barbecue', 'Grilled sausage brochettes 2 pieces', 1000),
  menu('Drinks Soft', 'Fanta 33cl', 1000),
  menu('Drinks Soft', 'Water 500ml', 1000),
  menu('Drinks Soft', 'Agashya juice', 3000),
  menu('Drinks Soft', 'Inyange juice', 1500),
  menu('Drinks Soft', 'Red bull', 3500),
  menu('Drinks Soft', 'Bavaria non-Alcoholic', 4000),
  menu('Drinks Soft', 'Panache', 1000),
  menu('Fish', 'Tilapia fish fillet', 20000),
  menu('Fish', 'Pan fried captain fish fillet', 15000),
  menu('Fish', 'Fried sambaza stew with chips', 8000),
  menu('Pizza', 'Bologn aise pizza', 10000),
  menu('Pizza', 'Chicken pizza', 10000),
  menu('Pizza', 'Margherita pizza', 8000),
  menu('Pizza', 'Hawaii pizza', 10000),
  menu('Pizza', '4 season pizza', 12000),
  menu('Pastes', 'Spaghetti napolitano', 7000),
  menu('Pastes', 'Spaghetti carbonara', 8000),
  menu('Pastes', 'Spaghetti bolognese', 8000),
  menu('Vegetarian', 'Vege Rice', 7000),
  menu('Vegetarian', 'Agatogo Vegetarian', 5000),
  menu('Main Red Meat', 'Braised steak', 15000),
  menu('Main Red Meat', 'Beef medaillon', 15000),
  menu('Main Red Meat', 'Chicken Cordombre', 12000),
  menu('Main Red Meat', 'Coffee Steak with garlic', 15000),
  menu('Main Red Meat', 'Beef Stew', 8000),
  menu('Main Red Meat', 'Beef carbonade', 8000),
  menu('Main Red Meat', 'Beef stroganoff', 12000),
  menu('Main Red Meat', '1/4 Chicken with curry', 10000),
  menu('Main Red Meat', 'Chicken with mushroom cream', 10000),
  menu('Main Red Meat', '1/4 chicken with bey leaves', 10000),
  menu('Main Red Meat', 'Chicken breast with mushroom sauce', 10000),
  menu('Main Red Meat', 'Chicken stroganoff', 10000),
  menu('Main Red Meat', 'Vegetarian penne pasta', 7000),
  menu('Main Red Meat', 'Vegetarian plate with tofu', 7000),
  menu('Cold Starter', "Classic chef's salad", 10000),
  menu('Cold Starter', 'Avocado and vinaigrette', 3000),
  menu('Cold Starter', 'Salad tuna', 7000),
  menu('Cold Starter', 'Mixed salad', 5000),
  menu('Cold Starter', 'Kacumbari salad', 4000),
  menu('Cold Starter', 'Italian salad', 7000),
  menu('Cold Starter', 'Salad nicoise', 10000),
  menu('Hot Starter', 'Mushroom soup', 6000),
  menu('Hot Starter', 'Pampukin soup', 4000),
  menu('Hot Starter', 'Vegetable soup', 4000),
  menu('Hot Starter', 'Spinach soup?', 7000),
  menu('Hot Starter', 'Fishman soup', 7000),
  menu('Fresh Juice', 'Orange juice', 5000),
  menu('Fresh Juice', 'Mango juice', 5000),
  menu('Fresh Juice', 'Pineapple juice', 5000),
  menu('Fresh Juice', 'Detox juice', 8000),
  menu('Fresh Juice', 'Tree tomato juice', 5000),
  menu('Fresh Juice', 'Cocktail juice', 6000),
  menu('Eggs', 'Fried eggs with bread', 3000),
  menu('Eggs', 'Plain omelet with toasted bread', 4000),
  menu('Eggs', 'Spanish omelet', 4000),
  menu('Eggs', 'Special omelet', 7000),
  menu('Eggs', 'Ham and Cheese omelet', 7000),
  menu('Eggs', 'Scrambled eggs', 3000),
  menu('Cereales', 'Porridge', 5000),
  menu('Cereales', 'Cornflakes', 5000),
  menu('Cereales', 'Rice crispies', 5000),
  menu('Breads', 'Anniversary Cake', 30000),
  menu('Breads', 'Wedding cake', 80000),
  menu('Breads', 'Vegetable burger', 7000),
  menu('Breads', 'Chicken burger', 10000),
  menu('Breads', 'Beef burger', 10000),
  menu('Breads', 'Chapat i rolex', 4000),
  menu('Breads', 'Chicken wrap', 10000),
  menu('Breads', 'Beef wrap', 10000),
  menu('Breakfast', 'Simple Breakfast', 7000),
  menu('Breakfast', 'Full Breakfast', 12000),
  menu('Breakfast', 'Americano Breakfast', 15000),
  menu('Tea Break', 'Simple Tea Break', 7000),
  menu('Tea Break', 'Full Tea Break', 10000),
  menu('Hot Drinks', 'Black tea', 2500),
  menu('Hot Drinks', 'African tea', 3500),
  menu('Hot Drinks', 'Ginger tea', 4000),
  menu('Hot Drinks', 'Lemon Tea', 3000),
  menu('Hot Drinks', 'Spice tea', 4000),
  menu('Sandwiches', 'Cheese sandwich', 7000),
  menu('Sandwiches', 'Beef burger sandwich?', 8000),
  menu('Sandwiches', 'Chicken burger', 8000),
  menu('Snacks', 'Meat samosas', 4000),
  menu('Snacks', 'Sausage', 6000),
  menu('Snacks', 'Cheese and sausage plate', 5000),
  menu('Snacks', 'Meat balls', 5000),
  menu('Snacks', 'Chicken wings with chips', 10000),
  menu('Snacks', 'Sambaza plate', 5000),
  menu('Snacks', 'Spring lors', 4000),
  menu('African Kitchen', 'Fish stock 1kg', 20000),
  menu('African Kitchen', 'Beef stock', 8000),
  menu('African Kitchen', 'Sambaza stock', 7000),
  menu('African Kitchen', '1/4 chicken bouillon', 8000),
  menu('African Kitchen', 'Goat stock', 10000),
  menu('African Kitchen', 'Vegetable stock', 7000),
];

function readWorkbook(filePath: string): MenuSeed[] {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' });

  return rows
    .slice(1)
    .map((row) => {
      const [category, name, description, price] = row as unknown[];
      return {
        category: String(category ?? '').trim(),
        name: String(name ?? '').trim(),
        description: String(description ?? '').trim(),
        price: Number(price) || 0,
      };
    })
    .filter((row) => row.category && row.name);
}

async function upsertMenuItem(item: MenuSeed) {
  const existing = await prisma.menuItem.findFirst({
    where: {
      name: item.name,
      category: item.category,
    },
  });

  const data = {
    name: item.name,
    category: item.category,
    price: item.price,
    description: item.description ?? null,
    available: true,
    inventoryItemId: null,
  };

  if (existing) {
    await prisma.menuItem.update({
      where: { id: existing.id },
      data,
    });
    return 'updated';
  }

  await prisma.menuItem.create({ data });
  return 'created';
}

async function main() {
  const inputPath = process.argv[2];
  const replace = process.argv.includes('--replace');

  let items = DEFAULT_MENU_ITEMS;
  if (inputPath) {
    const resolvedPath = path.resolve(inputPath);
    if (fs.existsSync(resolvedPath)) {
      items = readWorkbook(resolvedPath);
      console.log(`Loaded ${items.length} menu item(s) from spreadsheet.`);
    } else {
      console.log(`Spreadsheet not found at ${inputPath}; using the built-in menu list instead.`);
    }
  } else {
    console.log(`Using the built-in menu list (${items.length} items).`);
  }

  const categories = Array.from(new Set(items.map((item) => item.category)));

  if (replace) {
    await prisma.menuItem.deleteMany({
      where: { category: { in: categories } },
    });
  }

  let created = 0;
  let updated = 0;

  for (const item of items) {
    const result = await upsertMenuItem(item);
    if (result === 'created') created += 1;
    else updated += 1;
  }

  console.log(`Menu import complete: ${created} created, ${updated} updated.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
