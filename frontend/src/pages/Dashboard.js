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
    { title: "Start Health Assessment", desc: "Get AI-powered personalized plans", icon: "❤️", path: "/health", color: "bg-green-500/20 text-green-400" },
    { title: "AI Fitness Coach", desc: "Chat with your personal AI trainer", icon: "💬", isChat: true, color: "bg-emerald-500/20 text-emerald-400" },
    { title: "Track Progress", desc: "Log your daily fitness metrics", icon: "📈", path: "/progress", color: "bg-blue-500/20 text-blue-400" },
  ];
  const handleActionClick = (action) => {
    if (action.isChat) {
      window.dispatchEvent(new CustomEvent("open-aromi-chat"));
    }
  };
  const hasTasks = tasks.workout || tasks.nutrition;
  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">
            Welcome back, <span className="text-purple-400">{user?.name || "User"}!</span>
          </h1>
          <p className="text-white/40 flex items-center gap-2">
            Ready to continue your fitness journey? Let's make today count! 💪
          </p>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-purple-400">✨</span> Quick Actions
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {quickActions.map((action, i) => (
                action.isChat ? (
                  <button
                    key={i}
                    onClick={() => handleActionClick(action)}
                    className="glass-card p-6 glass-card-hover space-y-4 group text-left w-full"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold">{action.title}</h3>
                      <p className="text-xs text-white/40">{action.desc}</p>
                      <div className="text-purple-400 text-[10px] font-bold uppercase tracking-widest pt-2 group-hover:translate-x-1 transition-transform">
                        Open AI Chat →
                      </div>
                    </div>
                  </button>
                ) : (
                  <Link to={action.path} key={i} className="glass-card p-6 glass-card-hover space-y-4 group">
                    <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold">{action.title}</h3>
                      <p className="text-xs text-white/40">{action.desc}</p>
                      <div className="text-purple-400 text-[10px] font-bold uppercase tracking-widest pt-2 group-hover:translate-x-1 transition-transform">
                        Get Started →
                      </div>
                    </div>
                  </Link>
                )
              ))}
            </div>
          </div>
          <div className="glass-card p-8 space-y-6 relative overflow-hidden group">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="text-xl">🕒</div>
                <h3 className="font-bold">Today's Remaining Tasks</h3>
              </div>
              {hasTasks && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-bold rounded-full border border-purple-500/20 uppercase tracking-widest">
                  Live Plan
                </span>
              )}
            </div>
            {loading ? (
              <div className="py-20 text-center text-white/20">Loading your tasks...</div>
            ) : hasTasks ? (
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                {tasks.workout && (
                  <Link to="/workouts" className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3 hover:bg-white/10 transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">🏋️</div>
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Workout</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Today's Routine</p>
                      <p className="text-xs text-white/40 truncate">Focus: Strength & Form</p>
                    </div>
                  </Link>
                )}
                {tasks.nutrition && (
                  <Link to="/nutrition" className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3 hover:bg-white/10 transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">🥗</div>
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Nutrition</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">AI Meal Plan</p>
                      <p className="text-xs text-white/40 truncate">Personalized Indian Menu</p>
                    </div>
                  </Link>
                )}
              </div>
            ) : (
              <div className="py-10 text-center space-y-4">
                <div className="text-5xl animate-bounce">🚀</div>
                <div className="space-y-1">
                  <p className="font-bold">No plan created yet</p>
                  <p className="text-xs text-white/40">Start your fitness journey by completing health assessment!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AromiChat />
    </div>
  );
}
export default Dashboard;