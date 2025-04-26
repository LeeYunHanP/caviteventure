// src/app/api/clicks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Click from '@/models/Click'

// shape of the JSON body we expect
interface ClickBody {
  id: string
}

export async function POST(request: NextRequest) {
  let body: ClickBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON' },
      { status: 400 }
    )
  }

  const { id } = body
  if (typeof id !== 'string' || id.trim().length === 0) {
    return NextResponse.json(
      { success: false, message: 'Missing or invalid id' },
      { status: 400 }
    )
  }

  try {
    await dbConnect()
    await Click.findOneAndUpdate(
      { id },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    )
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    console.error('Mongoose POST error', error)
    return NextResponse.json(
      { success: false, message: 'Database error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await dbConnect()
    const data = await Click.find({}, { _id: 0, id: 1, count: 1 })
      .lean()
      .exec()
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error: unknown) {
    console.error('Mongoose GET error', error)
    return NextResponse.json(
      { success: false, message: 'Database error' },
      { status: 500 }
    )
  }
}
