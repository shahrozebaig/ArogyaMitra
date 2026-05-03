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
        weight: 70,
        calories_burned: calsPerEx,
        workout_completed: 1
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
          intensity: 0
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
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 md:p-10 font-sans selection:bg-purple-500/30">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-white/5 pb-8">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate("/workouts")}
            className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
          >
            <svg className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">End Session</span>
          </button>
          <div className="h-8 w-[1px] bg-white/5 hidden md:block"></div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-purple-500 uppercase tracking-[0.4em] mb-1">Status: {isRunning ? 'Active' : 'Paused'}</span>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'}`}></div>
              <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
                Training <span className="text-white/40">Session</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-12 bg-white/5 px-8 py-3 rounded-2xl border border-white/5">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Activity</span>
            <span className="text-xs font-bold italic text-white uppercase">{exercise?.name || 'Workout'}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Target</span>
            <span className="text-xs font-bold italic text-purple-400 uppercase">Fitness</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black italic uppercase text-white">Member</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-sm font-black italic shadow-2xl shadow-purple-500/20">
            AM
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto grid xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-5 space-y-8">
          <div className="bg-[#111114] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl group relative">
            <div className="aspect-video bg-black/50 relative">
              <iframe
                width="100%"
                height="100%"
                src={getYouTubeEmbedUrl(exercise?.video)}
                title={exercise?.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="opacity-80 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
              />
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black italic uppercase tracking-tight text-white/90">{exercise?.name}</h2>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Execution Guide</p>
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em]">Instructions</h3>
                <p className="text-sm text-white/50 leading-relaxed font-medium">
                  {exercise?.description || "Follow the video for optimal form."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`py-5 rounded-2xl text-[11px] font-black uppercase italic tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${isRunning ? 'bg-white/5 border border-white/10 text-white/40 hover:text-white' : 'bg-purple-600 text-white shadow-xl shadow-purple-600/20 hover:scale-[1.02]'}`}
                >
                  {isRunning ? "Pause" : "Start"}
                </button>
                <button
                  onClick={nextExercise}
                  className={`py-5 rounded-2xl text-[11px] font-black uppercase italic tracking-[0.2em] transition-all border bg-white/5 border-white/10 text-white hover:bg-white/10`}
                >
                  Next Exercise ➔
                </button>
              </div>
            </div>
          </div>
          <div className="bg-[#111114] border border-white/5 p-8 rounded-[40px] space-y-6">
            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Training Tips</h3>
            <ul className="space-y-4">
              {[
                "Maintain constant tension through the full range of motion.",
                "Controlled movements for better results.",
                "Focus on the muscle being worked.",
                "Stay hydrated throughout the session."
              ].map((tip, i) => (
                <li key={i} className="flex gap-4 items-start group">
                  <div className="w-5 h-5 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-black text-blue-400 shrink-0 mt-0.5">{i + 1}</div>
                  <p className="text-xs text-white/40 group-hover:text-white/70 transition-colors font-medium leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="xl:col-span-7 space-y-8">
          <div className="bg-[#111114] border border-white/5 rounded-[40px] overflow-hidden relative aspect-video shadow-2xl group">
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <CameraTracker
                isActive={isRunning}
                onRepUpdate={(count) => {
                  if (isRunning) setReps(count);
                }}
              />
            </div>
            {!isRunning && reps === 0 && (
              <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-lg font-black uppercase italic tracking-widest text-white/80">Camera Ready</p>
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em]">Start session to enable tracking</p>
                </div>
              </div>
            )}
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-[#111114] border border-white/5 p-10 rounded-[40px] space-y-8 shadow-2xl relative overflow-hidden">
              <div className="text-center space-y-4 relative z-10">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Time Remaining</span>
                <p className="text-8xl font-black italic tracking-tighter text-blue-500 leading-none">
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-8">
              <div className="bg-[#111114] border border-white/5 p-8 rounded-[40px] flex items-center justify-between shadow-2xl">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Sets Done</span>
                  <p className="text-4xl font-black italic text-white leading-none">{setsLeft} / {exercise?.sets || 3}</p>
                </div>
              </div>
              <div className="bg-[#111114] border border-white/5 p-8 rounded-[40px] flex items-center justify-between shadow-2xl">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Reps Done</span>
                  <p className="text-4xl font-black italic text-white leading-none">{reps} <span className="text-white/20 text-xl font-medium tracking-tight">/ {targetReps}</span></p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#111114] border border-white/5 p-10 rounded-[40px] space-y-8 shadow-2xl">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-green-500 uppercase tracking-[0.5em]">Completion Status</h3>
                <p className="text-4xl font-black italic text-white uppercase tracking-tighter">{exerciseProgress}% Progress</p>
              </div>
            </div>
            <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-700 ease-out"
                style={{ width: `${exerciseProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default WorkoutSession;