import { PrismaClient } from '@prisma/client';
import { normalizeRoomType } from '../src/lib/room-types';

const prisma = new PrismaClient();

async function main() {
  const rooms = await prisma.room.findMany({
    select: { id: true, type: true },
  });

  let updatedCount = 0;

  for (const room of rooms) {
    const normalizedType = normalizeRoomType(room.type);
    if (!normalizedType || normalizedType === room.type) continue;

    await prisma.room.update({
      where: { id: room.id },
      data: { type: normalizedType },
    });
    updatedCount += 1;
  }

  console.log(`Normalized ${updatedCount} room type record(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
