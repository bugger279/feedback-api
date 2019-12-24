const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: [{
        feedback: { type: String, required: true },
        received_on: { type: Date, default: Date.now }
    }]
})

module.exports = mongoose.model('Feedback', schema);