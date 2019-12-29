const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    sender_name: { type: String, required: true },
    sender_email: { type: String, required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver_name: { type: String, required: true },
    receiver_email: { type: String, required: true },
    feedback_data: { type: String },
    active: { type: Boolean, default: false, required: true }
})

module.exports = mongoose.model('AllotUser', schema);