const mongoose = require('mongoose');
const UserModel = require('../models/user');
const validateInput = require('../libs/paramsValidationLib');
const response = require('../libs/response');
const check = require('../libs/checkLib');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendmail = require('sendmail')();

let passwordArray = ['ant', 'dec', 'bee', 'cat', 'elephant', 'fox', 'goat', 'hen', 'impala', 'jackal', 'koala', 'lion', 'monkey', 'newt', 'owl', 'parrot', 'quail', 'rat', 'snake', 'tiger', 'unau', 'vampire', 'walrus', 'xenarthra', 'yak', 'zebra'];
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let signUpFunction = (req, res) => {
    let validateInputs = () => {
        return new Promise((resolve, reject) => {
            if (req.body.name && req.body.email) {
                if (!validateInput.NameSpace(req.body.name)) {
                    let apiResponse = response.generate(true, "Name should not contain numbers", 406, "");
                    res.status(406);
                    reject(apiResponse);
                }
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, "Invalid Email Id", 406, "");
                    res.status(406);
                    reject(apiResponse);
                } else {
                    resolve(req);
                }
            } else {
                let apiResponse = response.generate(true, "Name and Email Cannot be empty", 406, "");
                res.status(406);
                reject(apiResponse);
            }
        });
    }


    // create user
    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email }, (err, retreivedUserDetails) => {
                if (err) {
                    let apiResponse = response.generate(true, 'Failed To Create User', 500, null);
                    res.status(500);
                    reject(apiResponse);
                } else if (check.isEmpty(retreivedUserDetails)) {
                    var passwordGenerated = passwordArray[getRandomInt(0, (passwordArray.length - 1))] + getRandomInt(0, 10) + getRandomInt(0, 10) + getRandomInt(0, 10);
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(passwordGenerated, salt);
                    let newUser = new UserModel({
                        name: req.body.name,
                        email: req.body.email.toLowerCase(),
                        password: hash
                    });

                    newUser.save((err, newUser) => {
                        if (err) {
                            let apiResponse = response.generate(true, 'Failed to create new User', 500, null);
                            reject(apiResponse);
                        } else {
                            let newUserObj = newUser.toObject();
                            // Send Email 
                            var fromEmail = "inderjeet.sav@neosofttech.com";
                            // const sgMail = require('@sendgrid/mail');
                            // SENDGRID_APY_KEY = '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';
                            // sgMail.setApiKey(SENDGRID_APY_KEY);
                            // const msg = {
                            //     to: newUserObj.email,
                            //     from: fromEmail,
                            //     subject: 'Feedback Credentials',
                            //     html: 'Your Email Id is <strong>' + newUserObj.email + '</strong> <br>Your Password is <strong>' + passwordGenerated + '</strong>',
                            // };
                            // sgMail.send(msg).then(() => {
                            // }).catch((error) => {
                            //     console.log('error', JSON.stringify(error));
                            // });

                            // SendMail Code
                            sendmail({
                                from: fromEmail,
                                to: newUserObj.email,
                                subject: 'Feedback Credentials',
                                html: 'Your Email Id is <strong>' + newUserObj.email + '</strong> <br>Your Password is <strong>' + passwordGenerated + '</strong>',
                            }, (err, reply) => {
                                if (err) {
                                    console.log("Not Sent");
                                } else {
                                    console.log("Sent Successfully!");
                                }
                            });
                            resolve(newUserObj);
                        }
                    })
                } else {
                    let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null);
                    res.status(403);
                    reject(apiResponse);
                }
            })
        });
    }

    validateInputs(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password;
            let apiResponse = response.generate(false, `${resolve.name} registered with our database. Password details has been sent to registered email id`, 200, resolve);
            res.status(201).send(apiResponse);
        })
        .catch((err) => {
            res.send(err);
        })
}

// Login
let loginFunction = (req, res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
                    if (err) {
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null);
                        res.status(500);
                        reject(apiResponse);
                    } else if (check.isEmpty(userDetails)) {
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null);
                        res.status(404);
                        reject(apiResponse);
                    } else {
                        resolve(userDetails);
                    }
                });
            } else {
                let apiResponse = response.generate(true, 'email parameter is missing', 400, null);
                res.status(400);
                reject(apiResponse);
            }
        })
    }

    // Validate Password
    let validatePassword = (retreivedUserDetails) => {
        return new Promise((resolve, reject) => {
            if (!req.body.password) {
                let apiResponse = response.generate(true, 'Password Cannot be Empty', 404, null);
                res.status(404);
                reject(apiResponse);
            } else {
                if (bcrypt.compareSync(req.body.password, retreivedUserDetails.password)) {
                    let retreivedUserDetailsObj = retreivedUserDetails.toObject();
                    delete retreivedUserDetailsObj.__v;
                    const payload = { UserData: retreivedUserDetailsObj };
                    // delete retreivedUserDetailsObj.password;
                    
                    const options = { expiresIn: '2d', issuer: 'Inder' };
                    const secret = "mySecretKey";
                    const token = jwt.sign(payload, secret, options);
                    retreivedUserDetailsObj.token = token;
                    // res.setHeader('token', token);
                    resolve(retreivedUserDetailsObj);
                } else {
                    let apiResponse = response.generate(true, 'Login Failed', 401, "Incorrect Password");
                    res.status(401);
                    reject(apiResponse);
                }
            }
        })
    }

    findUser(req, res)
        .then(validatePassword)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve);
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
        })
}

let findAllUsers = (req, res) => {
    let users = () => {
        return new Promise((resolve, reject) => {
            UserModel.find({}, (err, allUser) => {
                if (err) {
                    reject({ "error": true, "message": "Internal Server Error" });
                } else {
                    if (check.isEmpty(allUser)) {
                        res.status(404);
                        reject({ "error": false, "message": "No Users Found!" })
                    } else {
                        resolve(allUser);
                    }
                }
            })
        });
    }

    users(req, res)
        .then((resolve) => {
            res.send(resolve);
        })
        .catch((err) => {
            res.send(err);
        })
}

module.exports = { signUpFunction, loginFunction, findAllUsers };