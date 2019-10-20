const request = require('supertest')
const http = require('http')
const app = require('../src/server.js')


describe('GET /products/:id', function () {
    it('respond with json containing product info (200)', function(done) {
        request(app)
            .get('/products/13860428')
            .expect(200, done)
    })
    it('Unknown Product ID (404)', function(done) {
        request(app)
            .get('/products/13860420')
            .expect(404, done)
    })
    it('Invalid ID return (404)', function(done) {
        request(app)
            .get('/products/aaa')
            .expect(404, done)
    })
})

describe('PUT /products/:id', function () {
    body = {
        "id": 13860428,
        "current_price": {
            "value": 1.00,
            "currency_code": "USD"
        }
    }
    invalid_body = {
        "id": 13860428,
        "current_price": {
            "currency_code": "USD"
        }
    }
    unknown_body = {
        "id": 13860420,
        "current_price": {
            "value": 1.00,
            "currency_code": "USD"
        }
    }
    it('Updates product price (200)', function(done) {
        request(app)
            .put('/products/13860428')
            .send(body)
            .expect(200, done)
    })
    it('Fails when passed invalid body (422)', function(done) {
        request(app)
            .put('/products/13860428')
            .send(invalid_body)
            .expect(422, done)
    })
    it('Fails when giving mismatched IDs (422)', function(done) {
        request(app)
            .put('/products/13860429')
            .send(body)
            .expect(422, done)
    })
    it('Fails when giving unknown id (404)', function(done) {
        request(app)
            .put('/products/13860420')
            .send(unknown_body)
            .expect(404, done)
    })
})