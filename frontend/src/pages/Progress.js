import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Progress() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProgress = async () => {
    try {
      const statsRes = await API.get("/progress/stats");
      const sorted = (statsRes.data || []).filter(r => 
        r.calories_burned > 0 || 
        r.healthy_meals_count > 0 || 
        r.status === "In Progress"
      ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRecords(sorted);
    } catch (err) {
      console.error("Failed to fetch progress data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleResume = async (record) => {
    try {
      const res = await API.get("/workout/current");
      if (res.data && res.data.plan_json) {
        const plan = JSON.parse(res.data.plan_json);
        navigate("/session", {
          state: {
            exercises: plan.today.exercises,
            currentExerciseId: null
          }
        });
      }
    } catch (err) {
      console.error("Failed to resume workout:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4 md:px-8 space-y-12 animate-fade-in">
      {/* Responsive Header */}
      <div className="pt-8 md:pt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase italic">
            Progress <span className="text-blue-500">Tracking</span>
          </h1>
          <p className="text-sm md:text-base text-white/40 font-medium">Monitoring your physiological evolution and daily consistency.</p>
        </div>
      </div>

      <div className="space-y-10">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            <h2 className="text-xl font-bold text-white uppercase italic">Activity Logs</h2>
            <span className="text-xs font-bold text-white/20 uppercase tracking-[0.2em]">{records.length} Objectives Recorded</span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : records.length === 0 ? (
            <div className="bg-[#111114] border border-white/5 border-dashed rounded-[40px] p-24 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="text-6xl opacity-10 grayscale">📊</div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white uppercase italic">No Activity Data</h3>
                <p className="text-sm text-white/30 max-w-xs mx-auto font-medium">Initialize workouts or log meals to synchronize your progress history.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {records.map((record, i) => (
                <div key={i} className="group bg-[#111114] border border-white/5 p-8 md:p-10 rounded-[40px] flex flex-col lg:flex-row justify-between items-center hover:border-blue-500/30 transition-all shadow-xl gap-10 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-center gap-10 w-full lg:w-auto relative z-10">
                    <div className="text-center sm:text-left min-w-[160px] space-y-1">
                      <p className="text-xs font-bold text-white/20 uppercase tracking-widest">
                        {new Date(record.created_at + (record.created_at.endsWith('Z') ? '' : 'Z')).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-2xl font-bold text-white uppercase italic">
                        {new Date(record.created_at + (record.created_at.endsWith('Z') ? '' : 'Z')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <div className="h-12 w-[1px] bg-white/5 hidden sm:block"></div>
                    
                    <div className="flex items-center gap-8">
                      <div className={`w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center text-3xl transition-all group-hover:scale-110 group-hover:border-blue-500/30 ${record.status === "In Progress" ? "border-orange-500/50 bg-orange-500/5" : ""}`}>
                        {record.healthy_meals_count > 0 ? "🥗" : "🏋️"}
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-4">
                          <h4 className="text-xl font-bold text-white uppercase tracking-tight italic">
                            {record.healthy_meals_count > 0 ? "Nutrient Map Sync" : record.status === "In Progress" ? "Session Pending" : "Objective Complete"}
                          </h4>
                          {record.status === "In Progress" && (
                            <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-orange-500/20 animate-pulse">
                              In Progress
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/20 font-bold uppercase tracking-[0.3em]">Module ID: #{record.id.toString().slice(-4)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-10 w-full lg:w-auto pt-10 lg:pt-0 border-t lg:border-t-0 border-white/5 relative z-10">
                    <div className="grid grid-cols-2 gap-12">
                      {record.calories_burned > 0 ? (
                        <div className="text-center lg:text-right space-y-1">
                          <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Metabolic Cost</p>
                          <p className="text-2xl font-bold text-orange-500 italic">-{record.calories_burned} kcal</p>
                        </div>
                      ) : record.healthy_meals_count > 0 ? (
                        <div className="text-center lg:text-right space-y-1">
                          <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Portion Units</p>
                          <p className="text-2xl font-bold text-emerald-500 italic">+{record.healthy_meals_count} Units</p>
                        </div>
                      ) : (
                        <div className="text-center lg:text-right space-y-1">
                          <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Current Status</p>
                          <p className={`text-base font-bold uppercase italic ${record.status === 'In Progress' ? 'text-orange-500' : 'text-white/40'}`}>{record.status}</p>
                        </div>
                      )}
                    </div>

                    {record.status === "In Progress" && (
                      <button
                        onClick={() => handleResume(record)}
                        className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95"
                      >
                        Resume Suite ➔
                      </button>
                    )}
                  </div>
                  
                  {/* Decorative Sub-glow */}
                  <div className="absolute bottom-[-20%] left-[-5%] w-40 h-40 bg-blue-500/[0.01] blur-[80px] rounded-full group-hover:bg-blue-500/[0.03] transition-all duration-700"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Progress;