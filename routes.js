var url = require('url');
var path = require('path');

var parser = require('./parser.js');
var controllers = require('./controllers');
var response = require('./response.js')();

function sendResponse( res, error, data ) {

    if ( error ) {
        response.error(res, error);
        return;
    }

    response.success(res, data)

}

function executeMethod( res, data, controller ) {

    var method = controller[data.action];

    if ( method === null ) {
        response.error(res, "method not found. unable to execute action against the database");
    }

    method(res, data, sendResponse);

}

exports.get = function( req, res ) {

    var data = {};
    var urlPath = path.parse(url.resolve("/", req.url));
    var resource = '';

    if ( urlPath.name === 'favicon' ) {

        response.noContent( res );

    } else if ( urlPath.dir === "/" ) {

        resource = urlPath.base;
        controller = controllers[resource];

        if ( controller === null ) {
            response.error(res, "resource not found");
        }

        controller.findAll(res, data, sendResponse);

    } else {

        resource = urlPath.dir.slice(1);
        controller = controllers[resource];

        if ( controller === null ) {
            response.error(res, "resource not found");
        }

        data.sessionId = urlPath.name;
        controller.find(res, data, sendResponse);

    }
    
};

exports.post = function( req, res ) {
    
    var resource = req.url.slice(1);
    var controller = controllers[resource];

    if ( controller === null ) {
        response.error(res, "resouce not specified");
    }

    parser.json(req, res, controller, executeMethod);

}