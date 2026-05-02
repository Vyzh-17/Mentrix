const express = require('express');
const router = express.Router();
const { createTask, getTasks, getMyTasks, updateTaskStatus } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all tasks assigned to me
router.get('/my-tasks', protect, getMyTasks);

// Get tasks for a project
router.get('/:projectId', protect, getTasks);

// Create a task (coordinators, mentors, and students can assign tasks)
router.post('/', protect, authorize('coordinator', 'mentor', 'student'), createTask);

// Update task status
router.put('/:id/status', protect, updateTaskStatus);

module.exports = router;
