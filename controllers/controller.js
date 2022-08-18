const { User, Profile, Post } = require('../models');
const bcrypt = require('bcryptjs');
const { listErrrors, imageFormated } = require('../helpers/index');

class Controller {
  static showProfile(req, res) {
    const UserId = +req.params.ProfileId;
    
    User.findOne({
      where: {
        id: UserId
      },
      include: {
        all: true
      }
    })
    .then(data => {
      res.render('profile', { data, imageFormated })
    })
    .catch(err => {
      res.send(err);
    })
  }

  static addPost(req, res) {
    const UserId = +req.params.ProfileId;
    const error = req.query.errors
    
    res.render('add-post', { UserId, error });
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
        res.redirect(`/profile/${ProfileId}/add?errors=${listErrrors(err)}`)
      })
  }

  static editProfile(req, res) {
    const error = req.query.errors
    const ProfileId = +req.params.ProfileId;
    
    Profile.findOne({
      where: {
        id: ProfileId
      }
    })
      .then(profile => {
        res.render('edit-profile', { profile, error });
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
  
  static home(req, res) {
    let ProfileId = req.session.UserId
    let condition = req.query
    let error = req.query.error
    if (condition) {
      condition = [Post.sortAndSearch(condition)].map(el => {
        return {
          ...el,
          include: {
            model:User,
            include: { model:Profile }
          }
        }
      })
    }
    Post.findAll(condition[0])
      .then(result => {
        res.render('home', { result, ProfileId, imageFormated, error })
      })
      .catch(err => {
        res.send(err)
      })
  }

  static register(req, res) {
    let error = req.query.error
    res.render('register', { error })
  }

  static saveRegister(req, res) {
    const { username, password, email, firstName, lastName, gender, dateOfBirth, phoneNumber, isAdmin } = req.body

    let id = 0
    User.create({
      username,
      password,
      email,
      isAdmin
    }, {
      returning: true,
      plain: true
    })
      .then(result => {
        id = result.id
        return Profile.create({
          firstName,
          lastName,
          gender,
          dateOfBirth,
          phoneNumber,
          UserProfileId: id
        })
      })
      .then(result => {
        res.redirect('/login')
      })
      .catch(err => {
        res.redirect(`/register?error=${listErrrors(err)}`)
      })
  }

  static login(req, res){
    let error = req.query.error
    res.render('login', { error })
  }

  static logon(req, res){
    const { username, password } = req.body
    if (!username || !password) {
      throw `Invalid Username/Password`
    } else {
      User.findOne({ where: { username }})
        .then(result => {
          if (!result) {
            throw `Invalid Username/Password`
          } else {
            const isPasswordMatch = bcrypt.compareSync(password, result.password)
            
            if(isPasswordMatch) {
              req.session.UserId = result.id // set session on controller login
              if (result.isSuspended) {
                throw `Your Account Has Been Suspended`
              } else {
                if (result.isAdmin) {
                  req.session.isAdmin = result.isAdmin // set session on controller login
                  res.redirect('/admin')
                } else {
                  req.session.isAdmin = result.isAdmin // set session on controller login
                  res.redirect(`/home`)
                }
              }
            } else {
              throw `Invalid Username/Password`
            }
          }
        })
        .catch(err => {
          res.redirect(`/login?error=${err}`)
        })
    }
  }

  static admin(req, res) {
    let condition = req.query
    if (condition) {
      condition = [Post.sortAndSearch(condition)].map(el => {
        return {
          ...el,
          include: {
            model:User,
            include: { model:Profile }
          }
        }
      })
    } else {
      condition = { include: {
        model:User,
        include: { model:Profile }
        }
      }
    }
    Post.findAll(condition[0])
      .then(result => {
        res.render('admin', { result, imageFormated })
      })
      .catch(err => {
        res.send(err)
      })
  }

  static user(req, res) {
    let error = req.query.error
    User.findAll({ 
      include: Profile,
      order: [[ 'id','ASC' ]]
    })
      .then(result => {
        res.render('user', { result, error })
      })
      .catch(err => {
        res.send(err)
      })
  }

  static suspend(req, res) {
    let id = req.params.id
    User.findOne({ where: { id } })
      .then(result => {
        if(!result.isAdmin){
          if (result.isSuspended) {
            return User.update(
              { isSuspended: false },
              { where: { id:result.id } })
          } else {
            return User.update(
              { isSuspended: true },
              { where: { id:result.id } })
          }
        } else {
          throw `You Can't Suspend Admin`
        }
      })
      .then(result => {
        res.redirect('/users')
      })
      .catch(err => {
        res.redirect(`/users?error=${err}`)
      })
  }

  static logout(req, res) {
    req.session.isAdmin = undefined // set session on controller login
    req.session.UserId = undefined // set session on controller login
    console.log(req.session.isAdmin, req.session.UserId)
    res.redirect('/login')
  }
}

module.exports = Controller;
