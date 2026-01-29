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
        const { name, email, subject, message } = body

        const inquiry = await prisma.webInquiry.create({
            data: {
                name,
                email,
                subject,
                message,
                status: 'NEW'
            }
        })

        return NextResponse.json(inquiry)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, status } = body

        const inquiry = await prisma.webInquiry.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json(inquiry)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
    }
}
