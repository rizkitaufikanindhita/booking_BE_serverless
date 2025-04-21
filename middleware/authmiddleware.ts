import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import model from "../db/db"

dotenv.config()

interface RequestDecode extends Request {
  decode?: any
}

const jwtPassword = process.env.SECRET_JWT ?? ""
const User = model.User

const authmiddleware = async(req: RequestDecode, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
  if(!token){
    res.json({
      msg: "silahkan login kembali"
    })
  } else {
    const tokenSplit = token.split(" ")
    const decode: any = jwt.verify(tokenSplit[1], jwtPassword)
    const id = decode.id
    const userData = await User.findOne({_id:id})
    if(userData){
      req.decode = decode
      next()
    } else {
      res.json({
        msg: "id tidak terdaftar"
      })
    }
  }
}

export default authmiddleware
