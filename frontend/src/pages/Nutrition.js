import { useState, useEffect } from "react";
import API from "../api/axios";

function Nutrition() {
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState({});
  const [loadingInstructions, setLoadingInstructions] = useState({});

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
        allergies: profile?.allergies || "None",
        medical_conditions: profile?.medical_conditions || "None"
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

  const fetchCookingInstructions = async (mealName, index) => {
    if (instructions[index]) {
      setInstructions(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      return;
    }
    setLoadingInstructions(prev => ({ ...prev, [index]: true }));
    try {
      const res = await API.post("/aromi/chat", {
        message: `Provide step-by-step cooking instructions for: ${mealName}. Respond ONLY in plain-text points starting with 1. 2. 3. etc. No symbols, no intro.`,
        context: "Nutrition Assistant"
      });
      setInstructions(prev => ({ ...prev, [index]: res.data.reply }));
    } catch (err) {
      console.error("Failed to fetch instructions:", err);
    } finally {
      setLoadingInstructions(prev => ({ ...prev, [index]: false }));
    }
  };

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
          healthy_meals_count: 1,
          status: "Completed"
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
    <div className="max-w-7xl mx-auto pb-24 px-4 md:px-8 space-y-12 animate-fade-in">
      {/* Responsive Header */}
      <div className="pt-8 md:pt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-[0.4em]">Fuel Architecture</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase italic">
            Daily <span className="text-orange-500">Nutrition</span>
          </h1>
          <p className="text-sm md:text-base text-white/40 font-medium">Metabolic mapping based on your physiological profile.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <button
            onClick={generatePlan}
            disabled={loading}
            className="px-8 py-3.5 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "✨"}
            <span>Optimize Menu</span>
          </button>
          
          <div className="flex bg-[#111114] p-1.5 rounded-2xl border border-white/5">
            {["today", "week", "shopping"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 md:px-8 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${activeTab === tab ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
              >
                {tab === "today" ? "Today" : tab === "week" ? "Week" : "Items"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#111114] border border-white/5 rounded-[40px] p-24 flex flex-col items-center justify-center space-y-6">
          <div className="w-12 h-12 border-4 border-orange-500/10 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/20">Analyzing Macronutrients...</p>
        </div>
      ) : !plan ? (
        <div className="bg-[#111114] border border-white/5 border-dashed rounded-[40px] p-24 flex flex-col items-center justify-center space-y-8 text-center">
          <div className="text-6xl opacity-10">🍱</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white uppercase italic">No Nutrition Map</h2>
            <p className="text-white/30 max-w-sm mx-auto text-sm font-medium">Initialize your metabolic plan to synchronize your intake.</p>
          </div>
          <button onClick={generatePlan} className="px-12 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-2xl active:scale-95">
            Sync Architecture ➔
          </button>
        </div>
      ) : (
        <div className="space-y-16 animate-fade-in">
          {activeTab === "today" && plan?.today && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {plan.today.map((meal, i) => (
                <div key={i} className="group bg-[#111114] border border-white/5 p-8 md:p-10 rounded-[40px] hover:border-orange-500/30 transition-all shadow-xl flex flex-col h-full relative overflow-hidden">
                  <div className="relative z-10 space-y-8 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em] rounded-lg border border-orange-500/20">{meal.type}</span>
                          <span className="text-xs font-bold text-white/20 uppercase tracking-widest italic">{meal.time}</span>
                        </div>
                        <h4 className={`text-2xl font-bold italic uppercase tracking-tighter pt-2 transition-all ${meal.completed ? 'text-white/10 line-through' : 'text-white'}`}>{meal.name}</h4>
                      </div>
                      
                      <button
                        onClick={() => handleMealComplete(i)}
                        className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all active:scale-90 ${meal.completed ? 'bg-emerald-600 border-emerald-500 text-white shadow-2xl' : 'bg-white/5 border-white/10 text-white/20 hover:text-white'}`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-white/5">
                      {[
                        { label: 'Calories', val: meal.calories, color: 'text-orange-500' },
                        { label: 'Protein', val: (meal.protein || 0) + 'g' },
                        { label: 'Carbs', val: (meal.carbs || 0) + 'g' },
                        { label: 'Fat', val: (meal.fat || 0) + 'g' }
                      ].map((stat, j) => (
                        <div key={j} className="text-center space-y-1">
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{stat.label}</p>
                          <p className={`text-base font-bold ${stat.color || 'text-white'} tracking-tight`}>{stat.val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-bold text-white/20 uppercase tracking-[0.4em]">Essential Components</p>
                      <div className="flex flex-wrap gap-2">
                        {meal.ingredients?.map((ing, j) => (
                          <span key={j} className="text-[11px] bg-white/[0.03] border border-white/5 px-4 py-2 rounded-xl text-white/50 font-bold tracking-tight hover:bg-white/5 transition-all">{ing}</span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-5">
                      <button
                        onClick={() => fetchCookingInstructions(meal.name, i)}
                        disabled={loadingInstructions[i]}
                        className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] transition-all ${instructions[i] ? 'text-orange-500' : 'text-white/30 hover:text-orange-500'}`}
                      >
                        {loadingInstructions[i] ? (
                          <div className="w-3 h-3 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                        ) : (
                          <span className="flex items-center gap-2">
                            {instructions[i] ? "Minimize Preparation" : "View Preparation Mode"}
                            <span className="text-sm">{instructions[i] ? "↑" : "↓"}</span>
                          </span>
                        )}
                      </button>
                      
                      {instructions[i] && (
                        <div className="p-8 bg-black/40 border border-white/5 rounded-[32px] space-y-6 animate-fade-in relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500/50"></div>
                           <p className="text-sm text-white/60 font-bold leading-relaxed italic whitespace-pre-wrap uppercase tracking-wider">
                            {instructions[i]}
                           </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Decorative Glow */}
                  <div className="absolute bottom-[-20%] right-[-10%] w-40 h-40 bg-orange-500/[0.01] blur-[80px] rounded-full group-hover:bg-orange-500/[0.03] transition-all duration-700"></div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "week" && plan?.week && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {plan.week.map((item, i) => {
                const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const isToday = item.day === todayName;
                return (
                  <div key={i} className={`bg-[#111114] border p-8 md:p-10 rounded-[40px] flex flex-col lg:flex-row gap-10 items-center shadow-2xl transition-all relative overflow-hidden group ${isToday ? 'border-orange-500/40 bg-white/[0.02]' : 'border-white/5 hover:border-white/20'}`}>
                    <div className="lg:w-32 text-center lg:text-left space-y-2 shrink-0 relative z-10">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.4em] ${isToday ? 'text-orange-500' : 'text-white/20'}`}>{item.day}</span>
                      <h4 className="text-3xl font-bold italic uppercase tracking-tighter text-white">{item.day.slice(0, 3)}</h4>
                      {isToday && <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase rounded-lg border border-orange-500/20">Active</span>}
                    </div>
                    
                    <div className="flex-1 grid grid-cols-2 gap-8 w-full relative z-10">
                      {item.meals.map((meal, j) => (
                        <div key={j} className="space-y-2 group/meal">
                          <span className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em] group-hover/meal:text-orange-500/40 transition-colors">
                            {['Breakfast', 'Lunch', 'Dinner', 'Snack'][j]}
                          </span>
                          <p className="text-sm font-bold text-white/80 leading-tight tracking-tight uppercase italic">{meal}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "shopping" && plan?.shoppingList && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex items-center justify-between px-8">
                <h3 className="text-xs font-bold text-white/20 uppercase tracking-[0.4em]">Inventory Synchronization</h3>
                <span className="text-xs font-bold text-orange-500/60 uppercase tracking-widest">{plan.shoppingList.filter(i => i.bought).length} / {plan.shoppingList.length} Secured</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {plan.shoppingList.map((item, i) => (
                  <div key={i} className="group bg-[#111114] border border-white/5 p-8 rounded-[32px] flex justify-between items-center hover:border-orange-500/30 transition-all shadow-2xl">
                    <div className="flex items-center gap-6 cursor-pointer" onClick={() => toggleShoppingItem(i)}>
                      <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${item.bought ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl' : 'bg-white/5 border-white/10 text-transparent hover:border-white/30'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className={`text-base font-bold tracking-tight uppercase italic ${item.bought ? 'text-white/10 line-through' : 'text-white/90'}`}>{item.name}</span>
                    </div>
                    <button onClick={() => handleBuy(item.name)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white/30 hover:bg-orange-600 hover:text-white transition-all active:scale-95 shadow-lg">
                      Purchase ➔
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Nutrition;