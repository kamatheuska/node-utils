process.env.NODE_ENV = 'test'
const request = require('supertest')
const should = require('chai').should()

const { app } = require('../app.js')
const { csv } = require('./seed')

console.log('\n\n========================================')
console.log('======         TESTING...           ====')
console.log('========================================\n\n')


describe('>------>> CONVERT: \n', () => {
  it('should return a parsed object given a string in .csv format', (done) => {
    request(app)
      .post('/api/convert')
      .attach('data', __dirname + '/seed/data.csv')
      .expect(200)
      .expect((res) => {
        let keys = Object.keys(res.body.collection[0])
        let collection = res.body.collection

        collection.should.be.an('array')
        collection.length.should.equal(4)
        collection[0].should.be.an('object')
        collection[0].specs.color.should.be.an('string')
        keys.length.should.equal(7)
      })
      .end(done)
  })
})
