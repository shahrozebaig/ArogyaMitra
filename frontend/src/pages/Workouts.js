import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
function Workouts() {
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const navigate = useNavigate();
  useEffect(() => {
    fetchPlan();
  }, []);
  const [loading, setLoading] = useState(false);
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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Workout Plans
          </h1>
          <p className="text-white/40">AI-powered personalized workout plans</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={generatePlan}
            disabled={loading}
            className="px-4 py-2 bg-purple-600/10 border border-purple-500/20 text-purple-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-purple-600/20 transition-all flex items-center gap-2"
          >
            {loading ? "🔄" : "✨"} Refresh AI Plan
          </button>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab("today")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "today" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveTab("week")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "week" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
            >
              This Week
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="glass-card p-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Generating your personalized plan...</p>
        </div>
      ) : !plan ? (
        <div className="glass-card p-20 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="text-6xl">🏋️</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">No Workout Plan Found</h2>
            <p className="text-white/40 max-w-sm">Complete your health assessment or click below to generate your first AI-powered workout plan!</p>
          </div>
          <button onClick={generatePlan} className="btn-primary !px-10">Generate My Plan 🚀</button>
        </div>
      ) : (
        <>
          {activeTab === "today" && plan?.today && (
            <div className="space-y-6">
              <div className="glass-card p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-purple-600/20 transition-all duration-500"></div>
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </span>
                        <h2 className="text-2xl font-semibold">Today's Workout 💪</h2>
                      </div>
                      <h3 className="text-3xl font-bold">{plan.today.title}</h3>
                      <div className="flex gap-4 text-white/60 text-sm">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {plan.today.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          {plan.today.exercises?.length || 0} exercises
                        </span>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Incomplete
                    </span>
                  </div>
                  <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center gap-3">
                    <span className="text-blue-400">📍</span>
                    <p className="text-sm">
                      <span className="text-blue-400 font-medium">Recommended Time:</span> {plan.today.recommendedTime || "Anytime"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {plan.today.exercises?.map((ex) => (
                  <div key={ex.id} className="glass-card p-6 glass-card-hover group">
                    <div className="flex gap-6 items-start">
                      <div className="pt-1">
                        <div className="w-6 h-6 border-2 border-white/20 rounded-full group-hover:border-purple-500/50 transition-colors"></div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-semibold">{ex.name}</h4>
                            <div className="flex gap-3 mt-1">
                              <span className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-md font-medium">Sets: {ex.sets}</span>
                              <span className="text-xs bg-green-500/10 text-green-400 px-2.5 py-1 rounded-md font-medium">Reps: {ex.reps}</span>
                              <span className="text-xs bg-orange-500/10 text-orange-400 px-2.5 py-1 rounded-md font-medium">Rest: {ex.rest}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => startWorkout(ex)}
                            className="p-3 bg-white/5 rounded-xl hover:bg-purple-600/20 hover:text-purple-400 transition-all active:scale-90"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-white/40 leading-relaxed max-w-2xl">
                          {ex.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => startWorkout()}
                className="w-full btn-primary py-4 text-lg shadow-xl"
              >
                Start Workout
              </button>
            </div>
          )}
          {activeTab === "week" && plan?.week && (
            <div className="space-y-4">
              {plan.week.map((item, idx) => {
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const isToday = item.day === today;
                return (
                  <div key={idx} className={`glass-card p-6 glass-card-hover flex justify-between items-center ${isToday ? 'border-purple-500/30 bg-purple-500/5' : ''}`}>
                    <div className="flex gap-6 items-center">
                      <div className="w-12 text-sm font-medium text-white/40">
                        {item.day.slice(0, 3)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {isToday && <span className="text-yellow-400 text-xs">★</span>}
                          <h4 className={`font-semibold ${isToday ? 'text-white' : 'text-white/60'}`}>{item.day} {isToday && <span className="text-[10px] bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded ml-2">TODAY</span>}</h4>
                        </div>
                        <p className="text-lg font-medium">{item.title}</p>
                        <div className="flex gap-4 text-xs text-white/30">
                          <span>{item.duration}</span>
                          <span>{item.exercises || 0} exercises</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${item.status === 'Rest Day' ? 'text-blue-400' : item.status === 'Completed' ? 'text-green-400' : 'text-orange-400'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default Workouts;