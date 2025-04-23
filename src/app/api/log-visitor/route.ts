// app/api/log-visitor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import VisitorLog from '@/models/VisitorLog';

export async function POST(req: NextRequest) {
  await dbConnect();

  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'Unknown';

  const userAgent = req.headers.get('user-agent') || 'Unknown';
  const url = req.nextUrl.pathname || '/';

  await VisitorLog.create({
    ip,
    userAgent,
    referrer: req.headers.get('referer') || '',
    page: url,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
