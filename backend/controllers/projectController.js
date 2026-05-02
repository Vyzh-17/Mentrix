const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Create a new project (Coordinator only)
// @route   POST /api/projects
// @access  Private/Coordinator
const createProject = async (req, res) => {
    const { title, description, mentor, students, deadline } = req.body;

    try {
        let finalStudents = students || [];
        if (req.user.role === 'student' && !finalStudents.includes(req.user._id.toString())) {
            finalStudents.push(req.user._id);
        }

        const project = await Project.create({
            title,
            description,
            mentor,
            students: finalStudents,
            deadline,
            section: req.user.section,
            year: req.user.year
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        let query = {};
        
        // If student, only show their projects
        if (req.user.role === 'student') {
            query.students = req.user._id;
        }
        // If mentor, only show projects they mentor
        else if (req.user.role === 'mentor') {
            query.mentor = req.user._id;
        }
        // Coordinator sees projects in their section
        else if (req.user.role === 'coordinator' && req.user.section) {
            query.section = req.user.section;
        }

        const projectsRaw = await Project.find(query)
            .populate('mentor', 'name email')
            .populate('students', 'name email');
            
        // Calculate completion level for each project
        const projects = await Promise.all(projectsRaw.map(async (p) => {
            const tasks = await Task.find({ project: p._id });
            const doneCount = tasks.filter(t => t.status === 'done').length;
            const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
            return { ...p._doc, progress };
        }));
            
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('mentor', 'name email')
            .populate('students', 'name email');
            
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment to project
// @route   POST /api/projects/:id/comment
// @access  Private
const addProjectComment = async (req, res) => {
    const { text } = req.body;
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const comment = {
            user: req.user._id,
            name: req.user.name,
            text,
            date: new Date()
        };

        project.comments.push(comment);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project status
// @route   PUT /api/projects/:id/status
// @access  Private (Coordinator or Mentor)
const updateProjectStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        project.status = status;
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project details
// @route   PUT /api/projects/:id
// @access  Private/Coordinator
const updateProject = async (req, res) => {
    const { title, description, mentor, students, status, deadline } = req.body;
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (title) project.title = title;
        if (description) project.description = description;
        if (mentor) project.mentor = mentor;
        if (students) project.students = students;
        if (status) project.status = status;
        if (deadline) project.deadline = deadline;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add reply to project comment
// @route   POST /api/projects/:id/comment/:commentId/reply
// @access  Private
const addProjectReply = async (req, res) => {
    const { text } = req.body;
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const comment = project.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        const reply = {
            user: req.user._id,
            name: req.user.name,
            text,
            date: new Date()
        };

        comment.replies.push(reply);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project phase
// @route   PUT /api/projects/:id/phase
// @access  Private (Coordinator or Mentor)
const updateProjectPhase = async (req, res) => {
    const { phase } = req.body;
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Ensure user is authorized
        if (req.user.role === 'student') {
            return res.status(401).json({ message: 'Not authorized to change project phase' });
        }

        project.phase = phase;
        // Optionally update status if Completed
        if (phase === 'Completed') {
            project.status = 'completed';
        } else {
            project.status = 'active'; // Reset if moved backwards
        }

        project.activities.push({
            type: 'update_submitted',
            description: `Project phase advanced to ${phase}`,
            user: req.user.name,
            date: new Date()
        });

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProject, getProjects, getProjectById, addProjectComment, updateProjectStatus, updateProject, addProjectReply, updateProjectPhase };
