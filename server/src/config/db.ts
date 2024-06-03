import { connect } from "mongoose"
import { config } from "./config"


export const dbConnect = async() => {
  try {
    await connect(config.DB_URI as string)
    console.log('Database connected')
  } catch (error) {
    console.log('Database connection error', error)
    process.exit(1)
  }
}