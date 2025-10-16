import Joi from "joi";
import {idCustomValidator} from '../../utils/customValidators.js'



export const addBooking = {
    body: Joi.object({
        roomId: Joi.string().custom(idCustomValidator),
        checkInDate: Joi.date().greater(Date.now() - (24*60*60*1000)),
        checkOutDate: Joi.date().greater(Joi.ref("checkInDate")),
        guestInfo: Joi.object({
            fullname: Joi.string().min(10).max(50),
            nationalId: Joi.string().length(14)
        }).required().options({ presence: "required" }),
        method: Joi.string().valid('cash', 'card')
    }).required().options({ presence: "required" }),
};


export const deleteBooking = {
    params: Joi.object({
        bookingId: Joi.string().custom(idCustomValidator),
    }).required().options({ presence: "required" }),
};


export const updateBooking = {
    body: Joi.object({
        roomId: Joi.string().custom(idCustomValidator).optional(),
        checkInDate: Joi.date().greater(Date.now() - 24 * 60 * 60 * 1000).optional(),
        checkOutDate: Joi.date().greater(Joi.ref("checkInDate")).optional(),
        guestInfo: Joi.object({
            fullname: Joi.string().min(10).max(50),
            nationalId: Joi.string().length(14),
        }).optional(),
        method: Joi.string().valid("cash", "card").optional(),
    }).required(),
};