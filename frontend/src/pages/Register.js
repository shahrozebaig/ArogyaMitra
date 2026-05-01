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
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full -z-10"></div>
      <div className="w-full max-w-lg space-y-6 animate-fade-in">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
        </Link>
        <div className="glass-card p-8 md:p-10 space-y-8 relative">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg shadow-green-500/20">
              ✨
            </div>
            <h1 className="text-3xl font-black tracking-tight">Join ArogyaMitra!</h1>
            <p className="text-white/40 text-sm">Start your AI-powered fitness journey today</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-[10px]">👤</span> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-[10px]">✉️</span> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-[10px]">🔒</span> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                      onChange={handleChange}
                      required
                    />
                    <span 
                      className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer transition-colors ${showPassword ? 'text-green-400' : 'text-white/20 hover:text-white'}`}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️‍🗨️" : "👁️"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-[10px]">🔒</span> Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                      onChange={handleChange}
                      required
                    />
                    <span 
                      className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer transition-colors ${showConfirmPassword ? 'text-green-400' : 'text-white/20 hover:text-white'}`}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 pt-4">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>🚀</span> Create My Account
              </button>
              <p className="text-center text-sm text-white/40 pt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 font-bold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>


  );
}
export default Register;