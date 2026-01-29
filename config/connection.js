import mongoose from "mongoose";

const connectionString = process.env.MONGODB_CONNECTION_STRING;

if (!connectionString) {
  console.error("❌ MongoDB connection string is missing.");
  process.exit(1);
}

const options = {
  connectTimeoutMS: 2000,
  serverSelectionTimeoutMS: 2000,
};

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(connectionString, options).then((mongoose) => {
      console.log("✅ my-80store database connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

mongoose.set("debug", false);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

export default connectDB;
