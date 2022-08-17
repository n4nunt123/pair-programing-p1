const { Admin, User, Profile, Post } = require('../models');

class Controller {
  static showProfile(req, res) {
    const UserId = +req.params.ProfileId;
    
    User.findOne({
      where: {
        id: UserId
      },
      include: {
        all: true,
        required: true
      }
    })
    .then(data => {
      res.render('profile', { data })
    })
    .catch(err => {
      res.send(err);
    })
  }

  static addPost(req, res) {
    const UserId = +req.params.ProfileId;
    
    res.render('add-post', { UserId });
  }
  
  static savePost(req,res) {
    const ProfileId = +req.params.ProfileId;

    const data = {
      content: req.body.content,
      imgUrl: req.body.imgUrl,
      UserPostId: ProfileId,
    }

    Post.create(data) 
      .then((_) => {
        res.redirect(`/profile/${ProfileId}`)
      })
      .catch(err => {
        res.send(err);
      })
  }

  static editProfile(req, res) {
    const ProfileId = +req.params.ProfileId;
    
    Profile.findOne({
      where: {
        id: ProfileId
      }
    })
      .then(profile => {
        res.render('edit-profile', { profile });
        // res.send({profile});
      })
      .catch(err => {
        res.send(err);
      })

  }

  static saveEditProfile(req, res) {
    const ProfileId = +req.params.ProfileId;

    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      phoneNumber: req.body.phoneNumber,
      imageProfileUrl: req.body.imageProfileUrl,
      updatedAt: new Date()
    }

    Profile.update(data, {
      where: {
        id: ProfileId
      }
    })
    .then((_) => {
      res.redirect(`/profile/${ProfileId}`)
    })
    .catch(err => {
      res.send(err);
    })
  }
}

module.exports = Controller;