const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiver_id: { type: String, required: true },
    feedback_data: { type: String, required: true },
    active: { type: Boolean, default: true }
})

module.exports = mongoose.model('Feedback', schema);