import moment from "moment";
import bookingModel from "../../../../DB/Models/Booking.model.js";
import paymentModel from "../../../../DB/Models/Payment.model.js";
import { asyncHandler } from "../../../utils/errorHandler.js";
import { verifyToken } from "../../../utils/tokenService.js";
import roomModel from "../../../../DB/Models/Room.model.js";




export const success = asyncHandler(
    async(req, res, next) => {
        const {token} = req.params

        const decoded = verifyToken({
            token,
            signature: process.env.PAYMENT_TOKEN_SIGNATURE,
        });

        if(!decoded){
            return next(new Error('In-valid Token'))
        }

        await bookingModel.updateOne(
            { _id: decoded.bookingId },
            { status: "confirmed", paymentStatus: "paid", expiresAt: null }
        );

        await paymentModel.updateOne(
            { bookingId: decoded.bookingId },
            { paymentDate: moment(), status: "success", isPaid: true }
        );

        return res.send({message: 'Booking Confirmed Successfully, Have A Nice Trip.'})
    }
)


export const cancel = asyncHandler(
    async(req, res, next) => {
        const {token} = req.params

        const decoded = verifyToken({
            token,
            signature: process.env.PAYMENT_TOKEN_SIGNATURE,
        });

        if(!decoded){
            return next(new Error('In-valid Token'))
        }

        const booking = await bookingModel.findByIdAndDelete(
            { _id: decoded.bookingId },
        );

        await paymentModel.deleteOne(
            { bookingId: decoded.bookingId },
        );

        await roomModel.updateOne(
            { _id: booking.roomId },
            { status: "available" }
        );

        return res.send({message: 'The Booking Canceled, Try Again.'})
    }
)