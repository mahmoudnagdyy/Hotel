import { Router } from "express";
import * as bookingController from "./controller/booking.controller.js";
import { authService } from "../../middleware/auth.js";
import { allBookingRoles } from "./booking.apiRoles.js";
import { validationService } from "../../middleware/validation.js";
import * as bookingValidators from "./booking.validators.js";

const router = Router();

router.post(
    "/",
    authService(allBookingRoles.addBookingRoles),
    validationService(bookingValidators.addBooking),
    bookingController.addBooking
);

router.delete(
    "/:bookingId",
    authService(allBookingRoles.deleteBookingRoles),
    validationService(bookingValidators.deleteBooking),
    bookingController.deleteBooking
);

router.get(
    "/:userId",
    authService(allBookingRoles.getAllBookingsRoles),
    bookingController.getAllBookings
);

router.get(
    "/book/:bookingId",
    authService(allBookingRoles.getOneBookingRoles),
    bookingController.getBookingById
);

export default router;
