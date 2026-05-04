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
    { name: "Dashboard", path: "/dashboard" },
    { name: "Workouts", path: "/workouts" },
    { name: "Nutrition", path: "/nutrition" },
    { name: "Progress", path: "/progress" },
    { name: "AI Coach", path: "/ai-coach" },
  ];
  return (
    <div className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-10 py-4">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-purple-600 text-white flex items-center justify-center font-bold text-lg rounded-xl transition-all">
              A
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors">
              Arogya<span className="text-white/40">Mitra</span>
            </h1>
          </Link>
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/profile" className="flex items-center gap-3 group">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                {user?.name || "User"}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 transition-all overflow-hidden">
              <span className="text-xs font-bold text-white/60">
                {user?.name?.slice(0, 2).toUpperCase() || "AM"}
              </span>
            </div>
          </Link>
          <div className="h-6 w-[1px] bg-white/10"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/40 hover:text-red-500 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-red-500/10 group-hover:border-red-500/20 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
export default Navbar;