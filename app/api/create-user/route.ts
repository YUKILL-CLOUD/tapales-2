import { createUserAfterSignUp } from '@/lib/users';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const user = await createUserAfterSignUp();
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in create-user API route:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}