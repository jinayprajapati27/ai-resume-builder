import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { getStructuringPrompt } from './agents/structuringAgent.js';
import { getAtsPrompt } from './agents/atsAgent.js';
import { getFormattingPrompt } from './agents/formattingAgent.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

/**
 * Validates if the string is valid JSON
 * @param {string} str 
 * @returns {object|null}
 */
const validateJSON = (str) => {
    try {
        // Remove markdown code blocks if present
        const jsonStr = str.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("JSON Validation Error:", e.message);
        return null;
    }
};

/**
 * Calls Gemini with retry logic
 * @param {string} prompt 
 * @param {number} retryCount 
 * @returns {Promise<object>}
 */
const callAgent = async (prompt, retryCount = 1) => {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const json = validateJSON(text);
        if (!json && retryCount > 0) {
            console.log("Retrying agent call...");
            return await callAgent(prompt, retryCount - 1);
        }
        
        if (!json) throw new Error("Invalid AI JSON response after retries");
        return json;
    } catch (error) {
        console.error("Agent Call Error:", error.message);
        throw error;
    }
};

/**
 * Orchestrates the full AI pipeline
 * @param {string} rawInput 
 * @returns {Promise<object>}
 */
export const generateResumePipeline = async (rawInput) => {
    try {
        // 1. Structuring Agent
        console.log("Starting Structuring Agent...");
        const structuredData = await callAgent(getStructuringPrompt(rawInput));

        // 2. ATS Agent
        console.log("Starting ATS Agent...");
        const atsData = await callAgent(getAtsPrompt(structuredData));

        // 3. Formatting Agent
        console.log("Starting Formatting Agent...");
        const formattedData = await callAgent(getFormattingPrompt(atsData));

        return {
            ...atsData,
            formattedResume: formattedData
        };
    } catch (error) {
        throw new Error(`AI Pipeline Failed: ${error.message}`);
    }
};
