import { useEffect, useState } from "react";
import useUserStore from "../store/userStore";
import API from "../api/axios";
import { Link } from "react-router-dom";
import AromiChat from "../components/AromiChat";
function Dashboard() {
  const user = useUserStore((state) => state.user);
  const [tasks, setTasks] = useState({ workout: null, nutrition: null });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const [workoutRes, nutritionRes] = await Promise.all([
          API.get("/workout/current"),
          API.get("/nutrition/current")
        ]);
        setTasks({
          workout: workoutRes.data,
          nutrition: nutritionRes.data
        });
      } catch (err) {
        console.error("Dashboard tasks error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);
  const quickActions = [
    { title: "RE-ARCHITECT PROFILE", desc: "Modify neural health parameters", icon: "⚙️", path: "/health", color: "bg-white/5 text-white/40" },
    { title: "NEURAL COACH", desc: "Access adaptive AROMI intelligence", icon: "🧠", isChat: true, color: "bg-purple-500/20 text-purple-400" },
    { title: "EVOLUTION TRACKER", desc: "Analyze physical performance data", icon: "📊", path: "/progress", color: "bg-white/5 text-white/40" },
  ];
  const handleActionClick = (action) => {
    if (action.isChat) {
      window.dispatchEvent(new CustomEvent("open-aromi-chat"));
    }
  };
  const hasTasks = tasks.workout || tasks.nutrition;
  return (
    <div className="max-w-7xl mx-auto pb-24 space-y-12 animate-fade-in relative px-6 md:px-8">
      <div className="pt-12 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-purple-600 rounded-full"></div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">{user?.name?.split(' ')[0] || "PROSPECT"}</span>
          </h1>
        </div>
        <p className="text-sm font-bold text-white/20 uppercase tracking-[0.3em] pl-6">
          System Status: <span className="text-green-500">Operational</span> {" // "} Performance Mode: <span className="text-purple-500">Elite</span>
        </p>
      </div>
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-2">Primary Controls</h2>
            <div className="space-y-3">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => action.isChat ? handleActionClick(action) : window.location.href = action.path}
                  className="w-full text-left p-5 bg-[#111114] border border-white/5 rounded-2xl group hover:border-purple-500/30 transition-all shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-[10px] font-black uppercase tracking-widest leading-none">{action.title}</h3>
                      <p className="text-[9px] text-white/20 font-bold uppercase tracking-tight">{action.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-10">
          <div className="bg-[#111114] border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8">
              <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">Neural ID: {user?.id || "001"}</span>
            </div>
            <div className="space-y-10 relative z-10">
              <div className="space-y-2">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Performance Blueprint</h3>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                  <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Active Cycle: Daily Optimization</p>
                </div>
              </div>
              {loading ? (
                <div className="py-24 text-center">
                  <div className="w-12 h-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                </div>
              ) : hasTasks ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {tasks.workout && (
                    <Link to="/workouts" className="group bg-white/5 border border-white/5 p-8 rounded-[32px] space-y-6 hover:bg-white/[0.08] transition-all">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">🏋️</div>
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-500/20">Protocol: Physical</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-black uppercase italic tracking-tight">Today's Routine</h4>
                        <p className="text-xs font-bold text-white/30 uppercase tracking-widest leading-relaxed">Neural focus: Strength & Metabolic Conditioning</p>
                      </div>
                      <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                        Initialize Training ➔
                      </div>
                    </Link>
                  )}
                  {tasks.nutrition && (
                    <Link to="/nutrition" className="group bg-white/5 border border-white/5 p-8 rounded-[32px] space-y-6 hover:bg-white/[0.08] transition-all">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">🥗</div>
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-green-500/20">Protocol: Metabolic</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-black uppercase italic tracking-tight">Fuel Strategy</h4>
                        <p className="text-xs font-bold text-white/30 uppercase tracking-widest leading-relaxed">System fuel: Intelligent Nutrition Mapping</p>
                      </div>
                      <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-green-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                        Access Fuel Plan ➔
                      </div>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center space-y-6 bg-white/5 rounded-[32px] border border-dashed border-white/10">
                  <div className="text-6xl grayscale opacity-20">📡</div>
                  <div className="space-y-2">
                    <p className="text-lg font-black uppercase italic">Neural Link Missing</p>
                    <p className="text-xs font-bold text-white/20 uppercase tracking-widest max-w-xs mx-auto">Complete the performance assessment to generate your blueprint.</p>
                  </div>
                  <Link to="/health" className="inline-block px-8 py-4 bg-white text-black font-black uppercase italic text-xs tracking-widest rounded-xl hover:bg-purple-500 hover:text-white transition-all">
                    Initiate Assessment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AromiChat />
    </div>
  );
}
export default Dashboard;