var player = require('../models/player');

module.exports = function( res, data, callback ) {

    function create( res, data, callback ) {
        var playerDetails = {};
        if ( data.displayName !== "" ) {
            playerDetails.display_name = data.displayName;  
        }
        player.create(playerDetails, function( error, player ) {
            if ( error ) {
                callback(res, error, null);
                return;
            };
            callback(res, null, player)
        });
    }

    function remove( res, data, callback ) {
        player.remove({ _id: data.playerId }, function( error, success ) {
            if ( error ) {
                callback(res, error, null);
                return;
            };
            callback(res, null, "player deleted successfully.")
        });
    }

    function placeBet( res, data, callback ) {
        if ( data.readyStatus === true ) {
            callback(res, null, "You can no longer place any further bets after setting your status as ready.")
            return;
        } else if ( data.betsPlaced.length >= 6 ) {
            callback(res, null, "You can only place a maximum of 6 bets.");
            return;
        } else if ( data.inSession === false ) {
            callback(res, null, "Please join a roulette session before placing any bets.");
            return;
        }
        // {type: number, selection: 20, amount: 0.20} or {type: colour, value: red, amount: 1.00}
        bets = {
            $push: {
                bets_placed: data.bet
            }
        }
        player.update({ _id: data.playerId }, bets, function( error, success ) {
            if ( error ) {
                callback(res, error, null);
                return;
            }
            callback(res, null, "Your bet on " + data.bet.selection + " has been placed successfully");
        });
    }

    function setSessionStatus( res, data, callback ) {
        player.update({ _id: data.playerId }, { in_session: true }, function( error, success ) {
            if ( error ) {
                callback(res, error, null);
                return
            }
            callback(res, null, "player session status updated successfully")
        });
    }

    function ready( res, data, callback ) {
        player.update({ _id: data.playerId }, { ready_status: true }, function( error, success ) {
            if ( error ) {
                callback(res, error, null);
                return;
            };
            
            callback(res, null, "You are ready")
        });
    }

    function find( res, data, callback ) {
        player.findById({ _id: data.id }, function( error, player ) {
            if ( error ) {
                callback(res, error, null);
                return;
            }
            callback(res, null, player)
        });
    }

    function findAll( res, data, callback ) {
        player.find(function( error, players ) {
            if ( error ) {
                callback(res, error, null);
                return;
            }
            callback(res, null, players)
        });
    }

    var methods = {
        create: create,
        delete: remove,
        bet: placeBet,
        join: setSessionStatus,
        ready: ready,
        find: find,
        findAll: findAll
    }

    var method = methods[data.action];

    method(res, data, callback);
}