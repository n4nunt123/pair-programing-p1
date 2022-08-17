const { Admins, Posts, Profiles, Users } = require('../models')

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
}

module.exports = Controller