function WorkoutCard({ day, exercises }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">{day}</h2>

      {exercises.map((ex, i) => (
        <div key={i} className="mb-2">
          <p>{ex.name}</p>
          <a
            href={ex.video}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 text-sm"
          >
            Watch Video
          </a>
        </div>
      ))}
    </div>
  );
}

export default WorkoutCard;