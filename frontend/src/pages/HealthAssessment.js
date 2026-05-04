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
    <div className="max-w-4xl mx-auto pb-24 px-4 md:px-8 space-y-12 animate-fade-in">
      <div className="pt-8 md:pt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase italic">
            Health <span className="text-purple-500">Assessment</span>
          </h1>
          <p className="text-sm md:text-base text-white/40 font-medium">
            Personalizing your training and nutrition architecture.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
        {/* Physical Metrics Section */}
        <div className="bg-[#111114] border border-white/5 rounded-[32px] p-6 md:p-10 space-y-8 shadow-xl">
          <div className="space-y-2 border-b border-white/5 pb-6">
            <h3 className="text-xl md:text-2xl font-bold text-white uppercase italic tracking-tight">Physical Metrics</h3>
            <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Base Physiological Data</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {[
              { label: 'Age (Years)', name: 'age', type: 'number' },
              { label: 'Height (cm)', name: 'height', type: 'number' },
              { label: 'Weight (kg)', name: 'weight', type: 'number' }
            ].map(field => (
              <div key={field.name} className="space-y-3">
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Fitness Goals Section */}
        <div className="bg-[#111114] border border-white/5 rounded-[32px] p-6 md:p-10 space-y-8 shadow-xl">
          <div className="space-y-2 border-b border-white/5 pb-6">
            <h3 className="text-xl md:text-2xl font-bold text-white uppercase italic tracking-tight">Fitness Architecture</h3>
            <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Targets & Experience Level</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">Primary Objective</label>
              <select name="fitness_goal" onChange={handleChange} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer">
                <option value="" className="bg-[#111114]">Select Goal</option>
                <option value="Weight Loss" className="bg-[#111114]">Weight Loss</option>
                <option value="Muscle Gain" className="bg-[#111114]">Muscle Gain</option>
                <option value="Stay Fit" className="bg-[#111114]">Stay Fit</option>
                <option value="Endurance" className="bg-[#111114]">Endurance</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">Experience Level</label>
              <select name="fitness_level" onChange={handleChange} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer">
                <option value="" className="bg-[#111114]">Select Level</option>
                <option value="Beginner" className="bg-[#111114]">Beginner</option>
                <option value="Intermediate" className="bg-[#111114]">Intermediate</option>
                <option value="Advanced" className="bg-[#111114]">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lifestyle & Health Section */}
        <div className="bg-[#111114] border border-white/5 rounded-[32px] p-6 md:p-10 space-y-8 shadow-xl">
          <div className="space-y-2 border-b border-white/5 pb-6">
            <h3 className="text-xl md:text-2xl font-bold text-white uppercase italic tracking-tight">Lifestyle & Health</h3>
            <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Dietary & Environment Preferences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">Environment</label>
              <select name="workout_location" onChange={handleChange} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer">
                <option value="" className="bg-[#111114]">Select Location</option>
                <option value="Home" className="bg-[#111114]">Home</option>
                <option value="Gym" className="bg-[#111114]">Gym</option>
                <option value="Outdoor" className="bg-[#111114]">Outdoor</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">Dietary Preference</label>
              <select name="dietary_preference" onChange={handleChange} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer">
                <option value="Vegetarian" className="bg-[#111114]">Vegetarian</option>
                <option value="Non-Vegetarian" className="bg-[#111114]">Non-Vegetarian</option>
                <option value="Vegan" className="bg-[#111114]">Vegan</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">Allergies (Optional)</label>
              <textarea
                name="allergies"
                placeholder="e.g., Peanuts, Dairy..."
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 h-32 resize-none"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">Medical Conditions (Optional)</label>
              <textarea
                name="medical_conditions"
                placeholder="e.g., Asthma, Knee Pain..."
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 h-32 resize-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-6 bg-white text-black rounded-[24px] font-bold text-lg uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-50"
        >
          {loading ? "Initializing Intelligence..." : "Generate AI Plans ➔"}
        </button>
      </form>
    </div>
  );
}

export default HealthAssessment;