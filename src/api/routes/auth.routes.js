const express = require('express') 
const resolve = require('../resolvers/auth.resolve')
const restWrapper = require("../resolvers/wrappers/restWrapper")

const router = express.Router()

router.post('/login', (req, res) => restWrapper(req, res, resolve.login))
router.post('/signin', (req, res) => restWrapper(req, res, resolve.signin))

module.exports = router