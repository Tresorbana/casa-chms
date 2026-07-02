import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type BeverageSeed = {
  name: string;
  price: number;
  category?: string;
  description?: string;
};

const beverages: BeverageSeed[] = [
  { name: 'pt mitsing', price: 1500 },
  { name: 'heniken', price: 2500 },
  { name: 'amuster', price: 1500 },
  { name: 'fant nto', price: 1000 },
  { name: 'fant GR', price: 1500 },
  { name: 'Inyange', price: 1500 },
  { name: 'energy', price: 1000 },
  { name: 'Woter', price: 1000 },
  { name: 'PT skol', price: 1500 },
  { name: 'panashi', price: 1000 },
  { name: 'Skol laga botter', price: 2000 },
  { name: 'skol malt', price: 2000 },
  { name: 'Virunganto', price: 1500 },
  { name: 'Skol laga cane', price: 1500 },
  { name: 'Skol Gatantu', price: 2000 },
  { name: 'Marton', price: 0 },
  { name: 'Guiness', price: 3000 },
  { name: 'Tusck nto', price: 3500 },
  { name: 'Sminofu Botter', price: 3000 },
  { name: 'Tusck nini', price: 4000 },
  { name: 'Stella', price: 4000 },
  { name: 'K vant', price: 5000 },
  { name: 'Sminofu cane', price: 5000 },
  { name: 'Gillibys nto', price: 5000 },
  { name: 'Bond 7 nto', price: 5000 },
  { name: 'Noribis', price: 3000 },
  { name: 'Red bulu', price: 4000 },
  { name: 'Bavaria', price: 4000 },
  { name: 'Exo', price: 4000 },
  { name: 'Savana', price: 4000 },
  { name: 'pt konyange', price: 5000 },
  { name: 'konyange nini', price: 15000 },
  { name: 'Four cousin nto', price: 0 },
  { name: 'Bond 7 nini', price: 20000 },
  { name: 'Fant tonic', price: 1500 },
  { name: 'Gillibys nini', price: 15000 },
  { name: 'VirungaNINI', price: 2000 },
  { name: 'Champany', price: 0 },
  { name: 'Lefu', price: 5000 },
  { name: 'K vant big', price: 15000 },
  { name: 'Desperado', price: 5000 },
  { name: 'Black General', price: 0 },
  { name: 'Amarura Small', price: 0 },
  { name: 'Sminooth big', price: 0 },
  { name: 'Bullantnis', price: 0 },
  { name: 'Babugi', price: 0 },
  { name: 'Kingend', price: 0 },
  { name: 'Bozaka wisk', price: 15000 },
  { name: 'Jameson Small', price: 35000 },
  { name: 'Tusker cannette', price: 5000 },
  { name: 'Rebol 5', price: 0 },
  { name: 'Drosty Small', price: 15000 },
  { name: 'GT Mitsing', price: 2500 },
  { name: 'Imperial Blue', price: 0 },
  { name: 'Corona', price: 4000 },
  { name: 'Primus', price: 2000 },
  { name: 'Randez Champagne', price: 0 },
  { name: 'Chamet Champagne', price: 12000 },
  { name: 'GT panach', price: 2000 },
  { name: 'Pinta negra', price: 35000 },
  { name: 'Amstel Back', price: 4000 },
  { name: 'GR WOTER', price: 1500 },
  { name: 'Martine Corse', price: 1500 },
  { name: 'Martine', price: 1500 },
  { name: 'Heimelin O', price: 3000 },
  { name: 'Extreme', price: 5000 },
  { name: 'Dledin berge', price: 2000 },
  { name: 'Jameson Big', price: 15000, description: 'Imported from size pricing list' },
  { name: 'Red lubel', price: 15000, description: 'Imported from size pricing list' },
  { name: 'Camine', price: 15000, description: 'Imported from size pricing list' },
  { name: 'Malibu', price: 15000, description: 'Imported from size pricing list' },
  { name: 'Hennessy', price: 15000, description: 'Imported from size pricing list' },
  { name: 'lerox', price: 15000, description: 'Imported from size pricing list' },
  { name: 'More up', price: 15000, description: 'Imported from size pricing list' },
  { name: 'Chivas', price: 15000, description: 'Imported from size pricing list' },
  { name: 'Goloden Gin', price: 15000, description: 'Imported from size pricing list' },
  { name: 'J&B', price: 15000, description: 'Imported from size pricing list' },
  { name: 'Cella Caltoni', price: 15000, description: 'Imported from size pricing list' },
  { name: 'Amarura Big', price: 15000, description: 'Imported from size pricing list' },
  { name: 'Dorste Big', price: 15000, description: 'Imported from size pricing list' },
  { name: 'Jack Diele', price: 15000, description: 'Imported from size pricing list' },
];

async function upsertBeverage(beverage: BeverageSeed) {
  const existing = await prisma.menuItem.findFirst({
    where: {
      name: beverage.name,
      category: beverage.category ?? 'Beverages',
    },
  });

  const data = {
    name: beverage.name,
    category: beverage.category ?? 'Beverages',
    price: beverage.price,
    description: beverage.description ?? null,
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
  const replace = process.argv.includes('--replace');

  if (replace) {
    await prisma.menuItem.deleteMany({
      where: { category: 'Beverages' },
    });
  }

  let created = 0;
  let updated = 0;

  for (const beverage of beverages) {
    const result = await upsertBeverage(beverage);
    if (result === 'created') created += 1;
    else updated += 1;
  }

  console.log(`Beverages import complete: ${created} created, ${updated} updated.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
