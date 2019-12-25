const FeedbackModel = require('../models/feedback');
const UserModel = require('../models/user');

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

let allotUser = (req, res) => {
    UserModel.find({}, function (err, users) {
        var usersArray = users;
        var selectedUser = usersArray[24];
        var userTotalCount = usersArray.length;
        console.log(userTotalCount);
        
        var assignedUsers = [];
        var selectedUserPosition = 24;


        while (assignedUsers.length != 3) {
            var random = randomNumber(0, userTotalCount - 1);
            if ((selectedUserPosition != random)) { //random no should not be equal to selected user's position
                if (assignedUsers.indexOf(random) < 0) {
                    assignedUsers.push(random);                    
                }
            }
        }

        console.log(assignedUsers);
        assignedUsers.forEach(index => {
            console.log(usersArray[index]._id);
        });


        // {
        //     sender_id: assignedUsers,
        //     receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        //     feedback: { type: String, required: true },
        //     active: { type: Boolean, default: true },
        //     received_on: { type: Date, default: Date.now }
        // }


        // 
        // usersArray.forEach(user => {
        //     if (user._id !== selectedUser._id) {
        //         assignedUsers.push(user);
        //     }
        // });

    });
}

module.exports = { allotUser };