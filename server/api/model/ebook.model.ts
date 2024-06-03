import { model, Schema } from "mongoose";
import { User } from "./user.model";
import { EbookType } from "../type/ebook.type";


export const ebookScheme = new Schema<EbookType>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  coverImg: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  }
},
  {
  timestamps:true
})

export const Ebook = model<EbookType>('Ebook', ebookScheme)