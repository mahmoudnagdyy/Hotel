import moment from "moment";
import bookingModel from "../../DB/Models/Booking.model.js"
import schedule from "node-schedule";
import paymentModel from "../../DB/Models/Payment.model.js";


export const deleteExpiredBookings = () => {
    schedule.scheduleJob("0 */30 * * * *", async function () {
        const allExpiredBookings = await bookingModel.find({status: 'pending', expiresAt: {$lt: moment().toDate()}})
        if (allExpiredBookings.length) {
            for (const booking of allExpiredBookings) {
                await bookingModel.deleteOne({ _id: booking._id });
                await paymentModel.deleteOne({ bookingId: booking._id });
            }
        }
        return 'Done'
    });
}


export const completedBookings = () => {
    schedule.scheduleJob("0 0 0 * * *", async function () {
        await bookingModel.updateMany({status: 'confirmed', checkOutDate: {$lt: moment().toDate()}}, {status: 'completed'})
    });
    return 'done'
}