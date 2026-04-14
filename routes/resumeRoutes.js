import { generateResume, exportDocx, getAllResumes, getResumeById, deleteResume } from '../controllers/resumeController.js';
import express from 'express';

const router = express.Router();

router.post('/generate', generateResume);
router.post('/export-docx', exportDocx);
router.get('/', getAllResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

export default router;
