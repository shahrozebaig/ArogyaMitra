import { LayoutDashboard, Dumbbell, Utensils, LineChart, Bot, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import useUserStore from "../store/userStore";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Navbar.css";
function Navbar() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const profileImage = useUserStore((state) => state.profileImage);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Workouts", path: "/workouts", icon: <Dumbbell size={18} /> },
    { name: "Nutrition", path: "/nutrition", icon: <Utensils size={18} /> },
    { name: "Progress", path: "/progress", icon: <LineChart size={18} /> },
    { name: "AI Coach", path: "/ai-coach", icon: <Bot size={18} /> },
  ];
  return (
    <div className="nb-root">
      <div className="nb-inner">
        <div className="nb-left">
          <button className="nb-mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/dashboard" className="nb-logo">
            <img src="/Logo.png" alt="ArogyaMitra" className="nb-logo-img" />
            <div>
              <div className="nb-logo-name">ArogyaMitra</div>
              <div className="nb-logo-sub">Your AI Health Companion</div>
            </div>
          </Link>
        </div>
        <nav className={`nb-links ${isMenuOpen ? 'nb-links-mobile-open' : ''}`}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nb-link ${isActive ? "nb-link-active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
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
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="nb-avatar-img" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user?.name?.slice(0, 2).toUpperCase() || "AM"
              )}
            </div>
            <span className="nb-username">{user?.name?.split(" ")[0] || "User"}</span>
          </Link>
          <div className="nb-divider" />
          <button className="nb-logout" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
            <span className="nb-logout-text">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default Navbar;