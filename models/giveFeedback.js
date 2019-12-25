const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    feedback: { type: String, required: true },
    active: { type: Boolean, default: true },
    received_on: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Feedback', schema);