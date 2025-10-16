import { Schema, model } from "mongoose";

const roomSchema = new Schema(
    {
        roomNumber: {
            type: Number,
            required: true,
            unique: true
        },

        roomType: {
            type: String,
            required: true,
            enum: ["single", "double", "suite"],
        },

        pricePerNight: {
            type: Number,
            required: true,
        },

        capacity: {
            type: Number,
            required: true,
        },

        // المرافق الموجودة في الغرفة
        amenities: {
            type: [String],
            required: true,
        },

        status: {
            type: String,
            enum: ["booked", "available", "maintenance"],
            default: "available",
        },

        images: [
            {
                public_id: {
                    type: String,
                    required: true
                },
                secure_url: {
                    type: String,
                    required: true
                }
            }
        ],

        customPath: String
    },
    {
        timestamps: true,
    }
);

const roomModel = model('Room', roomSchema)
export default roomModel