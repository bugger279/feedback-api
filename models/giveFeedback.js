const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    feedback: { type: String, default: "" },
    active: { type: Boolean, default: true },
    received_on: { type: Date, default: Date.now }
})

module.exports = mongoose.model('AllotUser', schema);