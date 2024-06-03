import { UserType } from './user.type';
export type BookType = {
  _id?: string
  title: string
  author: UserType
  genre: string
  coverImg: string
  ISBN: number 
  discount: number
}