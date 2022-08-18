
// const bcrypt = require('bcryptjs')

// const salt = bcrypt.genSaltSync(5)
// const hash = bcrypt.hashSync('bwaap123',salt)

// // console.log(hash)

// const { User, Profile, Post } = require('./models');

//   `SELECT * FROM "Posts" p
//   JOIN "Users" u ON u.id = p."UserPostId"
//   JOIN "Profiles" ps ON ps."UserProfileId" = u.id`

  
// router.get('/test', (req, res) => {
//   Post.findAll({ include: {
//     model:User,
//     include: { model:Profile }
//     }
//   })
//     .then(result => {
//       res.send(result)
//     })
// })

let imageFormated = (imgUrl) => {
  return imgUrl.substring(7)
}

console.log(imageFormated('images/1660815817024-.jpg'))