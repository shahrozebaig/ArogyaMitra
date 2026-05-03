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
            name: user?.name || "Neural Operator",
            email: user?.email || "operator@arogyamitra.sys",
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
      alert("System Identity Synchronized! ✨");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Update failed. Please verify biometrics.");
    }
  };
  const handleResetAccount = async () => {
    if (window.confirm("⚠️ SYSTEM RESET: This will wipe all biometric data and protocols. Proceed?")) {
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
        alert("System state cleared. Initiating recalibration...");
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
        alert("Visual identifier selected. Uplink logic pending.");
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="max-w-7xl mx-auto pb-24 px-6 md:px-8 space-y-12 animate-fade-in">
      <div className="pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              Operator <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Identity</span>
            </h1>
          </div>
          <p className="text-xs font-bold text-white/20 uppercase tracking-[0.4em] pl-6 italic">
            System Authorization: <span className="text-white">Granted</span> {" // "} Access Level: <span className="text-white">Admin</span>
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#111114] border border-white/5 rounded-[40px] p-10 text-center space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/5 blur-[60px] rounded-full -z-10 group-hover:bg-white/10 transition-all duration-700"></div>
            <div className="relative">
              <label className="cursor-pointer block relative mx-auto w-32 h-32 group/avatar">
                <div className="w-full h-full bg-white text-black rounded-[32px] flex items-center justify-center text-5xl font-black italic shadow-2xl shadow-white/5 group-hover/avatar:scale-105 transition-all duration-500 overflow-hidden relative">
                  {formData.name.charAt(0)}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Modify</span>
                    <span className="text-xl">📷</span>
                  </div>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
              </label>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{formData.name}</h2>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{formData.email}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
              {[
                { label: 'Workouts', val: '24' },
                { label: 'Cycles', val: '18' },
                { label: 'Delta', val: '3kg' }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-2xl font-black italic tracking-tighter">{stat.val}</p>
                  <p className="text-[8px] font-black uppercase text-white/20 tracking-widest leading-none">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-8">
          <div className="bg-[#111114] border border-white/5 rounded-[40px] p-10 md:p-12 space-y-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 text-9xl opacity-[0.02] font-black italic pointer-events-none">REGISTRY</div>
            <div className="space-y-2 border-b border-white/5 pb-8 relative z-10">
              <h3 className="text-2xl font-black italic uppercase tracking-tight leading-none">Biometric Registry</h3>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">System parameters and physical identifiers</p>
            </div>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
              {[
                { label: 'Full Designation', name: 'name', type: 'text' },
                { label: 'Communication Uplink', name: 'email', type: 'email' },
                { label: 'Chrono Age', name: 'age', type: 'number' },
                { label: 'Neural Gender', name: 'gender', type: 'text' },
                { label: 'Verticality (cm)', name: 'height', type: 'number' },
                { label: 'Mass Index (kg)', name: 'weight', type: 'number' }
              ].map((field) => (
                <div key={field.name} className="space-y-3 group/field">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] pl-1 transition-colors group-focus-within/field:text-white">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold italic uppercase tracking-tight focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
            <div className="pt-8 flex flex-col sm:flex-row gap-6 relative z-10">
              <button
                onClick={handleUpdateProfile}
                className="flex-1 bg-white text-black py-6 rounded-[24px] text-sm font-black uppercase italic tracking-[0.2em] hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-white/5"
              >
                Synchronize Identity ➔
              </button>
              <button
                onClick={handleResetAccount}
                className="px-10 py-6 bg-red-600/5 border border-red-600/10 text-red-500 rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95"
              >
                System Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;