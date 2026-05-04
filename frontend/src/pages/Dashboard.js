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

  const hasTasks = tasks.workout || tasks.nutrition;

  return (
    <>
    <div className="max-w-7xl mx-auto pb-20 space-y-8 animate-fade-in relative px-4 md:px-8">
      {/* Responsive Header */}
      <div className="pt-8 md:pt-16 space-y-2 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Welcome back, <span className="text-purple-500">{user?.name?.split(' ')[0] || "User"}</span>
        </h1>
        <p className="text-sm md:text-base text-white/40 font-medium">Monitoring your daily health architecture.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Responsive Action Center */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] px-1">Action Center</h2>
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="space-y-5">
              {[
                { id: "01.", text: "Complete your health assessment" },
                { id: "02.", text: "Generate AI-optimized plans" },
                { id: "03.", text: "Follow your daily objectives" }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <span className="text-xs font-bold text-purple-500 mt-1 shrink-0">{step.id}</span>
                  <p className="text-sm font-semibold text-white/60 leading-relaxed group-hover:text-white transition-colors">{step.text}</p>
                </div>
              ))}
            </div>
            <Link
              to="/health"
              className="w-full flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl group hover:bg-purple-600 transition-all"
            >
              <span className="text-xs font-bold text-purple-400 group-hover:text-white transition-colors">Start Assessment</span>
              <span className="text-purple-400 group-hover:text-white transition-all text-sm">➔</span>
            </Link>
          </div>
        </div>

        {/* Responsive Daily Focus */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#111114] border border-white/5 rounded-[24px] p-6 md:p-10 relative overflow-hidden shadow-sm">
            <div className="space-y-10 relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Daily Focus</h3>
                {!loading && hasTasks && (
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-purple-500/20">
                    Active Architecture
                  </span>
                )}
              </div>

              {loading ? (
                <div className="py-20 text-center">
                  <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                </div>
              ) : hasTasks ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {tasks.workout && (
                    <Link to="/workouts" className="group bg-white/[0.02] border border-white/5 p-8 rounded-2xl space-y-6 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition-all">🏋️</div>
                        <span className="text-[10px] font-bold text-blue-500/40 uppercase tracking-widest">Plan-01</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-white/90 uppercase italic tracking-tight">Training Routine</h4>
                        <p className="text-sm font-medium text-white/30 leading-relaxed">Strength and conditioning objectives for today.</p>
                      </div>
                      <div className="pt-4 flex items-center gap-3 text-xs font-bold text-blue-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                        Launch Suite ➔
                      </div>
                    </Link>
                  )}
                  {tasks.nutrition && (
                    <Link to="/nutrition" className="group bg-white/[0.02] border border-white/5 p-8 rounded-2xl space-y-6 hover:bg-white/[0.04] hover:border-green-500/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition-all">🥗</div>
                        <span className="text-[10px] font-bold text-green-500/40 uppercase tracking-widest">Plan-02</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-white/90 uppercase italic tracking-tight">Fuel Strategy</h4>
                        <p className="text-sm font-medium text-white/30 leading-relaxed">Metabolic meal mapping and nutrition data.</p>
                      </div>
                      <div className="pt-4 flex items-center gap-3 text-xs font-bold text-green-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                        View Menu ➔
                      </div>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4 bg-white/[0.01] rounded-2xl border border-dashed border-white/5">
                  <div className="text-5xl opacity-10">🍱</div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-white/80 uppercase italic">Awaiting Initialization</p>
                    <p className="text-xs font-medium text-white/20 max-w-xs mx-auto uppercase tracking-widest">Complete assessment to generate daily objectives</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <AromiChat />
    </>
  );
}

export default Dashboard;