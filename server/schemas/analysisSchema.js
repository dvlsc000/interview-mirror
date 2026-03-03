// schemas/analysisSchema.js

// This schema defines the structure of the analysis object returned by the server.
export const analysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overallScore: { type: "integer", minimum: 0, maximum: 100 },

    subscores: {
      type: "object",
      additionalProperties: false,
      properties: {
        clarity: { type: "integer", minimum: 0, maximum: 10 },
        structure: { type: "integer", minimum: 0, maximum: 10 },
        relevance: { type: "integer", minimum: 0, maximum: 10 },
        conciseness: { type: "integer", minimum: 0, maximum: 10 },
        depth: { type: "integer", minimum: 0, maximum: 10 }
      },
      required: ["clarity", "structure", "relevance", "conciseness", "depth"]
    },

    star: {
      type: "object",
      additionalProperties: false,
      properties: {
        detected: { type: "boolean" },
        missing: { type: "array", items: { type: "string" } }
      },
      required: ["detected", "missing"]
    },

    strengths: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 5
    },

    improvements: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 5
    },

    rewrite: { type: "string" },

    followUps: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 4
    },

    flags: {
      type: "object",
      additionalProperties: false,
      properties: {
        rambling: { type: "boolean" },
        fillerWords: { type: "array", items: { type: "string" } }
      },
      required: ["rambling", "fillerWords"]
    }
  },

  required: [
    "overallScore",
    "subscores",
    "star",
    "strengths",
    "improvements",
    "rewrite",
    "followUps",
    "flags"
  ]
};