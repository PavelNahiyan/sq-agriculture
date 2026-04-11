import { NextResponse } from 'next/server';
import { productsWithCategories, categories } from '@/lib/data';

export async function GET() {
  try {
    return NextResponse.json(productsWithCategories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = {
      id: `prod-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}