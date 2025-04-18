import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { getUserIdByToken } from "@/lib/auth";
import Comment, { IComment } from "@/models/Comment";

interface CommentDoc extends IComment {
  likedBy: Types.ObjectId[];
  dislikedBy: Types.ObjectId[];
}

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      eventId: string;
      commentId: string;
    }>;
  }
) {
  // await the params promise
  const {commentId } = await context.params;

  await dbConnect();

  // --- Authenticate ---
  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken")?.value;
  const userId = token ? await getUserIdByToken(token) : null;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // --- Load comment ---
  const comment = (await Comment.findById(commentId)) as CommentDoc | null;
  if (!comment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // --- Prevent multiple dislikes ---
  if (comment.dislikedBy.some(id => id.toString() === userId)) {
    return NextResponse.json({ dislikes: comment.dislikes });
  }

  // --- Remove previous like if present ---
  if (comment.likedBy.some(id => id.toString() === userId)) {
    comment.likes -= 1;
    comment.likedBy = comment.likedBy.filter(
      id => id.toString() !== userId
    );
  }

  // --- Add dislike ---
  comment.dislikes += 1;
  comment.dislikedBy.push(new Types.ObjectId(userId));
  await comment.save();

  return NextResponse.json({ dislikes: comment.dislikes });
}
