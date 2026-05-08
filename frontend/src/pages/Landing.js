import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Brain, Dumbbell, Utensils, TrendingUp,
  Heart, Shield
} from "lucide-react";
import "./Landing.css";
function Landing() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const sections = ["home", "features", "how"];
    const handleScroll = () => {
      const scrollY = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollTo = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="lp-root">
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <Link to="/" className="lp-logo">
            <img src="/Logo.png" alt="ArogyaMitra" className="lp-logo-img" />
            <div>
              <div className="lp-logo-name">ArogyaMitra</div>
              <div className="lp-logo-sub">Your AI Health Companion</div>
            </div>
          </Link>
          <nav className="lp-nav-links">
            <button className={`lp-nav-link ${active === "home" ? "lp-nav-active" : ""}`} onClick={() => scrollTo("home")}>Home</button>
            <button className={`lp-nav-link ${active === "features" ? "lp-nav-active" : ""}`} onClick={() => scrollTo("features")}>Features</button>
            <button className={`lp-nav-link ${active === "how" ? "lp-nav-active" : ""}`} onClick={() => scrollTo("how")}>How It Works</button>
          </nav>
          <div className="lp-nav-actions">
            <Link to="/login" className="lp-login-link">Login</Link>
            <Link to="/register" className="lp-get-started">Get Started</Link>
          </div>
        </div>
      </header>
      <section
        id="home"
        className="hero-v2"
        style={{
          backgroundImage: "url('/Full.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="hero-container">
          <div className="hero-main">
            <div className="hero-text-side">
              <h1 className="hero-title">
                Your Health.<br />
                Your Plan.<br />
                <span className="text-green">Your AI Companion.</span>
              </h1>
              <div className="heartbeat-divider">
                <svg viewBox="0 0 300 40" className="heartbeat-svg">
                  <path
                    d="M0,20 L120,20 L130,10 L140,30 L150,0 L160,40 L170,20 L300,20"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <Heart size={16} fill="#ef4444" color="#ef4444" x="142" y="12" />
                </svg>
              </div>
              <p className="hero-subtitle">
                AI-driven workout planning, nutrition guidance and real-time health coaching — all in one intelligent platform.
              </p>
              <div className="hero-features-list">
                <div className="h-feat-item">
                  <div className="h-feat-icon green"><Dumbbell size={20} /></div>
                  <div className="h-feat-info">
                    <h4>AI Workout</h4>
                    <p>Personalized plans for you</p>
                  </div>
                </div>
                <div className="h-feat-item">
                  <div className="h-feat-icon orange"><Utensils size={20} /></div>
                  <div className="h-feat-info">
                    <h4>AI Nutrition</h4>
                    <p>Smart meal recommendations</p>
                  </div>
                </div>
                <div className="h-feat-item">
                  <div className="h-feat-icon purple"><Heart size={20} /></div>
                  <div className="h-feat-info">
                    <h4>Health Assessment</h4>
                    <p>Know your health better</p>
                  </div>
                </div>
                <div className="h-feat-item">
                  <div className="h-feat-icon blue"><Brain size={20} /></div>
                  <div className="h-feat-info">
                    <h4>AI Coach</h4>
                    <p>Your AI wellness companion</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-visual-side"></div>
          </div>
        </div>
      </section>
      <section id="features" className="features-v2">
        <div className="lp-container">
          <div className="section-header-center">
            <h2>Everything You Need <span className="text-green">For a Healthier You</span></h2>
            <div className="divider-green-center"></div>
            <p>AI-powered tools and personalized guidance to help you achieve your health goals.</p>
          </div>
          <div className="features-grid-v2">
            <div className="feat-card-v2">
              <div className="feat-header">
                <div className="feat-icon green"><Dumbbell /></div>
                <h4>AI Workout Plans</h4>
              </div>
              <p>Personalized workout plans tailored to your fitness level and goals.</p>
            </div>
            <div className="feat-card-v2">
              <div className="feat-header">
                <div className="feat-icon orange"><Utensils /></div>
                <h4>Smart Nutrition</h4>
              </div>
              <p>AI-powered meal plans, calorie tracking and smart nutritional recommendations.</p>
            </div>
            <div className="feat-card-v2">
              <div className="feat-header">
                <div className="feat-icon purple"><Brain /></div>
                <h4>AI Coach</h4>
              </div>
              <p>Get real-time guidance, motivation and answers to all your health questions.</p>
            </div>
            <div className="feat-card-v2">
              <div className="feat-header">
                <div className="feat-icon blue"><TrendingUp /></div>
                <h4>Progress Tracking</h4>
              </div>
              <p>Track workouts, nutrition, and overall progress with insightful analytics.</p>
            </div>
            <div className="feat-card-v2">
              <div className="feat-header">
                <div className="feat-icon pink"><Heart /></div>
                <h4>Health Assessment</h4>
              </div>
              <p>Regular health assessments to monitor your well-being.</p>
            </div>
            <div className="feat-card-v2">
              <div className="feat-header">
                <div className="feat-icon navy"><Shield /></div>
                <h4>Secure & Private</h4>
              </div>
              <p>Your data is safe with enterprise grade security and privacy.</p>
            </div>
          </div>
        </div>
      </section>
      <section id="how" className="how-v2">
        <div className="lp-container">
          <div className="section-header-center">
            <h2>How <span className="text-green">It Works</span></h2>
            <div className="divider-green-center"></div>
            <p>A simple 5-step journey to a healthier, stronger you with the power of AI.</p>
          </div>
          <div className="how-steps-v2">
            <div className="step-v2">
              <div className="step-num-wrap"><div className="step-num">1</div></div>
              <h4>Create Your Profile</h4>
              <p>Sign up and tell us about yourself, your goals, and your lifestyle.</p>
            </div>
            <div className="step-v2">
              <div className="step-num-wrap"><div className="step-num">2</div></div>
              <h4>Complete Assessment</h4>
              <p>Answer a few simple questions so our AI can understand your health better.</p>
            </div>
            <div className="step-v2">
              <div className="step-num-wrap"><div className="step-num">3</div></div>
              <h4>Get Your AI Plan</h4>
              <p>Receive a personalized workout, nutrition, and wellness plan tailored just for you.</p>
            </div>
            <div className="step-v2">
              <div className="step-num-wrap"><div className="step-num">4</div></div>
              <h4>Follow & Track</h4>
              <p>Follow your daily plan and track your workouts, nutrition, and progress in real time.</p>
            </div>
            <div className="step-v2">
              <div className="step-num-wrap"><div className="step-num">5</div></div>
              <h4>Achieve Your Goals</h4>
              <p>Stay consistent, see your progress, and achieve a healthier, happier you.</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-inner">
            <div className="lp-footer-brand">
              <div className="lp-logo-name">ArogyaMitra</div>
              <p className="lp-footer-tagline">Your AI Health Companion</p>
            </div>
            <div className="lp-footer-copy">
              &copy; 2026 ArogyaMitra. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default Landing;