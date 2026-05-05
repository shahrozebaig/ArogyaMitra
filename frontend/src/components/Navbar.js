import useUserStore from "../store/userStore";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Navbar.css";
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
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Workouts", path: "/workouts", icon: "💪" },
    { name: "Nutrition", path: "/nutrition", icon: "🥗" },
    { name: "Progress", path: "/progress", icon: "📈" },
    { name: "AI Coach", path: "/ai-coach", icon: "🤖" },
  ];
  return (
    <div className="nb-root">
      <div className="nb-inner">
        <Link to="/dashboard" className="nb-logo">
          <img src="/Logo.png" alt="ArogyaMitra" className="nb-logo-img" />
          <div>
            <div className="nb-logo-name">ArogyaMitra</div>
            <div className="nb-logo-sub">Your AI Health Companion</div>
          </div>
        </Link>
        <nav className="nb-links">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nb-link ${isActive ? "nb-link-active" : ""}`}
              >
                <span className="nb-link-icon">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="nb-right">
          <Link to="/profile" className="nb-profile">
            <div className="nb-avatar">
              {user?.name?.slice(0, 2).toUpperCase() || "AM"}
            </div>
            <span className="nb-username">{user?.name?.split(" ")[0] || "User"}</span>
          </Link>
          <div className="nb-divider" />
          <button className="nb-logout" onClick={handleLogout} title="Logout">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
export default Navbar;