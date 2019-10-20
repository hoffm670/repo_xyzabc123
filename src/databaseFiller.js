//TODO shutdown mongo connection upon completion of for each loop
const request = require('request')
const config = require('../config.json')


const MongoClient = require('mongodb').MongoClient;

const url = `mongodb://${config.Database.host}:${config.Database.port}?maxPoolSize=${config.Database.poolSize}`

var mongodb
var index
var count = 1000
// Create the database connection

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, connection) {
    if(err) throw err;
    mongoclient = connection
    mongodb = connection.db(config.Database.DB)
    connection.close()

    var startingId = 13860000
    var endingId = startingId + count - 1
    for (index = 0; index < count; index++) {
        let id = startingId + index
        request(`${config.ExternalApi.base}${id}${config.ExternalApi.fillParams}`, { json: true }, (err, res, body) => {
            if (id == endingId){
                process.exit()
            }
            if (err) { return console.log(err); }
            if (body['product'].hasOwnProperty('price')) {
                console.log('Adding ID: ' + id)
                mongodb.collection(config.Database.collection).insertOne({
                    id: id,
                    current_price: {
                        value: body['product']['price']['listPrice']['price'],
                        currency_code: "USD"
                    }
                })

            }
        })

    }
})

