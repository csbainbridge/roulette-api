var session = require('../models/session');

var playerController = require('./PlayerController');

var rouletteController = require('./RouletteController');

/**
 * {
 *  action: action_name,
 *  sessionId: id,
 *  playerId: id,
 * }
 */

module.exports = function( res, data, callback ) {


    function checkReadyState() {
        findAll(null, null, function( res, error, sessions ) {

            if ( error ) {
                console.log(error)
            }

            sessions.forEach(function( session ) {
                var playersReady = false;

                session.players.forEach(function( player ) {
                    if ( player.ready_status === true ) {
                        playersReady = true;
                    } else {
                        playersReady = false;
                    }
                })

                if (playersReady === true ) {
                    var outcome = rouletteController.getResult();
                    console.log(outcome)
                } else {
                    console.log(playersReady)
                }

            })
        })  
    }

    function create( res, data, callback ) {
        session.create(data, function( error, session ) {
            if ( error ) {
                callback(res, error, null);
                return;
            };
            setInterval(checkReadyState, 10000);
            callback(res, null, session)
        });
    }

    function remove( res, data, callback ) {
        session.remove({ _id: data.sessionId }, function( error, success ) {
            if ( error ) {
                callback(res, error, null);
                return;
            };
            callback(res, null, "session deleted successfully")
        });
    }

    function join( res, data, callback ) {
        if ( data.inSession === true ) {
            callback(res, null, "You are already in a session of roulette");
            return;
        }
        playerController(res, data, function( res, error, success ) {
            if ( error ) {
                callback(res, error, null);
                return;
            }
            session.update({ _id: data.sessionId }, { $push: { players: data.playerId } }, function( error, success ) {
                if ( error ) {
                    callback(res, error, null);
                    return;
                }
                callback(res, null, "successfully joined room");
            });
        })
    }

    function leave( id ) {
        session.update({ _id: data.sessionId }, { $pull: { players: data.playerId } }, function( error, success ) {
            if ( error ) {
                callback(res, error, null);
                return;
            };
            callback(res, null, "successfully left room");
        });
    }

    function find( res, data, callback ) {
        session.findById({ _id: data.id }, function( error, session ) {
            if ( error ) {
                callback(res, error, null);
                return;
            }
            callback(res, null, session);
        });
    }

    function findAll( res, data, callback ) {
        session.find().populate("players").exec(function(error, sessions) {
            if ( error ) {
                callback(res, error, null);
                return;
            }
            callback(res, null, sessions);
        })
    }
    
    var methods = {
        create: create,
        delete: remove,
        join: join,
        leave: leave,
        find: find,
        findAll: findAll
    }

    var method = methods[data.action];

    method(res, data, callback);
}