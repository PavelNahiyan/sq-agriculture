import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        message: body.message,
        source: 'website',
        status: 'NEW',
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}