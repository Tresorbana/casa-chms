import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, category, stock, unit, price, minStock } = body

    const parsedStock = parseInt(stock)

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        stock: parsedStock,
        unit,
        price: parseFloat(price),
        minStock: minStock !== undefined ? parseInt(String(minStock), 10) : 10,
      }
    })

    // Record initial stock movement if stock > 0
    if (parsedStock > 0) {
      await prisma.stockMovement.create({
        data: {
          itemId: item.id,
          type: 'IN',
          quantity: parsedStock,
          reason: 'INITIAL',
        },
      })
    }

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}
