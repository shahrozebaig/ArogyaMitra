import { useNavigate, useLocation } from "react-router-dom";
function WorkoutComplete() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const stats = state || {
    calories: 14,
    sets: 3,
    minutes: 4,
    intensity: 0
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in px-4">
      <div className="glass-card p-8 md:p-12 max-w-2xl w-full text-center space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full"></div>
        <div className="relative z-10 space-y-4">
          <div className="text-6xl animate-bounce">🎉</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Workout Complete!
          </h1>
          <p className="text-white/60 text-lg">
            Amazing effort today! You crushed it! 💪
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-3xl flex flex-col items-center justify-center space-y-2 group hover:bg-orange-500/20 transition-all">
            <p className="text-4xl font-black text-orange-400">{stats.calories}</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 flex items-center gap-1">
              Calories Burned 🔥
            </p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-3xl flex flex-col items-center justify-center space-y-2 group hover:bg-green-500/20 transition-all">
            <p className="text-4xl font-black text-green-400">{stats.sets}</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 flex items-center gap-1">
              Sets Completed ✅
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl flex flex-col items-center justify-center space-y-2 group hover:bg-blue-500/20 transition-all">
            <p className="text-4xl font-black text-blue-400">{stats.minutes}</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 flex items-center gap-1">
              Minutes Worked 🦾
            </p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-3xl flex flex-col items-center justify-center space-y-2 group hover:bg-purple-500/20 transition-all">
            <p className="text-4xl font-black text-purple-400">{stats.intensity}%</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 flex items-center gap-1">
              Average Intensity 🚀
            </p>
          </div>
        </div>
        <div className="relative z-10 glass-card p-6 text-left space-y-4 bg-white/5">
          <h3 className="flex items-center gap-2 font-bold text-lg">
            <span className="text-yellow-400">🏆</span>
            What You Achieved Today
          </h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li className="flex items-center gap-3">
              <span className="text-green-400">✓</span> Improved cardiovascular endurance
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-400">✓</span> Built muscle strength and tone
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-400">✓</span> Boosted metabolism for the day
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-400">✓</span> Enhanced energy levels
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-400">✓</span> Progressed towards your fitness goals
            </li>
          </ul>
        </div>
        <button
          onClick={() => navigate("/workouts")}
          className="relative z-10 w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black py-4 rounded-2xl text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-500/20"
        >
          Keep Going! 🚀
        </button>
      </div>
    </div>
  );
}
export default WorkoutComplete;