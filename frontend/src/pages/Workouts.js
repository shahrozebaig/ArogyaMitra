import { Dumbbell, Sparkles, Clock, Play, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Workouts.css";
function Workouts() {
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => { fetchPlan(); }, []);
  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await API.get("/workout/current");
      if (res.data && res.data.plan_json) {
        setPlan(JSON.parse(res.data.plan_json));
      } else setPlan(null);
    } catch { setPlan(null); }
    finally { setLoading(false); }
  };
  const generatePlan = async () => {
    setLoading(true);
    try {
      const profileRes = await API.get("/health/profile");
      const profile = profileRes.data;
      const res = await API.post("/workout/generate", {
        goal: profile?.fitness_goal || "Muscle Gain",
        location: profile?.workout_location || "Home",
        duration: 30, // Default duration
        fitness_level: profile?.fitness_level || "Beginner",
      });
      if (res.data?.plan_json) setPlan(JSON.parse(res.data.plan_json));
    } catch (err) { console.error("Generation error:", err); }
    finally { setLoading(false); }
  };
  const startWorkout = (exercise = null) => {
    navigate("/session", {
      state: { exercises: plan?.today?.exercises || [], currentExerciseId: exercise?.id },
    });
  };
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return (
    <div className="wo-root">
      <div className="wo-header">
        <div>
          <h1 className="wo-title"><Dumbbell className="wo-title-icon" /> Workout Plan</h1>
          <p className="wo-subtitle">Your personalized AI-generated training schedule.</p>
        </div>
        <div className="wo-header-actions">
          <div className="wo-tabs">
            <button
              className={`wo-tab ${activeTab === "today" ? "wo-tab-active" : ""}`}
              onClick={() => setActiveTab("today")}
            >Today</button>
            <button
              className={`wo-tab ${activeTab === "week" ? "wo-tab-active" : ""}`}
              onClick={() => setActiveTab("week")}
            >Weekly</button>
          </div>
          <button className="wo-generate-btn" onClick={generatePlan} disabled={loading}>
            {loading
              ? <span className="wo-spinner" />
              : <Sparkles size={18} />
            }
            Generate New Plan
          </button>
        </div>
      </div>
      {loading ? (
        <div className="wo-loading">
          <div className="wo-spinner-lg" />
          <p>Building your workout plan...</p>
        </div>
      ) : !plan ? (
        <div className="wo-empty">
          <div className="wo-empty-icon"><Dumbbell size={64} /></div>
          <h2 className="wo-empty-title">No Workout Plan Yet</h2>
          <p className="wo-empty-desc">
            Complete your health assessment, then generate your personalized AI workout plan.
          </p>
          <button className="wo-cta-btn" onClick={generatePlan}>
            <Sparkles size={18} /> Generate My Plan
          </button>
        </div>
      ) : activeTab === "today" && plan?.today ? (
        <div className="wo-today-grid">
          <div className="wo-sidebar">
            <div className="wo-sidebar-card">
              <span className="wo-sidebar-tag">Today's Session</span>
              <h2 className="wo-sidebar-title">{plan.today.title}</h2>
              <div className="wo-sidebar-stats">
                <div className="wo-sidebar-stat">
                  <span className="wo-sidebar-stat-lbl"><Clock size={14} /> Duration</span>
                  <span className="wo-sidebar-stat-val">{plan.today.duration}</span>
                </div>
                <div className="wo-sidebar-stat">
                  <span className="wo-sidebar-stat-lbl"><Play size={14} /> Exercises</span>
                  <span className="wo-sidebar-stat-val">{plan.today.exercises?.length || 0}</span>
                </div>
              </div>
              <button className="wo-start-btn" onClick={() => startWorkout()}>
                Start Session <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="wo-exercises">
            <h3 className="wo-section-label">Exercise Sequence</h3>
            <div className="wo-exercise-list">
              {plan.today.exercises?.map((ex, idx) => (
                <div key={ex.id || idx} className="wo-exercise-card">
                  <div className="wo-exercise-num">{String(idx + 1).padStart(2, "0")}</div>
                  <div className="wo-exercise-body">
                    <div className="wo-exercise-top">
                      <h4 className="wo-exercise-name">{ex.name}</h4>
                      <div className="wo-exercise-stats">
                        {[
                          { label: "Sets", val: ex.sets },
                          { label: "Reps", val: ex.reps },
                          { label: "Rest", val: ex.rest, green: true },
                        ].map((s, i) => (
                          <div key={i} className={`wo-stat-pill ${s.green ? "wo-stat-pill-green" : ""}`}>
                            <span className="wo-stat-pill-lbl">{s.label}</span>
                            <span className="wo-stat-pill-val">{s.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="wo-exercise-desc">{ex.description}</p>
                    <button className="wo-exercise-link" onClick={() => startWorkout(ex)}>
                      View Technique Guide <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === "week" && plan?.week ? (
        <div className="wo-week-grid">
          {plan.week.map((item, idx) => {
            const isToday = item.day === todayName;
            return (
              <div key={idx} className={`wo-day-card ${isToday ? "wo-day-card-today" : ""}`}>
                <div className="wo-day-top">
                  <div>
                    <div className={`wo-day-name ${isToday ? "wo-day-name-today" : ""}`}>{item.day}</div>
                    <div className="wo-day-abbr">{item.day.slice(0, 3)}</div>
                  </div>
                  {isToday && <span className="wo-today-badge">Today</span>}
                </div>
                <div className="wo-day-info">
                  <p className="wo-day-title">{item.title}</p>
                  <p className={`wo-day-status ${item.status === "Rest Day" ? "wo-rest" : ""}`}>{item.status}</p>
                </div>
                <div className="wo-day-footer">
                  <span><Clock size={14} /> {item.duration}</span>
                  <span><Play size={14} /> {item.exercises || 0}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

    </div>
  );
}
export default Workouts;