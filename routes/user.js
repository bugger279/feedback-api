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

// Export Router
module.exports = router;


// Get all Ids frpm the DB
//      --> Count total number
//      --> 