const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {
        type: String,
        enum: ['proposed', 'active', 'delayed', 'completed'],
        default: 'proposed'
    },
    deadline: {
        type: Date,
        required: true,
    },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        text: String,
        date: { type: Date, default: Date.now },
        replies: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: String,
            text: String,
            date: { type: Date, default: Date.now }
        }]
    }],
    activities: [{
        type: { type: String, enum: ['task_created', 'task_completed', 'update_submitted', 'feedback_added'] },
        description: String,
        user: String,
        date: { type: Date, default: Date.now }
    }],
    section: {
        type: String,
        required: false
    },
    year: {
        type: String,
        required: false
    },
    phase: {
        type: String,
        enum: ['Ideation', 'Implementation', 'Report', 'Completed'],
        default: 'Ideation'
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
