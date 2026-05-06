import { CheckCircle2, Lock, Bot, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import "./AuthPages.css";
function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      await API.post("/auth/register", formData);
      alert("Account created successfully!");
      navigate("/login");
    } catch {
      alert("Registration failed. Please try again.");
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
            Join 10,000+<br />
            <span className="auth-left-title-green">Health Achievers.</span>
          </h2>
          <p className="auth-left-desc">
            Get your personalized AI health plan, track your nutrition, workouts and progress — all in one place.
          </p>
          <div className="auth-steps">
            <div className="auth-step">
              <div className="auth-step-num">1</div>
              <div>
                <div className="auth-step-title">Create your profile</div>
                <div className="auth-step-sub">Tell us about your health goals</div>
              </div>
            </div>
            <div className="auth-step">
              <div className="auth-step-num">2</div>
              <div>
                <div className="auth-step-title">Get your AI plan</div>
                <div className="auth-step-sub">Personalized workout & nutrition</div>
              </div>
            </div>
            <div className="auth-step">
              <div className="auth-step-num">3</div>
              <div>
                <div className="auth-step-title">Achieve your goals</div>
                <div className="auth-step-sub">Track progress with AROMI AI coach</div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-left-footer">
          <div className="auth-feature-pill"><CheckCircle2 size={16} /> Free to get started</div>
          <div className="auth-feature-pill"><Lock size={16} /> 100% Secure</div>
          <div className="auth-feature-pill"><Bot size={16} /> AI-Powered</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-card">
          <Link to="/" className="auth-mobile-logo">
            <img src="/Logo.png" alt="ArogyaMitra" style={{ width: 36, height: 36, objectFit: "contain" }} />
            <span className="auth-left-logo-name" style={{ fontSize: "1rem" }}>ArogyaMitra</span>
          </Link>
          <div className="auth-form-header">
            <h1 className="auth-form-title">Create Account</h1>
            <p className="auth-form-sub">Start your AI health journey today — it's free</p>
          </div>
          <form onSubmit={handleRegister} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                className="auth-input"
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="auth-input"
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  className="auth-input"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  className="auth-input"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Creating account..." : <><span style={{marginRight: '8px'}}>Create Account</span> <ArrowRight size={18} /></>}
            </button>
          </form>
          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="auth-switch-link">Sign in</Link>
          </p>
        </div>
      </div>

    </div>
  );
}
export default Register;