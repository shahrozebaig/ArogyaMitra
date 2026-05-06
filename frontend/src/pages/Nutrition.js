import { Utensils, Sparkles, ShoppingCart, Check, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../api/axios";
import "./Nutrition.css";
function Nutrition() {
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState({});
  const [loadingInstructions, setLoadingInstructions] = useState({});
  useEffect(() => { fetchPlan(); }, []);
  const fetchPlan = async () => {
    try {
      const res = await API.get("/nutrition/current");
      if (res.data?.plan_json) setPlan(JSON.parse(res.data.plan_json));
      else setPlan(null);
    } catch { setPlan(null); }
  };
  const generatePlan = async () => {
    setLoading(true);
    try {
      const profileRes = await API.get("/health/profile");
      const profile = profileRes.data;
      const res = await API.post("/nutrition/generate", {
        age: profile?.age || 25,
        height: profile?.height || 170,
        weight: profile?.weight || 70,
        fitness_goal: profile?.fitness_goal || "Stay Fit",
        fitness_level: profile?.fitness_level || "Beginner",
        diet_type: profile?.dietary_preference || "Vegetarian",
        allergies: profile?.allergies || "None",
        medical_conditions: profile?.medical_conditions || "None",
      });
      if (res.data?.plan_json) setPlan(JSON.parse(res.data.plan_json));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  const fetchCookingInstructions = async (mealName, index) => {
    if (instructions[index]) {
      setInstructions((p) => { const n = { ...p }; delete n[index]; return n; });
      return;
    }
    setLoadingInstructions((p) => ({ ...p, [index]: true }));
    try {
      const res = await API.post("/aromi/chat", {
        message: `Provide step-by-step cooking instructions for: ${mealName}. Respond ONLY in plain-text points starting with 1. 2. 3. etc. No symbols, no intro.`,
        context: "Nutrition Assistant",
      });
      setInstructions((p) => ({ ...p, [index]: res.data.reply }));
    } catch { }
    finally { setLoadingInstructions((p) => ({ ...p, [index]: false })); }
  };
  const handleMealComplete = async (i) => {
    try {
      const updated = { ...plan };
      updated.today[i].completed = !updated.today[i].completed;
      setPlan(updated);
      await API.post("/nutrition/update", { plan_json: JSON.stringify(updated) });
      if (updated.today[i].completed) {
        await API.post("/progress/update", { weight: 0, calories_burned: 0, workout_completed: 0, healthy_meals_count: 1, status: "Completed" });
      }
    } catch { }
  };
  const toggleShoppingItem = async (i) => {
    const updated = { ...plan };
    updated.shoppingList[i].bought = !updated.shoppingList[i].bought;
    setPlan(updated);
    try { await API.post("/nutrition/update", { plan_json: JSON.stringify(updated) }); } catch { }
  };
  const handleBuy = (item) => window.open(`https://www.bigbasket.com/ps/?q=${encodeURIComponent(item)}`, "_blank");
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="nt-root">
      <div className="nt-header">
        <div>
          <h1 className="nt-title"><Utensils className="nt-title-icon" /> Nutrition Plan</h1>
          <p className="nt-subtitle">Your AI-personalized daily meal strategy.</p>
        </div>
        <div className="nt-header-actions">
          <div className="nt-tabs">
            {[{ id: "today", label: "Today" }, { id: "week", label: "Weekly" }, { id: "shopping", label: "Shopping" }].map((t) => (
              <button
                key={t.id}
                className={`nt-tab ${activeTab === t.id ? "nt-tab-active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >{t.label}</button>
            ))}
          </div>
          <button className="nt-generate-btn" onClick={generatePlan} disabled={loading}>
            {loading ? <span className="nt-spinner" /> : <Sparkles size={18} />}
            Generate Plan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="nt-loading">
          <div className="nt-spinner-lg" />
          <p>Analyzing your nutrition profile...</p>
        </div>
      ) : !plan ? (
        <div className="nt-empty">
          <div className="nt-empty-icon"><Utensils size={64} /></div>
          <h2 className="nt-empty-title">No Nutrition Plan Yet</h2>
          <p className="nt-empty-desc">Generate your personalized AI meal plan based on your health profile.</p>
          <button className="nt-cta-btn" onClick={generatePlan}><Sparkles size={18} /> Generate My Plan</button>
        </div>
      ) : (
        <>
          {activeTab === "today" && plan?.today && (
            <div className="nt-meals-grid">
              {plan.today.map((meal, i) => (
                <div key={i} className={`nt-meal-card ${meal.completed ? "nt-meal-done" : ""}`}>
                  <div className="nt-meal-header">
                    <div className="nt-meal-meta">
                      <span className="nt-meal-type">{meal.type}</span>
                      <span className="nt-meal-time">{meal.time}</span>
                    </div>
                    <button
                      className={`nt-check-btn ${meal.completed ? "nt-check-done" : ""}`}
                      onClick={() => handleMealComplete(i)}
                    >
                      <Check size={16} />
                    </button>
                  </div>
                  <h4 className={`nt-meal-name ${meal.completed ? "nt-meal-name-done" : ""}`}>{meal.name}</h4>
                  <div className="nt-macros">
                    <div className="nt-macro nt-macro-cal">
                      <span className="nt-macro-val">{meal.calories}</span>
                      <span className="nt-macro-lbl">kcal</span>
                    </div>
                    <div className="nt-macro">
                      <span className="nt-macro-val">{meal.protein || 0}g</span>
                      <span className="nt-macro-lbl">Protein</span>
                    </div>
                    <div className="nt-macro">
                      <span className="nt-macro-val">{meal.carbs || 0}g</span>
                      <span className="nt-macro-lbl">Carbs</span>
                    </div>
                    <div className="nt-macro">
                      <span className="nt-macro-val">{meal.fat || 0}g</span>
                      <span className="nt-macro-lbl">Fat</span>
                    </div>
                  </div>
                  <div className="nt-ingredients">
                    {meal.ingredients?.map((ing, j) => (
                      <span key={j} className="nt-ingredient">{ing}</span>
                    ))}
                  </div>
                  <button
                    className={`nt-instructions-toggle ${instructions[i] ? "nt-instructions-open" : ""}`}
                    onClick={() => fetchCookingInstructions(meal.name, i)}
                    disabled={loadingInstructions[i]}
                  >
                    {loadingInstructions[i]
                      ? <><span className="nt-spinner nt-spinner-sm" /> Loading...</>
                      : instructions[i]
                        ? "▲ Hide Preparation Steps"
                        : "▼ View Preparation Steps"
                    }
                  </button>
                  {instructions[i] && (
                    <div className="nt-instructions-box">
                      <p className="nt-instructions-text">{instructions[i]}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {activeTab === "week" && plan?.week && (
            <div className="nt-week-list">
              {plan.week.map((item, i) => {
                const isToday = item.day === todayName;
                return (
                  <div key={i} className={`nt-week-row ${isToday ? "nt-week-row-today" : ""}`}>
                    <div className="nt-week-day">
                      <span className={`nt-week-day-name ${isToday ? "nt-week-today-label" : ""}`}>{item.day.slice(0, 3)}</span>
                      {isToday && <span className="nt-today-badge">Today</span>}
                    </div>
                    <div className="nt-week-meals">
                      {item.meals.map((meal, j) => (
                        <div key={j} className="nt-week-meal">
                          <span className="nt-week-meal-type">{["Breakfast", "Lunch", "Dinner", "Snack"][j]}</span>
                          <span className="nt-week-meal-name">{meal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {activeTab === "shopping" && plan?.shoppingList && (
            <div className="nt-shopping">
              <div className="nt-shopping-header">
                <span className="nt-shopping-title"><ShoppingCart size={20} /> Shopping List</span>
                <span className="nt-shopping-count">
                  {plan.shoppingList.filter((i) => i.bought).length} / {plan.shoppingList.length} items
                </span>
              </div>
              <div className="nt-shopping-grid">
                {plan.shoppingList.map((item, i) => (
                  <div key={i} className={`nt-shop-item ${item.bought ? "nt-shop-done" : ""}`}>
                    <div className="nt-shop-left" onClick={() => toggleShoppingItem(i)}>
                      <div className={`nt-shop-check ${item.bought ? "nt-shop-check-done" : ""}`}>
                        {item.bought && <Check size={12} strokeWidth={3} color="white" />}
                      </div>
                      <span className={`nt-shop-name ${item.bought ? "nt-shop-name-done" : ""}`}>{item.name}</span>
                    </div>
                    <button className="nt-buy-btn" onClick={() => handleBuy(item.name)}>
                      Buy <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default Nutrition;