const express = require('express');

const router = express.Router();
const multer  = require('multer');

const diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user- ${Date.now()}.${ext}`;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype.split('/')[0];
    if(fileType == 'image') {
        return cb(null, true);
    }else{
        return cb(appError.create('file must be an image type', 400), false);
    }
}
const upload = multer({ storage: diskStorage, fileFilter});

const {getUsers, register, login} = require('../controlers/users.controler');
const verifyToken = require('../middleware/verifyToken');
const appError = require('../utils/appError');

router.route('/')
            .get(getUsers);

router.route('/register')
            .post(upload.single('avatar'),register);

router.route('/login')
            .post(login);

module.exports = router;
