// app/api/log-visit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import VisitorLog from '@/models/VisitorLog';

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  await VisitorLog.create(body);
  return NextResponse.json({ success: true });
}
