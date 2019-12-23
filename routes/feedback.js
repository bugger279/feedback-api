const express = require('express');
const router = express.Router();

// Importing Router
const feedbackController = require('../controllers/feedback');

// Creating a route
router.post('/feedback', feedbackController.giveUserFeedback);
router.get('/feedback', feedbackController.viewFeedback);

// Exxport Router
module.exports = router;