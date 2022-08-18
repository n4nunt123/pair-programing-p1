const session = require('express-session');
const express = require('express')
const route = require('./routes/router')
const app = express()
const port = 3000

app.use(express.static('images'))
// app.use('/images', express.static(process.cwd() + '/images'))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, sameSite: true }
}))

app.use(route)

app.listen(port, () => {
  console.log(`H8M8 listening to port ${port}`)
})