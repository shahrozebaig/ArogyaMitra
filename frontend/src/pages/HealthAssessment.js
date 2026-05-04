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
          fitness_level: form.fitness_level,
          medical_conditions: form.medical_conditions
        }),
        API.post("/nutrition/generate", {
          age: parseInt(form.age) || 25,
          height: parseInt(form.height) || 170,
          weight: parseInt(form.weight) || 65,
          fitness_goal: form.fitness_goal,
          fitness_level: form.fitness_level,
          diet_type: form.dietary_preference || "Vegetarian",
          allergies: form.allergies || "None",
          medical_conditions: form.medical_conditions
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
    <div className="max-w-4xl mx-auto pb-24 px-6 md:px-10 space-y-12 animate-fade-in">
      <div className="pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Health <span className="text-purple-500">Assessment</span>
          </h1>
          <p className="text-sm text-white/40 font-medium">
            Complete your profile to generate your personalized training and nutrition plan.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="bg-[#111114] border border-white/5 rounded-[32px] p-8 md:p-10 space-y-8 shadow-sm">
          <div className="space-y-1 border-b border-white/5 pb-6">
            <h3 className="text-xl font-bold text-white">Physical Metrics</h3>
            <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Base Measurements</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { label: 'Age', name: 'age', placeholder: '', type: 'number' },
              { label: 'Height (cm)', name: 'height', placeholder: '', type: 'number' },
              { label: 'Weight (kg)', name: 'weight', placeholder: '', type: 'number' }
            ].map(field => (
              <div key={field.name} className="space-y-2">
                <label className="text-[11px] font-bold text-white/20 uppercase tracking-widest pl-1">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.04] transition-all"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#111114] border border-white/5 rounded-[32px] p-8 md:p-10 space-y-8 shadow-sm">
          <div className="space-y-1 border-b border-white/5 pb-6">
            <h3 className="text-xl font-bold text-white">Fitness Goals</h3>
            <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Target & Experience</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-white/20 uppercase tracking-widest pl-1">Primary Goal</label>
              <select name="fitness_goal" onChange={handleChange} required className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer">
                <option value="" className="bg-[#111114]">Select Goal</option>
                <option value="Weight Loss" className="bg-[#111114]">Weight Loss</option>
                <option value="Muscle Gain" className="bg-[#111114]">Muscle Gain</option>
                <option value="Stay Fit" className="bg-[#111114]">Stay Fit</option>
                <option value="Endurance" className="bg-[#111114]">Endurance</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-white/20 uppercase tracking-widest pl-1">Experience Level</label>
              <select name="fitness_level" onChange={handleChange} required className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer">
                <option value="" className="bg-[#111114]">Select Level</option>
                <option value="Beginner" className="bg-[#111114]">Beginner</option>
                <option value="Intermediate" className="bg-[#111114]">Intermediate</option>
                <option value="Advanced" className="bg-[#111114]">Advanced</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-[#111114] border border-white/5 rounded-[32px] p-8 md:p-10 space-y-8 shadow-sm">
          <div className="space-y-1 border-b border-white/5 pb-6">
            <h3 className="text-xl font-bold text-white">Lifestyle & Preferences</h3>
            <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Environment & Dietary Info</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-white/20 uppercase tracking-widest pl-1">Workout Location</label>
              <select name="workout_location" onChange={handleChange} required className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer">
                <option value="" className="bg-[#111114]">Select Location</option>
                <option value="Home" className="bg-[#111114]">Home</option>
                <option value="Gym" className="bg-[#111114]">Gym</option>
                <option value="Outdoor" className="bg-[#111114]">Outdoor</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-white/20 uppercase tracking-widest pl-1">Dietary Preference</label>
              <select name="dietary_preference" onChange={handleChange} required className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer">
                <option value="Vegetarian" className="bg-[#111114]">Vegetarian</option>
                <option value="Non-Vegetarian" className="bg-[#111114]">Non-Vegetarian</option>
                <option value="Vegan" className="bg-[#111114]">Vegan</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-white/20 uppercase tracking-widest pl-1">Allergies (Optional)</label>
              <textarea
                name="allergies"
                placeholder=""
                onChange={handleChange}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-purple-500/50 h-32 resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-white/20 uppercase tracking-widest pl-1">Medical Conditions (Optional)</label>
              <textarea
                name="medical_conditions"
                placeholder=""
                onChange={handleChange}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-purple-500/50 h-32 resize-none"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-6 bg-white text-black rounded-2xl font-bold text-lg hover:bg-purple-500 hover:text-white transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? "Personalizing your plans..." : "Generate My AI Plans ➔"}
        </button>
      </form>
    </div>
  );
}
export default HealthAssessment;