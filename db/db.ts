import mongoose from "mongoose";
import dotenv from "dotenv";
import { request } from "http";
dotenv.config();

const mongourl = process.env.MONGO_URL ?? "";

// Connection options optimized for serverless
const options = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10s
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5, // Maintain at least 5 socket connections
  maxIdleTimeMS: 60000, // Close idle connections after 60s
};

// Cache the database connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongourl, options).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Connect to database
connectDB().catch((err) => {
  console.error("MongoDB connection error:", err);
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    maxLength: 30,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
  },
});

const clockSchema = new mongoose.Schema({
  hours: {
    type: Number,
    required: true,
    min: 0,
    max: 23,
  },
  minutes: {
    type: Number,
    required: true,
    min: 0,
    max: 59,
  },
});

const roomEnum = [
  "Ruang Rapat F3",
  "Ruang Rapat F6",
  "Ruang Rapat F5",
  "Ruang Kolaborasi Hakim",
  "Ruang Kolaborasi Pegawai",
  "Ruang Rapat F2",
  "Ruang Assessment F5",
  "Ruang Assessment F6",
  "Ruang Serbaguna A5",
];

const jenisEnum = ["Offline", "Hybrid"];

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  day: {
    type: String,
    lowercase: true,
    required: true,
  },
  date: {
    type: String,
    lowercase: true,
    required: true,
  },
  event: {
    type: String,
    lowercase: true,
    required: true,
  },
  clockStart: {
    type: clockSchema,
    required: true,
  },
  clockEnd: {
    type: clockSchema,
    required: true,
  },
  room: {
    type: String,
    enum: roomEnum,
  },
  pic: {
    type: String,
    required: true,
  },
  kapasitas: {
    type: String,
    required: true,
  },
  rapat: {
    type: String,
    enum: jenisEnum,
  },
  catatan: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
const Booking = mongoose.model("Booking", bookingSchema);

const model = {
  User,
  Booking,
};

export default model;

// Add connection event handlers
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
