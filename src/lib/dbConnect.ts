import mongoose from "mongoose";

const { MONGODB_URI, MONGODB_DBNAME = "caviteventure" } = process.env;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}
global._mongoose ||= { conn: null, promise: null };

export default async function dbConnect() {
  if (global._mongoose.conn) return global._mongoose.conn;

  if (!global._mongoose.promise) {
    global._mongoose.promise = mongoose
      .connect(MONGODB_URI!, {
        dbName: MONGODB_DBNAME,
        maxPoolSize: 10, // Good default for serverless environments
        serverSelectionTimeoutMS: 30_000,
      })
      .then((mongoose) => {
        console.log("✅  MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌  MongoDB connection error:", err);
        throw err;
      });
  }

  global._mongoose.conn = await global._mongoose.promise;
  return global._mongoose.conn;
}
