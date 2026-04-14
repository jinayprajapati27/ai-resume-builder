import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    personal: {
        fullName: { type: String, required: true },
        email: { type: String },
        phone: { type: String },
        linkedin: { type: String },
        portfolio: { type: String },
        location: { type: String }
    },
    targetRole: { type: String },
    summary: { type: String },
    skills: [String],
    experience: [mongoose.Schema.Types.Mixed],
    projects: [mongoose.Schema.Types.Mixed],
    education: [mongoose.Schema.Types.Mixed],
    training: [mongoose.Schema.Types.Mixed],
    achievements: [mongoose.Schema.Types.Mixed],
    languages: [mongoose.Schema.Types.Mixed],
    // The ATS optimized/formatted version
    formattedResume: mongoose.Schema.Types.Mixed,
    rawInput: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
