import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await API.post("/auth/register", formData);
      alert("Account created successfully!");
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex overflow-hidden">
      {/* Left Panel: Desktop Only */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-20 bg-[#0f0f12] border-r border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050507]/60 to-[#050507]"></div>
        
        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl italic shadow-2xl">A</div>
          <span className="text-2xl font-black italic tracking-tighter uppercase text-white">ArogyaMitra</span>
        </Link>
        
        <div className="relative z-10 space-y-8">
          <h2 className="text-7xl xl:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">
            Begin Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Evolution</span>
          </h2>
          <p className="text-white/30 max-w-sm text-lg font-medium leading-relaxed italic">
            Join the elite circle architecting their biological future through precision intelligence.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-10 text-xs font-black uppercase tracking-[0.4em] text-white/10">
          <span>Discipline</span>
          <span>Optimization</span>
          <span>Legacy</span>
        </div>
      </div>

      {/* Right Panel: Responsive Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="w-full max-w-md space-y-12 relative z-10 py-12 md:py-0">
          <div className="space-y-3 text-center lg:text-left">
            {/* Mobile Logo */}
            <div className="flex lg:hidden justify-center mb-8">
              <div className="w-16 h-16 bg-white text-black rounded-[24px] flex items-center justify-center font-black text-3xl italic shadow-2xl">A</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight italic uppercase text-white">Enroll Profile</h1>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Initialize candidate registration.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-3 group">
                <label className="text-xs font-black text-white/20 uppercase tracking-[0.3em] group-focus-within:text-purple-500 transition-colors pl-1">Candidate Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Legal Name"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-[20px] px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-3 group">
                <label className="text-xs font-black text-white/20 uppercase tracking-[0.3em] group-focus-within:text-purple-500 transition-colors pl-1">Digital Identity</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Primary Email"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-[20px] px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10"
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3 group relative">
                  <label className="text-xs font-black text-white/20 uppercase tracking-[0.3em] group-focus-within:text-purple-500 transition-colors pl-1">Access Key</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create Key"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-[20px] px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10"
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-6 bottom-4 text-[10px] font-black text-white/20 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="space-y-3 group relative">
                  <label className="text-xs font-black text-white/20 uppercase tracking-[0.3em] group-focus-within:text-purple-500 transition-colors pl-1">Verify Key</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Verify Key"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-[20px] px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10"
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-6 bottom-4 text-[10px] font-black text-white/20 hover:text-white transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-6 bg-white text-black font-black uppercase italic tracking-[0.2em] text-xs rounded-[20px] hover:bg-purple-600 hover:text-white transition-all shadow-2xl active:scale-95"
            >
              Initialize Profile ➔
            </button>
          </form>

          <p className="text-center text-xs font-bold text-white/20 uppercase tracking-[0.3em]">
            Existing Member?{" "}
            <Link to="/login" className="text-white hover:text-purple-400 transition-colors decoration-1 underline-offset-4 underline">
              Access Vault
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;