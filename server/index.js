import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Use middleware to parse JSON bodies with a size limit of 2mb
app.use(express.json({ limit: "2mb" }));

// Import the OpenAI client from the openai package
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Define a simple health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ ok: "true" });
});

app.post("/api/question", async (req, res) => {
    try {
        // Extract role and difficulty from the request body
        const { role = "frontend", difficulty = "medium" } = req.body || {};

        // Create a prompt for the OpenAI API to generate an interview question
        const prompt = `
                    Generate ONE interview question.
                    Role: ${role}
                    Difficulty: ${difficulty}
                    Return only the question text, no numbering, no quotes.
                    `.trim();

        // Call the OpenAI API to create a response based on the prompt
        const resp = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: promt,
        });

        // Extract the question text from the API response and trim any whitespace
        const question = resp.output.text.trim() || "Tell me about yourself.";

        // Send the generated question back to the client as a JSON response
        res.json({ question });

        // Handle any errors that occur during the API call or response processing
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate question." });
    }
});

app.post("/api/analyze", async (req, res) => {
    try {
        // Extract role, difficulty, question, and transcript from the request body
        const { role, difficulty, question, transcript } = req.body || {};

        // Validate that both question and transcript are provided in the request
        if (!question || !transcript) {
            return res.status(400).json({ error: "Missing question or transcript." });
        }
    
    // Throw an error if the question exceeds 500 characters or the transcript exceeds 2000 characters
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to analyze answer." });
    }
});

// Start the server on port 3001
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});