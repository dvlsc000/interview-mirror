import { useState, useRef, useEffect, useMemo } from "react";
import SkillRadar from "./components/SkillRadar";
import "./index.css";

const TRACKS_BY_ROLE = {
  frontend: ["general", "react", "ionic", "angular", "vue", "svelte"],
  backend: ["general", "node", "python", "java", "c", "csharp", "go", "php"],
  behavioral: ["general", "leadership", "conflict", "teamwork", "ownership"],
};

export default function App() {
  const [role, setRole] = useState("frontend");
  const [track, setTrack] = useState("general"); // NEW
  const [difficulty, setDifficulty] = useState("medium");
  const [question, setQuestion] = useState("");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  // For voice input
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Create speech recognition once
  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const recognitionRef = useRef(null); // simple stable ref alternative

  useEffect(() => {
    if (typeof window !== "undefined" && !SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // NEW: Track options based on selected role
  const trackOptions = useMemo(() => {
    return TRACKS_BY_ROLE[role] ?? ["general"];
  }, [role]);

  // NEW: Ensure track is valid when role changes
  useEffect(() => {
    if (!trackOptions.includes(track)) {
      setTrack(trackOptions[0] || "general");
    }
  }, [trackOptions, track]);

  function startListening() {
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let text = "";

      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + " ";
      }

      setTranscript(text.trim());
    };

    recognition.onerror = (e) => {
      console.error(e);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  }

  function toggleListening() {
    if (listening) stopListening();
    else startListening();
  }

  async function getQuestion() {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // role + difficulty are unchanged; track is added (should not break functionality if backend ignores it)
        body: JSON.stringify({ role, difficulty, track }),
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
        // role + difficulty are unchanged; track is added (should not break functionality if backend ignores it)
        body: JSON.stringify({ role, difficulty, track, question, transcript }),
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

          {/* NEW: Track dropdown */}
          <label>
            Track
            <select value={track} onChange={(e) => setTrack(e.target.value)}>
              {trackOptions.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Difficulty
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
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
          <div className="question">
            {question || "Click “New question” to start."}
          </div>
        </div>

        <div className="answerBox">
          <div className="label">Your answer</div>

          <div className="answerControls">
            <button
              type="button"
              onClick={toggleListening}
              disabled={loading || !question || !speechSupported}
              className={listening ? "danger" : ""}
            >
              {listening ? "Stop recording" : "🎤 Record answer"}
            </button>

            <button
              type="button"
              onClick={() => setTranscript("")}
              disabled={loading || !transcript}
            >
              Clear
            </button>

            {!speechSupported && (
              <span className="hint">
                Speech-to-text not supported in this browser.
              </span>
            )}
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Type your answer here… or use the mic."
            rows={8}
          />

          <button
            onClick={analyze}
            disabled={loading || !question || !transcript.trim()}
          >
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
              {feedback.star.missing?.length
                ? ` (missing: ${feedback.star.missing.join(", ")})`
                : ""}
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
            <SkillRadar data={radarData} />
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