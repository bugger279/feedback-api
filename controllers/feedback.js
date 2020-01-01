const FeedbackModel = require('../models/giveFeedback');
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
                        reject(apiResponse);
                    } else {
                        resolve(decoded);
                    }
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
                if (check.isEmpty(receiver_id)) {
                    let apiResponse = response.generate(true, 'Receiver Id cannot be empty', 404, null);
                    res.status(404);
                    reject(apiResponse);
                } else if (feedback_data.length < 15) {
                    console.log("length: " + feedback_data.length);
                    
                    let apiResponse = response.generate(true, 'Feedback length should be greater than 15 characters', 406, null);
                    res.status(406);
                    reject(apiResponse);
                    console.log("++++++++++++++");
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
                            FeedbackModel.findOne({ sender_id: sender_id, receiver_id: receiver_id, active: true }, (err, data) => {
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
                                        var query = { "sender_id": sender_id, "receiver_id": receiver_id };
                                        var update = { "feedback_data": feedback_data, "active": true };
                                        var options = { new: true };
                                        FeedbackModel.findOneAndUpdate(query, update, options, function (err, feedbackData) {
                                            if (err) {
                                                let apiResponse = response.generate(true, 'Failed to create feedback', 500, null);
                                                reject(apiResponse);
                                            }
                                            let feedbackDataObj = feedbackData.toObject();
                                            delete feedbackDataObj.__v;
                                            resolve(feedbackDataObj);
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

    validateToken(req, res)
        .then(insertFeedback)
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.send(err)
        });
}

let fetchYourFeedback = (req, res) => {
    // Get Your Id from token
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
                        reject(apiResponse);
                    } else {
                        resolve(decoded);
                    }
                });
            } else {
                let apiResponse = response.generate(true, "Authentication Token Required", 406, "");
                reject(apiResponse);
            }
        })
    }

    let getFeedback = (tokenData) => {
        return new Promise((resolve, reject) => {
            let sender_id = tokenData.UserData._id;
            FeedbackModel.find({ "receiver_id": sender_id, "active": true }, (err, receivedFeedback) => {
                if (err) {
                    res.status(400);
                    reject(res.send({ "message": "No Users Alloted" }));
                } else {
                    if (check.isEmpty(receivedFeedback)) {
                        let apiResponse = response.generate(false, "No Feedback found", 200, null);
                        reject(apiResponse);
                    } else {
                        resolve(receivedFeedback)
                    }
                }
            })
        });
    }

    validateToken(req, res)
        .then(getFeedback)
        .then((data) => {
            let apiResponse = response.generate(false, "Feedbacks Found", 200, data);
            res.send(apiResponse);
        })
        .catch((error) => {
            res.send(error);
        })
}

module.exports = { giveUserFeedback, fetchYourFeedback };