import 'dotenv/config'

const _config = {
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  NODE_EVN: process.env.NODE_EVN,
  FRONTEND_URL: process.env.FRONTEND_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME, 
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY, 
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET 
}

export const config = Object.freeze(_config)