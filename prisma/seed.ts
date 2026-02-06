import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clean up
  // await prisma.invoiceItem.deleteMany({})
  // await prisma.invoice.deleteMany({})
  // await prisma.serviceCharge.deleteMany({})
  // await prisma.booking.deleteMany({})
  // await prisma.guest.deleteMany({})

  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('Hhhhhhh@', 10)

  // 1. Users
  await prisma.user.upsert({ where: { email: 'admin@casahotel.com' }, update: {}, create: { email: 'admin@casahotel.com', name: 'Admin User', password: adminPassword, role: 'ADMIN' } })
  await prisma.user.upsert({ where: { email: 'tresorbana77@gmail.com' }, update: {}, create: { email: 'tresorbana77@gmail.com', name: 'Tresor Bana', password: userPassword, role: 'ADMIN' } })

  // 2. Room Configuration
  const floorLabels: { [key: number]: string } = {
    1: 'Grand Lobby & Garden',
    2: 'Executive Floor',
    3: 'Skyline Suites',
    4: 'Penthouse Level'
  };

  for (let f = 1; f <= 4; f++) {
    const floor = await prisma.floor.upsert({
      where: { number: f },
      update: { name: floorLabels[f] || `Floor ${f}` }, // Explicitly set names
      create: {
        number: f,
        name: floorLabels[f] || `Floor ${f}`
      }
    });

    const roomTypes = ['DELUXE', 'EXECUTIVE', 'STANDARD', 'SUITE'];
    for (let r = 1; r <= 5; r++) {
      const roomNum = `${f}0${r}`;
      const type = roomTypes[(r + f) % 4];
      await prisma.room.upsert({
        where: { number: roomNum },
        update: {
          floorId: floor.id,
          type: type,
          price: 45000 + (r * 15000)
        },
        create: {
          number: roomNum,
          type: type,
          price: 45000 + (r * 15000),
          status: (r + f) % 3 === 0 ? 'OCCUPIED' : 'AVAILABLE',
          floorId: floor.id
        }
      });
    }
  }

  // 3. Guests
  const guests = [
    { name: 'John Doe', email: 'john@example.com', nationality: 'USA', phone: '+123456789' },
    { name: 'Alice Smith', email: 'alice@example.com', nationality: 'UK', phone: '+44789456123' },
    { name: 'Jean Pierre', email: 'jp@example.com', nationality: 'Rwanda', phone: '+250788123456' },
    { name: 'Wei Zhang', email: 'wei@example.com', nationality: 'China', phone: '+86139000000' }
  ];

  const createdGuests = [];
  for (const g of guests) {
    const guest = await prisma.guest.upsert({
      where: { email: g.email || '' },
      update: g,
      create: g
    });
    createdGuests.push(guest);
  }

  // 4. Bookings (Past & Present)
  const sources = ['DIRECT', 'ONLINE', 'CORPORATE', 'WALK_IN'];
  const now = new Date();
  const rooms = await prisma.room.findMany({ take: 10 });

  for (let i = 0; i < 20; i++) {
    const guest = createdGuests[i % createdGuests.length];
    const room = rooms[i % rooms.length];
    const isPast = i > 10;
    const checkIn = new Date();
    checkIn.setDate(now.getDate() - (isPast ? (i * 5) : 0));
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 2);

    await prisma.booking.create({
      data: {
        roomId: room.id,
        guestId: guest.id,
        checkIn: checkIn,
        checkOut: checkOut,
        status: isPast ? 'COMPLETED' : 'CHECKED_IN',
        source: sources[i % 4],
        totalAmount: room.price * 2,
        createdAt: checkIn
      }
    });
  }

  // 5. Invoices
  for (const guest of createdGuests) {
    await prisma.invoice.create({
      data: {
        guestName: guest.name,
        amount: 90000,
        type: 'ROOM',
        status: 'PAID',
        items: {
          create: [{ description: 'Room Charge - 2 Nights', quantity: 2, price: 45000 }]
        }
      }
    });

    await prisma.invoice.create({
      data: {
        guestName: guest.name,
        amount: 15000,
        type: 'RESTAURANT',
        status: 'UNPAID',
        items: {
          create: [
            { description: 'Grilled Salmon', quantity: 1, price: 12000 },
            { description: 'Sparkling Water', quantity: 2, price: 1500 }
          ]
        }
      }
    });
  }

  // 6. Menu & Services
  const menuItems = [
    { name: 'Grilled Tilapia', category: 'Main Course', price: 12000, available: true },
    { name: 'Isombe', category: 'Traditional', price: 4000, available: true },
    { name: 'Sambaza', category: 'Appetizers', price: 6000, available: true },
    { name: 'Primus Bottle', category: 'Drinks', price: 2500, available: true },
    { name: 'Akabenz', category: 'Main Course', price: 8000, available: true }
  ];
  for (const m of menuItems) {
    await prisma.menuItem.create({ data: m });
  }

  const services = [
    { name: 'Airport Shuttle', price: 25000, unit: 'trip' },
    { name: 'Massage', price: 30000, unit: 'hour' },
    { name: 'Laundry', price: 10000, unit: 'load' },
    { name: 'Room Service Fee', price: 5000, unit: 'session' }
  ];
  for (const s of services) {
    await prisma.service.upsert({ where: { name: s.name }, update: {}, create: s });
  }

  // 7. Conference Rooms
  const conferences = [
    { name: 'Grand Ballroom', capacity: 300, pricePerHour: 150000 },
    { name: 'Executive Suite', capacity: 20, pricePerHour: 50000 },
    { name: 'Garden Terrace', capacity: 100, pricePerHour: 80000 }
  ];
  for (const c of conferences) {
    await prisma.conferenceRoom.create({ data: c });
  }

  // 8. Inventory Items
  const inventory = [
    { name: 'White Bed Sheets', category: 'Linen', stock: 120, unit: 'pcs', price: 15000 },
    { name: 'Bath Towels', category: 'Linen', stock: 85, unit: 'pcs', price: 8000 },
    { name: 'Hand Soap 500ml', category: 'Toiletries', stock: 45, unit: 'bottles', price: 3500 },
    { name: 'Coffee Beans 1kg', category: 'F&B', stock: 12, unit: 'kg', price: 12000 }
  ];
  for (const i of inventory) {
    await prisma.inventoryItem.create({ data: i });
  }

  // 9. Web Inquiries
  const inquiries = [
    { name: 'Sarah Wilson', email: 'sarah@globex.com', subject: 'Corporate Event', message: 'Interested in booking the Ballroom for Oct 20th.', status: 'NEW' },
    { name: 'David Mwangi', email: 'davidm@kenya.co', subject: 'Long Stay', message: 'Do you offer monthly rates for executive rooms?', status: 'NEW' }
  ];
  for (const i of inquiries) {
    await prisma.webInquiry.create({ data: i });
  }

  // 10. Notifications
  const notifications = [
    { message: 'System Update: v3.1 successfully deployed.', type: 'INFO' },
    { message: 'Low Stock Alert: Bath Towels (85 remaining)', type: 'WARNING' },
    { message: 'New Inquiry: Corporate Event from Sarah Wilson', type: 'SUCCESS' }
  ];
  for (const n of notifications) {
    await prisma.notification.create({ data: n });
  }

  console.log('Seeding completed with comprehensive realistic data.');
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
