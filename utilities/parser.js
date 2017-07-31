exports.json = function( req, res, controller, callback ) {

    var data = '';

    req.on('data', function( chunk ) {

        data += chunk

    });

    req.on('end', function() {

       data = JSON.parse(data);
       callback(res, data, controller);

    });

}