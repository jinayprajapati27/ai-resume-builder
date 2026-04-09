import express from "express";
import dotenv from 'dotenv';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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