import { useEffect, useState } from "react";
import useUserStore from "../store/userStore";
import API from "../api/axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const user = useUserStore((state) => state.user);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/progress/stats");
        if (res.data && res.data.length > 0) {
          const latest = res.data[0];
          setStats({
            donation: 0, // Calculate based on data if needed
            level: "Bronze",
            peopleImpacted: 0,
            caloriesBurned: latest.calories_burned || 0,
            workoutsDone: res.data.length,
            healthyMeals: 0
          });
        }
      } catch (err) {
        console.error("Dashboard stats error:", err);
        setStats({
          donation: 0,
          level: "Bronze",
          peopleImpacted: 0,
          caloriesBurned: 0,
          workoutsDone: 0,
          healthyMeals: 0
        });
      }
    };
    fetchStats();
  }, []);


  const quickActions = [
    { title: "Start Health Assessment", desc: "Get AI-powered personalized plans", icon: "❤️", path: "/health", color: "bg-green-500/20 text-green-400" },
    { title: "Ask AROMI Coach", desc: "Chat with your health companion", icon: "🤖", path: "/ai-coach", color: "bg-purple-500/20 text-purple-400" },
    { title: "Track Progress", desc: "Log your daily fitness metrics", icon: "📈", path: "/progress", color: "bg-blue-500/20 text-blue-400" },
    { title: "AI Fitness Coach", desc: "Chat with your personal AI trainer", icon: "💬", path: "/ai-coach", color: "bg-emerald-500/20 text-emerald-400" },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">
            Welcome back, <span className="text-purple-400">{user?.name || "abcd"}!</span>
          </h1>
          <p className="text-white/40 flex items-center gap-2">
            Ready to continue your fitness journey? Let's make today count! 💪
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xl">🔥</div>
           <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 w-[60%]"></div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions & More */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
               <span className="text-purple-400">✨</span> Quick Actions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {quickActions.map((action, i) => (
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
              ))}
            </div>
          </div>

          <div className="glass-card p-8 space-y-6 bg-white/5">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">✓</div>
                   <h3 className="font-bold">Google Calendar Connected</h3>
                </div>
             </div>
             <p className="text-sm text-white/40 pl-11">
               Connected Account: <span className="text-green-400">{user?.email || "user@example.com"}</span><br />
               Your fitness plans will automatically sync to your Google Calendar!
             </p>
          </div>

          <div className="glass-card p-8 space-y-6 relative overflow-hidden group">
            <div className="flex items-center gap-3">
               <div className="text-xl">🕒</div>
               <h3 className="font-bold">Today's Remaining Tasks</h3>
            </div>
            <div className="py-10 text-center space-y-4">
               <div className="text-5xl animate-bounce">🚀</div>
               <div className="space-y-1">
                 <p className="font-bold">No plan created yet</p>
                 <p className="text-xs text-white/40">Start your fitness journey by completing health assessment!</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Charity Impact & Schedule */}
        <div className="space-y-8">
          <div className="glass-card p-8 space-y-8 bg-gradient-to-br from-white/5 to-purple-600/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">🏅 <span className="text-[10px] font-bold text-white/40 uppercase">Level 3</span></div>
             <div className="space-y-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Charity Impact 💖
                </h3>
                <p className="text-xs text-white/40 tracking-wider font-medium">Your fitness = Their health</p>
             </div>

             <div className="space-y-1">
                <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Amount Donated</p>
                <p className="text-5xl font-black text-white">₹{stats?.donation || 0}</p>
                <p className="text-xs font-medium text-white/40">via your workouts & meals</p>
                <p className="text-xs font-bold text-orange-400 pt-1">Level: {stats?.level || "Bronze"}</p>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <p className="text-2xl font-bold text-blue-400">{stats?.peopleImpacted || 0}</p>
                   <p className="text-[10px] uppercase font-bold text-white/20">People Impacted</p>
                </div>
                <div className="space-y-1">
                   <p className="text-2xl font-bold text-green-400">{stats?.caloriesBurned || 0}</p>
                   <p className="text-[10px] uppercase font-bold text-white/20">Calories Burned</p>
                </div>
                <div className="space-y-1">
                   <p className="text-2xl font-bold text-purple-400">{stats?.workoutsDone || 0}</p>
                   <p className="text-[10px] uppercase font-bold text-white/20">Workouts Done</p>
                </div>
                <div className="space-y-1">
                   <p className="text-2xl font-bold text-red-400">{stats?.healthyMeals || 0}</p>
                   <p className="text-[10px] uppercase font-bold text-white/20">Healthy Meals</p>
                </div>
             </div>

             <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                   <span>Workouts: ₹0 (₹5 each)</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                   <span>Calories: ₹0 (₹1 per 10 cal)</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                   <span>Meals: ₹0 (₹2 each)</span>
                </div>
             </div>

             <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-xs text-white/40 italic">"Keep going! Every calorie brings hope to someone in need! 💚"</p>
             </div>
          </div>

          <div className="glass-card p-8 space-y-6">
             <h3 className="font-bold flex items-center gap-2">
                <span className="text-lg">🗓️</span> Tomorrow's Schedule
             </h3>
             <div className="py-10 text-center space-y-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl mx-auto flex items-center justify-center text-xl">📅</div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white/40">No schedule set</p>
                  <button className="text-[10px] text-purple-400 font-bold uppercase tracking-widest hover:underline">Create your plan</button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-2xl shadow-purple-600/40 hover:scale-110 active:scale-95 transition-all z-50">
        🤖
      </button>
    </div>
  );
}

export default Dashboard;