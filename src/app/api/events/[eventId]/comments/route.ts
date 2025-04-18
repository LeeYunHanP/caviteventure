import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await dbConnect();
    const docs = await Comment.find({ eventId: id })
                              .sort({ createdAt: -1 })
                              .lean();

    const comments = docs.map(c => ({
      id:         c._id.toString(),
      userName:   c.userName,
      rating:     c.rating,
      text:       c.text,
      likes:      c.likes,
      dislikes:   c.dislikes,
      createdAt:  c.createdAt.toISOString(),
    }));

    return NextResponse.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await dbConnect();
    const { rating, text } = await request.json();

    if (typeof rating !== "number" || rating < 1 || !text?.trim()) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const commentDoc = await Comment.create({
      eventId: new mongoose.Types.ObjectId(id),
      rating,
      text: text.trim(),
    });

    const comment = {
      id:         commentDoc.id,
      userName:   commentDoc.userName,
      rating:     commentDoc.rating,
      text:       commentDoc.text,
      likes:      commentDoc.likes,
      dislikes:   commentDoc.dislikes,
      createdAt:  commentDoc.createdAt.toISOString(),
    };

    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    console.error("Error inserting comment:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
