/**
 * Wipes all transactional data while keeping:
 * Users, Rooms, Floors, Services, Menu Items, Inventory Items, Conference Rooms
 *
 * Run: npx ts-node --skip-project scripts/reset-db.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database reset...\n');

  const invoiceItems = await prisma.invoiceItem.deleteMany();
  console.log(`  Deleted ${invoiceItems.count} invoice items`);

  // Break self-referential links before deleting invoices
  await prisma.invoice.updateMany({ data: { masterInvoiceId: null } });
  const invoices = await prisma.invoice.deleteMany();
  console.log(`  Deleted ${invoices.count} invoices`);

  const stockMovements = await prisma.stockMovement.deleteMany();
  console.log(`  Deleted ${stockMovements.count} stock movements`);

  const serviceCharges = await prisma.serviceCharge.deleteMany();
  console.log(`  Deleted ${serviceCharges.count} service charges`);

  const conferenceItems = await prisma.conferenceBookingItem.deleteMany();
  console.log(`  Deleted ${conferenceItems.count} conference booking items`);

  const conferenceBookings = await prisma.conferenceBooking.deleteMany();
  console.log(`  Deleted ${conferenceBookings.count} conference bookings`);

  const bookings = await prisma.booking.deleteMany();
  console.log(`  Deleted ${bookings.count} bookings`);

  const guests = await prisma.guest.deleteMany();
  console.log(`  Deleted ${guests.count} guests`);

  const webInquiries = await prisma.webInquiry.deleteMany();
  console.log(`  Deleted ${webInquiries.count} web inquiries`);

  const notifications = await prisma.notification.deleteMany();
  console.log(`  Deleted ${notifications.count} notifications`);

  const expenses = await prisma.expense.deleteMany();
  console.log(`  Deleted ${expenses.count} expenses`);

  const otherIncome = await prisma.otherIncome.deleteMany();
  console.log(`  Deleted ${otherIncome.count} other income records`);

  // Reset all rooms back to available
  const roomsReset = await prisma.room.updateMany({ data: { status: 'AVAILABLE' } });
  console.log(`  Reset ${roomsReset.count} rooms → AVAILABLE`);

  console.log('\nDone! Kept: Users · Rooms · Floors · Services · Menu Items · Inventory · Conference Rooms');
}

main()
  .catch((e) => { console.error('Reset failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
