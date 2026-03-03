export default function AnswerBox({
  transcript,
  setTranscript,
  loading,
  question,
  listening,
  speechSupported,
  onToggleListening,
  onAnalyze,
}) {
  return (
    <div className="answerBox">
      <div className="label">Your answer</div>

      <div className="answerControls">
        <button
          type="button"
          onClick={onToggleListening}
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
          <span className="hint">Speech-to-text not supported in this browser.</span>
        )}
      </div>

      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Type your answer here… or use the mic."
        rows={8}
      />

      <button onClick={onAnalyze} disabled={loading || !question || !transcript.trim()}>
        {loading ? "Analyzing..." : "Analyze answer"}
      </button>
    </div>
  );
}