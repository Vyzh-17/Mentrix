const jwt = require('jsonwebtoken');

// Generate a token that expires in 30 days
const generateToken = (id) => {
    // Requires a JWT_SECRET in your .env file
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secretkey', {
        expiresIn: '30d',
    });
};

module.exports = generateToken;
