import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { analysisSchema } from './schemas/analysisSchema.js';

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Use middleware to parse JSON bodies with a size limit of 2mb
app.use(express.json({ limit: "2mb" }));

// Initialize the GoogleGenAI client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define a simple health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ ok: "true" });
});

app.post("/api/question", async (req, res) => {
    try {
        // Extract role and difficulty from the request body, providing default values if they are not present
        const { role = "frontend", difficulty = "medium" } = req.body || {};

        // Create a prompt for the OpenAI API to generate an interview question based on the specified role and difficulty
        const prompt = `
                        Generate ONE interview question.
                        Role: ${role}
                        Difficulty: ${difficulty}
                        Return only the question text, no numbering, no quotes.
                        `.trim();

        // Call the OpenAI API to generate a question based on the prompt and send it back to the client as a JSON response
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        // Extract the question text from the API response, trim it, and provide a default question if the response is empty
        const question = (response.text || "").trim() || "Tell me about yourself.";
        res.json({ question });

        // Log any errors that occur during the question generation process and send a 500 status code with an error message back to the client
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

        // Create a prompt for the OpenAI API to evaluate the interview answer based on the provided question and transcript
        const evalPrompt = `
                        You are an interview coach. Evaluate the answer and return strict JSON that matches the provided schema.

                        Role: ${role || "unknown"}
                        Difficulty: ${difficulty || "unknown"}
                        Question: ${question}

                        Answer transcript:
                        ${transcript}

                        Scoring rules:
                        - Be honest but constructive.
                        - Penalize rambling and low specificity.
                        - For behavioral answers, check STAR (Situation, Task, Action, Result). If missing parts, list them.
                        - fillerWords: only include obvious fillers that appear in the text (e.g., "um", "like", "you know"). If none, return [].
                        `.trim();

        // Call the OpenAI API to create a response based on the evaluation prompt and validate the output against the defined schema
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: evalPrompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: analysisSchema,
            },
        });


        // Parse the feedback from the API response and send it back to the client as a JSON response
        const feedback = JSON.parse(response.text);
        res.json(feedback);

        // Throw an error if the question exceeds 500 characters or the transcript exceeds 2000 characters
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to analyze answer." });
    }
});

// Start the Express server on the specified port and log a message to the console
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));