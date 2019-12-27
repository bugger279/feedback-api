const FeedbackModel = require('../models/feedback');
const response = require('../libs/response');
const check = require('../libs/checkLib');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

let giveUserFeedback = (req, res) => {
    // validate Token
    let validateToken = () => {
        return new Promise((resolve, reject) => {
            if (req.header('token')) {
                const options = {
                    expiresIn: '2d',
                    issuer: 'Inder'
                }
                jwt.verify(req.header('token'), 'mySecretKey', options, (err, decoded) => {
                    if (err) {
                        let apiResponse = response.generate(true, "Invalid WebToken", 406, "");
                        let fetchUserRandom = (req, res) => {
                            UserModel.count().exec(function(err, count){
                                var random = Math.floor(Math.random() * count);
                                Model.findOne().skip(random).exec(
                                    function (err, result) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("===============Random===============");
                                        console.log(result);
                                        console.log("===============Random===============");
                                    }
                                });
                            });
                        }
                        reject(apiResponse);
                    } else { resolve(decoded); }
                });
            } else {
                let apiResponse = response.generate(true, "Authentication Token Required", 406, "");
                reject(apiResponse);
            }
        })
    }

    // Push feedback into user
    let insertFeedback = (tokenData) => {
        return new Promise((resolve, reject) => {
            let sender_id = tokenData.UserData._id;
            let receiver_id = req.body.receiver_id;
            let feedback_data = req.body.feedback_data;

            if (tokenData.UserData._id == receiver_id) {
                let apiResponse = response.generate(true, 'Cannot give feedback to yourself', 409, null);
                res.status(409);
                reject(apiResponse);
            } else {
             if (check.isEmpty(receiver_id) || check.isEmpty(feedback_data)) {
                let apiResponse = response.generate(true, 'Feedback or receiver Id cannot be empty', 404, null);
                res.status(404);
                reject(apiResponse);
            } else {
                UserModel.findOne({ _id: receiver_id }, (err, retreivedUserDetails) => {
                    if (err) {
                        let apiResponse = response.generate(true, 'Failed to find Details', 500, null);
                        res.status(500);
                        reject(apiResponse);
                    } else if (check.isEmpty(retreivedUserDetails)) {
                        let apiResponse = response.generate(true, 'No Users with such Id', 404, null);
                        res.status(404);
                        reject(apiResponse);
                    } else {
                        FeedbackModel.findOne({sender_id: sender_id, receiver_id: receiver_id}, (err, data) => {
                            if (err) {
                                let apiResponse = response.generate(true, 'Failed to find Details', 500, null);
                                res.status(500);
                                reject(apiResponse);
                            } else {
                                if (!check.isEmpty(data)) {
                                    let apiResponse = response.generate(true, 'Feedback already given', 409, null);
                                    res.status(409);
                                    reject(apiResponse);
                                } else {
                                    var newFeedback = new FeedbackModel({
                                        sender_id: sender_id,
                                        receiver_id: receiver_id,
                                        feedback_data: feedback_data,
                                        active: false
                                    });
                                    newFeedback.save((err, feedbackData) => {
                                        if (err) {
                                            let apiResponse = response.generate(true, 'Failed to create feedback', 500, null);
                                            reject(apiResponse);
                                        } else {
                                            let feedbackDataObj = feedbackData.toObject();
                                            delete feedbackDataObj.__v;
                                            resolve(feedbackDataObj);
                                        }
                                    });
                                }
                            }
                        })
                    }
                })
            }   
            }

        })
    }
    // Fetch User id from token
    let fetchUser = () => {
        return new Promise((resolve, reject) => {
            db.users.aggregate([{ $sample: { size: 3 } }])
            UserModel.find()
                    .limit(3)
                    .exec(function (err, songs) {
                        res.json(songs);
                    });
        });
    }
    // Assign Three randoms users
    validateToken(req, res)
        .then(insertFeedback)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Token Validated', 200, resolve);
            res.send(apiResponse);
        })
        .catch((err) => {
            res.send(err)
        })
}

let fetchYourFeedback = (req, res) => {
    FeedbackModel.find({"receiver_id": req.body.receiver_id}, {active: false}, (err, receivedFeedback) => {
        if (err) {
            res.status(400).send({"message": "No Users Alloted"})
        } else {
            console.log(receivedFeedback);

            res.send({"feedbacks": receivedFeedback});
        }
    })
}

module.exports = { giveUserFeedback, fetchYourFeedback };