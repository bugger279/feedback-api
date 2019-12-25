const FeedbackModel = require('../models/feedback');
const response = require('../libs/response');
const check = require('../libs/checkLib');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

let allotUser = (req, res) => {
    UserModel.find({}, function(err, users) {
        var userMap = {};
        users.forEach(function(user) {
          userMap[user._id] = user._id;
    });
    var count = Object.keys(userMap).length;
    console.log(count);
    console.log(userMap);
    res.send({"data" : userMap});
  });
}

module.exports = { allotUser };