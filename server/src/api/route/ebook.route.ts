import { Router } from 'express'

import {
  addEbook,
  deleteEbook,
  getAllEbooks,
  getSingleEbook,
  updateEbook,
} from '../controller/ebook.controller'
import { verifyToken } from '../middleware/auth.middleware'
import { upload } from '../service/multer'

export const ebookRouter = Router()

ebookRouter.get('/all-ebooks', getAllEbooks)
ebookRouter
  .route('/:id')
  .get(getSingleEbook)
  .patch(
    verifyToken,
    upload.fields([
      { name: 'coverImg', maxCount: 1 },
      { name: 'file', maxCount: 1 },
    ]),
    updateEbook
  )
  .delete(verifyToken, deleteEbook)
ebookRouter.post(
  '/',
  upload.fields([
    { name: 'coverImg', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  addEbook
)
