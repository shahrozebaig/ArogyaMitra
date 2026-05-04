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
    { title: "Fill out details", desc: "Generate your AI plans ➔", icon: "📋", path: "/health", color: "bg-purple-500/10 text-purple-400" },
  ];
  const hasTasks = tasks.workout || tasks.nutrition;
  return (
    <div className="max-w-7xl mx-auto pb-24 space-y-10 animate-fade-in relative px-6 md:px-10">
      <div className="pt-16 space-y-2">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
          Welcome back, <span className="text-purple-500">{user?.name?.split(' ')[0] || "User"}</span>
        </h1>
        <p className="text-sm text-white/40 font-medium">Here's an overview of your health goals for today.</p>
      </div>
      <div className="grid lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-4">
            <h2 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.1em] px-1">Action Center</h2>
            <div className="space-y-3">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  to={action.path}
                  className="w-full block text-left p-6 bg-[#111114] border border-white/5 rounded-2xl group hover:border-purple-500/50 hover:bg-white/[0.02] transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${action.color} rounded-xl border border-white/5 flex items-center justify-center text-xl transition-all group-hover:scale-105`}>
                      {action.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-white/90">{action.title}</h3>
                      <p className="text-[11px] text-white/30 font-medium">{action.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-[#111114] border border-white/5 rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-sm">
            <div className="space-y-10 relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Daily Focus</h3>
                {!loading && hasTasks && (
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-purple-500/20">
                    Active Plan
                  </span>
                )}
              </div>
              {loading ? (
                <div className="py-20 text-center">
                  <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                </div>
              ) : hasTasks ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {tasks.workout && (
                    <Link to="/workouts" className="group bg-white/[0.02] border border-white/5 p-8 rounded-3xl space-y-6 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-all group-hover:scale-105">🏋️</div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Workout</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-white/90">Training Routine</h4>
                        <p className="text-xs font-medium text-white/40 leading-relaxed">Personalized strength and conditioning plan for today.</p>
                      </div>
                      <div className="pt-4 flex items-center gap-2 text-[11px] font-bold text-blue-400 uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                        Continue Training ➔
                      </div>
                    </Link>
                  )}
                  {tasks.nutrition && (
                    <Link to="/nutrition" className="group bg-white/[0.02] border border-white/5 p-8 rounded-3xl space-y-6 hover:bg-white/[0.05] hover:border-green-500/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-all group-hover:scale-105">🥗</div>
                        <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Nutrition</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-white/90">Fuel Strategy</h4>
                        <p className="text-xs font-medium text-white/40 leading-relaxed">Balanced meal mapping to support your metabolic goals.</p>
                      </div>
                      <div className="pt-4 flex items-center gap-2 text-[11px] font-bold text-green-400 uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                        View Meal Plan ➔
                      </div>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center space-y-6 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                  <div className="text-5xl opacity-20">📈</div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-white">No active goals yet</p>
                    <p className="text-xs font-medium text-white/30 max-w-xs mx-auto">Complete your assessment to unlock your personalized dashboard.</p>
                  </div>
                  <Link to="/health" className="inline-block px-10 py-4 bg-white text-black font-bold text-sm rounded-2xl hover:bg-purple-500 hover:text-white transition-all shadow-lg">
                    Start Assessment
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