import { useState, useEffect } from "react";
import API from "../api/axios";
function Progress() {
  const [records, setRecords] = useState([]);
  const [profile, setProfile] = useState(null);
  const fetchProgress = async () => {
    try {
      const statsRes = await API.get("/progress/stats");
      setRecords(statsRes.data || []);
      const profileRes = await API.get("/health/profile");
      setProfile(profileRes.data);
    } catch (err) {
      console.error("Failed to fetch progress data:", err);
    }
  };
  useEffect(() => {
    fetchProgress();
  }, []);
  const currentWeight = profile?.weight || 0;
  const heightInMeters = (profile?.height || 0) / 100;
  const bmi = heightInMeters > 0 ? (currentWeight / (heightInMeters * heightInMeters)).toFixed(1) : "0";
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      <div className="flex justify-between items-end border-b border-white/10 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <span className="text-blue-500">📈</span> Progress Tracking
          </h1>
          <p className="text-white/40">Real-time daily log of your fitness journey</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-1">Your BMI</div>
          <div className="text-3xl font-black text-purple-400">{bmi}</div>
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-blue-400">📅</span> Daily Activity Log
        </h2>
        {records.length === 0 ? (
          <div className="glass-card p-20 flex flex-col items-center justify-center space-y-6 text-center border-dashed">
            <div className="text-6xl opacity-20">📉</div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">No progress logged yet</h3>
              <p className="text-white/20 text-sm">Complete workouts or track meals to see your daily progress here!</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {records.map((record, i) => (
              <div key={i} className="glass-card p-6 flex flex-col md:flex-row justify-between items-center glass-card-hover group">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="text-center md:text-left min-w-[120px]">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{new Date(record.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                    <p className="text-lg font-bold text-white/80">{new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="h-10 w-[1px] bg-white/5 hidden md:block"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl border border-white/5 group-hover:scale-110 transition-transform">
                      {record.healthy_meals_count > 0 ? "🥗" : "🏋️"}
                    </div>
                    <div>
                      <h4 className="font-bold text-white/90">
                        {record.healthy_meals_count > 0 ? "Healthy Meal Logged" : "Workout Session Completed"}
                      </h4>
                      <p className="text-[10px] text-white/40 uppercase font-medium tracking-wider">Activity ID: #{record.id}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-6 md:mt-0 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                  {record.calories_burned > 0 && (
                    <div className="text-center md:text-right space-y-1">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Burned</p>
                      <p className="text-xl font-bold text-orange-400">{record.calories_burned} <span className="text-[10px] text-white/20">kcal</span></p>
                    </div>
                  )}
                  {record.healthy_meals_count > 0 && (
                    <div className="text-center md:text-right space-y-1">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Meals</p>
                      <p className="text-xl font-bold text-green-400">+{record.healthy_meals_count}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Progress;