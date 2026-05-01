import { useState, useEffect } from "react";
import useUserStore from "../store/userStore";
import API from "../api/axios";
function Profile() {
  const user = useUserStore((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
            name: user?.name || "Aragonda Srinivas",
            email: user?.email || "abcd@gmail.com",
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
        ...formData,
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        fitness_goal: user?.fitness_goal || "Stay Fit",
        fitness_level: user?.fitness_level || "Beginner",
        workout_location: user?.workout_location || "Home",
        workout_time: user?.workout_time || "Morning"
      });
      alert("Profile updated successfully! ✨");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Update failed. Please check your inputs.");
    }
  };
  const handleResetAccount = async () => {
    if (window.confirm("⚠️ Reset metrics? This will clear your Age, Gender, Height, and Weight, and let you restart your assessment.")) {
      try {
        await API.post("/health/profile/update", {
          ...formData,
          age: 0,
          gender: "Male",
          height: 0,
          weight: 0,
          fitness_goal: "Stay Fit",
          fitness_level: "Beginner"
        });
        await API.post("/health/reset");

        alert("Metrics reset successfully. Redirecting to assessment...");
        window.location.href = "/health";
      } catch (err) {
        console.error("Reset failed:", err);
      }
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        alert("Picture selected! (Upload logic can be connected here)");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">

      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <span className="text-purple-500">👤</span> My Profile
          </h1>
          <p className="text-white/40">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 text-center space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-600/10 blur-[60px] rounded-full -z-10"></div>
            <div className="relative">
              <label className="cursor-pointer block relative group/avatar">
                <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-purple-600/20 group-hover:scale-105 transition-transform overflow-hidden">
                  {formData.name.charAt(0)}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-sm font-bold">
                    Change 📷
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                />
              </label>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{formData.name}</h2>
              <p className="text-sm text-white/40">{formData.email}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
              <div className="space-y-1">
                <p className="text-xl font-black">24</p>
                <p className="text-[8px] uppercase font-bold text-white/20 tracking-widest">Workouts</p>
              </div>
              <div className="space-y-1 border-x border-white/5">
                <p className="text-xl font-black">18</p>
                <p className="text-[8px] uppercase font-bold text-white/20 tracking-widest">Active Days</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-black">3kg</p>
                <p className="text-[8px] uppercase font-bold text-white/20 tracking-widest">Lost</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-8 md:p-10 space-y-8">
            <div className="space-y-2 border-b border-white/5 pb-6">
              <h3 className="text-xl font-bold">Personal Information</h3>
              <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Update your basic details</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Age</label>
                <input
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Gender</label>
                <input
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="e.g., Male"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Height (cm)</label>
                <input
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
              <div className="space-y-1 md:col-span-1">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Weight (kg)</label>
                <input
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
            </div>
            <div className="pt-8 flex flex-col md:flex-row gap-4">
              <button onClick={handleUpdateProfile} className="flex-1 btn-primary py-4 rounded-2xl font-bold">Save Changes</button>
              <button
                onClick={handleResetAccount}
                className="flex-1 px-8 py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-bold hover:bg-red-500/20 transition-all"
              >
                Reset All Data & Plans 🔄
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;