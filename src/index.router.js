import userRouter from './modules/user/user.router.js'
import authRouter from './modules/auth/auth.router.js'
import { connectDB } from '../DB/connection.js'
import { globalErrorHandler } from './utils/errorHandler.js'
import roomRouter from './modules/room/room.router.js'
import bookingRouter from "./modules/booking/booking.router.js";
import paymentRouter from "./modules/payment/payment.router.js";
import reviewRouter from "./modules/review/review.router.js";



export const bootstrap = (app, express) => {

    app.get('/', (req, res, next) => res.send('Hello World'))

    app.use(express.json())

    app.use('/auth', authRouter)
    app.use('/room', roomRouter)
    app.use('/booking', bookingRouter)
    app.use('/payment', paymentRouter)
    app.use('/review', reviewRouter)
    // app.use('/user', userRouter)

    app.use(globalErrorHandler)

    app.use('*root',  (req, res, next) => {
        return res.send('404 Page Not Found')
    })

    connectDB()

}