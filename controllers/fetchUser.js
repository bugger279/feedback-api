const giveFeedbackModel = require('../models/giveFeedback');
// const UserModel = require('../models/user');
const response = require('../libs/response');
const jwt = require('jsonwebtoken');
// const sgMail = require('@sendgrid/mail');

const sendmail = require('sendmail')();

let fetchUsers = (req, res) => {

    // Validate Token
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
                        console.log(err);
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

    // Fetch Ids
    let fetchIds = (tokenData) => {
        return new Promise((resolve, reject) => {
            let sender_id = tokenData.UserData._id;
            // let usernames = [];

            giveFeedbackModel.find({ "sender_id": sender_id, "active": false }, (err, allotedData) => {
                if (err) {
                    res.status(400);
                    let apiResponse = response.generate(true, "No Users Alloted or Feedback already given", 400, null);
                    reject(apiResponse);
                } else {
                    resolve(allotedData);
                }
            });
        });
    }

    validateToken(req, res)
        .then(fetchIds)
        .then((data) => {
            if (data.length < 1) {
                let apiResponse = response.generate(false, "You have given feedback", 200, null);
                res.send(apiResponse);   
            } else {
                let apiResponse = response.generate(false, "UsersList", 200, data);
                res.send(apiResponse);                
            }
        })
        .catch((err) => {
            res.send(err);
        })
}

module.exports = { fetchUsers };