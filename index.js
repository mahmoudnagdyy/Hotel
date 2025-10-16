import express from 'express'
import dotenv from 'dotenv'
import { bootstrap } from './src/index.router.js'
import { completedBookings, deleteExpiredBookings } from './src/utils/cronjobs.js'
dotenv.config()

const app = express()



bootstrap(app, express)


deleteExpiredBookings()
completedBookings()


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port .... ${process.env.PORT}`);
})