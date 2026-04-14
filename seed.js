import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resume from './models/Resume.js';
import connectDB from './config/db.js';

dotenv.config();

const sampleResumes = [
    {
        personal: {
            fullName: "John Doe",
            email: "john@example.com",
            phone: "+1 234 567 890",
            location: "New York, NY"
        },
        targetRole: "Senior Software Engineer",
        summary: "Expert software developer with 10 years of experience in full-stack development using React and Node.js.",
        skills: ["React", "Node.js", "MongoDB", "AWS", "Docker"],
        experience: [
            {
                company: "Tech Corp",
                position: "Lead Developer",
                duration: "2018 - Present",
                description: "Lead architectural decisions and managed a team of 5 developers."
            }
        ],
        rawInput: "Sample input for John Doe."
    },
    {
        personal: {
            fullName: "Jane Smith",
            email: "jane@example.com",
            phone: "+1 987 654 321",
            location: "San Francisco, CA"
        },
        targetRole: "Product Manager",
        summary: "Customer-focused product manager with a track record of delivering successful SaaS products.",
        skills: ["Agile", "Scrum", "Jira", "Market Research"],
        experience: [
            {
                company: "Innovate AI",
                position: "Senior PM",
                duration: "2020 - 2024",
                description: "Oversaw the launch of the flagship AI product line."
            }
        ],
        rawInput: "Sample input for Jane Smith."
    }
];

const seedData = async () => {
    try {
        await connectDB();
        
        // Clear existing data (optional, but good for a fresh start)
        await Resume.deleteMany();
        console.log('Old resumes cleared.');

        await Resume.insertMany(sampleResumes);
        console.log('Sample data seeded successfully!');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
