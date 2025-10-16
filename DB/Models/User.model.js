import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'
import { allSystemRoles } from "../../src/utils/systemRoles.js";


const userSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: [allSystemRoles.guest, allSystemRoles.admin],
            default: allSystemRoles.guest,
        },

        isConfirmed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, +process.env.SALT_ROUND)
    next()
})


const userModel = model('User', userSchema)
export default userModel