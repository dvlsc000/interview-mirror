export default function FeedbackTextCards({ feedback }) {
  return (
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
  );
}