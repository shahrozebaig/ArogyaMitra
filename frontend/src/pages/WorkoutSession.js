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
      console.error("Failed to save intermediate progress:", err);
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
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Abort Session</span>
          </button>
          <div className="h-8 w-[1px] bg-white/5 hidden md:block"></div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-purple-500 uppercase tracking-[0.4em] mb-1">Status: {isRunning ? 'Active' : 'Paused'}</span>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'}`}></div>
              <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
                Neural <span className="text-white/40">Session</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-12 bg-white/5 px-8 py-3 rounded-2xl border border-white/5">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Signal</span>
            <span className="text-xs font-bold italic text-green-400 uppercase">Optimized</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Protocol</span>
            <span className="text-xs font-bold italic text-white uppercase">{exercise?.name || 'Protocol Delta'}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Target</span>
            <span className="text-xs font-bold italic text-purple-400 uppercase">Hypertrophy</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none">Operator</p>
            <p className="text-sm font-black italic uppercase text-white">Ravi S. // Alpha</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-sm font-black italic shadow-2xl shadow-purple-500/20">
            RS
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto grid xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-5 space-y-8">
          <div className="bg-[#111114] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl group relative">
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <span className="bg-black/60 backdrop-blur-md text-[8px] font-black px-3 py-1.5 rounded-lg border border-white/10 uppercase tracking-widest italic">Tactical Analysis</span>
            </div>
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
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Execution Blueprint // V1.4</p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em]">Protocol Instructions</h3>
                <p className="text-sm text-white/50 leading-relaxed font-medium">
                  {exercise?.description || "Initializing exercise description. Follow tactical analysis for optimal form and neural recruitment patterns."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`py-5 rounded-2xl text-[11px] font-black uppercase italic tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${isRunning ? 'bg-white/5 border border-white/10 text-white/40 hover:text-white' : 'bg-purple-600 text-white shadow-xl shadow-purple-600/20 hover:scale-[1.02]'}`}
                >
                  {isRunning ? (
                    <>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      Pause Execution
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      Initialize Session
                    </>
                  )}
                </button>
                <button
                  onClick={nextExercise}
                  disabled={reps < targetReps && !isRunning}
                  className={`py-5 rounded-2xl text-[11px] font-black uppercase italic tracking-[0.2em] transition-all border ${reps >= targetReps ? 'bg-green-600/20 border-green-500 text-green-400 hover:bg-green-600 hover:text-white' : 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed'}`}
                >
                  Protocol Complete ➔
                </button>
              </div>
            </div>
          </div>
          <div className="bg-[#111114] border border-white/5 p-8 rounded-[40px] space-y-6">
            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Performance Tips</h3>
            <ul className="space-y-4">
              {[
                "Maintain constant tension through the full range of motion.",
                "Explosive concentric phase, controlled eccentric phase.",
                "Neural focus: Mind-muscle connection at the peak contraction.",
                "Hydration levels: Optimal for system performance."
              ].map((tip, i) => (
                <li key={i} className="flex gap-4 items-start group">
                  <div className="w-5 h-5 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-black text-blue-400 shrink-0 mt-0.5 group-hover:bg-blue-500 group-hover:text-white transition-all">{i + 1}</div>
                  <p className="text-xs text-white/40 group-hover:text-white/70 transition-colors font-medium leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="xl:col-span-7 space-y-8">
          <div className="bg-[#111114] border border-white/5 rounded-[40px] overflow-hidden relative aspect-video shadow-2xl group">
            <div className="absolute top-6 left-6 z-20 flex gap-2">
              <span className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-lg border border-red-500/50 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                Live Neural Feed
              </span>
            </div>
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
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-black uppercase italic tracking-widest text-white/80">Camera Standby</p>
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em]">Initialize Session to enable neural mapping</p>
                </div>
              </div>
            )}
            <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-white/10 rounded-tr-[40px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-white/10 rounded-bl-[40px] pointer-events-none"></div>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-[#111114] border border-white/5 p-10 rounded-[40px] space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20"></div>
              <div className="text-center space-y-4 relative z-10">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Time Remaining</span>
                <p className="text-8xl font-black italic tracking-tighter text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] leading-none">
                  {formatTime(timeRemaining)}
                </p>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-6 h-1 rounded-full transition-colors ${isRunning ? 'bg-blue-500 animate-pulse' : 'bg-white/5'}`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-8">
              <div className="bg-[#111114] border border-white/5 p-8 rounded-[40px] flex items-center justify-between shadow-2xl">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Active Sets</span>
                  <p className="text-4xl font-black italic text-white leading-none">{setsLeft} / {exercise?.sets || 3}</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/10 animate-[spin_10s_linear_infinite]"></div>
                </div>
              </div>
              <div className="bg-[#111114] border border-white/5 p-8 rounded-[40px] flex items-center justify-between shadow-2xl">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Neural Reps</span>
                  <p className="text-4xl font-black italic text-white leading-none">{reps} <span className="text-white/20 text-xl font-medium tracking-tight">/ {targetReps}</span></p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <span className="text-xl font-black italic text-purple-400">#</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#111114] border border-white/5 p-10 rounded-[40px] space-y-8 shadow-2xl">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-green-500 uppercase tracking-[0.5em]">Protocol Completion</h3>
                <p className="text-4xl font-black italic text-white uppercase tracking-tighter">Phase {exerciseProgress}% <span className="text-white/20">Integrated</span></p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Cycle Load</span>
                <p className="text-xl font-bold italic text-white">OPTIMAL</p>
              </div>
            </div>
            <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                style={{ width: `${exerciseProgress}%` }}
              >
                <div className="absolute top-0 right-0 w-8 h-full bg-white/20 skew-x-[30deg] translate-x-4"></div>
              </div>
            </div>
            <div className="flex justify-between">
              {[0, 25, 50, 75, 100].map(mark => (
                <div key={mark} className="flex flex-col items-center gap-2">
                  <div className={`w-1 h-2 rounded-full ${exerciseProgress >= mark ? 'bg-green-500' : 'bg-white/10'}`}></div>
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{mark}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default WorkoutSession;