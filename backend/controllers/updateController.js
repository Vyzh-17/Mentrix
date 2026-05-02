const Update = require('../models/Update');

// @desc    Submit a weekly update
// @route   POST /api/updates
// @access  Private (Student)
const submitUpdate = async (req, res) => {
    const { project, task, description, fileLinks } = req.body;

    try {
        const update = await Update.create({
            project,
            task,
            student: req.user._id, // Gotten from auth middleware
            description,
            fileLinks
        });

        res.status(201).json(update);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Provide feedback on an update
// @route   PUT /api/updates/:id/feedback
// @access  Private (Mentor)
const addFeedback = async (req, res) => {
    const { status, feedback } = req.body;

    try {
        const update = await Update.findById(req.params.id);

        if (!update) {
            return res.status(404).json({ message: 'Update not found' });
        }

        update.status = status || update.status;
        update.feedback = feedback || update.feedback;

        const updatedSubmission = await update.save();
        res.json(updatedSubmission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment to update (report)
// @route   POST /api/updates/:id/comment
// @access  Private
const addUpdateComment = async (req, res) => {
    const { text } = req.body;
    try {
        const update = await Update.findById(req.params.id);
        if (!update) return res.status(404).json({ message: 'Update not found' });

        const comment = {
            user: req.user._id,
            name: req.user.name,
            text,
            date: new Date()
        };

        update.comments.push(comment);
        await update.save();
        res.status(201).json(update);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all updates
// @route   GET /api/updates
// @access  Private
const getUpdates = async (req, res) => {
    try {
        let query = {};
        
        if (req.query.projectId) {
            query.project = req.query.projectId;
        } else {
            if (req.user.role === 'student') {
                // Should technically be projects they are a part of, but for now:
                const Project = require('../models/Project');
                const myProjects = await Project.find({ students: req.user._id }).select('_id');
                query.project = { $in: myProjects.map(p => p._id) };
            } else if (req.user.role === 'mentor') {
                const Project = require('../models/Project');
                const mentoredProjects = await Project.find({ mentor: req.user._id }).select('_id');
                query.project = { $in: mentoredProjects.map(p => p._id) };
            }
        }

        const updates = await Update.find(query)
            .populate('student', 'name email')
            .populate('project', 'title')
            .sort({ createdAt: -1 });
        res.json(updates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Edit/Correct a submission
// @route   PUT /api/updates/:id
// @access  Private (Student)
const editUpdate = async (req, res) => {
    const { description, fileLinks } = req.body;
    try {
        const update = await Update.findById(req.params.id);
        if (!update) return res.status(404).json({ message: 'Update not found' });

        // Only owner can edit
        if (update.student.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        update.description = description || update.description;
        update.fileLinks = fileLinks || update.fileLinks;
        update.status = 'submitted'; // Reset status for re-review

        const updated = await update.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitUpdate, getUpdates, addFeedback, addUpdateComment, editUpdate };
