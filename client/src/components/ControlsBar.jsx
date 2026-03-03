export default function ControlsBar({
  role,
  setRole,
  track,
  setTrack,
  trackOptions,
  difficulty,
  setDifficulty,
  loading,
  onNewQuestion,
}) {
  return (
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

      <button onClick={onNewQuestion} disabled={loading}>
        {loading ? "Loading..." : "New question"}
      </button>
    </div>
  );
}