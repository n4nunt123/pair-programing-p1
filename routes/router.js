const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');

router.get('/', (req, res) => {
  res.send('home')
})

router.get('/profile/:ProfileId', Controller.showProfile);
router.get('/profile/:ProfileId/add', Controller.addPost);
router.post('/profile/:ProfileId/add', Controller.savePost);
router.get('/profile/:ProfileId/edit', Controller.editProfile);
router.post('/profile/:ProfileId/edit', Controller.saveEditProfile);

module.exports = router;