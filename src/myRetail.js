const MongoClient = require('mongodb').MongoClient;
const request = require('request')
const config = require('../config.json')
const { check, validationResult } = require('express-validator')

const url = `mongodb://${config.Database.host}:${config.Database.port}?maxPoolSize=${config.Database.poolSize}`

/*
 * Initial Database connection. 
 * Hold open N number of threads in a pool
 */
var mongodb
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, connection) {
    if (err) throw err;
    mongodb = connection.db(config.Database.DB)
});



/**
 * putProductPrice
 * Updates the current_price value into the database
 * @param {Request} req express Request
 * @param {Response} res express Response
 */
exports.putProductPrice = function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    if(req.body.id && req.body.id != req.params.id) {
        return res.status(422).json({ 
            errors: { 
                msg: "ID from URL parameter & Body do not match. Body ID is optional."
            }
        })
    }
    const productId = parseInt(req.params.id)
    const current_price = req.body.current_price
    mongodb.collection(config.Database.collection).findOneAndUpdate(
        { id: productId },
        { $set: { current_price: current_price }},
        function(err, doc) {
            if (err) {
                return res.status(500).json({ error: 'An error occured.' })
            }
            if (doc['value'] == null) {
                return res.status(404).json({
                    id: productId,
                    name: "",
                    current_price: {}
                })
            }
            return res.status(200).json({
                id: doc['value']['id'],
                current_price: current_price
            })
        }
    )
}

exports.putProductPriceSchema = [
    check('id').exists().isInt(),
    check('name').optional().isString(),
    check('current_price.value').exists().isCurrency(),
    check('current_price.currency_code').exists().isString().isLength(3) //For Production: Some sort of validation against other currency codes
]  

/**
 * getProductById
 * Aggregates the local database price info w/ the redsky API to return product info
 * @param {Request} req express Request
 * @param {Response} res express Response
 */
exports.getProductById = function (req, res) {
    productId = parseInt(req.params.id)
    localPricingPromise = new Promise(function (resolve, reject) {
        getLocalProductPricing(productId, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
    externalApiPromise = new Promise(function (resolve, reject) {
        getExternalProductName(productId, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
    Promise.all([localPricingPromise, externalApiPromise])
    .then(function (values) {
        pricing = values[0]
        name = values[1]
        combinedResponse = {
            id: productId,
            name,
            current_price: pricing['current_price']
        }
        return res.json(combinedResponse)
    })
    .catch((err) => {
        if ('Not Found' == err.message) {
            return res.status(404).json({
                id: productId,
                name: "",
                current_price: {}
            })
        } else {
            return res.status(500).json({ error: 'An error occured.' });
        }

    })
}



/**
 * getLocalProductPricing
 * Acceses the database to retrieve product price info based on ID
 * @param {int} productId product unique identifier
 * @param {callback} callback (error, product current_price{})
 */
function getLocalProductPricing(productId, callback) {
    mongodb.collection(config.Database.collection).find({ id: productId }, function (err, docs) {
        if (err) {
            callback(err)
        }
        docs.toArray(function (err, docs_array) {
            if (docs_array.length == 0) {
                callback(Error('Not Found'))
            } else if (docs_array.length > 1) {
                // This should not happen if all commands go through API
                callback(Error('Database error'))
            } else {
                callback(err, docs_array[0])
            }
        })
    })
}

/**
 * getExternalProductName
 * Accesses the external redsky to retrieve product name info based on ID
 * @param {int} productId product unique identifier
 * @param {callback} callback (error, product name)
 */
function getExternalProductName(productId, callback) {
    request(`${config.ExternalApi.base}${productId}${config.ExternalApi.fillParams}`, { json: true }, (err, res, body) => {
        if (err) {
            callback(err)
        } else {
            if (body['product']['item'].hasOwnProperty('product_description')) {
                callback(err, body['product']['item']['product_description']['title'])
            } else {
                callback(Error('Not Found'))
            }
        }
    })
}