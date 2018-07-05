const fs = require('fs')
const path = require('path')
const parse = require('csv-parse/lib/sync')

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
  let records = formatCsv(req.csv)

  // set results on the request object:
  req.results = parse(records, {
    cast: true,
    columns: true
  })
  next()
}

module.exports = { readAndSetFile, csvToJSON }
