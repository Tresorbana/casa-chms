import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      where: { available: true },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, category, price, description } = body
    
    const item = await prisma.menuItem.create({
        data: {
            name,
            category,
            price: parseFloat(price),
            description
        }
    })
    
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 })
  }
}
