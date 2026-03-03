export default function ScoreCard({ feedback }) {
  return (
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
  );
}