const server = require('./server.js')
const config = require('../config.json')

server.listen(config.Server.port, function () {
    console.log('Server running on port %d', config.Server.port);
});