const MongoClient = require('mongodb').MongoClient;
const request = require('request')
const config = require('./config.json')

const url = `mongodb://${config.Database.host}:${config.Database.port}?maxPoolSize=${config.Database.poolSize}`


var mongodb
// Create the database connection
MongoClient.connect(url, function (err, connection) {
    if(err) throw err;
    mongodb = connection.db(config.Database.DB)
});


exports.getProductById = function (req, res) {
    localPricingPromise = new Promise(function(resolve, reject) {
        getLocalProductPricing(req.params.id, function(err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
    externalApiPromise = new Promise(function(resolve, reject) {
        getExternalProductName(req.params.id, function(err, data) {
            if(err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
    Promise.all([localPricingPromise, externalApiPromise])
    .then(function(values) {
        pricing = values[0]
        name = values[1]
        combinedResponse = {
            id: req.params.id,
            name,
            current_price: pricing['current_price']
        }
        res.send(combinedResponse)
    })
    .catch((err) => {
        console.log(err)
        res.status(500).send();
    })
}

function getLocalProductPricing(productId, callback) {
    mongodb.collection(config.Database.collection).find({id: 13860431}, function(err, docs) {
        //TODO clean this up
        docs.each(function(err, doc) {
            if(doc) {
              callback(err, doc)
            }
          });
    })
}

function getExternalProductName(productId, callback) {
    request(`${config.ExternalApi.base}${productId}${config.ExternalApi.fillParams}`, { json: true }, (err, res, body) => {
        if (err) { 
            callback(err)
        } else {
            if (body['product']['item'].hasOwnProperty('product_description')) {
                callback(err, body['product']['item']['product_description']['title'])
            }
        }
    })
}