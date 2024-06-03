import { UserType } from "./user.type"


export type EbookType = {
  _id: string
  title: string
  author: UserType
  genre: string
  coverImg: string 
  file: string
}