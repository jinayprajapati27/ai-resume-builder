import express from "express";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './config/db.js';
import resumeRoutes from './routes/resumeRoutes.js';
import Resume from './models/Resume.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Routes
app.use('/api/resume', resumeRoutes);

// UI Routes
app.get('/', (req, res) => {
    res.render('index', { title: "Executive AI | Orchestrate Your Career" });
});

app.get('/preview', (req, res) => {
    res.render('preview', { title: "Resume Preview" });
});

app.get('/create', (req, res) => {
    res.render('form');
});

app.get('/resumes', async (req, res) => {
    try {
        const userId = req.cookies.resume_user_id;
        if (!userId) {
            return res.render('dashboard', { resumes: [], title: "My Resumes | ResumeAI" });
        }
        const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
        res.render('dashboard', { resumes, title: "My Resumes | ResumeAI" });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).send("Error loading dashboard");
    }
});


// Health Check
app.get('/health', (req, res) => {
    res.send("AI Resume Builder API is running...");
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
    console.log(`Server Listening From : http://localhost:${PORT}`);
});