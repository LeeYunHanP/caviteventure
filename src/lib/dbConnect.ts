import mongoose from "mongoose";

const { MONGODB_URI, MONGODB_DBNAME = "caviteventure" } = process.env;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}
// Avoid multiple connections in development
global._mongoose ||= { conn: null, promise: null };

export default async function dbConnect(): Promise<typeof mongoose> {
  if (global._mongoose.conn) {
    return global._mongoose.conn;
  }

  if (!global._mongoose.promise) {
    const opts: mongoose.ConnectOptions = {
      dbName: MONGODB_DBNAME,
      maxPoolSize: 10,             // Good default for serverless
      bufferCommands: false,       // Fail fast if not connected
      serverSelectionTimeoutMS: 5000, // 5s timeout
    };

    global._mongoose.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        console.log("✅  MongoDB connected");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌  MongoDB connection error:", err);
        // Reset promise so we can retry on next invocation
        global._mongoose.promise = null;
        throw err;
      });
  }

  global._mongoose.conn = await global._mongoose.promise!;
  return global._mongoose.conn;
}
