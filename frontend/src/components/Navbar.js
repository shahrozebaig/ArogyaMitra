import useUserStore from "../store/userStore";
import { useNavigate, Link, useLocation } from "react-router-dom";
function Navbar() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const navLinks = [
    { name: "Dashboard", path: "/dashboard", id: "01" },
    { name: "Workouts", path: "/workouts", id: "02" },
    { name: "Nutrition", path: "/nutrition", id: "03" },
    { name: "Progress", path: "/progress", id: "04" },
    { name: "AI Coach", path: "/ai-coach", id: "05" },
  ];
  return (
    <div className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-2xl border-b border-white/5 px-6 md:px-10 py-5">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-12">
          <Link to="/dashboard" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black italic text-xl rounded-xl group-hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                A
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 border-2 border-[#0a0a0c] rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none group-hover:text-blue-500 transition-colors">
                Arogya<span className="text-white/40">Mitra</span>
              </h1>
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] leading-none mt-1">Core System v2.0</span>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group relative px-6 py-2 transition-all`}
                >
                  <div className="flex flex-col items-center">
                    <span className={`text-[8px] font-black uppercase tracking-[0.3em] mb-1 transition-colors ${isActive ? 'text-blue-500' : 'text-white/20 group-hover:text-white/40'}`}>
                      PRT-{link.id}
                    </span>
                    <span className={`text-xs font-black italic uppercase tracking-widest transition-all ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                      {link.name}
                    </span>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-[-1.25rem] left-0 w-full h-[2px] bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-4 group">
              <div className="text-right hidden md:block">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Operator</p>
                <p className="text-xs font-black italic uppercase text-white group-hover:text-blue-500 transition-colors">
                  {user?.name || "Neural Operator"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-all overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-[10px] font-black italic text-white/60 relative z-10">
                  {user?.name?.slice(0, 2).toUpperCase() || "JD"}
                </span>
              </div>
            </Link>
            <div className="h-8 w-[1px] bg-white/5"></div>
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-red-600/5 border border-red-600/20 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all">
                <svg className="w-4 h-4 text-red-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="hidden lg:block text-[9px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-red-500 transition-colors">Abort</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Navbar;