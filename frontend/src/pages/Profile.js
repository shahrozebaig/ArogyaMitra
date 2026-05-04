import { useState, useEffect } from "react";
import useUserStore from "../store/userStore";
import API from "../api/axios";
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
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Update failed. Please check your data.");
    }
  };
  const handleResetAccount = async () => {
    if (window.confirm("Are you sure you want to reset your account? All data will be cleared.")) {
      try {
        await API.post("/health/profile/update", {
          ...formData,
          age: 0,
          height: 0,
          weight: 0
        });
        await API.post("/health/reset");
        alert("Account reset successfully.");
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
        alert("Profile picture update feature coming soon.");
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="max-w-7xl mx-auto pb-24 px-6 md:px-10 space-y-12 animate-fade-in">
      <div className="pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            My <span className="text-purple-500">Account</span>
          </h1>
          <p className="text-sm text-white/40 font-medium">Manage your personal settings and health information.</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="bg-[#111114] border border-white/5 rounded-[32px] p-10 text-center space-y-8 shadow-sm relative overflow-hidden group">
            <div className="relative">
              <label className="cursor-pointer block relative mx-auto w-32 h-32 group/avatar">
                <div className="w-full h-full bg-purple-600 text-white rounded-[32px] flex items-center justify-center text-5xl font-bold transition-all duration-300 overflow-hidden relative shadow-lg">
                  {formData.name.charAt(0) || "U"}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-white">Change</span>
                  </div>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
              </label>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">{formData.name || "User Name"}</h2>
              <p className="text-xs font-medium text-white/30">{formData.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
              {[
                { label: 'Activities', val: '24' },
                { label: 'Consistency', val: '92%' }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-xl font-bold text-white">{stat.val}</p>
                  <p className="text-[10px] font-bold uppercase text-white/20 tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-8">
          <div className="bg-[#111114] border border-white/5 rounded-[32px] p-10 md:p-12 space-y-10 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Account Details</h3>
              <p className="text-xs font-medium text-white/30 tracking-wide uppercase tracking-[0.1em]">Personal Information</p>
            </div>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
              {[
                { label: 'Full Name', name: 'name', type: 'text' },
                { label: 'Email Address', name: 'email', type: 'email' },
                { label: 'Age', name: 'age', type: 'number' },
                { label: 'Gender', name: 'gender', type: 'text' },
                { label: 'Height (cm)', name: 'height', type: 'number' },
                { label: 'Weight (kg)', name: 'weight', type: 'number' }
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-[11px] font-bold text-white/20 uppercase tracking-widest pl-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.04] transition-all"
                    placeholder={field.label}
                  />
                </div>
              ))}
            </div>
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleUpdateProfile}
                className="flex-1 bg-white text-black py-4 rounded-xl text-sm font-bold hover:bg-purple-500 hover:text-white transition-all shadow-md"
              >
                Save Changes
              </button>
              <button
                onClick={handleResetAccount}
                className="px-8 py-4 bg-red-600/5 border border-red-600/10 text-red-500 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all"
              >
                Reset Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;