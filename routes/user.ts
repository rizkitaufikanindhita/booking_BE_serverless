import express,{Request, Response} from 'express'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import model from "../db/db"
import {z} from "zod"

const router = express.Router()

const jwtPassword = process.env.SECRET_JWT ?? ""

const User = model.User

const userZod = z.object({
  username: z.string().min(4),
  password: z.string().min(4)
})

type userType = z.infer<typeof userZod>

router.post("/signup",async(req: Request,res: Response)=>{
  const input: userType = req.body
  const userFormat = userZod.safeParse(req.body)
  const username = input.username
  if(userFormat.success){
    const userData = await User.findOne({username})
    if(userData){
      res.json({
        msg: "username telah terdaftar"
      })
    } else {
      const passwordHash = await bcrypt.hash(input.password, 10)
      await User.create({
        username: input.username,
        password: passwordHash
      })
      res.json({
        msg: "user berhasil didaftarkan"
      })
    }
  } else {
    res.json({
      msg: userFormat.error?.errors
    })
  }
})

router.post("/signin",async(req: Request,res: Response)=>{
  const input: userType = req.body
  const userFormat = userZod.safeParse(req.body)
  const username = input.username
  if(userFormat.success){
    const userData = await User.findOne({username})
    if(userData){
      const passwordVerif = await bcrypt.compare(input.password,userData.password)
      if(passwordVerif){
        const id = userData._id
        const token = jwt.sign({username, id}, jwtPassword)
        res.json({
          msg: "login berhasil",
          token: token
        })
      } else {
        res.json({
          msg: "password salah"
        })
      }
    } else {
      res.json({
        msg: "user tidak terdaftar"
      })
    } 
  } else {
    res.json({
      msg: userFormat.error.errors
    })
  }
})


export default router
