import { asyncHandler } from "../../../utils/errorHandler.js";
import roomModel from '../../../../DB/Models/Room.model.js'
import { cloudinary } from "../../../utils/multerService.js";
import { nanoid } from "nanoid";


// prettier-ignore
export const addRoom = asyncHandler(
    async (req, res, next) => {
        const {roomNumber, roomType, pricePerNight, capacity, amenities, status} = req.body
        
        const checkRoom = await roomModel.findOne({ roomNumber });
        if(checkRoom){
            return next(new Error('Room Already Exist'))
        }

        if(!req.files.length){
            return next(new Error('You Must Upload at least 1 Picture'))
        }

        let images = []
        const customPath = nanoid(5)

        for (const file of req.files) {
            const {public_id, secure_url} = await cloudinary.uploader.upload(file.path, {
                folder: `Hotel/Rooms/${customPath}`
            })
            images.push({ public_id, secure_url });
        }

        const room = await roomModel.create({
            roomNumber,
            roomType,
            pricePerNight,
            capacity,
            amenities,
            status,
            customPath,
            images,
        });

        if(!room){
            return next(new Error('Adding Room Error'))
        }

        return res.send({message: 'Room Added', room})
    }
)


// prettier-ignore
export const getRoom = asyncHandler(
    async (req, res, next) => {
        const {roomNo} = req.params

        const room = await roomModel.findOne({ roomNumber: roomNo });
        if (!room) {
            return next(new Error("Room Not Exist"));
        }

        return res.send({ message: "Room Exist", room });
    }
)


// prettier-ignore
export const getAllRooms = asyncHandler(
    async (req, res, next) => {
        const rooms = await roomModel.find({})
        return res.send({message: 'All Rooms', rooms})
    }
)


// prettier-ignore
export const deleteRoom = asyncHandler(
    async (req, res, next) => {
        const {roomNo} = req.params

        const checkRoom = await roomModel.findOne({roomNumber: roomNo})
        if(!checkRoom){
            return next(new Error('Room Not Exist'))
        }

        for (const img of checkRoom.images) {
            await cloudinary.uploader.destroy(img.public_id)
        }
        await cloudinary.api.delete_folder(`Hotel/Rooms/${checkRoom.customPath}`)

        const room = await roomModel.deleteOne({roomNumber: roomNo})
        return res.send({message: room.deletedCount? `Room ${roomNo} Deleted`: "Room Not Exist"})
    }
)