import { generateResume, exportDocx } from '../controllers/resumeController.js';
import express from 'express';

const router = express.Router();

router.post('/generate', generateResume);
router.post('/export-docx', exportDocx);

export default router;
