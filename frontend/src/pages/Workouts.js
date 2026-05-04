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
    <div className="max-w-7xl mx-auto pb-24 px-6 md:px-10 space-y-12 animate-fade-in">
      <div className="pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Training <span className="text-purple-500">Plan</span>
          </h1>
          <p className="text-sm text-white/40 font-medium">Your personalized strength and conditioning schedule.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <button
            onClick={generatePlan}
            disabled={loading}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-purple-600 transition-all flex items-center justify-center gap-3 group"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "✨"}
            <span>Update Plan</span>
          </button>
          <div className="flex bg-[#111114] p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab("today")}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "today" ? "bg-white text-black" : "text-white/40 hover:text-white"}`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveTab("week")}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "week" ? "bg-white text-black" : "text-white/40 hover:text-white"}`}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="bg-[#111114] border border-white/5 rounded-[32px] p-24 flex flex-col items-center justify-center space-y-6">
          <div className="w-12 h-12 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-white/40">Curating your training sequence...</p>
        </div>
      ) : !plan ? (
        <div className="bg-[#111114] border border-white/5 rounded-[32px] p-24 flex flex-col items-center justify-center space-y-8 text-center">
          <div className="text-6xl opacity-20">🏃‍♂️</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">No active plan found</h2>
            <p className="text-white/40 max-w-sm mx-auto text-sm">Complete your assessment to generate a personalized workout plan.</p>
          </div>
          <button onClick={generatePlan} className="px-10 py-4 bg-white text-black font-bold text-sm rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-lg">
            Generate Plan ➔
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-10">
          {activeTab === "today" && plan?.today ? (
            <>
              <div className="lg:col-span-1">
                <div className="bg-[#111114] border border-white/5 rounded-[32px] p-8 space-y-8 shadow-sm sticky top-24">
                  <div className="space-y-2 text-center md:text-left">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Active Routine</span>
                    <h3 className="text-2xl font-bold text-white">{plan.today.title}</h3>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Duration</span>
                      <span className="text-xs font-bold text-white">{plan.today.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Exercises</span>
                      <span className="text-xs font-bold text-white">{plan.today.exercises?.length || 0}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => startWorkout()}
                    className="w-full py-4 bg-white text-black font-bold text-sm rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-lg active:scale-[0.98]"
                  >
                    Start Workout ➔
                  </button>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-6">
                <h3 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em] px-2 mb-4">Exercises</h3>
                {plan.today.exercises?.map((ex, idx) => (
                  <div key={ex.id} className="group bg-[#111114] border border-white/5 p-8 rounded-[32px] hover:border-purple-500/30 transition-all shadow-sm">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="text-4xl font-bold text-white/5 group-hover:text-purple-500/20 transition-colors shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <h4 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{ex.name}</h4>
                          <div className="flex gap-2">
                            <div className="bg-white/5 px-4 py-2 rounded-xl text-center min-w-[70px]">
                              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Sets</p>
                              <p className="text-sm font-bold text-white">{ex.sets}</p>
                            </div>
                            <div className="bg-white/5 px-4 py-2 rounded-xl text-center min-w-[70px]">
                              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Reps</p>
                              <p className="text-sm font-bold text-white">{ex.reps}</p>
                            </div>
                            <div className="bg-white/5 px-4 py-2 rounded-xl text-center min-w-[70px]">
                              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Rest</p>
                              <p className="text-sm font-bold text-purple-400">{ex.rest}</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-white/40 leading-relaxed font-medium">
                          {ex.description}
                        </p>
                        <button
                          onClick={() => startWorkout(ex)}
                          className="text-[11px] font-bold text-purple-400 uppercase tracking-widest hover:text-white transition-colors"
                        >
                          View Guide ➔
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : activeTab === "week" && plan?.week ? (
            <div className="lg:col-span-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plan.week.map((item, idx) => {
                const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const isToday = item.day === todayName;
                return (
                  <div key={idx} className={`bg-[#111114] border p-8 rounded-[32px] space-y-6 shadow-sm transition-all ${isToday ? 'border-purple-500 bg-white/[0.02]' : 'border-white/5 hover:border-white/10'}`}>
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? 'text-purple-400' : 'text-white/20'}`}>
                        {item.day}
                      </span>
                      {isToday && <span className="bg-purple-500/20 text-purple-400 text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">Today</span>}
                    </div>
                    <div className="space-y-1 min-h-[60px]">
                      <h4 className="text-lg font-bold text-white/90 leading-tight">{item.title}</h4>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${item.status === 'Rest Day' ? 'text-blue-400' : 'text-white/20'}`}>{item.status}</p>
                    </div>
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      <span>{item.duration}</span>
                      <span>{item.exercises || 0} Units</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
export default Workouts;