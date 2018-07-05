const express = require('express')
const path = require('path')
const morgan = require('morgan') 
const multer = require('multer')
const moment = require('moment')
const app = express()
const dist = path.join(__dirname, '..', 'dist')
const { csvToJSON, readAndSetFile  } = require('./middleware')


// MULTIPART PARSING MIDDLEWARE

const formattedName = `data-${ Date.now() }.csv`
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: function(req, file, cb) {
    cb(null, formattedName)
  }
})
const upload = multer({ storage })


// MIDDLEWARE

app.use('/api/convert', upload.single('data'), readAndSetFile, csvToJSON)
app.use(express.static(dist))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}


// ROUTES

app.get('/', (req, res) => {
  res.sendFile(dist + '/index.html')
})

app.post('/api/convert', (req, res) => {
  let data = req.results
  res.status(200).send(data)
})

module.exports = { app }
