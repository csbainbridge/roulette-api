/**
 * Roulette API routes module
 */

var routes = require('./routes.js');

exports.router = function( req, res ) {

    switch(req.method) {

        case 'GET':
            routes.get(req, res);
            break;

        case 'POST':
            routes.post(req, res)
            break;

    };
    
}