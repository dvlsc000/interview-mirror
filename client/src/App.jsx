import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import "./index.css";

export default function App() {
  const [role, setRole] = useState("frontend");
  const [difficulty, setDifficulty] = useState("medium");
  const [question, setQuestion] = useState("");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getQuestion() {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, difficulty }),
      });
      const data = await res.json();
      setQuestion(data.question);
    } finally {
      setLoading(false);
    }
  }

  async function analyze() {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, difficulty, question, transcript }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFeedback(data);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  const radarData = feedback
    ? [
        { metric: "Clarity", value: feedback.subscores.clarity },
        { metric: "Structure", value: feedback.subscores.structure },
        { metric: "Relevance", value: feedback.subscores.relevance },
        { metric: "Concise", value: feedback.subscores.conciseness },
        { metric: "Depth", value: feedback.subscores.depth },
      ]
    : [];

  return (
    <div className="container">
      <header className="header">
        <h1>Interview Mirror</h1>
        <p>AI coaching for mock interviews (MVP)</p>
      </header>

      <div className="panel">
        <div className="row">
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="behavioral">Behavioral</option>
            </select>
          </label>

          <label>
            Difficulty
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>

          <button onClick={getQuestion} disabled={loading}>
            {loading ? "Loading..." : "New question"}
          </button>
        </div>

        <div className="questionBox">
          <div className="label">Question</div>
          <div className="question">{question || "Click “New question” to start."}</div>
        </div>

        <div className="answerBox">
          <div className="label">Your answer</div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Type your answer here…"
            rows={8}
          />
          <button onClick={analyze} disabled={loading || !question || !transcript.trim()}>
            {loading ? "Analyzing..." : "Analyze answer"}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="results">
          <div className="scoreCard">
            <div className="score">{feedback.overallScore}</div>
            <div className="scoreLabel">Overall score</div>
            <div className="small">
              STAR detected: <b>{String(feedback.star.detected)}</b>
              {feedback.star.missing?.length ? ` (missing: ${feedback.star.missing.join(", ")})` : ""}
            </div>
            <div className="small">
              Rambling: <b>{String(feedback.flags.rambling)}</b>
            </div>
            <div className="small">
              Filler words: <b>{feedback.flags.fillerWords.join(", ") || "none"}</b>
            </div>
          </div>

          <div className="chartCard">
            <h3>Skill breakdown</h3>
            <RadarChart width={420} height={300} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis domain={[0, 10]} />
              <Radar dataKey="value" />
            </RadarChart>
          </div>

          <div className="textCards">
            <div className="textCard">
              <h3>Strengths</h3>
              <ul>
                {feedback.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="textCard">
              <h3>Improvements</h3>
              <ul>
                {feedback.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="textCard wide">
              <h3>Rewrite (stronger version)</h3>
              <p>{feedback.rewrite}</p>
            </div>
            <div className="textCard wide">
              <h3>Follow-up questions</h3>
              <ul>
                {feedback.followUps.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}