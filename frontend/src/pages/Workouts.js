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

  const startWorkout = async (exercise = null) => {
    try {
      await API.post("/progress/update", {
        weight: 0,
        calories_burned: 0,
        workout_completed: 0,
        status: "In Progress",
        workout_id: plan?.id
      });
    } catch (err) {
      console.error("Failed to mark workout as in progress:", err);
    }
    const exercises = plan?.today?.exercises || [];
    navigate("/session", {
      state: {
        exercises,
        currentExerciseId: exercise?.id
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4 md:px-8 space-y-12 animate-fade-in">
      {/* Responsive Header */}
      <div className="pt-8 md:pt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase italic">
            Training <span className="text-purple-500">Plan</span>
          </h1>
          <p className="text-sm md:text-base text-white/40 font-medium">Your personalized strength and conditioning architecture.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <button
            onClick={generatePlan}
            disabled={loading}
            className="px-8 py-3.5 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-purple-600 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "✨"}
            <span>Generate New Plan</span>
          </button>
          
          <div className="flex bg-[#111114] p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => setActiveTab("today")}
              className={`flex-1 sm:flex-none px-8 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${activeTab === "today" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveTab("week")}
              className={`flex-1 sm:flex-none px-8 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${activeTab === "week" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#111114] border border-white/5 rounded-[40px] p-24 flex flex-col items-center justify-center space-y-6">
          <div className="w-12 h-12 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/20">Synthesizing routine...</p>
        </div>
      ) : !plan ? (
        <div className="bg-[#111114] border border-white/5 border-dashed rounded-[40px] p-24 flex flex-col items-center justify-center space-y-8 text-center">
          <div className="text-6xl opacity-10 grayscale">🏋️</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white uppercase italic">No Active Training Data</h2>
            <p className="text-white/30 max-w-sm mx-auto text-sm font-medium">Complete your health assessment to unlock your personalized training suite.</p>
          </div>
          <button onClick={generatePlan} className="px-12 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-2xl active:scale-95">
            Initialize Suite ➔
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {activeTab === "today" && plan?.today ? (
            <>
              {/* Daily Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-[#111114] border border-white/5 rounded-[32px] p-8 space-y-8 shadow-2xl lg:sticky lg:top-32 relative overflow-hidden group">
                  <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-purple-500/[0.02] blur-[80px] rounded-full group-hover:bg-purple-500/[0.05] transition-colors"></div>
                  
                  <div className="space-y-2 relative z-10">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em]">Session Objective</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight uppercase italic">{plan.today.title}</h3>
                  </div>
                  
                  <div className="space-y-5 pt-8 border-t border-white/5 relative z-10">
                    <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                      <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Duration</span>
                      <span className="text-sm font-bold text-white uppercase">{plan.today.duration}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                      <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Volume</span>
                      <span className="text-sm font-bold text-white uppercase">{plan.today.exercises?.length || 0} Units</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => startWorkout()}
                    className="w-full py-5 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-2xl active:scale-95 relative z-10"
                  >
                    Start Session ➔
                  </button>
                </div>
              </div>

              {/* Exercise List */}
              <div className="lg:col-span-3 space-y-8">
                <h3 className="text-xs font-bold text-white/20 uppercase tracking-[0.5em] px-2">Exercise Sequence</h3>
                <div className="grid gap-6">
                  {plan.today.exercises?.map((ex, idx) => (
                    <div key={ex.id} className="group bg-[#111114] border border-white/5 p-8 md:p-10 rounded-[40px] hover:border-purple-500/30 transition-all shadow-xl relative overflow-hidden">
                      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        <div className="text-5xl font-bold text-white/5 group-hover:text-purple-500/20 transition-all duration-700 shrink-0 italic leading-none">
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                        
                        <div className="flex-1 space-y-6">
                          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                            <h4 className="text-xl md:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors uppercase italic tracking-tight">{ex.name}</h4>
                            
                            <div className="flex flex-wrap gap-3">
                              {[
                                { label: 'Sets', val: ex.sets },
                                { label: 'Reps', val: ex.reps },
                                { label: 'Rest', val: ex.rest, highlight: true }
                              ].map((stat, i) => (
                                <div key={i} className="bg-white/[0.03] border border-white/5 px-6 py-2.5 rounded-2xl text-center min-w-[90px] group-hover:bg-white/[0.05] transition-all">
                                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                  <p className={`text-base font-bold ${stat.highlight ? 'text-purple-400' : 'text-white'}`}>{stat.val}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-sm md:text-base text-white/40 leading-relaxed font-medium italic">
                            "{ex.description}"
                          </p>
                          
                          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <button
                              onClick={() => startWorkout(ex)}
                              className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] hover:text-white transition-all flex items-center gap-3 group/btn"
                            >
                              View Technique Guide 
                              <span className="group-hover/btn:translate-x-2 transition-transform">➔</span>
                            </button>
                            <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest">Strength Mod-01</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Sub-bg decoration */}
                      <div className="absolute bottom-[-20%] left-[-5%] w-40 h-40 bg-purple-500/[0.01] blur-[80px] rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : activeTab === "week" && plan?.week ? (
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {plan.week.map((item, idx) => {
                const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const isToday = item.day === todayName;
                return (
                  <div key={idx} className={`bg-[#111114] border p-8 md:p-10 rounded-[40px] space-y-8 shadow-2xl transition-all relative overflow-hidden group ${isToday ? 'border-purple-500/40 bg-white/[0.02]' : 'border-white/5 hover:border-white/20'}`}>
                    <div className="flex justify-between items-start relative z-10">
                      <div className="space-y-1">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.4em] ${isToday ? 'text-purple-400' : 'text-white/20'}`}>
                          {item.day}
                        </span>
                        <h4 className="text-2xl font-bold text-white/90 leading-tight uppercase italic">{item.day.slice(0, 3)}</h4>
                      </div>
                      {isToday && (
                        <span className="bg-purple-500/10 text-purple-400 text-[8px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest border border-purple-500/20">
                          Today
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 min-h-[80px] relative z-10">
                      <p className="text-base font-bold text-white leading-tight italic">{item.title}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${item.status === 'Rest Day' ? 'text-blue-400' : 'text-white/20'}`}>{item.status}</p>
                    </div>
                    
                    <div className="pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] relative z-10">
                      <span className="flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {item.duration}
                      </span>
                      <span className="flex items-center gap-2">
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        {item.exercises || 0} Units
                      </span>
                    </div>
                    
                    {/* Hover Glow */}
                    <div className="absolute bottom-[-30%] right-[-20%] w-40 h-40 bg-white/[0.01] group-hover:bg-purple-500/[0.03] blur-[80px] rounded-full transition-all duration-700"></div>
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