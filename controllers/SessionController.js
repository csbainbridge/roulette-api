var session = require('../models/session');
var playerController = require('./PlayerController');

module.exports = (function() {

    function create( res, data, callback ) {

        session.create(data, function( error, session ) {

            if ( error ) {
                callback(res, error, null);
                return;
            };
            
            callback(res, null, session);

        });

    }

    function find( res, data, callback ) {

        session.find({ _id: data.id }).populate("players").exec(function( error, session ) {

            var playersReady = false;

            if ( error ) {
                callback(res, error, null);
                return;
            }

            callback(res, null, session);

        })

    }

    function findAll( res, data, callback ) {

        session.find().populate("players").exec(function(error, sessions) {

            if ( error ) {
                callback(res, error, null);
                return;
            }

            callback(res, null, sessions);

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

        playerController.join(res, data, function( res, error, player ) {

            if ( error ) {
                callback(res, error, null);
                return;
            }

            session.update({ _id: data.sessionId }, { $push: { players: data.playerId } }, function( error, success ) {

                if ( error ) {
                    callback(res, error, null);
                    return;
                }

                var response = {
                    message: "You have successfully joined the roulette room.",
                    data: player
                }

                callback(res, null, response);

            });

        });

    }

    function leave( id ) {
        
        session.update({ _id: data.sessionId }, { $pull: { players: data.playerId } }, function( error, success ) {

            if ( error ) {
                callback(res, error, null);
                return;
            };

            callback(res, null, "You have successfully left the roulette room.");

        });

    }
    
    return {
        create: create,
        delete: remove,
        join: join,
        leave: leave,
        find: find,
        findAll: findAll
    }

}());