import { useEffect, useState } from "react";
import useUserStore from "../store/userStore";
import API from "../api/axios";
import { Link } from "react-router-dom";
import AromiChat from "../components/AromiChat";
import "./Dashboard.css";
function Dashboard() {
  const user = useUserStore((state) => state.user);
  const [tasks, setTasks] = useState({ workout: null, nutrition: null });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const [workoutRes, nutritionRes] = await Promise.all([
          API.get("/workout/current"),
          API.get("/nutrition/current"),
        ]);
        setTasks({ workout: workoutRes.data, nutrition: nutritionRes.data });
      } catch (err) {
        console.error("Dashboard tasks error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);
  const hasTasks = tasks.workout || tasks.nutrition;
  const firstName = user?.name?.split(" ")[0] || "User";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return (
    <>
      <div className="db-root">
        <div className="db-header">
          <div>
            <p className="db-greeting">{greeting} 👋</p>
            <h1 className="db-title">
              Welcome back, <span className="db-title-green">{firstName}</span>
            </h1>
            <p className="db-subtitle">Here's your health overview for today.</p>
          </div>
        </div>
        <div className="db-grid">
          <div className="db-card db-steps-card">
            <h2 className="db-card-title">Get Started</h2>
            <Link to="/health" className="db-assessment-btn">
              Complete Health Assessment →
            </Link>
            <div className="db-steps-list">
              <div className="db-step">
                <div className="db-step-num">1</div>
                <div className="db-step-body">
                  <div className="db-step-title">Fill out the form</div>
                  <div className="db-step-desc">Tell us your age, weight, height, goals and activity level.</div>
                </div>
              </div>
              <div className="db-step-connector" />
              <div className="db-step">
                <div className="db-step-num">2</div>
                <div className="db-step-body">
                  <div className="db-step-title">Click Generate</div>
                  <div className="db-step-desc">Our AI analyzes your data and builds your personalized plan.</div>
                </div>
              </div>
              <div className="db-step-connector" />
              <div className="db-step">
                <div className="db-step-num">3</div>
                <div className="db-step-body">
                  <div className="db-step-title">Get your weekly plan</div>
                  <div className="db-step-desc">Receive a full workout & nutrition schedule tailored to your preferred health goals.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="db-card db-focus-card">
            <div className="db-focus-header">
              <h2 className="db-card-title">Today's Plan</h2>
              {!loading && hasTasks && (
                <span className="db-badge">Active</span>
              )}
            </div>
            {loading ? (
              <div className="db-loading">
                <div className="db-spinner" />
                <p>Loading your plan...</p>
              </div>
            ) : hasTasks ? (
              <div className="db-plans-grid">
                {tasks.workout && (
                  <Link to="/workouts" className="db-plan-card db-plan-workout">
                    <div className="db-plan-icon">💪</div>
                    <div>
                      <div className="db-plan-tag">Workout Plan</div>
                      <div className="db-plan-name">Training Routine</div>
                      <div className="db-plan-desc">Your personalized strength & conditioning plan for today.</div>
                    </div>
                    <div className="db-plan-arrow">Start →</div>
                  </Link>
                )}
                {tasks.nutrition && (
                  <Link to="/nutrition" className="db-plan-card db-plan-nutrition">
                    <div className="db-plan-icon">🥗</div>
                    <div>
                      <div className="db-plan-tag">Nutrition Plan</div>
                      <div className="db-plan-name">Meal Strategy</div>
                      <div className="db-plan-desc">Customized meals with macros and nutrition targets.</div>
                    </div>
                    <div className="db-plan-arrow">View →</div>
                  </Link>
                )}
              </div>
            ) : (
              <div className="db-empty">
                <div className="db-empty-icon">🌱</div>
                <h3 className="db-empty-title">No plan yet</h3>
                <p className="db-empty-desc">
                  Complete your health assessment to get your personalized AI workout & nutrition plan.
                </p>
                <Link to="/health" className="db-empty-btn">Start Assessment →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <AromiChat />
    </>
  );
}
export default Dashboard;