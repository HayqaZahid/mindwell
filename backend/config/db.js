import mongoose from "mongoose";

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected:", cached.conn.connection.host);
    return cached.conn;
  } catch (err) {
    cached.promise = null; // lets the next request try again
    const perServer = err.reason?.servers
      ? [...err.reason.servers.entries()]
          .map(([host, s]) => `${host}: ${s.error?.message || "no error info"}`)
          .join(" | ")
      : "";
    console.error("MongoDB connection failed:", err.name, perServer);
    throw err;
  }
};

export default connectDB;
