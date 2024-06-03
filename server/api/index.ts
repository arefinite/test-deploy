import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { globalErrorHandler } from './middleware/globalErrorHandler'
import { authRouter } from './route/auth.route'
import { userRouter } from './route/user.route'
import { bookRouter } from './route/book.route'
import { ebookRouter } from './route/ebook.route'
import { config } from '../config/config'
import { dbConnect } from '../config/db'

export const app = express()

// middlewares
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'))
}
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
)

//routes
app.get('/', (req, res) => res.send('Book API'))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/book', bookRouter)
app.use('/api/v1/ebook', ebookRouter)

//global error handler
app.use(globalErrorHandler)



const PORT = config.PORT || 5000

app.listen(PORT, () => {
  dbConnect()
  console.log('Server running on port', PORT)
})