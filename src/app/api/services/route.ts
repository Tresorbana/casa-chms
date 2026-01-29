import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(services)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, price, unit } = body

        const service = await prisma.service.create({
            data: {
                name,
                price: parseFloat(price),
                unit
            }
        })

        return NextResponse.json(service)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
    }
}
