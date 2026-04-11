import { NextResponse } from 'next/server';
import { categories } from '@/lib/data';

export async function GET() {
  try {
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCategory = {
      id: `cat-${Date.now()}`,
      ...body,
    };
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}