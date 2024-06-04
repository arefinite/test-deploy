import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { getUserProfile } from "../controller/user.controller";


export const userRouter = Router()

userRouter.get('/profile',verifyToken,getUserProfile)