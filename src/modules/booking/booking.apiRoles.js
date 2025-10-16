import { allSystemRoles } from "../../utils/systemRoles.js";



export const allBookingRoles = {
    addBookingRoles: [allSystemRoles.guest],
    deleteBookingRoles: [allSystemRoles.admin, allSystemRoles.guest],
    getAllBookingsRoles: [allSystemRoles.admin, allSystemRoles.guest],
    getOneBookingRoles: [allSystemRoles.admin, allSystemRoles.guest],
};