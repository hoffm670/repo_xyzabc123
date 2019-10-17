const express = require('express')
const app = express()
const myRetail = require('./myRetail.js')
const config = require('./config.json')



app.get('/products/:id', myRetail.getProductById)



app.listen(config.Server.port)