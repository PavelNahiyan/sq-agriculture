import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      return NextResponse.json({ 
        error: 'DATABASE_URL not set',
        hasEnv: false
      }, { status: 500 });
    }
    
    // Try to connect
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$connect();
    
    // Test query
    const count = await prisma.product.count();
    
    await prisma.$disconnect();
    
    return NextResponse.json({ 
      success: true,
      hasEnv: true,
      productCount: count,
      dbUrl: dbUrl.replace(/:[^:]+@/, ':****@') // Mask password
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}