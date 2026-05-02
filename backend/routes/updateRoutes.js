const express = require('express');
const router = express.Router();
const { submitUpdate, getUpdates, addFeedback, addUpdateComment, editUpdate } = require('../controllers/updateController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.get('/', protect, getUpdates);


router.post('/', protect, authorize('student'), submitUpdate);


router.put('/:id', protect, authorize('student'), editUpdate);


router.put('/:id/feedback', protect, authorize('mentor'), addFeedback);


router.post('/:id/comment', protect, addUpdateComment);

module.exports = router;
