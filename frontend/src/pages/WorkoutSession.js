import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CameraTracker from "../components/CameraTracker";

function WorkoutSession() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const exercises = state?.exercises || [];
  const initialIndex = exercises.findIndex(ex => ex.id === state?.currentExerciseId);
  const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
  const exercise = exercises[currentIndex];

  const [timeRemaining, setTimeRemaining] = useState(60); // 1 minute countdown for demo
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

  const nextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeRemaining(60);
      setReps(0);
      setSetsLeft(exercises[currentIndex + 1].sets);
      setIsRunning(false);
    } else {
      navigate("/workout-complete", {
        state: {
          calories: 14,
          sets: 3,
          minutes: 4,
          intensity: 0
        }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/workouts")}
            className="p-2 hover:bg-white/10 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">A</span>
            </div>
            <h1 className="text-xl font-bold">ArogyaMitra</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">
            <a href="/dashboard" className="hover:text-white">Dashboard</a>
            <a href="/workouts" className="text-white border-b-2 border-purple-500 pb-1">Workouts</a>
            <a href="/nutrition" className="hover:text-white">Nutrition</a>
            <a href="/progress" className="hover:text-white">Progress</a>
            <a href="/ai-coach" className="hover:text-white">AI Coach</a>
          </nav>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/10 rounded-full border border-white/20 flex items-center justify-center">
               <span className="text-xs">abcd</span>
             </div>
             <button className="text-xs text-white/40 hover:text-white">Logout</button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Video and Info */}
        <div className="space-y-6">
          {/* Tutorial Video */}
          <div className="glass-card overflow-hidden group relative">
             <div className="aspect-video bg-black/50">
               <iframe
                 width="100%"
                 height="100%"
                 src={exercise?.video || ""}
                 title={exercise?.name}
                 frameBorder="0"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
               />
             </div>
             <div className="p-4 bg-black/80 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold">{exercise?.name}</p>
                    <p className="text-[10px] text-white/40">Video from YouTube Tutorials</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-1.5 hover:bg-white/10 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
                   <button className="p-1.5 hover:bg-white/10 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg></button>
                </div>
             </div>
          </div>

          {/* Instructions Card */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Instructions
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              {exercise?.description}
            </p>
            
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${isRunning ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20'}`}
            >
              {isRunning ? "Pause Workout" : "Start Workout"}
            </button>
            
            {reps >= (parseInt(exercise?.reps) || 10) && (
               <button 
                onClick={nextExercise}
                className="w-full py-4 rounded-xl text-lg font-bold bg-green-600 hover:bg-green-700 transition-all mt-2"
              >
                Complete Set & Next →
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Tracking and Stats */}
        <div className="space-y-6">
          {/* Camera Feed */}
          <div className="glass-card overflow-hidden relative aspect-video flex items-center justify-center bg-gray-900/50">
             <CameraTracker onRepUpdate={(count) => {
               if (isRunning) setReps(count);
             }} />
             {!isRunning && reps === 0 && (
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                    <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Camera not started</p>
                    <p className="text-xs text-white/40">Click "Start Workout" to activate</p>
                  </div>
               </div>
             )}
          </div>

          {/* Progress Metrics */}
          <div className="glass-card p-6 space-y-8">
            <h3 className="text-lg font-semibold">Workout Progress</h3>
            
            <div className="flex flex-col items-center justify-center space-y-2">
               <span className="text-6xl font-bold font-mono tracking-tighter text-blue-400">
                 {formatTime(timeRemaining)}
               </span>
               <p className="text-sm text-white/40 uppercase tracking-widest font-medium">Time Remaining</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center space-y-1">
                 <p className="text-2xl font-bold">{setsLeft}</p>
                 <p className="text-[10px] text-white/40 uppercase font-bold">Sets Left</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center space-y-1">
                 <p className="text-2xl font-bold text-green-400">{exercise?.reps}</p>
                 <p className="text-[10px] text-white/40 uppercase font-bold">Reps/Set</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center space-y-1">
                 <p className="text-2xl font-bold text-purple-400">{reps}</p>
                 <p className="text-[10px] text-white/40 uppercase font-bold">Detected</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-white/40">Overall Progress</span>
                <span className="text-green-400">{(currentIndex / exercises.length) * 100}%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${(currentIndex / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <span className="text-yellow-400">💪</span>
              Pro Tips
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
               <li className="flex items-start gap-2">
                 <span className="text-green-400">✓</span>
                 Keep consistent movement throughout
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-green-400">✓</span>
                 Control the speed - don't rush
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-green-400">✓</span>
                 Breathe in and out steadily
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-green-400">✓</span>
                 The camera tracks your movements
               </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutSession;