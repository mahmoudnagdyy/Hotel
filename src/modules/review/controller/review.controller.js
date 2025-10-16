import bookingModel from "../../../../DB/Models/Booking.model.js";
import reviewModel from "../../../../DB/Models/Review.model.js";
import { asyncHandler } from "../../../utils/errorHandler.js";


// prettier-ignore
export const addReview = asyncHandler(
    async (req, res, next) => {
        const {roomId, rate, comment} = req.body

        const checkBooking = await bookingModel.findOne({userId: req.user._id, roomId, status: 'completed'})
        if(!checkBooking){
            return next(new Error("You Cann't Make A Review As You Didn't Use This Room Before."))
        }

        const review = await reviewModel.create({userId: req.user._id, roomId, rate, comment})

        return res.send({message: 'Room Reviewed', review})
    }
)