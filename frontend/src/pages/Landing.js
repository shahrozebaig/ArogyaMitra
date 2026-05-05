import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
            <button
              className={`lp-nav-link ${active === "home" ? "lp-nav-active" : ""}`}
              onClick={() => scrollTo("home")}
            >
              Home
            </button>
            <button
              className={`lp-nav-link ${active === "features" ? "lp-nav-active" : ""}`}
              onClick={() => scrollTo("features")}
            >
              Features
            </button>
            <button
              className={`lp-nav-link ${active === "how" ? "lp-nav-active" : ""}`}
              onClick={() => scrollTo("how")}
            >
              How It Works
            </button>
          </nav>
          <Link to="/register" className="lp-get-started">Get Started</Link>
        </div>
      </header>
      <section id="home" className="lp-section">
        <img src="/Full.png" alt="ArogyaMitra Home" className="lp-section-img" />
      </section>
      <section id="features" className="lp-section">
        <img src="/Features.png" alt="ArogyaMitra Features" className="lp-section-img" />
      </section>
      <section id="how" className="lp-section">
        <img src="/Work.png" alt="How ArogyaMitra Works" className="lp-section-img" />
      </section>
    </div>
  );
}
export default Landing;