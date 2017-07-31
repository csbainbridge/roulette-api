var player = require('../models/player');
var rouletteController = require('./RouletteController');

module.exports = (function() {

    function create( res, data, callback ) {

        var playerDetails = {};

        if ( data.displayName !== "" ) {
            playerDetails.display_name = data.displayName;  
        };

        player.create(playerDetails, function( error, player ) {

            if ( error ) {
                callback(res, error, null);
                return;
            };

            callback(res, null, player);

        });

    }

    function find( res, data, callback ) {

        player.findById({ _id: data.id }, function( error, player ) {

            if ( error ) {
                callback(res, error, null);
                return;
            }

            callback(res, null, player);

        });
        
    }

    function findAll( res, data, callback ) {

        player.find(function( error, players ) {

            if ( error ) {
                callback(res, error, null);
                return;
            }

            callback(res, null, players);

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

        bets = {
            $push: {
                bets_placed: data.bet
            }
        }

        data.id = data.playerId;

        player.findOneAndUpdate({ _id: data.playerId }, bets, { new: true }, function( error, success ) {

            if ( error ) {
                callback(res, error, null);
                return;
            }

            var response = {
                message: "Your bet on " + data.bet.selection + " has been placed successfully.",
                data: success.bets_placed
            }

            callback(res, null, response);

        });

    }

    function joinSession( res, data, callback ) {

        data.id = data.playerId;

        player.findOneAndUpdate({ _id: data.id }, { in_session: true }, { new: true }, function( error, player ) {

            if ( error ) {
                callback(res, error, null);
                return
            }

            callback(res, null, player)

        });

    }

    function ready( res, data, callback ) {

        if ( data.betsPlaced.length == 0 ) {
            callback(res, null, "You need to place a bet before you can ready up.");
            return;
        }

        player.update({ _id: data.playerId }, { ready_status: true }, function( error, success ) {
            
            var sessionController = require('./SessionController');

            if ( error ) {
                callback(res, error, null);
                return;
            };

            data.id = data.sessionId;

            sessionController.find(res, data, function( res, error, session ) {

                if ( error ) {
                    callback(res, error, null);
                    return;
                }

                if ( checkPlayersReadyState(session["0"]) ) {

                    callback(res, null, "All players are ready. Time to spin the wheel!")

                    var outcome = rouletteController.getOutcome();
                    settlePlayerBets(session["0"], outcome);

                } else {

                    callback(res, null, "Waiting for other players to ready up.")

                }

            })

        });
    }

    function checkPlayersReadyState(session) {

        var playersReady = false;

        for ( i = 0; i < session.players.length; i++ ) {

            if ( session.players[i].ready_status === false ) {
                return playersReady = false;
            }

        }

        return playersReady = true;

    }

    function settlePlayerBets( session, outcome ) {

        for ( i = 0; i < session.players.length; i++ ) {

            var player = session.players[i];

            for ( j = 0; j < player.bets_placed.length; j++ ) {
                
                var bet = player.bets_placed[j]; 

                publishSettledBets(rouletteController.getResult(bet, outcome), player);

            }

            clearBetsPlaced(player);

        }

        return;
    }

    function publishSettledBets( result, user ) {

        var betsSettled = {
            $push: {
                bets_settled: result
            }
        }

        player.update({ _id: user._id }, betsSettled, function( error, success ) {

            if ( error ) {
                console.log(error);
                return;
            }

        });

        return;
    }

    function clearBetsPlaced(user) {

        player.update({ _id: user._id }, { $set: { bets_placed: [] } }, function( error, success ) {

            if ( error ) {
                console.log(error);
                return;
            }

        });

        return;
    }

    function acceptBetsSettled( res, data, callback ) {

        player.findOneAndUpdate({ _id: data.playerId }, { ready_status: false }, { new: true }, function( error, player ) {

            if ( error ) {
                callback(res, error, null);
                return;
            }

            var response = {
                message: "You are now ready to play again. Please place your bets then ready up.",
                data: {
                    ready_status: player.ready_status
                }
            }

            callback(res, null, response)

        });

    }

    return {
        create: create,
        find: find,
        findAll: findAll,
        delete: remove,
        bet: placeBet,
        join: joinSession,
        ready: ready,
        accept: acceptBetsSettled
    }

}());