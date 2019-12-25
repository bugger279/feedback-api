const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');

// Importing Router
const registerController = require('../controllers/user');
const feedbackController = require('../controllers/feedback');
const allotController = require('../controllers/allotUser');

// Creating a route for User
router.post('/register', registerController.signUpFunction);
router.post('/login', registerController.loginFunction);

// Creating a route for feedback
router.post('/feedback', feedbackController.giveUserFeedback);
router.get('/feedback', feedbackController.viewFeedback);

router.post('/allotUser', allotController.allotUser )

router.get('/usersList', function(req, res) {

// var randomeData = db.users.aggregate(
//    [ { $sample: { size: 3 } } ]
// )
// console.log(randomeData);

//   


var cursor = UserModel.aggregate([{ $match : "" }, { $skip: 0 }]).cursor({ batchSize: 10 }).exec();
cursor.eachAsync(function(error, doc) {
  if (error) {
      console.log(error);
  } else {
      console.log(doc);
  }
});

});



// Export Router
module.exports = router;


// Get all Ids frpm the DB
//      --> Count total number
//      --> 