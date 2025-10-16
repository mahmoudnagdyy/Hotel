import Joi from "joi";
import { idCustomValidator } from "../../utils/customValidators.js";




export const addReview = {
    body: Joi.object({
        roomId: Joi.string().custom(idCustomValidator).required(),
        rate: Joi.number().min(1).max(5).required(),
        comment: Joi.string().min(10).optional(),
    }).required(),
};