const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Company name is required'],
    },
    position: {
        type: String,
        required: [true, 'job position is required']
    },
    status: {
        type: String,
        enum: ['pending', 'reject', 'interview'],
        default: 'pending'
    },
    workType: {
        type: String,
        enum: ['full-time', 'part-time', 'internship', 'contract'],
        default: 'full-time'
    },
    workLocation: {
        type: String,
        default: 'Mumbai',
        required: [true, 'location is required']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Job role is required', jobSchema);