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
    <div className="min-h-screen bg-[#050507] flex overflow-hidden">
      {/* Left Panel: Desktop Only */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-20 bg-[#0f0f12] border-r border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050507]/60 to-[#050507]"></div>
        
        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl italic shadow-2xl">A</div>
          <span className="text-2xl font-black italic tracking-tighter uppercase text-white">ArogyaMitra</span>
        </Link>
        
        <div className="relative z-10 space-y-8">
          <h2 className="text-7xl xl:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">
            Scientific <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Excellence</span>
          </h2>
          <p className="text-white/30 max-w-sm text-lg font-medium leading-relaxed italic">
            Synchronize your biological data with our advanced neural performance architect.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-10 text-xs font-black uppercase tracking-[0.4em] text-white/10">
          <span>Precision</span>
          <span>Metabolism</span>
          <span>Evolution</span>
        </div>
      </div>

      {/* Right Panel: Responsive Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="w-full max-w-md space-y-12 relative z-10">
          <div className="space-y-3 text-center lg:text-left">
            {/* Mobile Logo */}
            <div className="flex lg:hidden justify-center mb-8">
              <div className="w-16 h-16 bg-white text-black rounded-[24px] flex items-center justify-center font-black text-3xl italic shadow-2xl">A</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight italic uppercase text-white">Access Portal</h1>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Initialize session synchronization.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3 group">
                <label className="text-xs font-black text-white/20 uppercase tracking-[0.3em] group-focus-within:text-purple-500 transition-colors pl-1">Identity Identifier</label>
                <input
                  type="email"
                  placeholder="Neural Mail"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-[20px] px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-3 group">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-white/20 uppercase tracking-[0.3em] group-focus-within:text-purple-500 transition-colors">Access Key</label>
                  <button type="button" className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em] hover:text-white transition-colors">Recover</button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Secret Key"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-[20px] px-6 py-4 text-base font-bold text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Secure" : "Reveal"}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-6 bg-white text-black font-black uppercase italic tracking-[0.2em] text-xs rounded-[20px] hover:bg-purple-600 hover:text-white transition-all shadow-2xl active:scale-95"
            >
              Initialize Access ➔
            </button>
          </form>

          <p className="text-center text-xs font-bold text-white/20 uppercase tracking-[0.3em]">
            New Prospect?{" "}
            <Link to="/register" className="text-white hover:text-purple-400 transition-colors decoration-1 underline-offset-4 underline">
              Begin Selection
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;