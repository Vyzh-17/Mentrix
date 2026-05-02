const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    fileLinks: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['submitted', 'approved', 'rejected'],
        default: 'submitted'
    },
    feedback: {
        type: String,
    },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        text: String,
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Update', updateSchema);
