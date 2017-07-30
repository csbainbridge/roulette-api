exports.getOutcome = function() {
    
    var TABLE_OUTCOMES = [
        { number: 1, colour: "red" },
        { number: 2, colour: "black" },
        { number: 3, colour: "red" },
        { number: 4, colour: "black" },
        { number: 5, colour: "red" },
        { number: 6, colour: "black" },
        { number: 7, colour: "red" },
        { number: 8, colour: "black" },
        { number: 9, colour: "red" },
        { number: 10, colour: "black" },
        { number: 11, colour: "black" },
        { number: 12, colour: "red" },
        { number: 13, colour: "black" },
        { number: 14, colour: "red" },
        { number: 15, colour: "black" },
        { number: 16, colour: "red" },
        { number: 17, colour: "black" },
        { number: 18, colour: "red" },
        { number: 19, colour: "red" },
        { number: 20, colour: "black" },
        { number: 21, colour: "red" },
        { number: 22, colour: "black" },
        { number: 23, colour: "red" },
        { number: 24, colour: "black" },
        { number: 25, colour: "red" },
        { number: 26, colour: "black" },
        { number: 27, colour: "red" },
        { number: 28, colour: "black" },
        { number: 29, colour: "black" },
        { number: 30, colour: "red" },
        { number: 31, colour: "black" },
        { number: 32, colour: "red" },
        { number: 33, colour: "black" },
        { number: 34, colour: "red" },
        { number: 35, colour: "black" },
        { number: 36, colour: "red" }
    ];

    return TABLE_OUTCOMES[Math.round(Math.random()*TABLE_OUTCOMES.length)];
}

exports.getResult = function(bet, outcome) {

    var result = {};
    
    switch(bet.type) {

        case "colour":

            if ( bet.selection === outcome.colour ) {
                result = {
                    outcome: outcome,
                    bet: bet,
                    result: "win",
                    amount: bet.amount * 2
                }
            } else {
                result = {
                    outcome: outcome,
                    bet: bet,
                    result: "loss",
                    amount: 0
                }
            }

            break;
        
        case "number":
        
            if ( bet.selection === outcome.number ) {
                result = {
                    outcome: outcome,
                    bet: bet,
                    result: "win",
                    amount: bet.amount * 35
                }
            } else {
                result = {
                    outcome: outcome,
                    bet: bet,
                    result: "loss",
                    amount: 0
                }
            }
            break;
    }

    return result;

}