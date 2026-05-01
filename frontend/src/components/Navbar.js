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
    <div className="sticky top-0 z-50 flex justify-between items-center bg-[#0f111a]/80 backdrop-blur-xl px-8 py-4 border-b border-white/5">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-all">
            <span className="text-lg font-bold">A</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            ArogyaMitra
          </h1>
        </Link>
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/profile" className="flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 flex items-center justify-center text-[10px] font-bold text-black group-hover:scale-110 transition-transform">
            {user?.name?.slice(0, 2).toUpperCase() || "JD"}
          </div>
          <span className="text-sm font-medium hidden md:block">{user?.name || "User"}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="text-xs text-white/40 hover:text-red-400 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
export default Navbar;