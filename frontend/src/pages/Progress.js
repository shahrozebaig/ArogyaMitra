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
    <div className="max-w-7xl mx-auto pb-24 px-6 md:px-8 space-y-12 animate-fade-in">
      <div className="pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              Performance <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Analytics</span>
            </h1>
          </div>
          <p className="text-xs font-bold text-white/20 uppercase tracking-[0.4em] pl-6 italic">
            Neural Growth Mapping {" // "} Data Stream: <span className="text-blue-500">Synchronized</span>
          </p>
        </div>
      </div>
      <div className="space-y-12">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-black italic uppercase tracking-tight">Protocol Logs</h2>
            </div>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{records.length} Cycles Logged</span>
          </div>
          {records.length === 0 ? (
            <div className="bg-[#111114] border border-white/5 border-dashed rounded-[40px] p-32 flex flex-col items-center justify-center space-y-8 shadow-2xl">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 grayscale opacity-20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black uppercase italic tracking-widest text-white/80">No Active Data Streams</h3>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em]">Initialize workouts to begin biometric mapping</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record, i) => (
                <div key={i} className="group bg-[#111114] border border-white/5 p-8 rounded-[40px] flex flex-col md:flex-row justify-between items-center hover:border-blue-500/30 transition-all shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-blue-600/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-10 w-full md:w-auto relative z-10">
                    <div className="text-center md:text-left min-w-[140px] space-y-1">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{new Date(record.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-2xl font-black italic text-white/90 uppercase tracking-tighter leading-none">{new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="h-12 w-[1px] bg-white/5 hidden md:block"></div>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-3xl grayscale group-hover:grayscale-0 transition-all group-hover:scale-110 group-hover:border-blue-500/30">
                        {record.healthy_meals_count > 0 ? "🥗" : "🏋️"}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-black italic uppercase text-white/90 leading-tight">
                          {record.healthy_meals_count > 0 ? "Fueling Integrated" : "Training Synced"}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          <p className="text-[9px] text-white/20 font-black uppercase tracking-widest italic">Cycle: #{record.id.toString().slice(-4)} {" // "} Logged</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-12 mt-8 md:mt-0 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-8 md:pt-0 relative z-10">
                    {record.calories_burned > 0 && (
                      <div className="text-center md:text-right space-y-1">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Energy Burned</p>
                        <p className="text-3xl font-black italic text-orange-500 leading-none">{record.calories_burned} <span className="text-sm font-medium text-white/10 uppercase tracking-tight italic">kcal</span></p>
                      </div>
                    )}
                    {record.healthy_meals_count > 0 && (
                      <div className="text-center md:text-right space-y-1">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Resource Gain</p>
                        <p className="text-3xl font-black italic text-emerald-500 leading-none">+{record.healthy_meals_count} <span className="text-sm font-medium text-white/10 uppercase tracking-tight italic">Units</span></p>
                      </div>
                    )}
                    {!record.calories_burned && !record.healthy_meals_count && (
                      <div className="text-center md:text-right space-y-1">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Protocol Type</p>
                        <p className="text-lg font-black italic text-white/40 uppercase leading-none">Maintenance</p>
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