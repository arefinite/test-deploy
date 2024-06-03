import { Response } from "express";
import jwt from 'jsonwebtoken'
import { config } from "../../config/config";

export const generateToken = (res:Response,id: string) => {
  //generate token
  const token = jwt.sign({ userId: id }, config.JWT_SECRET_KEY as string, {
    expiresIn:'1d'
  })

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: config.NODE_EVN === 'PRODUCTION',
    maxAge: 86400000, //1 day in milliseconds
  })
  return token
  
}