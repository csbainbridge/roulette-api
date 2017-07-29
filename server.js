/**
 * Roulette API server configuration 
 */

// Third party modules
var http = require('http');
var mongoose = require('mongoose');

// Author defined modules
var router = require('./router.js').router;

var port = 8000;

// Initialise HTTP server instance with routers module.
var server = http.createServer(router).listen(port);

mongoose.connect('mongodb://localhost/roulette-api', function( error, success ) {
    if ( error ) {
        console.log('Connection to database failed: %s', error)
    } else {
        console.log('Connection to database was successful')
    }
});

/**
 * Print out port when the server is listening
 */
function onListening() {
    serverDetails = server.address();
    port = serverDetails.port;
    console.log("roulette-api server listening on port %s", port); 
};

server.on('listening', onListening);

