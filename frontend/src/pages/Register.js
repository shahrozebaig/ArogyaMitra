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
    <div className="min-h-screen bg-[#0a0a0c] flex overflow-hidden">
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 bg-[#111114] border-r border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0c]/50 to-[#0a0a0c]"></div>
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center font-black text-xl italic shadow-2xl">A</div>
          <span className="text-2xl font-black italic tracking-tighter uppercase">ArogyaMitra</span>
        </Link>
        <div className="relative z-10 space-y-6">
          <h2 className="text-7xl font-black uppercase italic tracking-tighter leading-[0.85]">
            Start Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Selection</span>
          </h2>
          <p className="text-white/40 max-w-sm text-lg font-medium leading-relaxed">
            Join the elite circle of individuals architecting their future selves through neural fitness.
          </p>
        </div>
        <div className="relative z-10 flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
          <span>Optimization</span>
          <span>Discipline</span>
          <span>Results</span>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full"></div>
        <div className="w-full max-w-sm space-y-10 relative z-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight italic uppercase">Enroll Prospect</h1>
            <p className="text-white/40 font-medium">Initialize your performance profile.</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1 group">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] group-focus-within:text-purple-500 transition-colors">Candidate Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Legal Name"
                  className="w-full bg-[#16161a] border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1 group">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] group-focus-within:text-purple-500 transition-colors">Digital Identity</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Primary Email"
                  className="w-full bg-[#16161a] border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 group relative">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] group-focus-within:text-purple-500 transition-colors">Access Key</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create Key"
                    className="w-full bg-[#16161a] border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10"
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-4 bottom-4 text-[9px] font-black text-white/20 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "SECURE" : "VIEW"}
                  </button>
                </div>
                <div className="space-y-1 group relative">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] group-focus-within:text-purple-500 transition-colors">Verify Key</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Verify Key"
                    className="w-full bg-[#16161a] border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10"
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-4 bottom-4 text-[9px] font-black text-white/20 hover:text-white transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "SECURE" : "VIEW"}
                  </button>
                </div>
              </div>

            </div>
            <button
              type="submit"
              className="w-full py-6 bg-white text-black font-black uppercase italic tracking-widest text-sm rounded-2xl hover:bg-purple-500 hover:text-white transition-all active:scale-[0.98] shadow-2xl shadow-white/5 mt-4"
            >
              Initialize Profile ➔
            </button>
          </form>
          <p className="text-center text-xs font-bold text-white/20 uppercase tracking-widest">
            Existing Member?{" "}
            <Link to="/login" className="text-white hover:text-purple-400 transition-colors">
              Access Vault
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Register;