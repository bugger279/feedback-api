const UserModel = require('../models/user');
const AllotUser = require('../models/giveFeedback')
const response = require('../libs/response');

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

let allotUser = (req, res) => {
    UserModel.find({}, function (err, users) {
        var usersArray = users;
        var userTotalCount = usersArray.length;
        var assignedUsers = [];
        console.log(usersArray);
        var flag = 0;

        for (let selectedUserPosition = 0; selectedUserPosition < userTotalCount; selectedUserPosition++) {
            console.log("selectedUserPosition : " + selectedUserPosition);
            while (assignedUsers.length != 3) {
                var random = randomNumber(0, userTotalCount -1);
                console.log("random : " + random);
                if ((selectedUserPosition != random)) { //random no. should not be equal to selected user's position
                    if (assignedUsers.indexOf(random) < 0) {
                        assignedUsers.push(random);
                    }
                }
            }

            assignedUsers.forEach(index => {
                let newFeedback = new AllotUser({
                    sender_id: usersArray[selectedUserPosition]._id,
                    receiver_id: usersArray[index]._id,
                    receiver_name: usersArray[index].name
                })

                newFeedback.save((err, newUserAlloted) => {
                    if (err) {
                        flag++;
                    } else {
                        flag = 0;
                    }
                })
            });
            assignedUsers = [];
        }
    });

    setTimeout(() => {
        AllotUser.find({}, (err, response) => {
        if (err) {
            res.status(500).send({"error": true, "message" : "Internal Server Error"});
        } else {
            res.send({response});
        }
    })
    }, 2000);
}

module.exports = { allotUser };