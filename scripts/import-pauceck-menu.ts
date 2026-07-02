import { PrismaClient } from '@prisma/client';
import xlsx from 'xlsx';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

type MenuSeed = {
  section: string;
  name: string;
  description?: string;
  price: number;
};

const SECTION_RENAMES: Record<string, string> = {
  'Ub umwe Hotel VIP': 'Ubumwe Hotel VIP',
};

function normalizeSection(section: string) {
  const trimmed = section.trim();
  return SECTION_RENAMES[trimmed] ?? trimmed;
}

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readWorkbook(filePath: string): MenuSeed[] {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' });

  return rows
    .slice(1)
    .map((row) => {
      const [section, name, description, price] = row as unknown[];
      return {
        section: String(section ?? '').trim(),
        name: String(name ?? '').trim(),
        description: String(description ?? '').trim(),
        price: toNumber(price),
      };
    })
    .filter((row) => row.section && row.name)
    .map((row) => ({
      ...row,
      section: normalizeSection(row.section),
    }));
}

async function upsertMenuItem(item: MenuSeed) {
  const existing = await prisma.menuItem.findFirst({
    where: {
      name: item.name,
      category: item.section,
    },
  });

  const data = {
    name: item.name,
    category: item.section,
    price: item.price,
    description: item.description || null,
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
  const filePath = process.argv[2];
  if (!filePath) {
    throw new Error('Usage: node --import tsx scripts/import-pauceck-menu.ts <path-to-pauceck_menu.xlsx> [--replace]');
  }

  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(
      `File not found: ${filePath}\n` +
        `On the VPS you need to upload the spreadsheet first, then pass its Linux path.\n` +
        `Example:\n` +
        `  scp -i kamdine C:\\Users\\treso\\Downloads\\pauceck_menu.xlsx ubuntu@102.202.208.212:~/pauceck_menu.xlsx\n` +
        `  npm run import:pauceck-menu -- ~/pauceck_menu.xlsx`
    );
  }

  const replace = process.argv.includes('--replace');
  const items = readWorkbook(resolvedPath);
  const categories = Array.from(new Set(items.map((item) => item.section)));

  if (replace) {
    await prisma.menuItem.deleteMany({
      where: {
        category: { in: categories },
      },
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
