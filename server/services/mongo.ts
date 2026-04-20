import mongoose from "mongoose";

let connectPromise: Promise<typeof mongoose> | null = null;

export function connectMongo(): Promise<typeof mongoose> {
  if (!connectPromise) {
    const uri = (process.env.MONGODB_URI || "").trim();
    const dbName = (process.env.MONGODB_DB || "").trim() || undefined;

    if (!uri) {
      return Promise.reject(new Error("MONGODB_URI is not set."));
    }

    connectPromise = mongoose.connect(uri, { dbName }).catch((error) => {
      connectPromise = null;
      throw error;
    });
  }

  return connectPromise;
}
