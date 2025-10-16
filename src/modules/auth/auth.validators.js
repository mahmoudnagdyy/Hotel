import joi from "joi";



export const signup = {
    body: joi.object({
        fullname: joi.string().min(10).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
        phone: joi.string().min(11).required(),
        role: joi.string().valid("guest", "admin").optional(),
    }).required(),
};