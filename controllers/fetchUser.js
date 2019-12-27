const check = require('../libs/checkLib');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const giveFeedbackModel = require('../models/giveFeedback');

let fetchUsers = (req, res) => {
    giveFeedbackModel.find({"sender_id": req.body.sender_id}, (err, allotedData) => {
        if (err) {
            res.status(400).send({"message": "No Users Alloted"})
        } else {
            res.send({"usersList": allotedData});
        }
    })
}

module.exports = { fetchUsers };