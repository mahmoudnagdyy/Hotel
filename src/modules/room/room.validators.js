import joi from 'joi'


export const addRoom = {

    body: joi.object({
        roomNumber: joi.number().positive().required(),
        roomType: joi.string().valid("single", "double", "suite").required(),
        pricePerNight: joi.number().positive().required(),
        capacity: joi.number().positive().required(),
        amenities: joi.array().items(joi.string()).required(),
        status: joi.string().valid("booked", "available", "maintenance").optional(),
        image: joi.string()
    }).required(),
    
};