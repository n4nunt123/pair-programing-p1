const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');
const multer = require('multer');
const path = require('path')

const { Profile, Post, User } = require('../models')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Configure file upload destination
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    // Configure filename
    // cb(null, new Date().getTime() + '-' + file.originalname);
    cb(null, new Date().getTime() + '-' + path.extname(file.originalname));
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

router.get('/', Controller.login)
router.get('/register', Controller.register)
router.post('/register', Controller.saveRegister)
router.get('/login', Controller.login)
router.post('/login', Controller.logon)

router.use((req, res, next) => {
  console.log(req.session)
  console.log(req.session.UserId)
  if (!req.session.UserId) {
    const error = `Please Login First`
    res.redirect(`/?error=${error}`)
  } else {
    next()
  }
})

router.get('/logout', Controller.logout)
router.get('/home', Controller.home)

router.get('/profile/:ProfileId', Controller.showProfile);
router.get('/profile/:ProfileId/add', Controller.addPost);
router.post('/profile/:ProfileId/add', upload.single('image'), Controller.savePost);
router.get('/profile/:ProfileId/edit', Controller.editProfile);
router.post('/profile/:ProfileId/edit', upload.single('image'), Controller.saveEditProfile);
router.get('/profile/:ProfileId/post/:PostId/delete', Controller.deletePost);


router.use((req, res, next) => {
  console.log(req.session.isAdmin)
  if (!req.session.isAdmin) {
    const error = `You're not an Admin`
    res.redirect(`/home?error=${error}`)
  } else {
    next()
  }
})

router.get('/admin', Controller.admin)
router.get('/users', Controller.user)
router.get('/users/:id/', Controller.suspend)



module.exports = router;
