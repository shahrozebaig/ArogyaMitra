import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import useUserStore from "../store/userStore";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("user");
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      setUser(res.data.user);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };
  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full -z-10"></div>
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
        </Link>
        <div className="glass-card p-8 md:p-10 space-y-10 relative">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
              ✨
            </div>
            <h1 className="text-3xl font-black tracking-tight">Welcome Back!</h1>
            <p className="text-white/40 text-sm">Continue your fitness journey with ArogyaMitra</p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setLoginType("user")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${loginType === 'user' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              <span>👤</span> User Login
            </button>
            <button
              onClick={() => setLoginType("admin")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${loginType === 'admin' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              <span>🛡️</span> Admin Login
            </button>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Username</label>
                <input
                  type="email"
                  placeholder="aragondas3@gmail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/20"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Password</label>
                  <button type="button" className="text-[10px] text-purple-400 font-bold hover:underline">Forgot?</button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 cursor-pointer hover:text-white transition-colors">👁️</span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>➔</span> Sign In
            </button>
          </form>
          <p className="text-center text-sm text-white/40">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-400 font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;