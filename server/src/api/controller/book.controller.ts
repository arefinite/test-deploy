import { NextFunction, Request, Response } from 'express'
import { Book } from '../model/book.model'
import createHttpError from 'http-errors'
import cloudinary from '../../config/cloudinary'
import path from 'node:path'
import fs from 'node:fs'
import mongoose from 'mongoose'

//get all books
export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //TODO: Pagination
    const books = await Book.find()
    res.status(200).json({ books })
  } catch (err) {
    return next(createHttpError(500, 'Internal Server Error'))
  }
}

//get single book
export const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  //validate the id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createHttpError(404, 'Book not found'))
  }
  try {
    const book = await Book.findById(id)
    if (!book) return next(createHttpError(404, 'Book not found'))
    res.status(200).json({ book })
  } catch (err) {
    return next(createHttpError(500, 'Internal Server Error'))
  }
}

//add book
export const addBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, genre, ISBN, discount } = req.body
  const id = req.userId
  const files = req.files as { [filename: string]: Express.Multer.File[] }
  //get the cover image
  const coverImgMimeType = files.coverImg[0].mimetype.split('/').at(-1)
  const coverImgName = files.coverImg[0].filename
  const coverImgPath = path.resolve(
    __dirname,
    `../../../public/data/uploads`,
    coverImgName
  )
  // upload the cover image  to cloudinary
  try {
    const coverImgUploadResult = await cloudinary.uploader.upload(
      coverImgPath,
      {
        filename_override: coverImgName,
        folder: 'book-covers',
        format: coverImgMimeType,
      }
    )
    //create new book
    const newBook = await Book.create({
      title,
      genre,
      ISBN,
      discount,
      coverImg: coverImgUploadResult.secure_url,
      author: id,
    })
    //delete the cover image from the server
    try {
      await fs.promises.unlink(coverImgPath)
    } catch (err) {
      return next(createHttpError(500, 'File deletion error'))
    }
    if (!newBook) return next(createHttpError(404, 'Book not created'))
    res.status(201).json({ message: 'Book created' })
  } catch (err) {
    return next(createHttpError(500, 'Internal Server Error'))
  }
}

//update book
export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const { title, genre, ISBN, discount } = req.body
  //validate the id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createHttpError(404, 'Book not found'))
  }
  try {
    //check if the book exists
    const book = await Book.findById(id)
    if (!book) return next(createHttpError(404, 'Book not found'))
    //check if the user is the author of the book
    if (book.author.toString() !== req.userId)
      return next(createHttpError(401, 'Unauthorized Access'))

    const files = req.files as { [filename: string]: Express.Multer.File[] }
    //cover image update process
    let fullCoverImg = ''
    if (files.coverImg) {
      const coverImgMimeType = files.coverImg[0].mimetype.split('/').at(-1)
      const coverImgName = files.coverImg[0].filename
      const coverImgPath = path.resolve(
        __dirname,
        `../../../public/data/uploads`,
        coverImgName
      )
      fullCoverImg = coverImgName
      const coverImgSplits = book.coverImg.split('/')
      const coverImagePublicId =
        coverImgSplits.at(-2) + '/' + coverImgSplits.at(-1)?.split('.').at(-2)
      // upload the cover image  to cloudinary
      try {
        const coverImgUploadResult = await cloudinary.uploader.upload(
          coverImgPath,
          {
            filename_override: coverImgName,
            folder: 'book-covers',
            format: coverImgMimeType,
          }
        )
        //delete the cover image from the server
        await cloudinary.uploader.destroy(coverImagePublicId)
        fullCoverImg = coverImgUploadResult.secure_url
        //remove cover image from the server
        await fs.promises.unlink(coverImgPath)

      } catch (err) {
        return next(createHttpError(500, 'File deletion error'))
      }
    }

    //update book
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, genre, ISBN, discount, coverImg: fullCoverImg },
      { new: true }
    )
    if (!updatedBook) return next(createHttpError(404, 'Book update failed'))
    res.status(200).json({ message: 'Book updated' })
  } catch (err) {
    return next(createHttpError(500, 'Internal Server Error'))
  }
}

//delete book
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  //validate the id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createHttpError(404, 'Book not found'))
  }
  try {
    //check if the book exists
    const book = await Book.findById(id)
    if (!book) return next(createHttpError(404, 'Book not found'))

    //check if the user is the author of the book
    if (book.author.toString() !== req.userId)
      return next(createHttpError(401, 'Unauthorized Access'))

    const coverImgSplits = book.coverImg.split('/')
    const coverImagePublicId =
      coverImgSplits.at(-2) + '/' + coverImgSplits.at(-1)?.split('.').at(-2)

    try {
      await cloudinary.uploader.destroy(coverImagePublicId)
    } catch (err) {
      return next(createHttpError(500, 'Cloudinary delete failed'))
    }

    await Book.findByIdAndDelete(id)
    res.status(200).json({ message: 'Book deleted' })
  } catch (err) {
    return next(createHttpError(500, 'Internal Server Error' + err))
  }
}
