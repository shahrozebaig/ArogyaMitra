function MealCard({ day, meals }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">{day}</h2>

      <p><strong>Breakfast:</strong> {meals?.breakfast}</p>
      <p><strong>Lunch:</strong> {meals?.lunch}</p>
      <p><strong>Dinner:</strong> {meals?.dinner}</p>
    </div>
  );
}

export default MealCard;