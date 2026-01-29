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
  // Note: Schema expects `room.floor` to be Model `Floor`, but in previous seed it was used as integer in create? 
  // Checking schema provided earlier: `floor Floor? @relation...` but existing seed used `floor: floor` (int). 
  // This implies previous seed might have been failing or schema wasn't strictly enforced if using loose types?
  // Let's do it correctly: Create Floors first.

  for (let f = 1; f <= 4; f++) {
    const floor = await prisma.floor.upsert({
      where: { number: f },
      update: {},
      create: { number: f }
    });

    const roomTypes = ['DELUXE', 'EXECUTIVE', 'STANDARD', 'SUITE'];
    for (let r = 1; r <= 5; r++) {
      const roomNum = `${f}0${r}`;
      const type = roomTypes[(r + f) % 4];
      await prisma.room.upsert({
        where: { number: roomNum },
        update: { floorId: floor.id },
        create: {
          number: roomNum,
          type: type,
          price: 45000 + (r * 5000), // Adjusted price to match RWF realistic values
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
    const guest = await prisma.guest.create({ data: g });
    createdGuests.push(guest);
  }

  // 4. Bookings (Past & Present)
  const sources = ['DIRECT', 'ONLINE', 'CORPORATE', 'WALK_IN'];
  const now = new Date();

  // Find some rooms
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
        status: isPast ? 'COMPLETED' : 'CONFIRMED',
        source: sources[i % 4],
        totalAmount: room.price * 2,
        createdAt: checkIn // Important for reports filtering
      }
    });
  }

  // 5. Invoices (Room, Restaurant, Master)
  for (const guest of createdGuests) {
    // Room Invoice
    const invRoom = await prisma.invoice.create({
      data: {
        guestName: guest.name,
        amount: 90000,
        type: 'ROOM',
        status: 'PAID',
        items: {
          create: [
            { description: 'Room Charge - 2 Nights', quantity: 2, price: 45000 }
          ]
        }
      }
    });

    // Restaurant Invoice
    const invRest = await prisma.invoice.create({
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

    // Master Invoice (Combining them)
    await prisma.invoice.create({
      data: {
        guestName: guest.name,
        amount: 105000,
        type: 'MASTER',
        status: 'PENDING',
        masterInvoiceId: null, // Self
        items: {
          create: [{ description: 'Consolidated Charges', quantity: 1, price: 105000 }]
        },
        // In a real relation scenario, we would link invRoom and invRest here if Schema allows updates
        // For now, creating a standalone master for demo
      }
    })
  }

  // 6. Menu & Services
  const menuItems = [
    { name: 'Grilled Tilapia', category: 'Main', price: 12000, available: true },
    { name: 'Isombe', category: 'Traditional', price: 4000, available: true }
  ];
  for (const m of menuItems) await prisma.menuItem.create({ data: m });

  const services = [
    { name: 'Airport Shuttle', price: 25000, unit: 'trip' },
    { name: 'Massage', price: 30000, unit: 'hour' }
  ];
  for (const s of services) await prisma.service.create({ data: s });

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
