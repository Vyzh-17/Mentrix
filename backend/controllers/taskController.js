const Task = require('../models/Task');




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




const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignedTo', 'name email');
            
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




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




const updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        
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
