/**
 * Roulette API HTTP response utility module
 */

module.exports = function( req, res ) {
    var contentType = {"Content-Type": "application/json"};
    function success( res, data ) {
        res.writeHead(200, contentType);
        res.end(JSON.stringify({
            message: "success",
            data: data
        }))
    }
    function error( res, error ) {
        res.writeHead(404, contentType);
        res.end(JSON.stringify({
            message: "fail",
            data: error
        }))
    }
    function noContent( res ) {
        res.writeHead(204);
        res.end()
    }
    return {
        success: success,
        error: error,
        noContent: noContent
    }
}