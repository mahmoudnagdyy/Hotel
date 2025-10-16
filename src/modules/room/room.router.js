import { Router } from "express";
import * as roomController from './controller/room.controller.js'
import * as roomValidators from './room.validators.js'
import { validationService } from "../../middleware/validation.js";
import { authService } from "../../middleware/auth.js";
import {allRoomRoles} from './room.apiRoles.js'
import { allFilesExtensions, multerService } from "../../utils/multerService.js";

const router = Router()


router.post('/', multerService(allFilesExtensions.image).array('image', 10), authService(allRoomRoles.addRoom), validationService(roomValidators.addRoom), roomController.addRoom)

router.get('/:roomNo', authService(allRoomRoles.getRoom), roomController.getRoom)

router.get('/', authService(allRoomRoles.getAllRooms), roomController.getAllRooms)

router.delete('/:roomNo', authService(allRoomRoles.deleteRoom), roomController.deleteRoom)




export default router