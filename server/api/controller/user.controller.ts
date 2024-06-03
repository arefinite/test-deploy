import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { User } from "../model/user.model";

//get user profile
export const getUserProfile = async(req:Request,res:Response,next:NextFunction) => {
  //extract id from req object
  const id = req.userId 
  
  try {
    //check for existing user and grab it without password field
    const user = await User.findById(id).select('-password')
    if (!user) return next(createHttpError(400, 'User not found'))
    res.status(200).json({ user })
  } catch (error) {
     createHttpError(500, 'Internal Server Error')
  }
}