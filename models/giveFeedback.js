const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver_name: { type: String, required: true },
    active: { type: Boolean, default: true }
})

module.exports = mongoose.model('AllotUser', schema);