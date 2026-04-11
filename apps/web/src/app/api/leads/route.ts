import { NextResponse } from 'next/server';

// In-memory leads storage
const leads = [
  { id: 'lead-1', name: 'Test Lead', email: 'test@example.com', phone: '+8801234567890', message: 'Interested in tractors', status: 'NEW', createdAt: new Date().toISOString() },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newLead = {
      id: `lead-${Date.now()}`,
      ...body,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    leads.push(newLead);

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}