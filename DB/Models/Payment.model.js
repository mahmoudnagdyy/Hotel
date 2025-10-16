import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },

        method: {
            type: String,
            enum: ["cash", "card"],
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        paymentDate: {
            type: Date,
        },

        status: {
            type: String,
            enum: ["success", "failed", "pending"],
            default: "pending"
        },

        isPaid: {
            type: Boolean,
            default: false
        },

        transactionId: {
            type: String,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    {
        timestamps: true,
    }
);

const paymentModel = model('Payment', paymentSchema)
export default paymentModel