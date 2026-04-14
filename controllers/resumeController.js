import { generateResumePipeline } from '../services/aiModel.js';
import { generateDocx } from '../services/docxService.js';
import Resume from '../models/Resume.js';

export const generateResume = async (req, res) => {
    try {
        const { rawInput } = req.body;

        if (!rawInput) {
            return res.status(400).json({ error: "rawInput is required" });
        }

        const resumeData = await generateResumePipeline(rawInput);

        // Save to MongoDB
        const newResume = new Resume({
            ...resumeData,
            rawInput
        });
        await newResume.save();

        res.status(200).json({
            message: "Resume generated and saved successfully",
            resumeId: newResume._id,
            data: resumeData
        });
    } catch (error) {
        console.error("Controller Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find().sort({ createdAt: -1 });
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) return res.status(404).json({ error: "Resume not found" });
        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findByIdAndDelete(req.params.id);
        if (!resume) return res.status(404).json({ error: "Resume not found" });
        res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const exportDocx = async (req, res) => {
    try {
        const { resumeData } = req.body;

        if (!resumeData) {
            return res.status(400).json({ error: "Resume data is required" });
        }

        const buffer = await generateDocx(resumeData);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=Resume_${(resumeData.personal?.fullName || "Candidate").replace(/\s+/g, "_")}.docx`);
        res.send(buffer);

    } catch (error) {
        console.error("Export Error:", error.message);
        res.status(500).json({ error: "Failed to generate Word document." });
    }
};
