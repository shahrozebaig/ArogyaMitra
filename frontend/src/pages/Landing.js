import { Link } from "react-router-dom";

function Landing() {
  const coreModules = [
    {
      title: "AI Training",
      desc: "Custom workout architectures generated for your unique physiology.",
      icon: "🏋️",
      accent: "bg-purple-500",
      id: "OBJ-01"
    },
    {
      title: "Precision Nutrition",
      desc: "Metabolic fuel mapping curated by intelligent analysis.",
      icon: "🥗",
      accent: "bg-orange-500",
      id: "OBJ-02"
    },
    {
      title: "Dynamic Coaching",
      desc: "Adaptive health intelligence that evolves with your progress.",
      icon: "🧠",
      accent: "bg-blue-500",
      id: "OBJ-03"
    },
    {
      title: "Smart Analytics",
      desc: "Detailed biometric insights to track your physical transformation.",
      icon: "📈",
      accent: "bg-emerald-500",
      id: "OBJ-04"
    },
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-white/10 selection:text-white overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050507]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-10 py-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white text-black flex items-center justify-center font-bold italic text-lg md:text-xl rounded-xl">A</div>
            <span className="text-base md:text-xl font-bold italic uppercase tracking-tighter">Arogya<span className="text-white/30 font-normal">Mitra</span></span>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="px-4 md:px-8 py-2 md:py-3 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all">
              Initialize
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section: Responsive Text Scaling */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8 md:space-y-12 relative z-10">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white/30 uppercase tracking-[0.3em]">A.I. Health Ecosystem</span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[1.1] uppercase italic">
              Advanced <br />
              <span className="text-purple-500">Wellness</span>
            </h1>
          </div>
          
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-white/30 leading-relaxed font-medium italic">
            Engineered for high-performance individuals. ArogyaMitra leverages adaptive 
            intelligence to architect your health journey with scientific accuracy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-4">
            <Link to="/register" className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-white text-black rounded-2xl font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-2xl active:scale-95">
              Start Assessment ➔
            </Link>
          </div>
        </div>
        
        {/* Responsive Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      </section>

      {/* Features Grid: Responsive Columns */}
      <section className="px-4 md:px-10 py-24 md:py-40 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 md:mb-24 text-center md:text-left">
          <div className="space-y-4 max-w-2xl mx-auto md:mx-0">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase italic tracking-tight leading-none">
              The <span className="text-white/20">Architecture</span>
            </h2>
            <p className="text-white/30 text-sm md:text-lg font-medium leading-relaxed italic">
              An integrated suite of modules designed to synchronize with your unique physiological data points.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {coreModules.map((module, i) => (
            <div key={i} className="group bg-[#0f0f12] border border-white/5 p-8 md:p-10 rounded-[32px] space-y-10 hover:border-white/10 transition-all shadow-xl flex flex-col justify-between h-[360px] md:h-[400px]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white/10 uppercase tracking-widest">{module.id}</span>
                <span className="text-4xl opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">{module.icon}</span>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold uppercase italic tracking-tight text-white/80 group-hover:text-white transition-colors">{module.title}</h3>
                <p className="text-sm text-white/30 leading-relaxed font-medium group-hover:text-white/50 transition-colors">
                  {module.desc}
                </p>
              </div>
              
              <div className="pt-6 border-t border-white/5">
                <div className={`h-1 w-12 ${module.accent} rounded-full group-hover:w-full transition-all duration-700`}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer: Responsive Stack */}
      <footer className="px-4 md:px-10 py-16 border-t border-white/5 bg-[#050507]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold italic rounded-lg">A</div>
            <span className="text-base md:text-lg font-bold italic tracking-tighter uppercase text-white/30">ArogyaMitra Platform</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs font-bold uppercase tracking-widest text-white/10">
            <a href="#" className="hover:text-white transition-colors">Operations</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Intelligence</a>
          </div>
          <p className="text-xs font-bold italic uppercase text-white/10">© 2026 Arogya Systems</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;