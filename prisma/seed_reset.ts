import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function reset() {
    console.log('Resetting Database...')

    // Delete all existing data
    await prisma.serviceCharge.deleteMany({})
    await prisma.invoiceItem.deleteMany({})
    await prisma.invoice.deleteMany({})
    await prisma.booking.deleteMany({})
    await prisma.guest.deleteMany({})
    await prisma.room.deleteMany({})
    await prisma.floor.deleteMany({})
    await prisma.menuItem.deleteMany({})
    await prisma.service.deleteMany({})
    await prisma.conferenceBooking.deleteMany({})
    await prisma.conferenceRoom.deleteMany({})

    console.log('Deleted all data.')

    // Seed Floors
    const floors = [
        {
            number: 1, name: 'Floor 1', rooms: [
                { number: '101', type: 'EXECUTIVE', price: 6500 },
                { number: '102', type: 'STANDARD', price: 8500 },
                { number: '103', type: 'SUITE', price: 10500 },
                { number: '104', type: 'DELUXE', price: 4500 },
                { number: '105', type: 'EXECUTIVE', price: 6500 },
            ]
        },
        {
            number: 2, name: 'Floor 2', rooms: [
                { number: '201', type: 'STANDARD', price: 8500 },
                { number: '202', type: 'SUITE', price: 10500 },
                { number: '203', type: 'DELUXE', price: 4500 },
                { number: '204', type: 'EXECUTIVE', price: 6500 },
                { number: '205', type: 'STANDARD', price: 8500 },
            ]
        }
    ]

    for (const f of floors) {
        const floor = await prisma.floor.create({
            data: {
                number: f.number,
                name: f.name
            }
        })

        for (const r of f.rooms) {
            await prisma.room.create({
                data: {
                    number: r.number,
                    type: r.type,
                    price: r.price,
                    floorId: floor.id,
                    status: 'AVAILABLE'
                }
            })
        }
    }

    // Seed Services
    await prisma.service.createMany({
        data: [
            { name: 'Room Service', price: 500, unit: 'Order' },
            { name: 'Laundry', price: 1000, unit: 'Kg' },
            { name: 'Spa', price: 5000, unit: 'Session' }
        ]
    })

    // Seed Menu
    await prisma.menuItem.createMany({
        data: [
            { name: 'Burger', category: 'Main', price: 2500, available: true },
            { name: 'Soda', category: 'Drinks', price: 500, available: true },
            { name: 'Coffee', category: 'Drinks', price: 1000, available: true }
        ]
    })

    console.log('Seeding Completed.')
}

reset()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
