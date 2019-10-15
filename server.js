const express = require('express')
const app = express()
const port = 8080
var path = require('path')

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/README.md')))


getProductById = function (req, res) {
    res.send('Product #: ' + req.params.id)
}

app.get('/products/:id', getProductById)



app.listen(port, () => console.log(`Example app listening on port ${port}!`))