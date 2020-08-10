const multer = require('multer'),
    path = require('path'),
    UploadFile = {}

const fileSize = 1024*1024*10;
const fileFilter = ( req , file, cb) => {
    if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb( null, true)
    } else {
        req.fileValidationError = 'The image does not have a valid extension';
        return cb( null , false, new Error())
    }
}

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb( null, path.join(__dirname + "/../public/moment"))
    },
    filename: function(req, file, cb){
        cb( null, file.originalname )
    }
})

UploadFile.userPhoto = ( req, res, next ) => {
    const uploadPhotoProfile = multer({
        storage: storage,
        limits: {
            fileSize: fileSize
        },
        fileFilter: fileFilter
    }).single('userPhoto')

    uploadPhotoProfile( req, res, (error) => {
        if (typeof req.file !== 'undefined') {
            if(error) return res.status(422).json({ error: 'Invalid file' })
            next()
        } else {
            return res.status(422).json({ error: req.fileValidationError })
        }
    })
}

UploadFile.photos = ( req, res, next ) => {
    const uploadPhotos = multer({
        storage: storage,
    }).array('images',10)
}

module.exports = UploadFile
