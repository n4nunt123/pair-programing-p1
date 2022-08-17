const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Configure file upload destination
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    // Configure filename
    cb(null, new Date().getTime() + '-' + file.originalname);
  }
})

// const upload = multer({ storage: storage });

// Configure only filetype image can be uploaded
const fileFilter = (req, file, cb) => {
  if ( file.mimetype === 'image/png' ||
       file.mimetype === 'image/jpg' ||
       file.mimetype === 'image/jpeg') {
        cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only png, jpg, jpeg allowed'));
  }
}

const upload = multer({ storage: storage,  fileFilter:fileFilter });

router.get('/', (req, res) => {
  res.send('home')
})

router.get('/profile/:ProfileId', Controller.showProfile);
router.get('/profile/:ProfileId/add', Controller.addPost);
router.post('/profile/:ProfileId/add', upload.single('image'), Controller.savePost);
router.get('/profile/:ProfileId/edit', Controller.editProfile);
router.post('/profile/:ProfileId/edit', upload.single('image'), Controller.saveEditProfile);
router.get('/profile/:ProfileId/post/:PostId/delete', Controller.deletePost);

module.exports = router;