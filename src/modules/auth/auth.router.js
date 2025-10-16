import { Router } from "express";
import * as authController from './controller/auth.controller.js'
import * as authValidators from './auth.validators.js'
import {validationService} from '../../middleware/validation.js'

const router = Router()


router.post('/signup', validationService(authValidators.signup), authController.signup)

router.get('/confirmEmail/:token', authController.confirmEmail)

router.post('/login', authController.login)





export default router