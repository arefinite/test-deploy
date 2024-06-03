import { NextFunction, Request, Response } from 'express'
import path from 'node:path'
import fs from 'node:fs'
import cloudinary from '../../config/cloudinary'
import createHttpError from 'http-errors'
import { Ebook } from '../model/ebook.model'
import mongoose from 'mongoose'

//get all ebooks
export const getAllEbooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //TODO: Pagination
    const books = await Ebook.find()
    res.status(200).json({ books })
  } catch (err) {
    return next(createHttpError(500, 'Internal Server Error'))
  }
}

//get single ebook
export const getSingleEbook = async (
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
    const book = await Ebook.findById(id)
    if (!book) return next(createHttpError(404, 'Book not found'))
    res.status(200).json({ book })
  } catch (err) {
    return next(createHttpError(500, 'Internal Server Error'))
  }
}

//add ebook
export const addEbook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, genre } = req.body
  const id = req.userId

  const files = req.files as { [filename: string]: Express.Multer.File[] }
  // get the cover image
  const coverImgMimeType = files.coverImg[0].mimetype.split('/').at(-1)
  const coverImgName = files.coverImg[0].filename
  const coverImgPath = path.resolve(
    __dirname,
    `../../../public/data/uploads`,
    coverImgName
  )
  // get the pdf
  const pdfFileName = files.file[0].filename
  const pdfFilePath = path.resolve(
    __dirname,
    `../../../public/data/uploads`,
    pdfFileName
  )
  // upload the cover image and pdf to cloudinary
  try {
    const coverImgUploadResult = await cloudinary.uploader.upload(
      coverImgPath,
      {
        filename_override: coverImgName,
        folder: 'ebook-covers',
        format: coverImgMimeType,
      }
    )

    const pdfUploadResult = await cloudinary.uploader.upload(pdfFilePath, {
      resource_type: 'raw',
      filename_override: pdfFileName,
      folder: 'ebooks',
      format: 'pdf',
    })
    //create a new ebook
    const newBook = await Ebook.create({
      title,
      genre,
      author: '665aa07dba88e3d55fadb0ae',
      coverImg: coverImgUploadResult.secure_url,
      file: pdfUploadResult.secure_url,
    })
    //delete the cover image and pdf from the server
    try {
      await fs.promises.unlink(coverImgPath)
      await fs.promises.unlink(pdfFilePath)
    } catch (err) {
      return next(createHttpError(400, 'File deletion error' + err))
    }

    if (!newBook) return next(createHttpError(400, 'Ebook not created'))
    res.status(201).json({ message: 'Ebook created' })
  } catch (err) {
    return next(createHttpError(500, 'Internal Server Error' + err))
  }
}

//update ebook
export const updateEbook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, genre } = req.body
  const { id } = req.params
  //validate the id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createHttpError(404, 'Book not found'))
  }

  try {
    //check if the book exists
    const book = await Ebook.findById(id)
    if (!book) return next(createHttpError(404, 'Book not found'))
    //check if the user is the author of the book
    if (book.author.toString() !== req.userId)
      return next(createHttpError(401, 'Unauthorized Access'))

    const files = req.files as { [filename: string]: Express.Multer.File[] }
    //cover image update process
    let fullCoverImg = ''
    if (files.coverImg) {
      const coverImgName = files.coverImg[0].filename
      const coverImgMimeType = files.coverImg[0].mimetype.split('/').at(-1)
      const CoverImgPath = path.resolve(
        __dirname,
        `../../../public/data/uploads`,
        coverImgName
      )
      fullCoverImg = coverImgName
      const coverImgSplits = book.coverImg.split('/')
      const coverImagePublicId =
        coverImgSplits.at(-2) + '/' + coverImgSplits.at(-1)?.split('.').at(-2)
      try {
        //update cover image in cloudinary
        const coverImgUploadResult = await cloudinary.uploader.upload(
          CoverImgPath,
          {
            fileName_override: fullCoverImg,
            folder: 'ebook-covers',
            format: coverImgMimeType,
          }
        )
        //delete existing cover image from cloudinary
        await cloudinary.uploader.destroy(coverImagePublicId)
        fullCoverImg = coverImgUploadResult.secure_url
        //remove cover image from the server
        await fs.promises.unlink(CoverImgPath)
      } catch (error) {
        return next(createHttpError(400, 'Update Failed'))
      }
    }
    //pdf update process
    let fullPdf = ''
    if (files.file) {
      const pdfName = files.file[0].filename
      const pdfFilePath = path.resolve(
        __dirname,
        `../../../public/data/uploads`,
        pdfName
      )
      fullPdf = pdfName
      const pdfSplits = book.file.split('/')
      const pdfPublicId = pdfSplits.at(-2) + '/' + pdfSplits.at(-1)
      try {
        //delete existing pdf from cloudinary
        await cloudinary.uploader.destroy(pdfPublicId, {
          resource_type: 'raw',
        })
        //update pdf in cloudinary
        const pdfUploadResult = await cloudinary.uploader.upload(pdfFilePath, {
          resource_type: 'raw',
          fileName_override: fullPdf,
          folder: 'ebooks',
          format: 'pdf',
        })
        fullPdf = pdfUploadResult.secure_url
        //remove pdf from the server
        await fs.promises.unlink(pdfFilePath)
      } catch (error) {
        return next(createHttpError(400, 'Update Failed'))
      }
    }
    //update the book
    const updatedBook = await Ebook.findByIdAndUpdate(
      id,
      {
        title,
        genre,
        coverImg: fullCoverImg ? fullCoverImg : book.coverImg,
        file: fullPdf ? fullPdf : book.file,
      },
      { new: true }
    )
    if(!updatedBook) return next(createHttpError(400, 'Ebook update failed'))
    res.status(200).json({ message: 'Ebook updated' })
  } catch (err) {
    return next(createHttpError(500, 'Internal Server Error'))
  }
}

//delete ebook
export const deleteEbook = async (
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
    const book = await Ebook.findById(id)
    if (!book) return next(createHttpError(404, 'Book not found'))

    //check if the user is the author of the book
    if (book.author.toString() !== req.userId)
      return next(createHttpError(401, 'Unauthorized Access'))

    const coverImgSplits = book.coverImg.split('/')
    const coverImagePublicId =
      coverImgSplits.at(-2) + '/' + coverImgSplits.at(-1)?.split('.').at(-2)

    const pdfSplits = book.file.split('/')
    const pdfPublicId = pdfSplits.at(-2) + '/' + pdfSplits.at(-1)

    try {
      await cloudinary.uploader.destroy(coverImagePublicId)
      await cloudinary.uploader.destroy(pdfPublicId, {
        resource_type: 'raw',
      })
    } catch (err) {
      return next(createHttpError(500, 'Cloudinary delete failed'))
    }

    await Ebook.findByIdAndDelete(id)
    res.status(200).json({ message: 'Ebook deleted' })
  } catch (err) {
    return next(createHttpError(500, 'Internal Server Error'))
  }
}
