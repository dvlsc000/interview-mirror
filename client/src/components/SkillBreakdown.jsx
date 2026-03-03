import SkillRadar from "./SkillRadar";

export default function SkillBreakdown({ radarData }) {
  return (
    <div className="chartCard">
      <h3>Skill breakdown</h3>
      <SkillRadar data={radarData} />
    </div>
  );
}