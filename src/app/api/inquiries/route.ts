import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'

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

        // Send automated email if response is provided
        let emailResult = null;
        if (response !== undefined && inquiry.email) {
            emailResult = await sendEmail({
                to: inquiry.email,
                subject: `Response to your inquiry: ${inquiry.subject}`,
                text: `Dear ${inquiry.name},\n\nThank you for your inquiry regarding "${inquiry.subject}".\n\nOur response:\n${response}\n\nBest regards,\nHotel Management Team`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
                        <h2 style="color: #1e293b; border-bottom: 2px solid #57534e; padding-bottom: 10px;">Hotel Management</h2>
                        <p style="color: #475569; font-size: 16px;">Dear ${inquiry.name},</p>
                        <p style="color: #475569; font-size: 16px;">Thank you for reaching out to us regarding <strong>${inquiry.subject}</strong>.</p>
                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #57534e;">
                            <p style="color: #1e293b; font-weight: bold; margin-bottom: 10px;">Our Response:</p>
                            <p style="color: #334155; line-height: 1.6;">${response.replace(/\n/g, '<br>')}</p>
                        </div>
                        <p style="color: #475569; font-size: 16px;">We look forward to welcoming you soon.</p>
                        <p style="color: #64748b; font-size: 14px; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                            Best regards,<br>
                            <strong>Hotel Management Team</strong><br>
                            Southern Province, Rwanda
                        </p>
                    </div>
                `
            });
            
            if (!emailResult.success) {
                console.error('CRITICAL: Automated email failed to send:', emailResult.error);
            } else {
                console.log('Automated email sent successfully to:', inquiry.email);
            }
        }

        return NextResponse.json({ 
            ...inquiry, 
            emailSent: emailResult?.success ?? false,
            emailError: emailResult?.success ? null : emailResult?.error 
        })
    } catch (error) {
        console.error('Inquiry update/email error:', error)
        return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
    }
}

