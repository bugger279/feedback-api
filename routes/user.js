const express = require('express');
const router = express.Router();

// Importing Router
const registerController = require('../controllers/user');
const feedbackController = require('../controllers/feedback');

// Creating a route for User
router.post('/register', registerController.signUpFunction);
router.post('/login', registerController.loginFunction);

// Creating a route for feedback
router.post('/feedback', feedbackController.giveUserFeedback);
router.get('/feedback', feedbackController.viewFeedback);

// Exxport Router
module.exports = router;