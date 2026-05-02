const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');


router.post('/register', registerUser);


router.post('/login', loginUser);


router.get('/users', require('../middleware/authMiddleware').protect, require('../middleware/authMiddleware').authorize('coordinator', 'student'), require('../controllers/authController').getUsers);

module.exports = router;
