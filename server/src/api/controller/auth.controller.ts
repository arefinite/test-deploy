import createHttpError from 'http-errors'
import bcrypt from 'bcryptjs'
import { User } from '../model/user.model'
import { NextFunction, Request, Response } from 'express'
import { generateToken } from '../service/generateToken'
import { validationResult } from 'express-validator'

//SignUp controller
export const SignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return next(createHttpError(400, { message: errors.array() }))
  const { fullName, email, password } = req.body
  try {
    //check for existing user
    const foundUser = await User.findOne({ email })
    if (foundUser) return next(createHttpError(400, 'User already exists'))
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10)
    //create new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    })
    if (!newUser) return next(createHttpError(400, 'User can not be created'))
    //generate token
    generateToken(res, newUser._id.toString())
    res.status(201).json({ message: 'Sign up Successful' })
  } catch (error) {
    return next(createHttpError(500, 'Internal Server Error'))
  }
}

//SignIn controller

export const SignIn = async (req: Request, res: Response, next: NextFunction) => {
  //check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) return next(createHttpError(400, { message: errors.array() }))

  const { email, password } = req.body
  try {
    //check for existing user
    const user = await User.findOne({ email })
    if (!user) return next(createHttpError(400, 'User not found'))
    //match the password
    const isMatchPassword = await bcrypt.compare(password, user.password)
    if (!isMatchPassword) return next(createHttpError(400, 'Invalid credentials'))
    //generate token
    generateToken(res, user._id.toString())
    res.status(200).json({ message: 'Sign In Successful' })
  } catch (error) {
    return next(createHttpError(500, 'Internal Server Error'))
  }
}

//SignOut controller
export const SignOut = async (req: Request, res: Response) => {
  //clear the cookies
  res.clearCookie('access_token')
  res.status(200).json({ message: 'Sign out Successful' })
}
