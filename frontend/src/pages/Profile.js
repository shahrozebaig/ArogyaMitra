import { useState, useEffect } from "react";
import { User as UserIcon } from "lucide-react";
import useUserStore from "../store/userStore";
import API from "../api/axios";
import "./Profile.css";
function Profile() {
  const user = useUserStore((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "Male",
    height: "",
    weight: ""
  });
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/health/profile");
        if (res.data) {
          setFormData({
            name: user?.name || "",
            email: user?.email || "",
            age: String(res.data.age) || "",
            gender: res.data.gender || "Male",
            height: String(res.data.height) || "",
            weight: String(res.data.weight) || ""
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, [user]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleUpdateProfile = async () => {
    try {
      await API.post("/health/profile/update", {
        age: parseInt(formData.age) || 0,
        height: parseFloat(formData.height) || 0,
        weight: parseFloat(formData.weight) || 0,
        gender: formData.gender,
        fitness_goal: user?.fitness_goal || "Stay Fit",
        fitness_level: user?.fitness_level || "Beginner",
        workout_location: user?.workout_location || "Home",
        workout_time: user?.workout_time || "Morning"
      });
      alert("Profile updated successfully! ✨");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Update failed. Please check your data.");
    }
  };
  const handleResetAccount = async () => {
    if (window.confirm("Are you sure you want to reset your account? All progress will be cleared.")) {
      try {
        await API.post("/health/reset");
        alert("Account reset successfully.");
        window.location.href = "/health";
      } catch (err) {
        console.error("Reset failed:", err);
      }
    }
  };
  return (
    <div className="pr-root">
      <div className="pr-header">
        <div>
          <h1 className="pr-title"><UserIcon className="pr-icon" size={32} /> My <span className="pr-title-green">Account</span></h1>
          <p className="pr-subtitle">Manage your personal settings and health profile.</p>
        </div>
      </div>
      <div className="pr-grid">
        <div className="pr-card-profile">
          <div className="pr-avatar-wrap">
            <div className="pr-avatar">
              {formData.name.charAt(0) || "U"}
            </div>
          </div>
          <div className="pr-info-wrap">
            <h2 className="pr-name">{formData.name || "User Name"}</h2>
            <p className="pr-email">{formData.email}</p>
          </div>
        </div>
        <div className="pr-card-form">
          <h3 className="pr-form-section-title">Identity Details</h3>
          <div className="pr-inputs-grid">
            <div className="pr-input-group">
              <label className="pr-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="pr-input"
                placeholder="Your Name"
              />
            </div>
            <div className="pr-input-group">
              <label className="pr-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="pr-input"
                disabled
                title="Email cannot be changed"
              />
            </div>
            <div className="pr-input-group">
              <label className="pr-label">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="pr-input"
                placeholder="e.g. 25"
              />
            </div>
            <div className="pr-input-group">
              <label className="pr-label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="pr-input"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="pr-input-group">
              <label className="pr-label">Height (CM)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="pr-input"
                placeholder="e.g. 175"
              />
            </div>
            <div className="pr-input-group">
              <label className="pr-label">Weight (KG)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="pr-input"
                placeholder="e.g. 70"
              />
            </div>
          </div>
          <div className="pr-actions">
            <button onClick={handleUpdateProfile} className="pr-save-btn">
              Save Changes ➔
            </button>
            <button onClick={handleResetAccount} className="pr-reset-btn">
              Reset Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
export default Profile;