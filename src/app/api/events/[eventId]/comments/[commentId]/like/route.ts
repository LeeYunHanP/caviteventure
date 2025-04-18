import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { getUserIdByToken } from "@/lib/auth";
import Comment, { IComment } from "@/models/Comment";

// Extend IComment so TS knows likedBy/dislikedBy are ObjectIds
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
  // only extract commentId to avoid unused-vars
  const { commentId } = await context.params;

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

  // --- Prevent multiple likes ---
  if (comment.likedBy.some(id => id.toString() === userId)) {
    return NextResponse.json({ likes: comment.likes });
  }

  // --- Remove previous dislike if present ---
  if (comment.dislikedBy.some(id => id.toString() === userId)) {
    comment.dislikes -= 1;
    comment.dislikedBy = comment.dislikedBy.filter(
      id => id.toString() !== userId
    );
  }

  // --- Add like ---
  comment.likes += 1;
  comment.likedBy.push(new Types.ObjectId(userId));
  await comment.save();

  return NextResponse.json({ likes: comment.likes });
}
