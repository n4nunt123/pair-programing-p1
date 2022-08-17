const express = require('express')
const route = express.Router()
const Controller = require('../controllers/controller')


route.get('/', Controller.home)
route.get('/register', Controller.register)
route.post('/register', Controller.saveRegister)
route.get('/login', Controller.login)
route.post('/login', Controller.logon)
route.get('/admin', Controller.admin)
route.get('/users', Controller.user)
route.get('/users/:id/', Controller.suspend)

module.exports = route