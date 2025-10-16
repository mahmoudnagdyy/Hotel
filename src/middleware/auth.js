import userModel from "../../DB/Models/User.model.js";
import { verifyToken } from "../utils/tokenService.js";



export const authService = (apiRoles = []) => {
    return async (req, res, next) => {

        const {authorization} = req.headers

        if(!authorization){
            return next(new Error("Authorization Token Is Required!"));
        }

        if(!authorization.startsWith('Barca__')){
            return next(new Error('In-Valid Authorization Token'))
        }

        const token = authorization.split("Barca__")[1];

        const decoded = verifyToken({ token, signature: process.env.LOGIN_SIGNATURE });
        if(!decoded){
            return next(new Error('Token Destroyed!'))
        }

        const user = await userModel.findById(decoded.id)
        if(!user){
            return next(new Error('User Not Found'))
        }

        // ===== Authorization =====
        if(!apiRoles.includes(user.role)){
            return next(new Error("You Don't Have Permission"))
        }

        req.user = user
        next()
    }
}