const express = require('express');
const router = express.Router();
const { createTask, getTasks, getMyTasks, updateTaskStatus } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.get('/my-tasks', protect, getMyTasks);


router.get('/:projectId', protect, getTasks);


router.post('/', protect, authorize('coordinator', 'mentor', 'student'), createTask);


router.put('/:id/status', protect, updateTaskStatus);

module.exports = router;
