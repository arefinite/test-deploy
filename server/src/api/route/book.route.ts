import { Router } from 'express'
import {
  addBook,
  deleteBook,
  getAllBooks,
  getSingleBook,
  updateBook,
} from '../controller/book.controller'
import { verifyToken } from '../middleware/auth.middleware'
import { upload } from '../service/multer'

export const bookRouter = Router()

bookRouter.get('/all-books', getAllBooks)
bookRouter
  .route('/:id')
  .get(getSingleBook)
  .patch(
    verifyToken,
    upload.fields([{ name: 'coverImg', maxCount: 1 }]),
    updateBook
  )
  .delete(verifyToken, deleteBook)
bookRouter.post(
  '/',
  upload.fields([{ name: 'coverImg', maxCount: 1 }]),
  verifyToken,
  addBook
)
