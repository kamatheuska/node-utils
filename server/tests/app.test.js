process.env.NODE_ENV = 'test'
const request = require('supertest')
const should = require('chai').should()

const { app } = require('../app.js')
const { mongoose } = require('../db/mongoose')

const { csv } = require('./seed')
const { Product } = require('../models/Product')
const { populateProducts, seedProducts } = require('./seed')

console.log('\n\n========================================')
console.log('======         TESTING...           ====')
console.log('========================================\n\n')

beforeEach(populateProducts)
after((done) => {
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

describe('>------>> CONVERT: \n', () => {
  it('should return a parsed object given a string in .csv format', (done) => {
    request(app)
      .post('/api/convert')
      .attach('data', __dirname + '/seed/data.csv')
      .expect(200)
      .expect((res) => {
        let keys = Object.keys(res.body[0])

        res.body.should.be.an('array')
        res.body.length.should.equal(4)
        res.body[0].should.be.an('object')
        res.body[0].specs.color.should.be.an('string')
        keys.length.should.equal(8)
      })
      .then(() => done())
      .catch(e => done(e))
  })

  it('should fail to convert an invalid csv file', (done) => {
    request(app)
      .post('/api/convert')
      .attach('data', __dirname + '/seed/wrong.csv')
      .expect(400)
      .then(() => done())
      .catch(e => done(e))
  });
})

describe('>------>> DATABASE: \n', () => {

  describe('POST /products/add', () => {  

    it('should add a batch of items to the database', (done) => {
      request(app)
        .post('/products/add')
        .send([ seedProducts[1], seedProducts[2]])
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
        title: "ALAMBRE DE MARMOL",
        model: 9998999888,
        rates: { pvp: { unit: 23 } },
        setup: { keywords: "ALAMBRE" },
        specs: { amount: { collection: { isCollection: false }}}
      }

      request(app)
        .post('/products/add')
        .send(item)
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
        title: "MADERA DE MARMOL",
        model: null,
        rates: { pvp: { unit: 230 } },
        setup: { keywords: "MADERA" },
        specs: { amount: { collection: { isCollection: false }}}
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
    it('should get all the products in DB', (done) => {
      
      request(app)
        .get('/products')
        .expect(200)
        .then((res) => {
          res.body.should.exist
        })
        .then(() => done())
        .catch(e => done(e))
    });
  })
})
