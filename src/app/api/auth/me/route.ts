import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '@/lib/auth';
import { apiError, serviceUnavailable } from '@/lib/http';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) return serviceUnavailable();
    const admin = await getAdmin();
    if (!admin) {
      if (request.nextUrl.searchParams.get('optional') === '1') {
        return NextResponse.json({ user: null }, { status: 200, headers: { 'Cache-Control': 'private, no-store' } });
      }
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user: admin });
  } catch (error) {
    return apiError(error);
  }
}
