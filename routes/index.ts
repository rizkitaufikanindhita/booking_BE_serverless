import express from "express"
import userEndpoints from "./user"
import bookingEndpoints from "./booking"

const router = express.Router()

router.use("/user", userEndpoints)
router.use("/booking", bookingEndpoints)

export default router
