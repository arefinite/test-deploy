import { verifyToken } from './../middleware/auth.middleware';
import { Router } from "express"
import { SignIn, SignOut, SignUp } from "../controller/auth.controller"
import { signInValidator, signUpValidator } from "../validator/auth.validator"


export const authRouter = Router()

authRouter.post('/sign-up',signUpValidator ,SignUp)
authRouter.post('/sign-in',signInValidator ,SignIn)
authRouter.post('/sign-out', verifyToken,SignOut)