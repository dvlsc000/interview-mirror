import { useEffect, useMemo, useState } from "react";
import "./index.css";

import { TRACKS_BY_ROLE } from "./constants/tracks";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";

import Header from "./components/Header";
import ControlsBar from "./components/ControlsBar";
import QuestionBox from "./components/QuestionBox";
import AnswerBox from "./components/AnswerBox";
import Results from "./components/Results";

export default function App() {
  const [role, setRole] = useState("frontend");
  const [track, setTrack] = useState("general");
  const [difficulty, setDifficulty] = useState("medium");

  const [question, setQuestion] = useState("");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const trackOptions = useMemo(() => TRACKS_BY_ROLE[role] ?? ["general"], [role]);

  useEffect(() => {
    if (!trackOptions.includes(track)) setTrack(trackOptions[0] || "general");
  }, [trackOptions, track]);

  const { listening, speechSupported, toggleListening } = useSpeechRecognition({
    onTranscriptChange: setTranscript,
    lang: "en-US",
  });

  async function getQuestion() {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const radarData = useMemo(() => {
    if (!feedback) return [];
    return [
      { metric: "Clarity", value: feedback.subscores.clarity },
      { metric: "Structure", value: feedback.subscores.structure },
      { metric: "Relevance", value: feedback.subscores.relevance },
      { metric: "Concise", value: feedback.subscores.conciseness },
      { metric: "Depth", value: feedback.subscores.depth },
    ];
  }, [feedback]);

  return (
    <div className="container">
      <Header />

      <div className="panel">
        <ControlsBar
          role={role}
          setRole={setRole}
          track={track}
          setTrack={setTrack}
          trackOptions={trackOptions}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          loading={loading}
          onNewQuestion={getQuestion}
        />

        <QuestionBox question={question} />

        <AnswerBox
          transcript={transcript}
          setTranscript={setTranscript}
          loading={loading}
          question={question}
          listening={listening}
          speechSupported={speechSupported}
          onToggleListening={toggleListening}
          onAnalyze={analyze}
        />
      </div>

      <Results feedback={feedback} radarData={radarData} />
    </div>
  );
}