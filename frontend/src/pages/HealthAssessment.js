import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function HealthAssessment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: "",
    height: "",
    weight: "",
    fitness_goal: "",
    fitness_level: "",
    workout_location: "",
    workout_time: "",
    allergies: "",
    medical_conditions: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/health/assessment", form);
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to submit assessment");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-in pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
          <span className="text-red-500">❤️</span> Health Assessment
        </h1>
        <p className="text-white/40">Complete this assessment to get your AI-powered personalized plans!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Physical Metrics */}
        <div className="glass-card p-8 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
             <span className="text-blue-400">📏</span> Physical Metrics
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Age</label>
              <input name="age" type="number" placeholder="e.g., 25" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Height (cm)</label>
              <input name="height" type="number" placeholder="e.g., 175" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Weight (kg)</label>
              <input name="weight" type="number" placeholder="e.g., 70" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50" required />
            </div>
          </div>
        </div>

        {/* Fitness Goals */}
        <div className="glass-card p-8 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
             <span className="text-green-400">🎯</span> Fitness Goals
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Fitness Goal</label>
              <select name="fitness_goal" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 text-white/60" required>
                <option value="">Select Goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Stay Fit">Stay Fit</option>
                <option value="Endurance">Endurance</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Current Fitness Level</label>
              <select name="fitness_level" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 text-white/60" required>
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lifestyle & Health */}
        <div className="glass-card p-8 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
             <span className="text-yellow-400">🥗</span> Lifestyle & Health
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Workout Location</label>
              <select name="workout_location" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 text-white/60" required>
                <option value="">Select Location</option>
                <option value="Home">Home</option>
                <option value="Gym">Gym</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Preferred Workout Time</label>
              <select name="workout_time" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 text-white/60" required>
                <option value="">Select Time</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 pt-4">
             <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Allergies</label>
              <textarea name="allergies" placeholder="e.g., Peanuts, Dairy (Optional)" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 text-sm h-24" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Medical Conditions</label>
              <textarea name="medical_conditions" placeholder="e.g., Asthma, Back Pain (Optional)" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 text-sm h-24" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-black text-xl hover:shadow-2xl hover:shadow-purple-600/30 active:scale-[0.98] transition-all"
        >
          Generate My AI Plan 🚀
        </button>
      </form>
    </div>
  );
}

export default HealthAssessment;