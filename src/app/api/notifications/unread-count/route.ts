import { NextResponse } from 'next/server'

export async function GET() {
    // Mock data since we don't have a notifications table yet
    return NextResponse.json({ count: 3 })
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    })
}
