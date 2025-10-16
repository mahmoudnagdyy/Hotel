import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        roomId: {
            type: Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },

        rate: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },

        comment: String,
    },
    {
        timestamps: true
    }
)

const reviewModel = model('Review', reviewSchema)
export default reviewModel