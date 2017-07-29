var parser = require('./json-parser.js');
var controllers = require('./controllers');
var response = require('./response.js')();

var url = require('url');
var path = require('path');

function operationComplete( res, error, success ) {
    if ( error ) {
        response.error(res, error);
        return;
    }
    response.success(res, success);
}

exports.get = function( req, res ) {

    var data = {};
    var urlPath = path.parse(url.resolve("/", req.url));
    var controller;
    var id = urlPath.name;

    if ( urlPath.name === 'favicon' ) {
        response.noContent( res );
    } else if ( urlPath.dir === "/" ) {
        controller = controllers[urlPath.base];
        data.action = "findAll";
        controller(res, data, operationComplete);
    } else {
        controller = controllers[urlPath.dir.slice(1)]
        data.action = "find";
        data.id = id;
        controller(res, data, operationComplete);
    }
    
};

exports.post = function( req, res ) {

    function parseComplete( res, data ) {
        controller(res, data, operationComplete);
    };
    
    var resource = req.url.slice(1);
    var controller = controllers[resource];

    if ( controller === null ) {
        response.error(res, "resouce not specified");
    }

    parser(req, res, parseComplete);

}