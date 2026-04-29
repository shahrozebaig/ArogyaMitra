import { useState } from "react";
import useUserStore from "../store/userStore";

function Profile() {
  const user = useUserStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("Profile");

  const [formData, setFormData] = useState({
    name: user?.name || "Aragonda Srinivas",
    email: user?.email || "abcd@gmail.com",
    phone: "",
    age: "22",
    gender: "Male",
    height: "170",
    weight: "80"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <button className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all">
          <span>📝</span> Edit Profile
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-card p-8 text-center space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-600/10 blur-[60px] rounded-full -z-10"></div>
              
              <div className="relative">
                 <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-purple-600/20 group-hover:scale-105 transition-transform">
                    {formData.name.charAt(0)}
                 </div>
                 <button className="absolute bottom-0 right-1/2 translate-x-10 w-8 h-8 bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-xs backdrop-blur-xl hover:bg-white/20 transition-all">
                    📷
                 </button>
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

           <div className="glass-card p-4 space-y-2">
              {["Profile", "Settings", "Notifications", "Privacy"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-left transition-all flex items-center justify-between group ${
                    activeTab === tab
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {tab === 'Profile' && '👤'}
                    {tab === 'Settings' && '⚙️'}
                    {tab === 'Notifications' && '🔔'}
                    {tab === 'Privacy' && '🛡️'}
                    {tab}
                  </span>
                  <span className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === tab ? 'opacity-100' : ''}`}>→</span>
                </button>
              ))}
           </div>
        </div>

        {/* Settings Content */}
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
                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Phone</label>
                    <input 
                      name="phone" 
                      placeholder="Enter phone number" 
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
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all text-white/60"
                    >
                       <option value="Male">Male</option>
                       <option value="Female">Female</option>
                       <option value="Other">Other</option>
                    </select>
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

              <div className="pt-8 flex gap-4">
                 <button className="flex-1 btn-primary py-4 rounded-2xl font-bold">Save Changes</button>
                 <button className="px-8 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all">Cancel</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;