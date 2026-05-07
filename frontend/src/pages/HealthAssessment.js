import { Activity, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import useToastStore from "../store/toastStore";
import "./HealthAssessment.css";
function HealthAssessment() {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
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
      addToast("Successfully generated AI plans!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to generate plans:", err);
      addToast("Assessment saved, but plan generation failed.", "error");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="ha-root">
      <div className="ha-header">
        <h1 className="ha-title"><Activity className="ha-icon" size={32} /> Health <span className="ha-title-green">Assessment</span></h1>
        <p className="ha-subtitle">Let's build your personalized AI training and nutrition architecture.</p>
      </div>
      <form onSubmit={handleSubmit} className="ha-form">
        <div className="ha-card">
          <div className="ha-card-title-row">
            <h3 className="ha-card-title">Physical Metrics</h3>
            <p className="ha-card-subtitle">Basic physiological data</p>
          </div>
          <div className="ha-inputs-grid">
            <div className="ha-input-group">
              <label className="ha-label">Age (Years)</label>
              <input name="age" type="number" onChange={handleChange} required className="ha-input" placeholder="e.g. 25" />
            </div>
            <div className="ha-input-group">
              <label className="ha-label">Height (CM)</label>
              <input name="height" type="number" onChange={handleChange} required className="ha-input" placeholder="e.g. 175" />
            </div>
            <div className="ha-input-group">
              <label className="ha-label">Weight (KG)</label>
              <input name="weight" type="number" onChange={handleChange} required className="ha-input" placeholder="e.g. 70" />
            </div>
          </div>
        </div>
        <div className="ha-card">
          <div className="ha-card-title-row">
            <h3 className="ha-card-title">Fitness Architecture</h3>
            <p className="ha-card-subtitle">Goals & Experience level</p>
          </div>
          <div className="ha-inputs-grid">
            <div className="ha-input-group">
              <label className="ha-label">Primary Goal</label>
              <select name="fitness_goal" onChange={handleChange} required className="ha-select">
                <option value="">Select Goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Stay Fit">Stay Fit</option>
              </select>
            </div>
            <div className="ha-input-group">
              <label className="ha-label">Experience Level</label>
              <select name="fitness_level" onChange={handleChange} required className="ha-select">
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
        <div className="ha-card">
          <div className="ha-card-title-row">
            <h3 className="ha-card-title">Lifestyle & Health</h3>
            <p className="ha-card-subtitle">Preferences & Conditions</p>
          </div>
          <div className="ha-inputs-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="ha-input-group">
              <label className="ha-label">Workout Environment</label>
              <select name="workout_location" onChange={handleChange} required className="ha-select">
                <option value="">Select Location</option>
                <option value="Home">Home</option>
                <option value="Gym">Gym</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>
            <div className="ha-input-group">
              <label className="ha-label">Dietary Preference</label>
              <select name="dietary_preference" onChange={handleChange} required className="ha-select">
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>
          </div>
          <div className="ha-inputs-grid">
            <div className="ha-input-group">
              <label className="ha-label">Allergies (Optional)</label>
              <textarea name="allergies" onChange={handleChange} className="ha-textarea" placeholder="e.g. Peanuts, Dairy..." />
            </div>
            <div className="ha-input-group">
              <label className="ha-label">Medical Conditions (Optional)</label>
              <textarea name="medical_conditions" onChange={handleChange} className="ha-textarea" placeholder="e.g. Asthma, Knee pain..." />
            </div>
          </div>
        </div>
        <button type="submit" disabled={loading} className="ha-submit-btn">
          {loading ? "Generating Your AI Plans..." : <><Sparkles size={18} /> Generate AI Plans</>}
        </button>

      </form>
    </div>
  );
}
export default HealthAssessment;