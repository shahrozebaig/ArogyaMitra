import { useState, useEffect } from "react";
import API from "../api/axios";

function Nutrition() {

  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("today");

  const fetchPlan = async () => {
    try {
      const res = await API.get("/nutrition/current");
      if (res.data && res.data.plan_json) {
        setPlan(JSON.parse(res.data.plan_json));
      } else {
        generatePlan();
      }
    } catch (err) {
      console.error("Failed to fetch nutrition:", err);
      // Fallback mock data
      setPlan({
        today: [
          { type: "Breakfast", time: "7:00 AM", name: "Dosa with Sambar", calories: 350, protein: 8, carbs: 60, fat: 8, ingredients: ["Dosa", "Sambar"], image: "🥞" }
        ],
        week: [],
        shoppingList: []
      });
    }
  };

  const generatePlan = async () => {
    try {
      const res = await API.post("/nutrition/generate", {
        preferences: "Vegetarian",
        goal: "Health",
        restrictions: "None"
      });
      if (res.data && res.data.plan_json) {
        setPlan(JSON.parse(res.data.plan_json));
      }
    } catch (err) {
      console.error("Nutrition generation error:", err);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);




  const handleBuy = (item) => {
    window.open(`https://www.bigbasket.com/ps/?q=${encodeURIComponent(item)}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="relative overflow-hidden py-10">
         <div className="absolute top-0 right-0 text-[120px] font-black text-white/[0.02] -mr-20 -mt-10 select-none">yamitra</div>
         <div className="relative space-y-2">
            <div className="flex items-center gap-3">
               <span className="text-3xl">🍲</span>
               <h1 className="text-5xl font-black tracking-tighter">Indian Nutrition Plans</h1>
            </div>
            <p className="text-white/40 flex items-center gap-2">
               AI-powered traditional Indian meal planning for optimal nutrition 🥗💚
            </p>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 w-fit">
        <button 
          onClick={() => setActiveTab("today")}
          className={`px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'today' ? 'bg-white/10 text-white shadow-xl' : 'text-white/40 hover:text-white'}`}
        >
          <span>📅</span> Today
        </button>
        <button 
          onClick={() => setActiveTab("week")}
          className={`px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'week' ? 'bg-white/10 text-white shadow-xl' : 'text-white/40 hover:text-white'}`}
        >
          <span>🗓️</span> This Week
        </button>
        <button 
          onClick={() => setActiveTab("shopping")}
          className={`px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'shopping' ? 'bg-white/10 text-white shadow-xl' : 'text-white/40 hover:text-white'}`}
        >
          <span>🛒</span> Shopping List
        </button>
      </div>

      {activeTab === "today" && plan?.today && (
        <div className="grid md:grid-cols-2 gap-8">
          {plan.today.map((meal, i) => (
            <div key={i} className="glass-card p-8 space-y-6 relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="text-8xl">{meal.image}</div>
               </div>
               
               <div className="relative space-y-4">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                           <h3 className="text-lg font-bold text-orange-400 uppercase tracking-widest">{meal.type}</h3>
                        </div>
                        <p className="text-xs text-white/40 font-medium">🕒 {meal.time}</p>
                     </div>
                     <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                        <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                     </button>
                  </div>

                  <h4 className="text-2xl font-bold leading-tight">{meal.name}</h4>

                  <div className="grid grid-cols-4 gap-4 py-4 border-y border-white/5">
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-white/20">Calories</p>
                        <p className="text-xl font-bold">{meal.calories}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-white/20">Protein</p>
                        <p className="text-xl font-bold">{meal.protein}g</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-white/20">Carbs</p>
                        <p className="text-xl font-bold">{meal.carbs}g</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-white/20">Fat</p>
                        <p className="text-xl font-bold">{meal.fat}g</p>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Ingredients:</p>
                     <div className="flex flex-wrap gap-2">
                        {meal.ingredients.map((ing, j) => (
                           <span key={j} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-md text-white/60">{ing}</span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "week" && plan?.week && (
        <div className="space-y-6">
          {plan.week.map((item, i) => (
            <div key={i} className={`glass-card p-8 flex flex-col md:flex-row gap-8 items-center ${item.today ? 'border-green-500/30 bg-green-500/5' : ''}`}>
               <div className="md:w-32 text-center md:text-left space-y-1">
                  <h4 className="text-2xl font-black text-white">{item.day}</h4>
                  {item.today && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold uppercase">Today</span>}
               </div>
               
               <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                  {item.meals.map((meal, j) => (
                     <div key={j} className="space-y-2">
                        <p className="text-[10px] uppercase font-bold text-white/20">
                           {['Breakfast', 'Lunch', 'Dinner', 'Snacks'][j]}
                        </p>
                        <p className="text-sm font-semibold text-white/80">{meal}</p>
                        <div className="flex gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-orange-400/40"></span>
                           <span className="text-[10px] text-white/20">100 cal • 5g p</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "shopping" && plan?.shoppingList && (
        <div className="max-w-3xl mx-auto space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black flex items-center gap-3">
                 <span className="text-2xl">🛒</span> Weekly Shopping List
              </h2>
              <p className="text-xs text-white/40 uppercase font-bold tracking-widest">{plan.shoppingList.length} Items</p>
           </div>

           <div className="space-y-3">
              {plan.shoppingList.map((item, i) => (
                <div key={i} className="glass-card p-5 flex justify-between items-center glass-card-hover group">
                   <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${item.bought ? 'bg-green-500 border-green-500 text-white' : 'border-white/10 group-hover:border-green-500/50'}`}>
                         {item.bought && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-lg font-medium transition-all ${item.bought ? 'text-white/20 line-through' : 'text-white/80'}`}>{item.name}</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em]">Required for: {['Breakfast', 'Lunch', 'Dinner'][i % 3]}</span>
                      <button 
                         onClick={() => handleBuy(item.name)}
                         className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                      >
                         <span>🛒</span> Buy
                      </button>
                   </div>
                </div>
              ))}
           </div>

           <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-3xl">💡</div>
              <div className="space-y-1">
                 <h4 className="font-bold">Did you know?</h4>
                 <p className="text-sm text-white/40">Fresh ingredients preserve more nutrients. Try to shop locally whenever possible! 🥦</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default Nutrition;