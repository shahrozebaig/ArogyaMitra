import { useState, useEffect } from "react";
import API from "../api/axios";
function Progress() {
  const [records, setRecords] = useState([]);
  const fetchProgress = async () => {
    try {
      const statsRes = await API.get("/progress/stats");
      setRecords(statsRes.data || []);
    } catch (err) {
      console.error("Failed to fetch progress data:", err);
    }
  };
  useEffect(() => {
    fetchProgress();
  }, []);
  return (
    <div className="max-w-7xl mx-auto pb-24 px-6 md:px-10 space-y-12 animate-fade-in">
      <div className="pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Progress <span className="text-blue-500">Tracking</span>
          </h1>
          <p className="text-sm text-white/40 font-medium">Monitoring your physical transformation and daily consistency.</p>
        </div>
      </div>
      <div className="space-y-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-white">Activity Logs</h2>
            <span className="text-[11px] font-bold text-white/20 uppercase tracking-widest">{records.length} Activities Recorded</span>
          </div>
          {records.length === 0 ? (
            <div className="bg-[#111114] border border-white/5 border-dashed rounded-[32px] p-24 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="text-5xl opacity-20">📊</div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white/90">No logs found</h3>
                <p className="text-xs text-white/30 max-w-xs mx-auto">Start your training or nutrition plan to see your progress here.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record, i) => (
                <div key={i} className="group bg-[#111114] border border-white/5 p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-center hover:border-blue-500/30 transition-all shadow-sm">
                  <div className="flex items-center gap-10 w-full md:w-auto">
                    <div className="text-center md:text-left min-w-[140px] space-y-1">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{new Date(record.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-xl font-bold text-white/90">{new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-white/5 hidden md:block"></div>
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl transition-all group-hover:bg-blue-500/10 group-hover:border-blue-500/20">
                        {record.healthy_meals_count > 0 ? "🥗" : "🏋️"}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-white/90">
                          {record.healthy_meals_count > 0 ? "Meal Logged" : "Workout Completed"}
                        </h4>
                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Entry ID: #{record.id.toString().slice(-4)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10 mt-8 md:mt-0 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-8 md:pt-0">
                    {record.calories_burned > 0 && (
                      <div className="text-center md:text-right space-y-1">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Calories</p>
                        <p className="text-2xl font-bold text-orange-500">-{record.calories_burned} kcal</p>
                      </div>
                    )}
                    {record.healthy_meals_count > 0 && (
                      <div className="text-center md:text-right space-y-1">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Portions</p>
                        <p className="text-2xl font-bold text-emerald-500">+{record.healthy_meals_count}</p>
                      </div>
                    )}
                    {!record.calories_burned && !record.healthy_meals_count && (
                      <div className="text-center md:text-right space-y-1">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Log Type</p>
                        <p className="text-base font-bold text-white/40">Check-in</p>
                      </div>
                    )}
                  </div>
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