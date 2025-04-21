import express, { Request, Response } from "express";
import moment from "moment-timezone";
import { z } from "zod";
import model from "../db/db";
import authmiddleware from "../middleware/authmiddleware";

const router = express.Router();

interface RequestDecode extends Request {
  decode?: any;
}

const Booking = model.Booking;

router.get("/", async (_req: RequestDecode, res: Response) => {
  const dataBooking = await Booking.find({});
  res.json({
    msg: dataBooking,
  });
});

const clockSchema = z.object({
  hours: z.number().int().min(0).max(23),
  minutes: z.number().int().min(0).max(59),
});

const inputSchema = z.object({
  date: z.string(),
  event: z.string(),
  clockStart: clockSchema,
  clockEnd: clockSchema,
  room: z.enum([
    "Ruang Rapat F3",
    "Ruang Rapat F6",
    "Ruang Rapat F5",
    "Ruang Kolaborasi Hakim",
    "Ruang Kolaborasi Pegawai",
    "Ruang Rapat F2",
    "Ruang Assessment F5",
    "Ruang Assessment F6",
    "Ruang Serbaguna A5",
  ]),
  pic: z.string(),
  kapasitas: z.string(),
  rapat: z.enum(["Offline", "Hybrid"]),
  catatan: z.string(),
});

router.get(
  "/:id",
  authmiddleware,
  async (req: RequestDecode, res: Response) => {
    const { id } = req.params;
    const dataBooking = await Booking.findById({ _id: id });
    res.json({
      msg: dataBooking,
    });
  },
);

type inputType = z.infer<typeof inputSchema>;

router.post(
  "/add",
  authmiddleware,
  async (req: RequestDecode, res: Response) => {
    const input: inputType = req.body;
    const { id } = req.decode;
    const inputFormat = inputSchema.safeParse(req.body);
    const dateEpoch = new Date(input.date).getTime();
    const date = new Date(dateEpoch);
    const inputDays = moment(date).tz("Asia/Jakarta").format("dddd");
    if (inputFormat.success) {
      await Booking.create({
        userId: id,
        day: inputDays,
        date: dateEpoch,
        event: input.event,
        clockStart: input.clockStart,
        clockEnd: input.clockEnd,
        room: input.room,
        pic: input.pic,
        kapasitas: input.kapasitas,
        rapat: input.rapat,
        catatan: input.catatan,
      });
      res.json({
        msg: "input booking berhasil",
      });
    } else {
      res.json({
        msg: inputFormat.error.errors,
      });
    }
  },
);

type updateBookingOptional = Partial<inputType>;

router.put(
  "/:id",
  authmiddleware,
  async (req: RequestDecode, res: Response) => {
    const { id } = req.params;
    const inputUpdate: updateBookingOptional = req.body;
    const inputDate = inputUpdate.date ?? "";
    const dateEpoch = new Date(inputDate).getTime();
    const date = new Date(dateEpoch);
    const inputDays = moment(date).tz("Asia/Jakarta").format("dddd");
    const updateFields: any = {
      event: inputUpdate.event,
      clockStart: inputUpdate.clockStart,
      clockEnd: inputUpdate.clockEnd,
      room: inputUpdate.room,
      pic: inputUpdate.pic,
      kapasitas: inputUpdate.kapasitas,
      rapat: inputUpdate.rapat,
      catatan: inputUpdate.catatan,
    };
    if (dateEpoch) {
      updateFields.date = dateEpoch;
      updateFields.day = inputDays;
    }
    const result = await Booking.findByIdAndUpdate({ _id: id }, updateFields, {
      new: true,
    });
    if (result) {
      res.json({
        msg: "booking berhasil diupdate",
      });
    } else {
      res.json({
        msg: "booking gagal diupdate",
      });
    }
  },
);

router.delete(
  "/:id",
  authmiddleware,
  async (req: RequestDecode, res: Response) => {
    const { id } = req.params;
    await Booking.findByIdAndDelete({ _id: id });
    res.json({
      msg: "delete berhasil",
    });
  },
);

export default router;
