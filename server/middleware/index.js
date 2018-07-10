const fs = require('fs')
const path = require('path')
const { Product } = require('../models/Product')

const { Convert, ParseDB } = require('../utils')

const convert = new Convert()

const readAndSetFile = (req, res, next) => {
  let filename = path.join(__dirname, '..', 'uploads', req.file.filename)
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      console.log('Error on FS', err)
    }
    req.csv = data
    next()
  })
}

const csvToJSON = (req, res, next) => {
  // set results on the request object:
  req.results = convert.formatCsv(req.csv)
  next()
}

const parseAndCountField = (req, res, next) => {
  Product.find().then((data) => {
    let parseDB = new ParseDB(data)
    req.results = parseDB.getCountDictionary()
  })
    .then(() => next())
    .catch((err) => { throw err })
}

const generateCsv = (req, res, next) => {
  Product.find().then((data) => {
    let parseDB = new ParseDB(data)
    if (parseDB) {
      req.results = parseDB.getCountDictionary().reduce(convert.generateCsv)
    } else {

    }
  })
    .then(() => next())
    .catch((err) => { throw err })
}

module.exports = {
  readAndSetFile,
  csvToJSON,
  parseAndCountField,
  generateCsv
}
