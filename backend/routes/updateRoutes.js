const express = require('express');
const router = express.Router();
const { submitUpdate, getUpdates, addFeedback, addUpdateComment, editUpdate } = require('../controllers/updateController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all updates (mentor sees all their project updates, student sees own)
router.get('/', protect, getUpdates);

// Student submits an update
router.post('/', protect, authorize('student'), submitUpdate);

// Student edits/corrects an update
router.put('/:id', protect, authorize('student'), editUpdate);

// Mentor provides feedback (approve/reject)
router.put('/:id/feedback', protect, authorize('mentor'), addFeedback);

// Add comment to update
router.post('/:id/comment', protect, addUpdateComment);

module.exports = router;
