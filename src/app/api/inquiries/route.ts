import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'



export async function GET() {
    try {
        const inquiries = await prisma.webInquiry.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(inquiries)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, subject, message, checkIn, checkOut, guests, roomType } = body

        const inquiry = await (prisma.webInquiry as any).create({
            data: {
                name,
                email,
                subject: subject || 'Booking Request',
                message,
                status: 'NEW',
                checkIn: checkIn ? new Date(checkIn) : null,
                checkOut: checkOut ? new Date(checkOut) : null,
                guests: guests ? parseInt(guests) : null,
                roomType: roomType || null
            }
        })


        return NextResponse.json(inquiry)
    } catch (error) {
        console.error('Inquiry creation error:', error)
        return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, status, response } = body

        const data: any = { status }
        if (response !== undefined) {
            data.response = response
            data.status = 'REPLIED'
        }

        const inquiry = await prisma.webInquiry.update({
            where: { id },
            data
        })

        return NextResponse.json(inquiry)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
    }
}

