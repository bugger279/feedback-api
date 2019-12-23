const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// var schema = new Schema({
//     fromUserID: { type: String, required: true },
//     toUserID: { type: String, required: true },
//     content: { type: String, required: true },
//     active: { type: Boolean, required: true },
//     createdOn: { type: Date, required: true },
// });

// var schema = new Schema({
//     takerId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     content: [{
//         text: { type: String, required: true },
//         giverId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User'
//         }
//     }]
// });

var schema = new Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiver_id: { type: String, required: true },
    feedback_data: { type: String, required: true }
})

module.exports = mongoose.model('Feedback', schema);