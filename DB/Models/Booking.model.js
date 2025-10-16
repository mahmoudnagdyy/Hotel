import { Schema, model } from "mongoose";

const bookingSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        guestInfo: {
            fullname: {
                type: String,
                required: true,
            },

            nationalId: {
                type: String,
                required: true,
            },
        },

        roomId: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },

        checkInDate: {
            type: Date,
            required: true,
        },

        checkOutDate: {
            type: Date,
            required: true,
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending",
        },

        paymentStatus: {
            type: String,
            enum: ["paid", "unpaid", "refunded"],
            default: "unpaid",
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const bookingModel = model('booking', bookingSchema)
export default bookingModel