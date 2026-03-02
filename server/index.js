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

// Start the server on port 3001
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});