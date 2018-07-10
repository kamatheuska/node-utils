/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
process.env.NODE_ENV = 'test'

const request = require('supertest')
const path = require('path')
const should = require('chai').should()

const { app } = require('../app.js')
const { mongoose } = require('../db/mongoose')

const { csv } = require('./seed')
const { Product } = require('../models/Product')
const { populateProducts, seedProducts, removeProducts } = require('./seed')

console.log('======----------------- TESTING ------------------======')

after((done) => {
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

describe('MANIPULATE THE .csv FILE', () => {
  beforeEach(populateProducts)

  describe('CONVERT: ', () => {
    it('should return a parsed object given a string in .csv format', (done) => {
      request(app)
        .post('/api/convert')
        .attach('data', path.join(__dirname, '/seed/data.csv'))
        .expect(200)
        .expect((res) => {
          let keys = Object.keys(res.body[0])

          res.body.should.be.an('array')
          res.body.length.should.equal(4)
          res.body[0].should.be.an('object')
          res.body[0].specs.color.should.be.an('string')
          keys.length.should.equal(9)
        })
        .then(() => done())
        .catch(e => done(e))
    })

    it('should fail to convert an invalid csv file', (done) => {
      request(app)
        .post('/api/convert')
        .attach('data', path.join(__dirname, '/seed/wrong.csv'))
        .expect(400)
        .then(() => done())
        .catch(e => done(e))
    })
  })

  describe('ANALIZE DATA: ', () => {
    it('should return an array describing how many times are each word metioned in an the DB description', (done) => {
      request(app)
        .get('/api/parse/count')
        .expect(200)
        .expect((res) => {
          let dictionary = res.body.dictionary
          dictionary[0].should.be.an('object')
          dictionary[0].word.should.be.a('string')
          dictionary[0].count.should.be.a('number')
        })
        .then(() => done())
        .catch(e => done(e))
    })

    it('should return a CSV formatted text with the parsed document in descending order', (done) => {
      request(app)
        .get('/api/convert/csv')
        .expect(200)
        .expect((res) => {
          let csv = res.body.csv
          console.log(csv)
          csv[0].should.be.an('object')
          csv[0].word.should.be.a('string')
          csv[0].count.should.be.a('number')
        })
        .then(() => done())
        .catch(e => done(e))
    })
  })
})

describe('DATABASE:', () => {
  describe('POST /products/add', () => {
    before(removeProducts)

    it('should add a batch of items to the database', (done) => {
      request(app)
        .post('/products/add')
        .send([ seedProducts[1], seedProducts[2] ])
        .expect(200)
        .then((res) => {
          res.body.should.exist
          res.body[0].should.be.an('object')
          res.body[0].rates.pvp.unit.should.equal(2600)
          Product.findById(res.body[0]._id).then((item) => {
            item._id.should.exist
          })
        })
        .then(done)
        .catch(e => done(e))
    })

    it('should create a new product in the db', (done) => {
      let item = {
        title: 'ALAMBRE DE MARMOL',
        model: 999888,
        description: 'ESTA es la MejOR DESCRIPCIOn de todas',
        rates: { pvp: { unit: 23 } },
        setup: { keywords: 'ALAMBRE' },
        specs: { amount: { collection: { isCollection: false } } }
      }

      request(app)
        .post('/products/add')
        .send([ item ])
        .expect(200)
        .then((res) => {
          res.body.should.exist
          res.body[0].should.be.an('object')
          res.body[0].rates.pvp.unit.should.equal(23)
          Product.findById(res.body[0]._id).then((item) => {
            item._id.should.exist
          })
        })
        .then(done)
        .catch(e => done(e))
    })

    it('should fail to create a new product in the db', (done) => {
      let badItem = {
        title: 'MADERA DE MARMOL',
        model: null,
        rates: { pvp: { unit: 230 } },
        setup: { keywords: 'MADERA' },
        specs: { amount: { collection: { isCollection: false } } }
      }

      request(app)
        .post('/products/add')
        .send(badItem)
        .expect(400)
        .then(() => done())
        .catch(e => done(e))
    })
  })

  describe('GET /products', () => {
    beforeEach(populateProducts)
    it('should get all the products in DB', (done) => {
      request(app)
        .get('/products')
        .expect(200)
        .then((res) => {
          res.body.should.exist
        })
        .then(() => done())
        .catch(e => done(e))
    })

    it('should get the products that match the one word query', (done) => {
      request(app)
        .post('/products/query')
        .send({ query: 'marron' })
        .expect(200)
        .expect((res) => {
          res.body.should.exist
          res.body.length.should.equal(3)
          res.body[0].rates.pvp.unit.should.equal(2600)
        })
        .then(() => {
          done()
        })
        .catch(err => {
          done(err)
        })
    })
  })
})
