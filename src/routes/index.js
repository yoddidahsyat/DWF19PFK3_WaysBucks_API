const express = require('express')

const router = express.Router()

const { getUsers, deleteUser } = require('../controllers/user')

//USERS
router.get('/users', getUsers)
router.delete('/user/:id', deleteUser)

module.exports = router