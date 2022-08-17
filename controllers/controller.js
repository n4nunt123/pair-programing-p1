const { Admins, Posts, Profiles, Users } = require('../models')
const bcrypt = require('bcryptjs')
const { listError } = require('../helper/index')

class Controller {
  static home(req, res) {
    let condition = req.query
    if (condition) {
      condition = [Posts.sortAndSearch(condition)].map(el => {
        return {
          ...el,
          include: Users
        }
      })
    } else {
      condition = { include: Users }
    }
    let listPost = {}
    Posts.findAll(condition[0])
      .then(result => {
        listPost = result
        let listProfile = [Posts.profilePost(result)].map(el => {
          return {
            ...el,
            include: Users
          }
        })
        return Profiles.findAll(listProfile[0])
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
    Users.create({
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
        return Profiles.create({
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
      Users.findOne({ where: { username }})
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
      condition = [Posts.sortAndSearch(condition)].map(el => {
        return {
          ...el,
          include: Users
        }
      })
    } else {
      condition = { include: Users }
    }
    let listPost = {}
    Posts.findAll(condition[0])
      .then(result => {
        listPost = result
        let listProfile = [Posts.profilePost(result)].map(el => {
          return {
            ...el,
            include: Users
          }
        })
        return Profiles.findAll(listProfile[0])
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
    Users.findAll({ 
      include: Profiles,
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
    Users.findOne({ where: { id } })
      .then(result => {
        if(!result.isAdmin){
          if (result.isSuspended) {
            return Users.update(
              { isSuspended: false },
              { where: { id:result.id } })
          } else {
            return Users.update(
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
}

module.exports = Controller