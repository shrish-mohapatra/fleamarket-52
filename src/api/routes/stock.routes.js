const express = require('express') 
const resolve = require('../resolvers/stock.resolve')
const restWrapper = require("../resolvers/wrappers/restWrapper")

const router = express.Router()

router.get('/stocks', (req, res) => restWrapper(req, res, resolve.getStocks))
router.get('/stocks/:symbol', (req, res) => restWrapper(req, res, resolve.getStockData2))
router.get('/stocks/:symbol/history', (req, res) => restWrapper(req, res, resolve.getStockHistory))
router.get('/stockData', (req, res) => restWrapper(req, res, resolve.getStockData))

router.post('/stocks', (req, res) => restWrapper(req, res, resolve.createStock))
router.post('/stockData', (req, res) => restWrapper(req, res, resolve.createStockData))

module.exports = router