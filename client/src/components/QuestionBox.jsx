export default function QuestionBox({ question }) {
  return (
    <div className="questionBox">
      <div className="label">Question</div>
      <div className="question">{question || "Click “New question” to start."}</div>
    </div>
  );
}