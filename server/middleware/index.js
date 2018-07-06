const fs = require('fs')
const path = require('path')

const { formatCsv } = require('../utils/index')

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
  req.results = formatCsv(req.csv)

  // set results on the request object:
  next()
}

module.exports = { readAndSetFile, csvToJSON }
