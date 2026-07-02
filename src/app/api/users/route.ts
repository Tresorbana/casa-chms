import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { canAssignRole, normalizeRole } from '@/lib/rbac'

function canManageUsers(role: string | null | undefined) {
    return ['ADMIN', 'SUPER_ADMIN'].includes(normalizeRole(role) ?? '');
}

export async function GET() {
    const session = await getSession()
    if (!session || !canManageUsers(session.user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: session ? 403 : 401 })
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(users)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || !canManageUsers(session.user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: session ? 403 : 401 })
    }

    try {
        const body = await request.json()
        const { email, name, password, role } = body

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const normalizedRole = normalizeRole(role) ?? 'STAFF'

        if (!canAssignRole(session.user.role, normalizedRole)) {
            return NextResponse.json({ error: 'You cannot assign that role' }, { status: 403 })
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: normalizedRole,
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    const session = await getSession()
    if (!session || !canManageUsers(session.user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: session ? 403 : 401 })
    }

    try {
        const body = await request.json()
        const { id, name, email, password, role } = body

        if (!id) {
            return NextResponse.json({ error: 'User id is required' }, { status: 400 })
        }

        const normalizedRole = role !== undefined ? normalizeRole(role) : undefined
        if (role !== undefined && !normalizedRole) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
        }

        if (normalizedRole && !canAssignRole(session.user.role, normalizedRole)) {
            return NextResponse.json({ error: 'You cannot assign that role' }, { status: 403 })
        }

        const updates: Record<string, unknown> = {}
        if (name !== undefined) updates.name = name
        if (email !== undefined) updates.email = email
        if (normalizedRole) updates.role = normalizedRole
        if (password) updates.password = await bcrypt.hash(password, 10)

        const user = await prisma.user.update({
            where: { id },
            data: updates,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}
