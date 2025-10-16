import { asyncHandler } from "../../../utils/errorHandler.js";
import bookingModel from '../../../../DB/Models/Booking.model.js'
import roomModel from "../../../../DB/Models/Room.model.js";
import moment from "moment";
import stripe from '../../../utils/stripeService.js'
import { generateToken } from "../../../utils/tokenService.js";
import paymentModel from "../../../../DB/Models/Payment.model.js";


// prettier-ignore
export const addBooking = asyncHandler(
    async (req, res, next) => {
        const {roomId, checkInDate, checkOutDate, guestInfo, method} = req.body
        
        const checkBooking = await bookingModel.findOne({
            roomId,
            $or: [
                {status: 'confirmed', checkInDate: {$lt: checkOutDate}, checkOutDate: {$gt: checkInDate}},
                {status: 'pending', expiresAt: {$gt: moment()}, checkInDate: {$lt: checkOutDate}, checkOutDate: {$gt: checkInDate}}
            ]
        });
        if(checkBooking){
            return next(new Error('This Room Is Booked'))
        }

        const room = await roomModel.findById(roomId)
        if(!room){
            return next(new Error('Room Not Exist'))
        }

        const bookingDays = (moment(checkOutDate) - moment(checkInDate)) / (1000 * 60 * 60 * 24)

        const booking = await bookingModel.create({
            userId: req.user._id,
            roomId,
            checkInDate,
            checkOutDate,
            guestInfo,
            totalPrice: room.pricePerNight * bookingDays,
            expiresAt: method == 'cash'? moment().add(2, 'days'): moment().add(1, 'days')
        })

        // Set Room As Booked
        await roomModel.updateOne({_id: roomId}, {status: 'booked'})

        // TODO: Payment Step
        if(method == 'card') {
            const token = generateToken({
                payload: { bookingId: booking._id },
                signature: process.env.PAYMENT_TOKEN_SIGNATURE,
                expiresIn: '2d'
            });

            const checkoutSession = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: "egp",
                            product_data: {
                                name: `Room ${room.roomNumber}`,
                            },
                            unit_amount: room.pricePerNight * 100,
                        },
                        quantity: bookingDays,
                    },
                ],
                mode: "payment",
                success_url: `${req.protocol}://${req.headers.host}/payment/success/${token}`,
                cancel_url: `${req.protocol}://${req.headers.host}/payment/cancel/${token}`,
            });

            console.log(checkoutSession);
            

            const payment = await paymentModel.create({
                bookingId: booking._id,
                method,
                amount: room.pricePerNight * bookingDays,
                isPaid: false,
                transactionId: checkoutSession.id ,
                userId: req.user._id,
            });

            return res.send({ message: "Booking Created, You Have 2 Days To Pay To Confirm The Booking.", booking, payment, sessionUrl: checkoutSession.url });
        }

        const payment = await paymentModel.create({
            bookingId: booking._id,
            method,
            amount: room.pricePerNight * bookingDays,
            isPaid: false,
            userId: req.user._id,
        });

        return res.send({message: 'Booking Created, You Have 2 Days To Pay To Confirm The Booking.', booking, payment })
    }
)


// prettier-ignore
export const deleteBooking = asyncHandler(
    async (req, res, next) => {
        const {bookingId} = req.params

        const booking = await bookingModel.findOne({
            _id: bookingId,
            status: { $in: ["pending", 'confirmed'] },
        });
        
        if (!booking) {
            return next(new Error("Booking Not Exist"));
        }

        const deletedBooking =  await bookingModel.findByIdAndDelete( bookingId );
        
        const payment = await paymentModel.findOneAndDelete({bookingId});

        await roomModel.updateOne(
            { _id: booking.roomId },
            { status: "available" }
        );

        // Refund Money
        if (deletedBooking.status == "confirmed") {
            const session = await stripe.checkout.sessions.retrieve(payment.transactionId)
            const refund = await stripe.refunds.create({
                payment_intent: session.payment_intent,
                amount: payment.amount,
            });

            if (refund.status == "succeeded") {
                return res.send({message: 'Your Booking Deleted Successfully, And Your Money Is Refunded.'})
            }
        }

        return res.send({message: 'Your Booking Deleted Successfully.'})
    }
)


// prettier-ignore
export const getAllBookings = asyncHandler(
    async (req, res, next) => {
        const {userId} = req.params
        const bookings = await bookingModel.find({userId})
        return res.send({message: "User's Bookings", bookings})
    }
)



// prettier-ignore
export const getBookingById = asyncHandler(
    async (req, res, next) => {
        const {bookingId} = req.params
        const booking = await bookingModel.findById(bookingId);
        return res.send({message: "Booking", booking})
    }
)