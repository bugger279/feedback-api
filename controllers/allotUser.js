const UserModel = require('../models/user');
const AllotUser = require('../models/giveFeedback');
const sendmail = require('sendmail')();

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

let allotUser = (req, res) => {

    // Find Users
    let findUser = () => {
        return new Promise((resolve, reject) => {
            AllotUser.collection.drop();
            UserModel.find({}, (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users)
                }
            });
        })
    }

    // Assign Users
    let assignUsers = (users) => {
        return new Promise((resolve, reject) => {
            var usersArray = users;
            var userTotalCount = usersArray.length;
            var assignedUsers = [];

            for (let selectedUserPosition = 0; selectedUserPosition < userTotalCount; selectedUserPosition++) {
                while (assignedUsers.length != 3) {
                    var random = randomNumber(0, userTotalCount - 1);
                    if ((selectedUserPosition != random)) { //random no. should not be equal to selected user's position
                        if (assignedUsers.indexOf(random) < 0) {
                            assignedUsers.push(random);
                        }
                    }
                }

                assignedUsers.forEach(index => {
                    let newFeedback = new AllotUser({
                        sender_id: usersArray[selectedUserPosition]._id,
                        sender_name: usersArray[selectedUserPosition].name,
                        sender_email: usersArray[selectedUserPosition].email,
                        receiver_id: usersArray[index]._id,
                        receiver_name: usersArray[index].name,
                        receiver_email: usersArray[index].email,
                        feedback_data: "",
                        active: false
                    })

                    newFeedback.save((err, newUserAlloted) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(newUserAlloted);
                        }
                    })
                });
                assignedUsers = [];
            }
        })
    }

    // Return response from alloted users table
    let allotedUsersResponse = (req, res) => {
        return new Promise((resolve, reject) => {
            AllotUser.find({}, (err, allotedUsersData) => {
                if (err) {
                    res.status(500);
                    reject({ "error": true, "message": "Failed to Allot Users" });
                } else {
                    resolve(allotedUsersData);
                }
            })
        })
    }

    // Send Email to All Users
    let sendEmail = (allotedUsersData) => {
        return new Promise((resolve, reject) => {

            AllotUser.aggregate(
                [
                    {
                        "$group": {
                            "_id": "$sender_id",
                            "sender_email": { "$first": "$sender_email" },
                            "receiver_name": { $push: "$receiver_name" },
                        }
                    }
                ],
                function (err, results) {
                    if (err) throw err;
                    else {
                        results.forEach(result => {
                            let toEmail = result.sender_email;
                            fromEmail = 'inderjeet.sav@neosofttech.com';
                            // Send Mail Code
                            sendmail({
                                from: fromEmail,
                                to: toEmail,
                                subject: 'Feedback Usernames',
                                html: 'You have to give feedback to ' + result.receiver_name[0] + ', ' + result.receiver_name[1] + ' and ' + result.receiver_name[2],
                            }, function (err, reply) {
                                if (err) {
                                    console.log("Not Sent");
                                    console.log(err && err.stack);
                                } else {
                                    console.log("Sent Successfully!");
                                    console.dir(reply);
                                }
                            });
                        });
                        resolve(allotedUsersData)
                    }
                })
        });
    }

    findUser(req, res)
        .then(assignUsers)
        .then(allotedUsersResponse)
        .then(sendEmail)
        .then((data) => { res.send(data) })
        .catch((err) => {
            res.send(err);
        })
}

module.exports = { allotUser };