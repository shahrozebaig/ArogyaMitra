import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
function Workouts() {
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchPlan();
  }, []);
  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await API.get("/workout/current");
      if (res.data && res.data.plan_json) {
        setPlan(JSON.parse(res.data.plan_json));
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.error("Failed to fetch plan:", err);
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };
  const generatePlan = async () => {
    setLoading(true);
    try {
      const profileRes = await API.get("/health/profile");
      const profile = profileRes.data;
      const res = await API.post("/workout/generate", {
        goal: profile?.goal || "Muscle Gain",
        location: "Home",
        duration: parseInt(profile?.daily_commitment) || 45,
        fitness_level: profile?.fitness_level || "Beginner"
      });
      if (res.data && res.data.plan_json) {
        setPlan(JSON.parse(res.data.plan_json));
      }
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };
  const startWorkout = (exercise = null) => {
    const exercises = plan?.today?.exercises || [];
    navigate("/session", {
      state: {
        exercises,
        currentExerciseId: exercise?.id
      },
    });
  };
  return (
    <div className="max-w-7xl mx-auto pb-24 px-6 md:px-8 space-y-12 animate-fade-in relative">
      <div className="pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-purple-600 rounded-full"></div>
            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              Training <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">Protocols</span>
            </h1>
          </div>
          <p className="text-xs font-bold text-white/20 uppercase tracking-[0.4em] pl-6">
            Neural Architecture: <span className="text-white">Physical Evolution</span> {" // "} System: <span className="text-purple-500">Active</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <button
            onClick={generatePlan}
            disabled={loading}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-purple-600 hover:border-purple-600 transition-all flex items-center justify-center gap-3 group"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "✨"}
            <span>Re-Generate Protocol</span>
          </button>
          <div className="flex bg-[#111114] p-1.5 rounded-[20px] border border-white/5 shadow-2xl">
            <button
              onClick={() => setActiveTab("today")}
              className={`px-8 py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "today" ? "bg-white text-black italic" : "text-white/20 hover:text-white"}`}
            >
              Active Session
            </button>
            <button
              onClick={() => setActiveTab("week")}
              className={`px-8 py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "week" ? "bg-white text-black italic" : "text-white/20 hover:text-white"}`}
            >
              Macro Cycle
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="bg-[#111114] border border-white/5 rounded-[40px] p-32 flex flex-col items-center justify-center space-y-8 shadow-2xl">
          <div className="w-16 h-16 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="text-center space-y-2">
            <p className="text-lg font-black uppercase italic tracking-widest">Architecting Protocol</p>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Processing Neural Health Metrics...</p>
          </div>
        </div>
      ) : !plan ? (
        <div className="bg-[#111114] border border-white/5 rounded-[40px] p-32 flex flex-col items-center justify-center space-y-10 text-center shadow-2xl">
          <div className="text-8xl grayscale opacity-20 animate-pulse">📡</div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">No Active Protocol</h2>
            <p className="text-white/40 max-w-sm mx-auto text-sm font-medium uppercase tracking-tight">Complete your physical assessment to initiate neural training mapping.</p>
          </div>
          <button onClick={generatePlan} className="px-12 py-6 bg-white text-black font-black uppercase italic tracking-widest text-sm rounded-2xl hover:bg-purple-500 hover:text-white transition-all shadow-2xl shadow-white/5">
            Initialize Protocol ➔
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-12">
          {activeTab === "today" && plan?.today ? (
            <>
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-[#111114] border border-white/5 rounded-[32px] p-8 space-y-8 shadow-2xl sticky top-8">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-purple-500 uppercase tracking-[0.3em]">Active Blueprint</span>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">{plan.today.title}</h3>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Duration</span>
                      <span className="text-sm font-bold italic">{plan.today.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Volume</span>
                      <span className="text-sm font-bold italic">{plan.today.exercises?.length || 0} Units</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Window</span>
                      <span className="text-sm font-bold italic">{plan.today.recommendedTime || "ANYTIME"}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => startWorkout()}
                    className="w-full py-5 bg-white text-black font-black uppercase italic tracking-widest text-xs rounded-2xl hover:bg-purple-500 hover:text-white transition-all shadow-xl active:scale-[0.98]"
                  >
                    Execute Protocol ➔
                  </button>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight">Sequence Analysis</h3>
                </div>
                {plan.today.exercises?.map((ex, idx) => (
                  <div key={ex.id} className="group bg-[#111114] border border-white/5 p-8 rounded-[40px] hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors"></div>
                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                      <div className="text-5xl font-black italic text-white/5 group-hover:text-blue-500/10 transition-colors leading-none pt-2">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1 space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="space-y-1">
                            <h4 className="text-2xl font-black italic uppercase tracking-tight group-hover:text-blue-400 transition-colors">{ex.name}</h4>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Target: Muscular Evolution</p>
                          </div>
                          <div className="flex gap-3">
                            <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-center min-w-[80px]">
                              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Sets</p>
                              <p className="text-sm font-black italic">{ex.sets}</p>
                            </div>
                            <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-center min-w-[80px]">
                              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Reps</p>
                              <p className="text-sm font-black italic">{ex.reps}</p>
                            </div>
                            <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-center min-w-[80px]">
                              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Rest</p>
                              <p className="text-sm font-black italic text-blue-400">{ex.rest}</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-white/40 font-medium leading-relaxed max-w-3xl">
                          {ex.description}
                        </p>
                        <button
                          onClick={() => startWorkout(ex)}
                          className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] hover:text-white transition-colors"
                        >
                          View Tactical Analysis ➔
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : activeTab === "week" && plan?.week ? (
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                <h3 className="text-xl font-black italic uppercase tracking-tight">Macro Cycle Overview</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plan.week.map((item, idx) => {
                  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                  const isToday = item.day === todayName;
                  return (
                    <div key={idx} className={`bg-[#111114] border p-8 rounded-[40px] space-y-6 shadow-2xl transition-all ${isToday ? 'border-purple-500 shadow-purple-500/10' : 'border-white/5 hover:border-white/20'}`}>
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isToday ? 'text-purple-400' : 'text-white/20'}`}>
                          {item.day}
                        </span>
                        {isToday && <span className="bg-purple-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Today</span>}
                      </div>
                      <div className="space-y-2 min-h-[80px]">
                        <h4 className="text-xl font-black italic uppercase tracking-tighter leading-tight">{item.title}</h4>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'Rest Day' ? 'text-blue-400' : 'text-white/20'}`}>{item.status}</p>
                      </div>
                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{item.duration}</span>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{item.exercises || 0} Units</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
export default Workouts;