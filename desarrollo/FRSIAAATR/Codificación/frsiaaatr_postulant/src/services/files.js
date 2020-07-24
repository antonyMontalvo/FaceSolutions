const multer = require('multer'),
    path = require('path'),
    UploadFile = {}

const fileSize = 1024*1024*2;
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
        cb( null, path.join(__dirname + "../public/perfiles"))
    },
    filename: function(req, file, cb){
        req.fileName = Date.now() + path.extname( file.originalname )
        cb( null, req.fileName )
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

module.exports = UploadFile
