const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, addProjectComment, updateProjectStatus, updateProject, addProjectReply, updateProjectPhase } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route to get projects (accessible by all logged-in users)
router.get('/', protect, getProjects);

// Get project by ID
router.get('/:id', protect, getProjectById);

// Route to create a project (accessible by coordinators and students)
router.post('/', protect, authorize('coordinator', 'student'), createProject);

// Route to update a project (accessible ONLY by coordinators)
router.put('/:id', protect, authorize('coordinator'), updateProject);

// Route to add comment
router.post('/:id/comment', protect, addProjectComment);

// Route to add reply to comment
router.post('/:id/comment/:commentId/reply', protect, addProjectReply);

// Route to update status
router.put('/:id/status', protect, authorize('coordinator', 'mentor'), updateProjectStatus);

// Route to update phase
router.put('/:id/phase', protect, authorize('coordinator', 'mentor'), updateProjectPhase);

module.exports = router;
