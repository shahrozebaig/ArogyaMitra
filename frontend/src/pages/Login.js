import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import useUserStore from "../store/userStore";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-[#0a0a0c] flex overflow-hidden">
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 bg-[#111114] border-r border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0c]/50 to-[#0a0a0c]"></div>
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center font-black text-xl italic shadow-2xl">A</div>
          <span className="text-2xl font-black italic tracking-tighter uppercase">ArogyaMitra</span>
        </Link>
        <div className="relative z-10 space-y-6">
          <h2 className="text-7xl font-black uppercase italic tracking-tighter leading-[0.85]">
            Relentless <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Progress</span>
          </h2>
          <p className="text-white/40 max-w-sm text-lg font-medium leading-relaxed">
            The world's most advanced neural performance architect. Your evolution starts here.
          </p>
        </div>
        <div className="relative z-10 flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
          <span>Performance</span>
          <span>Recovery</span>
          <span>Evolution</span>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full"></div>
        <div className="w-full max-w-sm space-y-10 relative z-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight italic uppercase">Access Profile</h1>
            <p className="text-white/40 font-medium">Identify yourself to continue evolution.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] group-focus-within:text-purple-500 transition-colors">Identity Identifier</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-[#16161a] border border-white/5 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 group">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] group-focus-within:text-purple-500 transition-colors">Access Key</label>
                  <button type="button" className="text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">Recover Key</button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Secret Key"
                    className="w-full bg-[#16161a] border border-white/5 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "SECURE" : "VIEW"}
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-6 bg-white text-black font-black uppercase italic tracking-widest text-sm rounded-2xl hover:bg-purple-500 hover:text-white transition-all active:scale-[0.98] shadow-2xl shadow-white/5"
            >
              Initialize Access ➔
            </button>
          </form>
          <p className="text-center text-xs font-bold text-white/20 uppercase tracking-widest">
            New Prospect?{" "}
            <Link to="/register" className="text-white hover:text-purple-400 transition-colors">
              Begin Selection
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;