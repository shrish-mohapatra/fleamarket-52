const express = require('express') 
const resolve = require('../resolvers/order.resolve')
const restWrapper = require("../resolvers/wrappers/restWrapper")

const router = express.Router()

router.get('/orders', (req, res) => restWrapper(req, res, resolve.getOrders))
router.post('/orders', (req, res) => restWrapper(req, res, resolve.createOrder))

module.exports = router