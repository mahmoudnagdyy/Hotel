import { Types } from "mongoose"



export const idCustomValidator = (value, helper) => {
    return Types.ObjectId.isValid(value)? value: helper.message('In-valid Id')
}