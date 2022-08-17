const { Admin, User, Profile, Post } = require('../models');
const { listErrrors } = require('../helpers/index');

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
      // res.send(data)
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

    // kalau user melakukan add post tanpa upload image
    let data = {
      content: req.body.content,
      UserPostId: ProfileId
    };
    
    // kalau user melakukan add post dengan upload image
    if (req.file) {
      data.imgUrl = req.file.path; 
    }

    Post.create(data) 
      .then((_) => {
        res.redirect(`/profile/${ProfileId}`)
      })
      .catch(err => {
        res.redirect(`/profile/${ProfileId}/add?errors=${listErrrors(err)}`);
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

    // kalau user melakukan edit profile tanpa upload image
    let data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      phoneNumber: req.body.phoneNumber,
      updatedAt: new Date()
    }

    // kalau user melakukan edit profile dengan upload image
    if (req.file) {
      data.imageProfileUrl = req.file.path; 
    }

    Profile.update(data, {
      where: {
        id: ProfileId
      }
    })
    .then((_) => {
      res.redirect(`/profile/${ProfileId}`);
    })
    .catch(err => {
      res.redirect(`/profile/${ProfileId}/edit?errors=${listErrrors(err)}`);
    })
  }

  static deletePost(req, res) {
    const ProfileId = +req.params.ProfileId;
    const PostId = +req.params.PostId;
    
    Post.findOne({
      where: {
        id: PostId
      }
    })
    .then((_) => {
      Post.destroy({
        where: {
          id: PostId
        }
      });

      res.redirect(`/profile/${ProfileId}`);
    })
    .catch(err => {
      res.send(err);
    })
  }
}

module.exports = Controller;