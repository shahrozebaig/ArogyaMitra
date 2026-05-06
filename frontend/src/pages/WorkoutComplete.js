import { Trophy, Flame, CheckCircle2, Clock, Zap, Award, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./WorkoutComplete.css";
function WorkoutComplete() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const stats = state || { calories: 14, sets: 3, minutes: 4, intensity: 0 };
  const achievements = [
    "Improved cardiovascular endurance",
    "Built muscle strength and tone",
    "Boosted metabolism for the day",
    "Enhanced energy levels",
    "Progressed towards your fitness goals",
  ];
  return (
    <div className="wc-root">
      <div className="wc-card">
        <div className="wc-blob wc-blob-1" />
        <div className="wc-blob wc-blob-2" />
        <div className="wc-hero">
          <div className="wc-trophy"><Trophy size={48} /></div>
          <h1 className="wc-title">Workout Complete!</h1>
          <p className="wc-subtitle">Amazing effort today! You absolutely crushed it!</p>
        </div>
        <div className="wc-stats">
          <div className="wc-stat wc-stat-orange">
            <span className="wc-stat-icon"><Flame size={20} /></span>
            <span className="wc-stat-num">{stats.calories}</span>
            <span className="wc-stat-lbl">Calories Burned</span>
          </div>
          <div className="wc-stat wc-stat-green">
            <span className="wc-stat-icon"><CheckCircle2 size={20} /></span>
            <span className="wc-stat-num">{stats.sets}</span>
            <span className="wc-stat-lbl">Sets Completed</span>
          </div>
          <div className="wc-stat wc-stat-blue">
            <span className="wc-stat-icon"><Clock size={20} /></span>
            <span className="wc-stat-num">{stats.minutes}</span>
            <span className="wc-stat-lbl">Minutes Worked</span>
          </div>
          <div className="wc-stat wc-stat-purple">
            <span className="wc-stat-icon"><Zap size={20} /></span>
            <span className="wc-stat-num">{stats.intensity}%</span>
            <span className="wc-stat-lbl">Avg Intensity</span>
          </div>
        </div>
        <div className="wc-achievements">
          <h3 className="wc-ach-title"><Award size={20} style={{ marginRight: '8px' }} /> What You Achieved Today</h3>
          <ul className="wc-ach-list">
            {achievements.map((item, i) => (
              <li key={i} className="wc-ach-item">
                <span className="wc-ach-check"><Check size={14} strokeWidth={3} /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="wc-actions">
          <button className="wc-btn-primary" onClick={() => navigate("/workouts")}>
            Keep Training! <Zap size={18} style={{ marginLeft: '8px' }} />
          </button>
          <button className="wc-btn-secondary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
export default WorkoutComplete;