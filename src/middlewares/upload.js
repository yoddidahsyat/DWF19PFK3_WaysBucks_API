const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

exports.uploadFile = (fieldName) => {
  //initialisasi multer diskstorage
  //menentukan destination file diupload
  //menentukan nama file (rename agar tidak ada nama file ganda)
    // const storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, "uploads"); //lokasi penyimpan file
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null, Date.now() + "-" + file.originalname); //rename nama file by date now + nama original
    //     },
    // });
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    });
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
          // async code using `req` and `file`
            return {
                folder: "waysbucks",
                public_id: Date.now() + "-" + file.originalname,
            };
        }
    });

    //function untuk filter file berdasarkan type
    const fileFilter = function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG)$/)) {
            req.fileValidationError = {
                message: "Only image files are allowed!",
            };
            return cb(new Error("Only image files are allowed!"), false);
        }

        cb(null, true);
    };

    const maxSize = 8 * 1024 * 1024; //Maximum file size i MB

    //eksekusi upload multer dan tentukan disk storage, validation dan maxfile size
    const upload = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSize,
        },
    }).single(fieldName) // menggunakan multer.array untuk upload single files.
    // Return file that will be stored in req.file.

    //middleware handler
    return (req, res, next) => {
        upload(req, res, function (err) {
        //munculkan error jika validasi gagal
        if (req.fileValidationError) {
            return res.status(400).send(req.fileValidationError);
        }
        
        if (err) {
            
            //munculkan error jika melebihi max size
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).send({
                    message: `Max file sized exceeded (${maxSize} MB)`,
                });
            }
            
            // munculkan error jika melebihi max count
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(400).send({
                    message: `Only single file allowed`,
                });
            }
            // munculkan error lainnya
            return res.status(400).send(err);
        }

        //munculkan error jika tidak ada file yang diupload
        if (!req.file) {
            return res.status(400).send({
                message: "Please select a file to upload",
            })
        }

        //jika oke dan aman lanjut ke controller
        //akses nnti pake req.files
        return next();
        });
    };
    };
