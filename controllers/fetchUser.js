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
                    reject(res.send({ "message": "No Users Alloted" }));
                } else {
                    resolve(allotedData);
                }
            });
        });
    }

    validateToken(req, res)
        .then(fetchIds)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err);
        })
}

module.exports = { fetchUsers };