var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({
    created_at: { type: Date, default: Date.now },
    in_session: { type: Boolean, default: false },
    display_name: { type: String, default: 'anonymous' },
    bets_placed: { type: Array, default: [] },
    ready_status: { type: Boolean, default: false }
});

module.exports = mongoose.model('Player', playerSchema);

//  _session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session'},
//     session_join_time: { type: Date },