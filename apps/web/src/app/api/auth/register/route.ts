import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sq-agriculture-secret-key-2026';

// In-memory user storage (for demo purposes)
const users = [
  { id: 'user-1', email: 'admin@sqagriculture.com', password: 'admin123', name: 'Admin User', role: 'ADMIN' },
];

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();
    
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password, // In production, hash the password
      name,
      role: 'USER',
    };

    users.push(newUser);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}