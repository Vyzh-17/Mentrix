const Task = require('../models/Task');

// @desc    Create a new task for a project
// @route   POST /api/tasks
// @access  Private (Coordinator or Mentor)
const createTask = async (req, res) => {
    const { project, title, description, assignedTo, deadline } = req.body;

    try {
        const task = await Task.create({
            project,
            title,
            description,
            assignedTo,
            deadline
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get tasks for a specific project
// @route   GET /api/tasks/:projectId
// @access  Private
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignedTo', 'name email');
            
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tasks assigned to the current user
// @route   GET /api/tasks/my-tasks
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate('project', 'title')
            .populate('assignedTo', 'name');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Ensure user is assigned to task or is a mentor/coordinator
        if (task.assignedTo.toString() !== req.user._id.toString() && req.user.role === 'student') {
            return res.status(401).json({ message: 'Not authorized to update this task' });
        }

        task.status = status;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTask, getTasks, getMyTasks, updateTaskStatus };
