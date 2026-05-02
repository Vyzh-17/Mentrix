const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

// Initialize the Express application
const app = express();

// Middleware
// Enable CORS (Cross-Origin Resource Sharing) to allow requests from the frontend
app.use(cors());
// Built-in middleware to parse incoming JSON payloads
app.use(express.json());

// Route setup
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/updates', require('./routes/updateRoutes'));

// Basic test route to check if server is running
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define the port for the server to listen on, defaulting to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
