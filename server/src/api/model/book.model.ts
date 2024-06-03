import { model, Schema } from 'mongoose';
import { BookType } from '../type/book.type';
import { User } from './user.model';



export const bookScheme = new Schema<BookType>({
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
  ISBN: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
},
  {
    timestamps: true
  }
)

export const Book = model<BookType>('Book', bookScheme)