import { NextFunction,Request,Response } from "express";
import createHttpError from "http-errors";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { config } from "../../config/config";


declare global{
  namespace Express{
    interface Request{
      userId: string
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  //check for token
  const token = req.cookies['access_token']
  if (!token) return next(createHttpError(400, 'Unauthorized access'))
  try {
    //verify token
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY as string) 
    req.userId = (decoded as JwtPayload).userId
    next()
  } catch (error) {
    createHttpError(400,'Unauthorized access')
  }
}