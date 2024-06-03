import { check } from "express-validator";


export const signUpValidator = [
  check('fullName', 'Full name is required').isString().isLength({ max: 50 }),
  check('email', 'Email is required').isEmail().isLength({max: 50}),
  check('password', 'Password is required and at least 6 characters long').isLength({ min: 6, max: 30 })
]

export const signInValidator = [
  check('email', 'Email is required').isEmail().isLength({max: 50}),
  check('password', 'Password is required and at least 6 characters long').isLength({ min: 6, max: 30 })
]