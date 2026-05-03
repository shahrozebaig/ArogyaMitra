import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
function HealthAssessment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    age: "",
    height: "",
    weight: "",
    fitness_goal: "",
    fitness_level: "",
    workout_location: "",
    workout_time: "",
    dietary_preference: "Vegetarian",
    allergies: "",
    medical_conditions: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/health/assessment", form);
      await Promise.all([
        API.post("/workout/generate", {
          goal: form.fitness_goal,
          location: form.workout_location,
          duration: 30,
          fitness_level: form.fitness_level
        }),
        API.post("/nutrition/generate", {
          age: parseInt(form.age) || 25,
          height: parseInt(form.height) || 170,
          weight: parseInt(form.weight) || 65,
          fitness_goal: form.fitness_goal,
          fitness_level: form.fitness_level,
          diet_type: form.dietary_preference || "Vegetarian",
          allergies: form.allergies || "None"
        })
      ]);
      await API.post("/progress/update", {
        weight: parseFloat(form.weight),
        calories_burned: 0,
        workout_completed: 0,
        healthy_meals_count: 0
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to generate plans:", err);
      alert("Assessment saved, but plan generation failed. You can try generating from the dashboard.");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto pb-24 px-6 md:px-8 animate-fade-in space-y-12">
      <div className="pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              Health <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Assessment</span>
            </h1>
          </div>
          <p className="text-xs font-bold text-white/20 uppercase tracking-[0.4em] pl-6 italic">
            Initialize your personalized training and nutrition blueprint.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="bg-[#111114] border border-white/5 rounded-[40px] p-10 md:p-12 space-y-10 shadow-2xl relative overflow-hidden group">
          <div className="space-y-2 border-b border-white/5 pb-8 relative z-10">
            <h3 className="text-2xl font-black italic uppercase tracking-tight leading-none">Physical Metrics</h3>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">Enter your baseline body measurements</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 relative z-10">
            {[
              { label: 'Age', name: 'age', placeholder: 'e.g., 25', type: 'number' },
              { label: 'Height (cm)', name: 'height', placeholder: 'e.g., 175', type: 'number' },
              { label: 'Weight (kg)', name: 'weight', placeholder: 'e.g., 70', type: 'number' }
            ].map(field => (
              <div key={field.name} className="space-y-3">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] pl-1">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold italic uppercase tracking-tight focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#111114] border border-white/5 rounded-[40px] p-10 md:p-12 space-y-10 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 border-b border-white/5 pb-8 relative z-10">
            <h3 className="text-2xl font-black italic uppercase tracking-tight leading-none">Fitness Goals</h3>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">Define your objectives and experience level</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] pl-1">Primary Goal</label>
              <select name="fitness_goal" onChange={handleChange} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold italic uppercase tracking-tight focus:outline-none focus:border-white/20 appearance-none cursor-pointer">
                <option value="" className="bg-[#111114]">Select Goal</option>
                <option value="Weight Loss" className="bg-[#111114]">Weight Loss</option>
                <option value="Muscle Gain" className="bg-[#111114]">Muscle Gain</option>
                <option value="Stay Fit" className="bg-[#111114]">Stay Fit</option>
                <option value="Endurance" className="bg-[#111114]">Endurance</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] pl-1">Current Level</label>
              <select name="fitness_level" onChange={handleChange} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold italic uppercase tracking-tight focus:outline-none focus:border-white/20 appearance-none cursor-pointer">
                <option value="" className="bg-[#111114]">Select Level</option>
                <option value="Beginner" className="bg-[#111114]">Beginner</option>
                <option value="Intermediate" className="bg-[#111114]">Intermediate</option>
                <option value="Advanced" className="bg-[#111114]">Advanced</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-[#111114] border border-white/5 rounded-[40px] p-10 md:p-12 space-y-10 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 border-b border-white/5 pb-8 relative z-10">
            <h3 className="text-2xl font-black italic uppercase tracking-tight leading-none">Lifestyle & Preferences</h3>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">Environmental and dietary constraints</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] pl-1">Workout Location</label>
              <select name="workout_location" onChange={handleChange} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold italic uppercase tracking-tight focus:outline-none focus:border-white/20 appearance-none cursor-pointer">
                <option value="" className="bg-[#111114]">Select Location</option>
                <option value="Home" className="bg-[#111114]">Home</option>
                <option value="Gym" className="bg-[#111114]">Gym</option>
                <option value="Outdoor" className="bg-[#111114]">Outdoor</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] pl-1">Dietary Preference</label>
              <select name="dietary_preference" onChange={handleChange} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold italic uppercase tracking-tight focus:outline-none focus:border-white/20 appearance-none cursor-pointer">
                <option value="Vegetarian" className="bg-[#111114]">Vegetarian 🥦</option>
                <option value="Non-Vegetarian" className="bg-[#111114]">Non-Vegetarian 🍗</option>
                <option value="Vegan" className="bg-[#111114]">Vegan 🌱</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] pl-1">Allergies (Optional)</label>
              <textarea name="allergies" placeholder="e.g., Peanuts, Dairy..." onChange={handleChange} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold italic uppercase tracking-tight focus:outline-none focus:border-white/20 h-32 resize-none" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] pl-1">Medical Conditions (Optional)</label>
              <textarea name="medical_conditions" placeholder="e.g., Asthma, Back Pain..." onChange={handleChange} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold italic uppercase tracking-tight focus:outline-none focus:border-white/20 h-32 resize-none" />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-8 bg-white text-black rounded-[32px] font-black text-xl italic uppercase tracking-[0.3em] hover:bg-white/90 hover:scale-[1.01] active:scale-[0.98] transition-all shadow-2xl shadow-white/5 disabled:opacity-50 disabled:grayscale"
        >
          {loading ? "Generating Your Plans..." : "Generate My AI Plans ➔"}
        </button>
      </form>
    </div>
  );
}
export default HealthAssessment;