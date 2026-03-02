import express from 'express';
import cors from 'cors';

// Create an Express application
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Define a simple health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ ok: "true" });
});

// Start the server on port 3001
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});