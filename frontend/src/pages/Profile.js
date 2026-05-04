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
    <div className="max-w-7xl mx-auto pb-24 px-4 md:px-8 space-y-12 animate-fade-in">
      {/* Responsive Header */}
      <div className="pt-8 md:pt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase italic">
            My <span className="text-purple-500">Account</span>
          </h1>
          <p className="text-sm md:text-base text-white/40 font-medium">Managing your personal configuration and metabolic data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Profile Card: Responsive Scaling */}
        <div className="lg:col-span-4">
          <div className="bg-[#111114] border border-white/5 rounded-[40px] p-8 md:p-10 text-center space-y-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-purple-500/[0.02] blur-[80px] rounded-full"></div>
            
            <div className="relative">
              <label className="cursor-pointer block relative mx-auto w-32 h-32 group/avatar">
                <div className="w-full h-full bg-purple-600 text-white rounded-[32px] flex items-center justify-center text-5xl font-bold italic transition-all duration-500 overflow-hidden relative shadow-2xl">
                  {formData.name.charAt(0) || "U"}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <span className="text-xs font-black uppercase tracking-widest text-white">Modify</span>
                  </div>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
              </label>
            </div>

            <div className="space-y-2 relative z-10">
              <h2 className="text-2xl font-bold text-white uppercase italic tracking-tight">{formData.name || "User Name"}</h2>
              <p className="text-sm font-bold text-white/20 uppercase tracking-widest">{formData.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-10 border-t border-white/5 relative z-10">
              {[
                { label: 'Completed', val: '24' },
                { label: 'Efficiency', val: '92%' }
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-2xl font-bold text-white italic tracking-tighter">{stat.val}</p>
                  <p className="text-[10px] font-black uppercase text-white/10 tracking-[0.3em]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details Form: Responsive Columns */}
        <div className="lg:col-span-8">
          <div className="bg-[#111114] border border-white/5 rounded-[40px] p-8 md:p-12 space-y-12 shadow-2xl">
            <div className="space-y-2 border-b border-white/5 pb-8">
              <h3 className="text-xl md:text-2xl font-bold text-white uppercase italic tracking-tight">Identity Details</h3>
              <p className="text-xs font-bold text-white/20 uppercase tracking-[0.4em]">Personal Information Mapping</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
              {[
                { label: 'Full Identity', name: 'name', type: 'text' },
                { label: 'Neural Mail', name: 'email', type: 'email' },
                { label: 'Chronological Age', name: 'age', type: 'number' },
                { label: 'Biological Gender', name: 'gender', type: 'text' },
                { label: 'Height (CM)', name: 'height', type: 'number' },
                { label: 'Weight (KG)', name: 'weight', type: 'number' }
              ].map((field) => (
                <div key={field.name} className="space-y-3">
                  <label className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] pl-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                    placeholder={field.label}
                  />
                </div>
              ))}
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-6">
              <button
                onClick={handleUpdateProfile}
                className="flex-1 bg-white text-black py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-2xl active:scale-95"
              >
                Sync Data ➔
              </button>
              <button
                onClick={handleResetAccount}
                className="px-10 py-5 bg-red-600/5 border border-red-600/10 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95"
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