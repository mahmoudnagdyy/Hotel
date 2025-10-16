import multer from "multer";
import {v2 as cloudinary} from 'cloudinary'


export const allFilesExtensions = {
    image: ['image/jpg', 'image/jpeg', 'image/png'],
    video: ['video/mp4'],
    audio: ['audio/mp3'],
    file: 'application/pdf'
}

cloudinary.config({
    cloud_name: "ddbxrwwmz",
    api_key: "797827295144815",
    api_secret: "AatKcubDyFThFk_I_lIixiIF81s",
});


const multerService = (allowedExtensions=[]) => {
    const storage = multer.diskStorage({});

    function fileFilter(req, file, cb) {
        if(allowedExtensions.includes(file.mimetype)){
            return cb(null, true);
        }
        return cb(new Error('In-valid Extensions'), false)
    }

    const upload = multer({ storage, fileFilter });
    return upload
}

export {
    cloudinary,
    multerService
}