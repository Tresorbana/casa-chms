import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('Hhhhhhh@', 10)

  // Users
  await prisma.user.upsert({
    where: { email: 'admin@casahotel.com' },
    update: {},
    create: {
      email: 'admin@casahotel.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  await prisma.user.upsert({
    where: { email: 'tresorbana77@gmail.com' },
    update: {},
    create: {
      email: 'tresorbana77@gmail.com',
      name: 'Tresor Bana',
      password: userPassword,
      role: 'ADMIN',
    },
  })

  // Rooms
  const roomTypes = ['DELUXE', 'EXECUTIVE', 'STANDARD', 'SUITE']
  for (let i = 1; i <= 20; i++) {
    const floor = Math.ceil(i / 5)
    await prisma.room.upsert({
      where: { number: `${floor}0${i % 5 || 5}` },
      update: {},
      create: {
        number: `${floor}0${i % 5 || 5}`,
        type: roomTypes[i % 4],
        price: 4500 + (i % 4) * 2000,
        status: i % 7 === 0 ? 'OCCUPIED' : 'AVAILABLE',
        floor: floor
      }
    })
  }

  // Menu Items
  const menuCategories = ['Appetizers', 'Main Course', 'Desserts', 'Cocktails', 'Wine & Spirits']
  const sampleItems = [
    { name: 'Grilled Salmon', category: 'Main Course', price: 2500 },
    { name: 'Caesar Salad', category: 'Appetizers', price: 1200 },
    { name: 'Chocolate Fondant', category: 'Desserts', price: 850 },
    { name: 'Old Fashioned', category: 'Cocktails', price: 1500 },
    { name: 'Merlot 2018', category: 'Wine & Spirits', price: 4500 }
  ]

  for (const item of sampleItems) {
    await prisma.menuItem.create({
      data: item
    })
  }

  // Inventory
  const inventoryItems = [
    { name: 'Bedsheets - Queen', category: 'Linen', stock: 50, unit: 'pcs', price: 1200 },
    { name: 'Bath Towels', category: 'Linen', stock: 100, unit: 'pcs', price: 800 },
    { name: 'Shampoo (5L)', category: 'Toiletries', stock: 10, unit: 'bottles', price: 3500 },
    { name: 'Wine Glasses', category: 'Glassware', stock: 80, unit: 'pcs', price: 450 }
  ]

  for (const item of inventoryItems) {
    await prisma.inventoryItem.create({
      data: item
    })
  }

  console.log('Seeding completed successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
