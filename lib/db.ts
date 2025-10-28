import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment. Add it to .env.local");
}

let globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const cache = globalWithMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalWithMongoose.mongooseCache = cache;

export async function dbConnect(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    if (!MONGODB_URI) {
      throw new Error(
        "Missing MONGODB_URI in environment. Add it to .env.local"
      );
    }
    cache.promise = mongoose.connect(MONGODB_URI, { dbName: "quizApp" });
    console.log("Mongodb Connected Successfully");
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
