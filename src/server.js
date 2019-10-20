const myRetail = require('./myRetail.js')
const express = require('express')
const app = express()
const router = express.Router()

module.exports = app

app.use(express.json())

app.use('/', router)


/**
 * GET /products/:id
 * @Params: Product ID
 * Returns: Product information
 */
app.get('/products/:id', myRetail.getProductById)


/**
 * PUT /products/:id
 * @Params: Product ID
 * @Body:
 *  id: Product ID optional
 *  name: optional, unused
 *  current_price:
 *    value: currency value (required)
 *    currency_code: ex. USD (required)
 * Returns: Updated product pricing info
 */
app.put('/products/:id', myRetail.putProductPriceSchema, myRetail.putProductPrice)

