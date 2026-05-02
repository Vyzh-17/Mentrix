const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Route to register a user
router.post('/register', registerUser);

// Route to login a user
router.post('/login', loginUser);

// Route to get all users
router.get('/users', require('../middleware/authMiddleware').protect, require('../middleware/authMiddleware').authorize('coordinator', 'student'), require('../controllers/authController').getUsers);

module.exports = router;
