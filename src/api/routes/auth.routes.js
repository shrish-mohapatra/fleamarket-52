const express = require('express') 
const resolve = require('../resolvers/auth.resolve')
const restWrapper = require("../resolvers/wrappers/restWrapper")

const router = express.Router()

router.post('/signup', (req, res) => restWrapper(req, res, resolve.signup))
router.post('/signin', (req, res) => restWrapper(req, res, resolve.signin))

module.exports = router