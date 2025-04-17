export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import { Buffer } from "buffer";
import { getUserIdByToken } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";

// Configure Cloudinary
cloudinary.config({
  cloud_name:   process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:      process.env.CLOUDINARY_API_KEY!,
  api_secret:   process.env.CLOUDINARY_API_SECRET!,
});

/** Upload a Buffer under profiles/{userId} */
function uploadBuffer(buffer: Buffer, userId: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `profiles/${userId}`,
        use_filename: true,
        unique_filename: false,
      },
      (err, result) => {
        if (err) return reject(err);
        if (!result) return reject(new Error("No result from Cloudinary"));
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

export async function POST(req: NextRequest) {
  // 1) Authenticate
  await dbConnect();
  const token = req.cookies.get("sessionToken")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const userId = await getUserIdByToken(token);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // 2) Parse file
  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  // 3) Buffer it
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 4) Upload and return URL
  try {
    const result = await uploadBuffer(buffer, userId);
    return NextResponse.json({ url: result.secure_url });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
