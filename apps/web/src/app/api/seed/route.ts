import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    const filePath = 'E:\\sq agriculture website\\Materials\\Seed\\Bank Loan plan - seed 2026.xlsx';
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    return NextResponse.json({ 
      success: true, 
      message: `Seed data loaded: ${data.length} rows from Excel`,
      data: data.slice(0, 5)
    });
  } catch(e: any) {
    return NextResponse.json({ 
      success: false, 
      error: e.message 
    }, { status: 500 });
  }
}