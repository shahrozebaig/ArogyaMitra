import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Workouts() {
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const navigate = useNavigate();

  useEffect(() => {
    // Initial fetch of the workout plan
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const res = await API.get("/workout/current");
      if (res.data && res.data.plan_json) {
        setPlan(JSON.parse(res.data.plan_json));
      } else {
        // If no plan, we might want to generate one or show a "Generate" button
        generatePlan();
      }
    } catch (err) {
      console.error("Failed to fetch plan:", err);
      // Fallback mock data
      setPlan({
        today: {
          title: "Upper Body and Cardio",
          duration: "45 minutes",
          exerciseCount: 3,
          recommendedTime: "6:00 AM - 7:00 AM",
          exercises: [
            { id: 1, name: "Diamond push-ups", sets: 3, reps: "12-15", rest: "60s", description: "Start in a plank position with hands closer together.", video: "https://www.youtube.com/embed/S_7T0q2eG2I" },
            { id: 2, name: "Mountain climbers", sets: 3, reps: "30-60s", rest: "45s", description: "Start in a plank position, bring knees to chest.", video: "https://www.youtube.com/embed/zT-9L37ReGk" }
          ]
        },
        week: [
          { day: "Thursday", title: "Upper Body and Cardio", duration: "45 min", exercises: 3, status: "TODAY", active: true }
        ]
      });
    }
  };

  const generatePlan = async () => {
    try {
      const res = await API.post("/workout/generate", {
        goal: "Muscle Gain",
        location: "Home",
        duration: 45,
        fitness_level: "Beginner"
      });
      if (res.data && res.data.plan_json) {
        setPlan(JSON.parse(res.data.plan_json));
      }
    } catch (err) {
      console.error("Generation error:", err);
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Workout Plans
          </h1>
          <p className="text-white/40">AI-powered personalized workout plans</p>
        </div>
        
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

      {activeTab === "today" && plan?.today && (
        <div className="space-y-6">
          {/* Today's Workout Card */}
          <div className="glass-card p-8 relative overflow-hidden group">
            {/* Decorative background element */}
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
                      {plan.today.exerciseCount} exercises
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
                  <span className="text-blue-400 font-medium">Recommended Time:</span> {plan.today.recommendedTime}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <p className="font-medium">Warm-up</p>
                </div>
                <p className="text-sm text-white/60 pl-5">5-minute jogging in place or jumping jacks</p>
              </div>
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-4">
            {plan.today.exercises.map((ex) => (
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
          {plan.week.map((item, idx) => (
            <div key={idx} className={`glass-card p-6 glass-card-hover flex justify-between items-center ${item.active ? 'border-purple-500/30 bg-purple-500/5' : ''}`}>
              <div className="flex gap-6 items-center">
                <div className="w-12 text-sm font-medium text-white/40">
                  {item.day.slice(0, 3)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {item.active && <span className="text-yellow-400 text-xs">★</span>}
                    <h4 className={`font-semibold ${item.active ? 'text-white' : 'text-white/60'}`}>{item.day} {item.active && <span className="text-[10px] bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded ml-2">TODAY</span>}</h4>
                  </div>
                  <p className="text-lg font-medium">{item.title}</p>
                  <div className="flex gap-4 text-xs text-white/30">
                    <span>{item.duration}</span>
                    <span>{item.exercises} exercises</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${item.status === 'Rest Day' ? 'text-blue-400' : item.status === 'Completed' ? 'text-green-400' : 'text-orange-400'}`}>
                  {item.status}
                </span>
                <button className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workouts;