import { asyncHandler } from "../../../utils/errorHandler.js";
import userModel from './../../../../DB/Models/User.model.js'
import {generateToken, verifyToken} from '../../../utils/tokenService.js'
import {sendEmail} from '../../../utils/emailService.js'
import bcrypt from "bcryptjs";


// prettier-ignore
export const signup = asyncHandler(
    async (req, res, next) => {
        const {fullname, email, password, role, phone} = req.body
        
        const checkUser = await userModel.findOne({email})
        if(checkUser){
            return next(new Error("Email Already Exist"));
        }

        const userData = new userModel({ fullname, email, password, role, phone });
        const user = await userData.save()

        if(!user){
            return next(new Error("Saving User Error"));
        }

        const token = generateToken({
            payload: { id: user._id },
            signature: process.env.CONFIRM_EMAIL_SIGNATURE,
            expiresIn: '1d'
        });
        
        sendEmail({
            to: email,
            subject: "Confirm Your Email",
            html: `
                <p>Click on the link below to confirm your email</p>
                <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}">Confirm</a>
            `,
        });

        return res.send({message: 'User Registered, Check your email to confirm your account', user})
    }
)


// prettier-ignore
export const confirmEmail = asyncHandler(
    async(req, res, next) => {
        const {token} = req.params

        const decoded = verifyToken({token, signature: process.env.CONFIRM_EMAIL_SIGNATURE})
        if(!decoded){
            return next(new Error("In-valid Token"));
        }        

        const checkUser = await userModel.findById(decoded.id)
        if(!checkUser){
            return next(new Error("User Not Found!"));
        }

        if(checkUser.isConfirmed){
            return next(new Error("Email Already Confirmed"));
        }

        const user = await userModel.findByIdAndUpdate(checkUser._id, {isConfirmed: true}, {new: true})
        if(!user){
            return next(new Error("Confirming User Error"));
        }

        sendEmail({
            to: checkUser.email,
            subject: 'Email Confirmed',
            html: `
                <p>Your Email Confirmed Successfully, Now You Can Login</p>
            `
        })

        return res.json({message: 'Email Confirmed', user})
    }
)


// prettier-ignore
export const login = asyncHandler(
    async (req, res, next) => {
        const {email, password} = req.body

        const checkUser = await userModel.findOne({email})
        if(!checkUser){
            return next(new Error('Email Not Exist!'))
        }

        const checkPassword = bcrypt.compareSync(password, checkUser.password)
        if(!checkPassword){
            return next(new Error('Wrong Email Or Password.'))
        }

        if(!checkUser.isConfirmed){
            return next(new Error('Please Confirm Your Email First To Be Able To Login.'))
        }

        const token = generateToken({
            payload: {
                id: checkUser._id,
            },
            signature: process.env.LOGIN_SIGNATURE,
            expiresIn: '1d'
        });

        return res.send({message: 'User Loged In Successfully', token})
    }
)