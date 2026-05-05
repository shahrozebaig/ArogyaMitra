import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import useUserStore from "../store/userStore";
import "./AuthPages.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      setUser(res.data.user);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-left-blob auth-left-blob-1" />
        <div className="auth-left-blob auth-left-blob-2" />
        <Link to="/" className="auth-left-logo">
          <img src="/Logo.png" alt="ArogyaMitra" className="auth-left-logo-img" style={{ background: '#fff', borderRadius: 12, padding: 4 }} />
          <div>
            <div className="auth-left-logo-name">ArogyaMitra</div>
            <div className="auth-left-logo-sub">Your AI Health Companion</div>
          </div>
        </Link>
        <div className="auth-left-content">
          <h2 className="auth-left-title">
            Your Health Journey<br />
            <span className="auth-left-title-green">Starts Here.</span>
          </h2>
          <p className="auth-left-desc">
            AI-driven workout planning, nutrition guidance and real-time health coaching — all in one intelligent platform.
          </p>
        </div>
        <div className="auth-left-footer">
          <div className="auth-feature-pill">🏋️ AI Workout Plans</div>
          <div className="auth-feature-pill">🥗 Smart Nutrition</div>
          <div className="auth-feature-pill">💬 AROMI Coach</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-card">
          <Link to="/" className="auth-mobile-logo">
            <img src="/Logo.png" alt="ArogyaMitra" style={{ width: 36, height: 36, objectFit: "contain" }} />
            <span className="auth-left-logo-name" style={{ fontSize: "1rem" }}>ArogyaMitra</span>
          </Link>
          <div className="auth-form-header">
            <h1 className="auth-form-title">Welcome Back 👋</h1>
            <p className="auth-form-sub">Sign in to continue your health journey</p>
          </div>
          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <div className="auth-label-row">
                <label className="auth-label">Password</label>
                <button type="button" className="auth-forgot">Forgot password?</button>
              </div>
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register" className="auth-switch-link">Create one free</Link>
          </p>
        </div>
      </div>

    </div>
  );
}
export default Login;