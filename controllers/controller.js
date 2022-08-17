const { Admin, User, Profile, Post } = require('../models');
const bcrypt = require('bcryptjs');
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
  
  static home(req, res) {
    let condition = req.query
    if (condition) {
      condition = [Post.sortAndSearch(condition)].map(el => {
        return {
          ...el,
          include: User
        }
      })
    } else {
      condition = { include: User }
    }
    let listPost = {}
    Post.findAll(condition[0])
      .then(result => {
        listPost = result
        let listProfile = [Post.profilePost(result)].map(el => {
          return {
            ...el,
            include: User
          }
        })
        return Profile.findAll(listProfile[0])
      })
      .then(result => {
        res.render('home', { listPost, result })
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
        res.redirect(`/register?error=${listError(err)}`)
      })
  }

  static login(req, res){
    let error = req.query.error
    res.render('login', { error })
  }

  static logon(req, res){
    const { username, password } = req.body
    if (!username || !password) {
      const error = `Invalid Username/Password`
      res.redirect(`/login?error=${error}`)
    } else {
      User.findOne({ where: { username }})
        .then(result => {
          if (!result) {
            const error = `Invalid Username/Password`
            res.redirect(`/login?error=${error}`)
          } else {
            const isPasswordMatch = bcrypt.compareSync(password, result.password)
            
            if(isPasswordMatch) {
              if (result.isSuspended) {
                const error = `Your Account Has Been Suspended`
                res.redirect(`/login?error=${error}`)
              } else {
                if (result.isAdmin) {
                  res.redirect('/admin')
                } else {
                  res.redirect('/')
                }
              }
            } else {
              const error = `Invalid Username/Password`
              res.redirect(`/login?error=${error}`)
            }
          }
        })
        .catch(err => {
          res.send(err)
        })
    }
  }

  static admin(req, res) {
    let condition = req.query
    if (condition) {
      condition = [Post.sortAndSearch(condition)].map(el => {
        return {
          ...el,
          include: User
        }
      })
    } else {
      condition = { include: User }
    }
    let listPost = {}
    Post.findAll(condition[0])
      .then(result => {
        listPost = result
        let listProfile = [Post.profilePost(result)].map(el => {
          return {
            ...el,
            include: User
          }
        })
        return Profile.findAll(listProfile[0])
      })
      .then(result => {
        res.render('admin', { listPost, result })
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
        res.redirect('/user')
      })
      .catch(err => {
        res.redirect(`/user?error=${err}`)
      })
  }
}

module.exports = Controller;
