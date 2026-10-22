import { NextResponse } from 'next/server';
import { getAdmin } from '@/lib/auth';
import { apiError, serviceUnavailable } from '@/lib/http';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) return serviceUnavailable();
    const admin = await getAdmin();
    if (!admin) return NextResponse.json({ user: null }, { status: 401 });
    return NextResponse.json({ user: admin });
  } catch (error) {
    return apiError(error);
  }
}
