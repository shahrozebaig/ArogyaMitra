import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import CameraTracker from "../components/CameraTracker";
import "./WorkoutSession.css";
function WorkoutSession() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const exercises = state?.exercises || [];
  const initialIndex = exercises.findIndex((ex) => ex.id === state?.currentExerciseId);
  const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
  const exercise = exercises[currentIndex];
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [reps, setReps] = useState(0);
  const [setsLeft, setSetsLeft] = useState(exercise?.sets || 3);
  const [aiStatus, setAiStatus] = useState("Initializing...");
  const [aiFeedback, setAiFeedback] = useState("Preparing...");
  const [aiConfidence, setAiConfidence] = useState(0);
  useEffect(() => {
    const initProgress = async () => {
      try {
        await API.post("/progress/update", {
          weight: 0,
          calories_burned: 0,
          workout_completed: currentIndex,
          status: "In Progress",
        });
      } catch (err) {
        console.error("Failed to initialize progress tracking:", err);
      }
    };
    initProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    let interval;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => setTimeRemaining((p) => p - 1), 1000);
    } else if (timeRemaining === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);
  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const nextExercise = async () => {
    const isLast = currentIndex >= exercises.length - 1;
    try {
      await API.post("/progress/update", {
        weight: 0,
        calories_burned: 15,
        workout_completed: currentIndex + 1,
        status: isLast ? "Completed" : "In Progress",
      });
    } catch { }
    if (!isLast) {
      setCurrentIndex((p) => p + 1);
      setTimeRemaining(60);
      setReps(0);
      setSetsLeft(exercises[currentIndex + 1].sets || 3);
      setIsRunning(false);
    } else {
      navigate("/workout-complete", {
        state: {
          calories: (currentIndex + 1) * 15,
          sets: exercises.length * 3,
          minutes: (currentIndex + 1) * 2,
          intensity: 85
        },
      });
    }
  };
  const targetReps = parseInt(exercise?.reps?.split("-")[0]) || 10;
  const exerciseProgress = Math.min(Math.round((reps / targetReps) * 100), 100);
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("/embed/")) return url;
    let id = "";
    if (url.includes("v=")) id = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) id = url.split("youtu.be/")[1].split("?")[0];
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=1&loop=1` : url;
  };
  return (
    <div className="ws-root">
      <div className="ws-topbar">
        <div className="ws-topbar-left">
          <button className="ws-exit-btn" onClick={() => navigate("/workouts")}>
            ← Exit Session
          </button>
          <div className="ws-topbar-divider" />
          <div>
            <div className="ws-session-status">
              <span className={`ws-status-dot ${isRunning ? "ws-dot-active" : "ws-dot-paused"}`} />
              {isRunning ? "Active" : "Paused"}
            </div>
            <div className="ws-session-label">Training Session</div>
          </div>
        </div>
        <div className="ws-topbar-right">
          <div className="ws-exercise-indicator">
            <span className="ws-ex-label">Current Exercise</span>
            <span className="ws-ex-name">{exercise?.name}</span>
          </div>
          <div className="ws-ex-counter">
            {currentIndex + 1}<span className="ws-ex-total">/{exercises.length}</span>
          </div>
        </div>
      </div>
      <div className="ws-progress-pills">
        {exercises.map((ex, i) => (
          <div
            key={i}
            className={`ws-pill ${i < currentIndex ? "ws-pill-done" : i === currentIndex ? "ws-pill-active" : ""}`}
            title={ex.name}
          />
        ))}
      </div>
      <div className="ws-grid">
        <div className="ws-left">
          <div className="ws-video-card">
            <div className="ws-video-wrapper">
              <iframe
                width="100%" height="100%"
                src={getYouTubeEmbedUrl(exercise?.video)}
                title={exercise?.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="ws-video-info">
              <h3 className="ws-video-title">{exercise?.name}</h3>
              <p className="ws-video-desc">
                {exercise?.description || "Follow the demonstration for correct form and technique."}
              </p>
            </div>
          </div>
          <div className="ws-camera-card">
            <CameraTracker
              isActive={isRunning}
              onRepUpdate={(count) => { if (isRunning) setReps(count); }}
              onStatusUpdate={setAiStatus}
              onFeedbackUpdate={setAiFeedback}
              onConfidenceUpdate={setAiConfidence}
            />
            <div className="ws-camera-badges">
              <div className="ws-camera-badge">
                <span className={`ws-cam-dot ${aiStatus === "Detecting..." ? "ws-cam-dot-active" : ""}`} />
                {aiStatus}
              </div>
              <div className="ws-camera-badge">Conf: {aiConfidence}%</div>
            </div>
            <div className="ws-ai-feedback">
              🤖 {aiFeedback}
            </div>
            {!isRunning && reps === 0 && (
              <div className="ws-camera-overlay">
                <p>Press Start to activate AI tracking</p>
              </div>
            )}
          </div>
          <div className="ws-progress-card">
            <div className="ws-progress-header">
              <span className="ws-progress-label">Rep Progress</span>
              <span className="ws-progress-pct">{exerciseProgress}%</span>
            </div>
            <div className="ws-progress-track">
              <div className="ws-progress-fill" style={{ width: `${exerciseProgress}%` }} />
            </div>
            <div className="ws-progress-text">
              {reps} of {targetReps} target reps
            </div>
          </div>
        </div>
        <div className="ws-right">
          <div className="ws-control-card">
            <span className="ws-ctrl-label">Time Remaining</span>
            <div className={`ws-timer ${timeRemaining <= 10 ? "ws-timer-warning" : ""}`}>
              {formatTime(timeRemaining)}
            </div>
            <div className="ws-counters">
              <div className="ws-counter">
                <span className="ws-counter-num">{setsLeft}</span>
                <span className="ws-counter-den">/ {exercise?.sets || 3}</span>
                <span className="ws-counter-lbl">Sets</span>
              </div>
              <div className="ws-counter-divider" />
              <div className="ws-counter">
                <span className="ws-counter-num">{reps}</span>
                <span className="ws-counter-den">/ {targetReps}</span>
                <span className="ws-counter-lbl">Reps</span>
              </div>
            </div>
            <div className="ws-ctrl-buttons">
              <button
                className={`ws-btn-main ${isRunning ? "ws-btn-pause" : "ws-btn-start"}`}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? "⏸ Pause" : "▶ Start Session"}
              </button>
              <button className="ws-btn-next" onClick={nextExercise}>
                {currentIndex < exercises.length - 1 ? "Next Exercise →" : "Finish Workout ✓"}
              </button>
            </div>
          </div>
          <div className="ws-tip-card">
            <div className="ws-tip-icon">💡</div>
            <div>
              <div className="ws-tip-label">Technique Tip</div>
              <p className="ws-tip-text">
                Maintain consistent tension through the full range of motion. Breathe out on exertion.
              </p>
            </div>
          </div>
          <div className="ws-queue-card">
            <div className="ws-queue-label">Exercise Queue</div>
            {exercises.map((ex, i) => (
              <div key={i} className={`ws-queue-item ${i === currentIndex ? "ws-queue-active" : i < currentIndex ? "ws-queue-done" : ""}`}>
                <span className="ws-queue-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="ws-queue-name">{ex.name}</span>
                {i < currentIndex && <span className="ws-queue-check">✓</span>}
                {i === currentIndex && <span className="ws-queue-now">Now</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default WorkoutSession;