import { useState, useEffect } from "react";
import API from "../api/axios";
function Nutrition() {
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const [loading, setLoading] = useState(false);
  const fetchPlan = async () => {
    try {
      const res = await API.get("/nutrition/current");
      if (res.data && res.data.plan_json) {
        setPlan(JSON.parse(res.data.plan_json));
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.error("Failed to fetch nutrition:", err);
      setPlan(null);
    }
  };
  const generatePlan = async () => {
    setLoading(true);
    try {
      const profileRes = await API.get("/health/profile");
      const profile = profileRes.data;
      const calories = profile?.goal === "Weight Loss" ? 1600 : profile?.goal === "Muscle Gain" ? 2800 : 2100;
      const res = await API.post("/nutrition/generate", {
        calories: calories,
        diet_type: profile?.dietary_preference || "Vegetarian",
        allergies: profile?.allergies || "None"
      });
      if (res.data && res.data.plan_json) {
        setPlan(JSON.parse(res.data.plan_json));
      }
    } catch (err) {
      console.error("Nutrition generation error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPlan();
  }, []);
  const handleMealComplete = async (mealIndex) => {
    try {
      const updatedPlan = { ...plan };
      updatedPlan.today[mealIndex].completed = !updatedPlan.today[mealIndex].completed;
      setPlan(updatedPlan);
      await API.post("/nutrition/update", { plan_json: JSON.stringify(updatedPlan) });
      if (updatedPlan.today[mealIndex].completed) {
        await API.post("/progress/update", {
          weight: 0,
          calories_burned: 0,
          workout_completed: 0,
          healthy_meals_count: 1
        });
      }
    } catch (err) {
      console.error("Failed to complete meal:", err);
    }
  };
  const toggleShoppingItem = async (index) => {
    const updatedPlan = { ...plan };
    updatedPlan.shoppingList[index].bought = !updatedPlan.shoppingList[index].bought;
    setPlan(updatedPlan);
    try {
      await API.post("/nutrition/update", { plan_json: JSON.stringify(updatedPlan) });
    } catch (err) {
      console.error("Failed to update shopping list:", err);
    }
  };
  const handleBuy = (item) => {
    window.open(`https://www.bigbasket.com/ps/?q=${encodeURIComponent(item)}`, "_blank");
  };
  return (
    <div className="max-w-7xl mx-auto pb-24 px-6 md:px-8 space-y-12 animate-fade-in">
      <div className="pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-orange-600 rounded-full"></div>
            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              Fueling <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Protocols</span>
            </h1>
          </div>
          <p className="text-xs font-bold text-white/20 uppercase tracking-[0.4em] pl-6">
            Resource Allocation: <span className="text-white">Metabolic Efficiency</span> {" // "} System: <span className="text-orange-500">Active</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <button
            onClick={generatePlan}
            disabled={loading}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-600 hover:border-orange-600 transition-all flex items-center justify-center gap-3 group"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "✨"}
            <span>Re-Generate Matrix</span>
          </button>
          <div className="flex bg-[#111114] p-1.5 rounded-[20px] border border-white/5 shadow-2xl">
            <button
              onClick={() => setActiveTab("today")}
              className={`px-8 py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "today" ? "bg-white text-black italic" : "text-white/20 hover:text-white"}`}
            >
              Active Log
            </button>
            <button
              onClick={() => setActiveTab("week")}
              className={`px-8 py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "week" ? "bg-white text-black italic" : "text-white/20 hover:text-white"}`}
            >
              Cycle Projection
            </button>
            <button
              onClick={() => setActiveTab("shopping")}
              className={`px-8 py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "shopping" ? "bg-white text-black italic" : "text-white/20 hover:text-white"}`}
            >
              Inventory
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="bg-[#111114] border border-white/5 rounded-[40px] p-32 flex flex-col items-center justify-center space-y-8 shadow-2xl">
          <div className="w-16 h-16 border-4 border-orange-500/10 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="text-center space-y-2">
            <p className="text-lg font-black uppercase italic tracking-widest">Architecting Macro Matrix</p>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Processing Nutritional Biometrics...</p>
          </div>
        </div>
      ) : !plan ? (
        <div className="bg-[#111114] border border-white/5 rounded-[40px] p-32 flex flex-col items-center justify-center space-y-10 text-center shadow-2xl">
          <div className="text-8xl grayscale opacity-20 animate-pulse">🍱</div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">No Active Fueling Matrix</h2>
            <p className="text-white/40 max-w-sm mx-auto text-sm font-medium uppercase tracking-tight">Initiate metabolic mapping to generate your personalized fueling protocol.</p>
          </div>
          <button onClick={generatePlan} className="px-12 py-6 bg-white text-black font-black uppercase italic tracking-widest text-sm rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-2xl shadow-white/5">
            Initialize Matrix ➔
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {activeTab === "today" && plan?.today && (
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight">Resource Allocation</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {plan.today.map((meal, i) => (
                    <div key={i} className="group bg-[#111114] border border-white/5 p-8 rounded-[40px] hover:border-orange-500/30 transition-all shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 text-6xl opacity-[0.03] group-hover:opacity-10 transition-opacity grayscale">{meal.image || "🍱"}</div>
                      <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em]">{meal.type}</span>
                            <h4 className={`text-2xl font-black italic uppercase tracking-tight leading-tight transition-all ${meal.completed ? 'text-white/20 line-through' : 'text-white'}`}>{meal.name}</h4>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Window: {meal.time}</p>
                          </div>
                          <button
                            onClick={() => handleMealComplete(i)}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${meal.completed ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-white/5 border-white/10 text-white/20 hover:text-white hover:border-white/30'}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-4 py-6 border-y border-white/5">
                          {[
                            { l: 'CAL', v: meal.calories },
                            { l: 'PRO', v: meal.protein + 'g' },
                            { l: 'CHO', v: meal.carbs + 'g' },
                            { l: 'FAT', v: meal.fat + 'g' }
                          ].map((stat, j) => (
                            <div key={j} className="text-center">
                              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">{stat.l}</p>
                              <p className="text-sm font-black italic">{stat.v}</p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Inventory Requirements</span>
                          <div className="flex flex-wrap gap-2">
                            {meal.ingredients?.map((ing, j) => (
                              <span key={j} className="text-[9px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-white/60 font-bold uppercase italic tracking-wider">{ing}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "week" && plan?.week && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                <h3 className="text-xl font-black italic uppercase tracking-tight">Macro Cycle Projection</h3>
              </div>
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {plan.week.map((item, i) => {
                  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                  const isToday = item.day === todayName;
                  return (
                    <div key={i} className={`bg-[#111114] border p-10 rounded-[40px] flex flex-col md:flex-row gap-10 items-center shadow-2xl transition-all ${isToday ? 'border-orange-500 shadow-orange-500/10' : 'border-white/5'}`}>
                      <div className="md:w-32 text-center md:text-left space-y-2 shrink-0">
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isToday ? 'text-orange-500' : 'text-white/20'}`}>{item.day}</span>
                        <h4 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{item.day.slice(0, 3)}</h4>
                        {isToday && <span className="bg-orange-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Today</span>}
                      </div>
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8 w-full">
                        {item.meals.map((meal, j) => (
                          <div key={j} className="space-y-2">
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                              {['BRK', 'LNC', 'DIN', 'SNK'][j]}
                            </span>
                            <p className="text-xs font-black italic uppercase text-white/80 leading-tight min-h-[32px]">{meal}</p>
                            <div className="w-full bg-white/5 h-0.5 rounded-full"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {activeTab === "shopping" && plan?.shoppingList && (
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="space-y-1">
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">Inventory Acquisition</h2>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Resource Checksum: {plan.shoppingList.length} Units</p>
                </div>
                <div className="w-16 h-16 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center text-2xl grayscale opacity-40">🛒</div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {plan.shoppingList.map((item, i) => (
                  <div key={i} className="group bg-[#111114] border border-white/5 p-6 rounded-[32px] flex justify-between items-center hover:border-orange-500/30 transition-all shadow-xl">
                    <div className="flex items-center gap-6 cursor-pointer" onClick={() => toggleShoppingItem(i)}>
                      <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${item.bought ? 'bg-green-600 border-green-600 text-white' : 'border-white/10 group-hover:border-white/30 text-transparent'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div className="space-y-0.5">
                        <span className={`text-sm font-black italic uppercase tracking-tight transition-all ${item.bought ? 'text-white/20 line-through' : 'text-white/90'}`}>{item.name}</span>
                        <p className="text-[8px] font-black text-white/10 uppercase tracking-widest italic">Phase: Acquisition Required</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBuy(item.name)}
                      className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all active:scale-95 shadow-lg"
                    >
                      Buy ➔
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-10 bg-blue-500/5 border border-blue-500/10 rounded-[40px] flex flex-col md:flex-row items-center gap-10">
                <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-center text-4xl grayscale opacity-40">🔬</div>
                <div className="space-y-2 text-center md:text-left">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Bio-Availability Insight</h4>
                  <p className="text-sm font-medium text-white/40 italic leading-relaxed">"Consuming whole-food micronutrients during the anabolic window maximizes system-wide recovery and neural signaling."</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default Nutrition;