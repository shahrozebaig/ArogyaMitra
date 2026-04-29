import { useState } from "react";

function AICoach() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi there! 👋 I'm your AI fitness coach. I'm here to help you with workout plans, nutrition advice, and motivation. What would you like to know?",
      time: "03:45 PM",
      coach: "Fitness"
    },
    {
      sender: "user",
      text: "hello",
      time: "03:45 PM"
    },
    {
      sender: "ai",
      text: "Hello! 🌟 I'm super excited to start this fitness journey with you! 💪 Congratulations on taking the first step by reaching out. As a beginner, it's amazing that you're thinking about your general fitness 🏋️.",
      time: "03:46 PM",
      coach: "Fitness"
    }
  ]);
  const [input, setInput] = useState("");
  const [activeCoach, setActiveCoach] = useState("Fitness");

  const coaches = {
    Fitness: {
      name: "AI Fitness Coach",
      subtitle: "Your personal AI trainer is here to help 24/7",
      icon: "🤖",
      color: "text-green-400",
      bg: "bg-green-400/20"
    },
    AROMI: {
      name: "AROMI",
      subtitle: "Your Health Companion",
      icon: "🧠",
      color: "text-purple-400",
      bg: "bg-purple-400/20"
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newUserMsg = { sender: "user", text: input, time: "03:47 PM" };
    setMessages([...messages, newUserMsg]);
    setInput("");
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: "ai",
        text: activeCoach === "Fitness" 
          ? "That sounds like a great plan! Consistency is key. Should we look at a specific workout for tomorrow?"
          : "Namaste! I am AROMI, your personal health companion. I have access to your personalized workout and nutrition plans. How can I assist you today? 🧘",
        time: "03:47 PM",
        coach: activeCoach
      }]);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto h-[80vh] flex flex-col animate-fade-in">
      {/* Coach Toggle */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-fit mb-6">
        {Object.keys(coaches).map((c) => (
          <button
            key={c}
            onClick={() => setActiveCoach(c)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeCoach === c
                ? "bg-white/10 text-white shadow-xl"
                : "text-white/40 hover:text-white"
            }`}
          >
            {c} Coach
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col relative border-white/5">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${coaches[activeCoach].bg} ${coaches[activeCoach].color} rounded-2xl flex items-center justify-center text-2xl border border-white/5`}>
                 {coaches[activeCoach].icon}
              </div>
              <div>
                 <h2 className="text-xl font-bold tracking-tight">{coaches[activeCoach].name}</h2>
                 <p className="text-xs text-white/40">{coaches[activeCoach].subtitle}</p>
              </div>
           </div>
           <button className="text-white/20 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
           </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              <div className={`flex gap-4 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                {msg.sender === "ai" && (
                  <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-sm ${msg.coach === 'Fitness' ? 'bg-green-400/20 text-green-400' : 'bg-purple-400/20 text-purple-400'}`}>
                    {msg.coach === 'Fitness' ? '🤖' : '🧠'}
                  </div>
                )}
                <div className="space-y-1">
                   <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                     msg.sender === "user" 
                       ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-lg shadow-purple-600/10" 
                       : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none"
                   }`}>
                     {msg.text}
                   </div>
                   <p className={`text-[9px] font-bold uppercase tracking-widest text-white/20 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                     {msg.time}
                   </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5">
           <div className="relative">
              <input 
                type="text" 
                placeholder={`Ask ${activeCoach === 'Fitness' ? 'anything about fitness, nutrition, or wellness...' : 'AROMI anything...'}`}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all pr-16"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

export default AICoach;