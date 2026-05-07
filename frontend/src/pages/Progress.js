import { LineChart, BarChart3, Utensils, Dumbbell, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Progress.css";
function Progress() {
  const [records, setRecords] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();
  const fetchProgress = async () => {
    try {
      const planRes = await API.get("/workout/current");
      if (planRes.data?.plan_json) {
        setPlan(JSON.parse(planRes.data.plan_json));
      }
      const statsRes = await API.get("/progress/stats");
      const data = statsRes.data || [];
      const seenDates = new Set();
      const filtered = data
        .filter(r => r.calories_burned > 0 || r.healthy_meals_count > 0 || r.status === "In Progress")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .filter(r => {
          if (r.status !== "In Progress") return true;
          const date = new Date(r.created_at).toDateString();
          if (seenDates.has(date)) return false;
          seenDates.add(date);
          return true;
        });
      setRecords(filtered);
    } catch (err) {
      console.error("Failed to fetch progress data:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProgress();
  }, []);
  const handleResume = async (record) => {
    try {
      const res = await API.get("/workout/current");
      if (res.data && res.data.plan_json) {
        const currentPlan = JSON.parse(res.data.plan_json);
        const lastIndex = record.workout_completed || 0;
        navigate("/session", {
          state: {
            exercises: currentPlan.today.exercises,
            currentExerciseId: currentPlan.today.exercises[lastIndex]?.id || null
          }
        });
      }
    } catch (err) {
      console.error("Failed to resume workout:", err);
    }
  };
  return (
    <div className="pg-root">
      <div className="pg-header">
        <div>
          <h1 className="pg-title"><LineChart className="pg-title-icon" /> Progress <span className="pg-title-green">Tracking</span></h1>
          <p className="pg-subtitle">Monitoring your physiological evolution and daily consistency.</p>
        </div>
      </div>
      <div className="pg-section">
        <div className="pg-section-header">
          <h2 className="pg-section-title">Activity Logs</h2>
          <span className="pg-section-count">{records.length} Records Found</span>
        </div>
        {loading ? (
          <div className="pg-loading">
            <div className="pg-spinner"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="pg-empty">
            <div className="pg-empty-icon"><BarChart3 size={48} /></div>
            <h3 className="pg-empty-title">No Activity Data</h3>
            <p className="pg-empty-desc">Start a workout or log a meal to see your progress here.</p>
          </div>
        ) : (
          <div className="pg-list">
            {records.map((record, i) => {
              const dateObj = new Date(record.created_at + (record.created_at.endsWith('Z') ? '' : 'Z'));
              const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
              const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const isInProgress = record.status === "In Progress";
              const isMeal = record.healthy_meals_count > 0;
              const isExpanded = expandedId === record.id;
              const showExerciseList = !isMeal && plan?.today?.exercises;
              return (
                <div key={i} className="pg-card">
                  <div className="pg-card-main">
                    <div className="pg-card-left">
                      <div className="pg-time-box">
                        <p className="pg-date">{dateStr}</p>
                        <p className="pg-time">{timeStr}</p>
                      </div>
                      <div className="pg-divider"></div>
                      <div className="pg-info">
                        <div className={`pg-icon-wrap ${isInProgress ? 'pg-icon-in-progress' : ''}`}>
                          {isMeal ? <Utensils size={18} /> : <Dumbbell size={18} />}
                        </div>
                        <div className="pg-details">
                          <div className="pg-card-title-row">
                            <h4 className="pg-card-title">
                              {isMeal ? "Nutrient Map Sync" : isInProgress ? "Workout in Progress" : "Workout Finished"}
                            </h4>
                            {isInProgress && <span className="pg-badge-ip">Active Now</span>}
                          </div>
                          <p className="pg-id">Module ID: #{record.id.toString().slice(-4)}</p>
                          {showExerciseList && (
                            <button
                              className="pg-toggle-details"
                              onClick={() => setExpandedId(isExpanded ? null : record.id)}
                            >
                              {isExpanded ? "▲ Hide Checklist" : "▼ View Checklist"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="pg-card-right">
                      <div className="pg-stat-box">
                        {record.calories_burned > 0 ? (
                          <>
                            <span className="pg-stat-lbl">Energy Expended</span>
                            <p className="pg-stat-val pg-stat-val-cal">-{record.calories_burned} kcal</p>
                          </>
                        ) : isMeal ? (
                          <>
                            <span className="pg-stat-lbl">Nutrition Units</span>
                            <p className="pg-stat-val pg-stat-val-meal">+{record.healthy_meals_count} Units</p>
                          </>
                        ) : (
                          <>
                            <span className="pg-stat-lbl">Current State</span>
                            <p className={`pg-stat-val pg-stat-val-status ${isInProgress ? 'pg-stat-val-ip' : ''}`}>
                              {isInProgress ? "In Progress" : "Finished"}
                            </p>
                          </>
                        )}
                      </div>
                      {isInProgress && (
                        <button onClick={() => handleResume(record)} className="pg-resume-btn">
                          Resume Session <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  {isExpanded && showExerciseList && (
                    <div className="pg-exercise-details">
                      <div className="pg-ex-list">
                        {plan.today.exercises.map((ex, idx) => {
                          let statusLabel = "Pending";
                          let statusClass = "pg-ex-status-pending";
                          
                          if (!isInProgress && idx < record.workout_completed) {
                            statusLabel = "Completed ✓";
                            statusClass = "pg-ex-status-done";
                          } else if (isInProgress && idx === record.workout_completed) {
                            statusLabel = "Active Now";
                            statusClass = "pg-ex-status-active";
                          }

                          return (
                            <div key={idx} className="pg-ex-item">
                              <span className="pg-ex-name">
                                {idx + 1}. {ex.name}
                              </span>
                              <span className={`pg-ex-status ${statusClass}`}>
                                {statusLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export default Progress;