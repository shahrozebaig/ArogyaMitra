import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import CameraTracker from "../components/CameraTracker";

function WorkoutSession() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const exercises = state?.exercises || [];
  const initialIndex = exercises.findIndex(ex => ex.id === state?.currentExerciseId);
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
    let interval;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const nextExercise = async () => {
    try {
      const calsPerEx = 10;
      await API.post("/progress/update", {
        weight: 0,
        calories_burned: calsPerEx,
        workout_completed: 1,
        status: currentIndex < exercises.length - 1 ? "In Progress" : "Completed"
      });
    } catch (err) {
      console.error("Failed to save progress:", err);
    }

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeRemaining(60);
      setReps(0);
      setSetsLeft(exercises[currentIndex + 1].sets || 3);
      setIsRunning(false);
    } else {
      navigate("/workout-complete", {
        state: {
          calories: (currentIndex + 1) * 10,
          sets: 3,
          minutes: 4,
          intensity: 85
        }
      });
    }
  };

  const targetReps = parseInt(exercise?.reps?.split('-')[0]) || 10;
  const exerciseProgress = Math.min(Math.round((reps / targetReps) * 100), 100);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("/embed/")) return url;
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&loop=1` : url;
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white p-4 md:p-8 lg:p-12 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      {/* Responsive Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 mb-10 bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/workouts")}
            className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest text-white/50"
          >
            Exit Session
          </button>
          <div className="h-8 w-[1px] bg-white/5 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-0.5">{isRunning ? 'Active' : 'Paused'}</span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight uppercase">Training <span className="text-white/30 font-medium">Session</span></h1>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Current Exercise</span>
            <span className="text-sm md:text-base font-bold text-purple-400 uppercase tracking-wider">{exercise?.name}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-white/40">
            {currentIndex + 1}
          </div>
        </div>
      </div>

      {/* Main Grid: Responsive Stacking */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Visual Monitors Section */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* YouTube Guide */}
            <div className="bg-[#111114] border border-white/5 rounded-[32px] overflow-hidden shadow-xl flex flex-col">
              <div className="aspect-video bg-black relative">
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(exercise?.video)}
                  title={exercise?.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="opacity-90"
                />
              </div>
              <div className="p-8 space-y-3">
                <h3 className="text-base md:text-lg font-bold text-white uppercase italic tracking-tight">{exercise?.name}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-medium">
                  {exercise?.description || "Follow the visual demonstration for optimal technique."}
                </p>
              </div>
            </div>

            {/* AI Camera Tracker */}
            <div className="bg-[#111114] border border-white/5 rounded-[32px] overflow-hidden relative aspect-video shadow-xl group">
              <CameraTracker
                isActive={isRunning}
                onRepUpdate={(count) => { if (isRunning) setReps(count); }}
                onStatusUpdate={setAiStatus}
                onFeedbackUpdate={setAiFeedback}
                onConfidenceUpdate={setAiConfidence}
              />
              <div className="absolute top-6 left-6 flex gap-3 pointer-events-none">
                <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${aiStatus === 'Detecting...' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-[0.2em]">{aiStatus}</span>
                </div>
                <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Conf: {aiConfidence}%</span>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                <div className="bg-purple-600/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-purple-400/30 flex items-center gap-3 shadow-2xl">
                  <span className="text-lg">🤖</span>
                  <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">{aiFeedback}</span>
                </div>
              </div>

              {!isRunning && reps === 0 && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center space-y-3 pointer-events-none backdrop-blur-sm">
                   <p className="text-xs font-bold uppercase tracking-[0.5em] text-white/20">Awaiting AI Initialization</p>
                </div>
              )}
            </div>
          </div>

          {/* Session Progress Bar */}
          <div className="bg-[#111114] border border-white/5 p-8 rounded-[32px] space-y-5">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Exercise Completion</span>
                <p className="text-2xl font-bold text-white">Target Accuracy <span className="text-emerald-500">{exerciseProgress}%</span></p>
              </div>
              <span className="text-3xl font-bold text-white tabular-nums">{exerciseProgress}%</span>
            </div>
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-700 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                style={{ width: `${exerciseProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Dashboard / Controls Section */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#111114] border border-white/5 p-10 rounded-[40px] text-center space-y-10 flex flex-col justify-between shadow-2xl">
            <div className="space-y-3">
              <span className="text-xs font-bold text-white/20 uppercase tracking-[0.5em]">Time Remaining</span>
              <p className="text-7xl md:text-8xl font-bold tracking-tighter text-blue-500 tabular-nums leading-none">{formatTime(timeRemaining)}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/5">
              <div className="space-y-2 text-center">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Sets Completed</p>
                <p className="text-4xl font-bold text-white tabular-nums">{setsLeft} <span className="text-white/10 text-xl font-medium">/ {exercise?.sets || 3}</span></p>
              </div>
              <div className="space-y-2 text-center">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Reps Recorded</p>
                <p className="text-4xl font-bold text-white tabular-nums">{reps} <span className="text-white/10 text-xl font-medium">/ {targetReps}</span></p>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-full py-5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${isRunning ? 'bg-white/5 border border-white/10 text-white/40 hover:text-white' : 'bg-white text-black hover:bg-purple-600 hover:text-white shadow-2xl active:scale-95'}`}
              >
                {isRunning ? "Pause Session" : "Start Session"}
              </button>
              <button
                onClick={nextExercise}
                className="w-full py-5 rounded-2xl text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-all active:scale-95"
              >
                Next Exercise ➔
              </button>
            </div>
          </div>

          {/* Compact Instructions */}
          <div className="bg-[#111114] border border-white/5 p-8 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.5em]">Expert Guidance</p>
            </div>
            <p className="text-sm text-white/70 leading-relaxed font-medium italic">
              "Maintain consistent tension through the full range of motion. Breathe out on exertion."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutSession;