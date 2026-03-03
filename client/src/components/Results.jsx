import ScoreCard from "./ScoreCard";
import SkillBreakdown from "./SkillBreakdown";
import FeedbackTextCards from "./FeedbackTextCards";

export default function Results({ feedback, radarData }) {
  if (!feedback) return null;

  return (
    <div className="results">
      <ScoreCard feedback={feedback} />
      <SkillBreakdown radarData={radarData} />
      <FeedbackTextCards feedback={feedback} />
    </div>
  );
}