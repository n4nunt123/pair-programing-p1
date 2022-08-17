const express = require('express')
const route = require('./routes/router')
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(route)

app.listen(port, () => {
  console.log(`H8M8 listening to port ${port}`)
})