const UserModel = require('../models/user');
const AllotUser = require('../models/giveFeedback')
const response = require('../libs/response');

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

let allotUser = (req, res, next) => {
    UserModel.find({}, function (err, users) {
        var usersArray = users;
        var userTotalCount = usersArray.length;
        var assignedUsers = [];

        for (let selectedUserPosition = 0; selectedUserPosition < (userTotalCount - 25); selectedUserPosition++) {
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
    
            console.log("=============assignedUsers=============");
            console.log(assignedUsers);
            console.log("=============assignedUsers=============");

            assignedUsers.forEach(index => {
                let newFeedback = new AllotUser({
                    sender_id: usersArray[selectedUserPosition]._id,
                    receiver_id: usersArray[index]._id,
                })

                newFeedback.save((err, newUserAlloted) => {
                    if (err) {
                        let apiResponse = response.generate(true, "Failed to allot User", 500,  null)
                        res.status(500).send(apiResponse);
                    } else {
                        let apiResponse = response.generate(false, "User alloted successfully", 200,  null)
                        res.send(apiResponse);
                    }
                })
            });
            assignedUsers = [];
        }
    });
}

module.exports = { allotUser };