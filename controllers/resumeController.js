import { generateResumePipeline } from '../services/aiModel.js';
import { generateDocx } from '../services/docxService.js';

export const generateResume = async (req, res) => {
    try {
        const { rawInput } = req.body;

        if (!rawInput) {
            return res.status(400).json({ error: "rawInput is required" });
        }

        const resumeData = await generateResumePipeline(rawInput);

        // In this stateless version, we don't save to a database.
        // We return the processed data directly.
        res.status(200).json({
            message: "Resume generated successfully",
            resumeId: "stateless_" + Date.now(), // Mock ID
            data: resumeData
        });
    } catch (error) {
        console.error("Controller Error:", error.message);
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
