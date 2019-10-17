//TODO shutdown mongo connection upon completion of for each loop
const request = require('request')
const config = require('./config.json')


const MongoClient = require('mongodb').MongoClient;

const url = `mongodb://${config.Database.host}:${config.Database.port}?maxPoolSize=${config.Database.poolSize}`

var mongodb
// Create the database connection
MongoClient.connect(url, function (err, connection) {
    if(err) throw err;
    mongodb = connection.db(config.Database.DB)
})


var startingId = 13860428
for (i = 0; i < 100; i++) {
    let id = startingId + i
    request(`${config.ExternalApi.base}${id}${config.ExternalApi.fillParams}`, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }

        if (body['product'].hasOwnProperty('price')) {
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
