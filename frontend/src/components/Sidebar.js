import { useNavigate } from "react-router-dom";
function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="w-64 bg-gray-800 p-5 flex flex-col gap-6">
      <h1 className="text-xl font-bold text-purple-400">
        ArogyaMitra
      </h1>
      <div className="flex flex-col gap-4 text-gray-300">
        <p onClick={() => navigate("/dashboard")} className="cursor-pointer hover:text-white">
          Dashboard
        </p>
        <p onClick={() => navigate("/workouts")} className="cursor-pointer hover:text-white">
          Workouts
        </p>
        <p onClick={() => navigate("/nutrition")} className="cursor-pointer hover:text-white">
          Nutrition
        </p>
        <p onClick={() => navigate("/progress")} className="cursor-pointer hover:text-white">
          Progress
        </p>
        <p onClick={() => navigate("/ai-coach")} className="cursor-pointer hover:text-white">
          AI Coach
        </p>
        <p onClick={() => navigate("/profile")} className="cursor-pointer hover:text-white">
          Profile
        </p>
      </div>
    </div>
  );
}
export default Sidebar;