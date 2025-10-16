import { Router } from "express";
import * as paymentController from './controller/payment.controller.js'

const router = Router()



router.get("/success/:token", paymentController.success);

router.get("/cancel/:token", paymentController.cancel);








export default router