var mongoose = require('mongoose');

var sessionSchema = mongoose.Schema({
    created_at: { type: Date, default: Date.now },
    players: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Player',
    }]
});

module.exports = mongoose.model('Session', sessionSchema);