import { useState, useEffect } from "react";
import API from "../api/axios";

function Progress() {
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchProgress = async () => {
    try {
      const res = await API.get("/progress/stats");
      setRecords(res.data);
    } catch (err) {
      setRecords([
        { weight: 72, calories_burned: 450, workout_completed: "Push Day", date: "2024-04-29" },
        { weight: 72.5, calories_burned: 320, workout_completed: "Cardio", date: "2024-04-28" },
      ]);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const overviewStats = [
    { label: "Total Workouts", value: "24", icon: "🏋️", color: "bg-blue-500/20 text-blue-400", progress: 0 },
    { label: "Weight Loss", value: "0 kg", icon: "⚖️", color: "bg-green-500/20 text-green-400", progress: 0 },
    { label: "Calories Burned", value: "28", icon: "🔥", color: "bg-orange-500/20 text-orange-400", progress: 12 },
    { label: "BMI", value: "27.7", icon: "📊", color: "bg-purple-500/20 text-purple-400", progress: 0 },
  ];

  const achievements = [
    { title: "First Step", desc: "Complete your first workout", progress: 100, icon: "🏃", color: "bg-blue-400" },
    { title: "Workout Warrior", desc: "Complete 5 workouts", progress: 20, icon: "💪", color: "bg-yellow-600" },
    { title: "Beast Mode", desc: "Complete 10 workouts", progress: 10, icon: "🦍", color: "bg-gray-600" },
    { title: "Nutrition Ninja", desc: "Track 5 meals", progress: 0, icon: "🥗", color: "bg-green-600" },
    { title: "Exercise Excellence", desc: "Complete 25 exercises", progress: 40, icon: "⚡", color: "bg-indigo-600" },
    { title: "Fire Starter", desc: "Burn 500 calories", progress: 5, icon: "🔥", color: "bg-red-500" },
    { title: "Fire Master", desc: "Burn 1000 calories", progress: 0, icon: "🔥", color: "bg-red-700" },
    { title: "Consistency Counts", desc: "Achieve 3-day streak", progress: 33, icon: "🗓️", color: "bg-blue-600" },
    { title: "Streak King", desc: "Achieve 7-day streak", progress: 14, icon: "👑", color: "bg-yellow-500" },
    { title: "Weight Loss Winner", desc: "Lose 2kg", progress: 0, icon: "⚖️", color: "bg-emerald-500" },
    { title: "Major Transformation", desc: "Lose 5kg", progress: 0, icon: "🦋", color: "bg-purple-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <span className="text-blue-500">📈</span> Progress Tracking
          </h1>
          <p className="text-white/40">Monitor your fitness journey with detailed analytics</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-white/40">
           Last Month <span className="ml-2">▼</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 w-fit">
        {["overview", "workouts", "nutrition", "body metrics", "achievements"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
              activeTab === tab
                ? "bg-white/10 text-white shadow-xl"
                : "text-white/40 hover:text-white"
            }`}
          >
            {tab === 'overview' && <span>📊</span>}
            {tab === 'workouts' && <span>🏋️</span>}
            {tab === 'nutrition' && <span>🍎</span>}
            {tab === 'body metrics' && <span>📏</span>}
            {tab === 'achievements' && <span>🏆</span>}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {overviewStats.map((stat, i) => (
                <div key={i} className="glass-card p-6 space-y-6 relative overflow-hidden group">
                   <div className="flex justify-between items-start relative z-10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{stat.label}</p>
                        <h2 className="text-4xl font-black">{stat.value}</h2>
                      </div>
                      <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-xl`}>
                        {stat.icon}
                      </div>
                   </div>
                   <div className="space-y-2 relative z-10">
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-current transition-all" style={{ width: `${stat.progress}%`, color: 'inherit' }}></div>
                      </div>
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
                         <span>Progress</span>
                         <span className="text-white/40">{stat.progress}%</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="glass-card p-12 h-96 flex flex-col items-center justify-center space-y-6 relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-4xl border border-white/10">📈</div>
              <div className="text-center space-y-2">
                 <h3 className="text-2xl font-bold">Progress Tracking</h3>
                 <p className="text-white/20 text-sm max-w-sm">Your detailed progress charts and analytics will appear here as you complete workouts and track your nutrition.</p>
              </div>
           </div>
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="space-y-10">
           <div className="glass-card p-8 space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="text-yellow-400">🏆</span> Achievement Progress
                 </h3>
                 <p className="text-xs font-bold text-white/40">1/11 <span className="ml-2 uppercase tracking-widest text-[10px]">Achievements Unlocked</span></p>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
                    <span>Overall Completion</span>
                    <span>1%</span>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-[1%]"></div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((ach, i) => (
                <div key={i} className="glass-card p-6 space-y-6 relative group overflow-hidden">
                   {ach.progress === 100 && (
                     <div className="absolute top-0 right-0 p-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">✓</div>
                     </div>
                   )}
                   <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 ${ach.color}/20 ${ach.color.replace('bg-', 'text-')} rounded-2xl flex items-center justify-center text-2xl border border-white/5 group-hover:scale-110 transition-transform`}>
                        {ach.icon}
                      </div>
                      <div className="space-y-1">
                         <h4 className="font-bold">{ach.title}</h4>
                         <p className="text-[10px] text-white/40 leading-tight">{ach.desc}</p>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className={`h-full ${ach.color} transition-all`} style={{ width: `${ach.progress}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
                         <span>Progress</span>
                         <span>{ach.progress}% complete</span>
                      </div>
                   </div>
                   {ach.progress === 100 && (
                     <div className="absolute inset-0 bg-blue-500/10 pointer-events-none"></div>
                   )}
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Body Metrics Tab */}
      {activeTab === "body metrics" && (
        <div className="grid md:grid-cols-2 gap-8">
           <div className="glass-card p-8 space-y-6">
              <h3 className="text-xl font-bold">Current Metrics</h3>
              <div className="space-y-4">
                 {[
                   { label: "Height", value: "170 cm" },
                   { label: "Weight", value: "80 kg" },
                   { label: "BMI", value: "27.7" },
                   { label: "Body Fat", value: "24%" }
                 ].map((m, i) => (
                   <div key={i} className="flex justify-between items-center py-4 border-b border-white/5">
                      <span className="text-sm text-white/40 uppercase font-bold tracking-widest">{m.label}</span>
                      <span className="text-lg font-bold">{m.value}</span>
                   </div>
                 ))}
              </div>
           </div>
           <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-6xl opacity-20">📊</div>
              <h4 className="font-bold">Metric Trends</h4>
              <p className="text-sm text-white/40">Track your body composition changes over time with visual charts.</p>
              <button className="btn-outline !px-6 !py-2 text-xs">Update Metrics</button>
           </div>
        </div>
      )}
    </div>
  );
}

export default Progress;