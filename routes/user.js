const express = require('express');
const router = express.Router();

// Importing Router
const registerController = require('../controllers/user');
const feedbackController = require('../controllers/feedback');
const allotController = require('../controllers/allotUser');
const fetchController = require('../controllers/fetchUser');


// Creating a route for User
router.post('/register', registerController.signUpFunction);
router.post('/login', registerController.loginFunction);

// Creating a route for feedback
router.post('/feedback', feedbackController.giveUserFeedback);
router.get('/feedback', feedbackController.fetchYourFeedback);
router.post('/allotUser', allotController.allotUser );

// Fetching ids of alloted users to sender id's 
router.get('/fetchIds/:sender_id', fetchController.fetchUsers);

// Export Router
module.exports = router;


// Get all Ids frpm the DB
//      --> Count total number
//      --> 