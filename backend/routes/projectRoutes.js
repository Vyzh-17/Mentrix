const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, addProjectComment, updateProjectStatus, updateProject, addProjectReply, updateProjectPhase } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.get('/', protect, getProjects);


router.get('/:id', protect, getProjectById);


router.post('/', protect, authorize('coordinator', 'student'), createProject);


router.put('/:id', protect, authorize('coordinator'), updateProject);


router.post('/:id/comment', protect, addProjectComment);


router.post('/:id/comment/:commentId/reply', protect, addProjectReply);


router.put('/:id/status', protect, authorize('coordinator', 'mentor'), updateProjectStatus);


router.put('/:id/phase', protect, authorize('coordinator', 'mentor'), updateProjectPhase);

module.exports = router;
