import mongoose from "mongoose";
import dotenv from "dotenv";
import { request } from "http";
dotenv.config();

const mongourl = process.env.MONGO_URL ?? "";

mongoose.connect(mongourl);

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
