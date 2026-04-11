import { NextResponse } from 'next/server';
import { productsWithCategories } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: `Data loaded: ${productsWithCategories.length} products available (no database needed)` 
  });
}