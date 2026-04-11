import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sq-agriculture-secret-key-2026';

// Admin users (in production, use proper auth with database)
const users = [
  { id: 'user-1', email: 'admin@sqagriculture.com', password: 'admin123', name: 'Admin User', role: 'ADMIN' },
  { id: 'user-2', email: 'manager@sqagriculture.com', password: 'manager123', name: 'Manager', role: 'MANAGER' },
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}