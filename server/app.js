require('./config')

const express = require('express')
const path = require('path')
const morgan = require('morgan') 
const multer = require('multer')
const bodyParser = require('body-parser')
const moment = require('moment')

const app = express()
const dist = path.join(__dirname, '..', 'dist')
const { csvToJSON, readAndSetFile  } = require('./middleware')
const { mongoose } = require('./db/mongoose')
const { Product } = require('./models/Product')


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
app.use(express.static(dist))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/convert', upload.single('data'))
app.use('/api/convert', readAndSetFile)
app.use('/api/convert', csvToJSON)

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}


// ROUTES

app.get('/', (req, res) => {
  res.sendFile(dist + '/index.html')
})

app.post('/api/convert', (req, res) => {
  let { collection } = req.results
  Product.insertMany(collection)
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((err) => {
      res.status(400).send()
    })
})


app.post('/products/add', (req, res) => {
  let items = req.body
  Product.insertMany(items)
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((err) => {
      res.status(400).send()
    })
})

// GET PRODUCTS
app.get('/products', (req, res) => {
  Product.find()
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((err) => {
      res.status(400).send()
    })
})

// QUERY ON DESCRIPTION
app.post('/products/query', (req, res) => {
  let query = req.body.query.toUpperCase()
    .trim()
    .split(' ')
    .filter(word => word.length !== 0)
    .join(' ')
  Product.find( { $text: { $search: query  } } )
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})
module.exports = { app }
