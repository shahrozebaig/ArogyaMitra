function ProgressChart({ data }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">Progress</h2>
      {data.map((item, i) => (
        <div key={i} className="text-sm">
          {item.weight} kg - {item.calories_burned} cal
        </div>
      ))}
    </div>
  );
}
export default ProgressChart;