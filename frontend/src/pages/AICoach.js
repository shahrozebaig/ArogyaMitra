import { useState } from "react";
import API from "../api/axios";
function AICoach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const coach = {
    name: "AI Fitness Coach",
    subtitle: "Your personal AI trainer is here to help 24/7",
    icon: "🤖",
    color: "text-green-400",
    bg: "bg-green-400/20"
  };
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    const newUserMsg = { sender: "user", text: userMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newUserMsg]);
    setInput("");
    try {
      const res = await API.post("/aromi/chat", {
        message: userMessage,
        context: "Fitness"
      });
      const aiReply = {
        sender: "ai",
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        coach: "Fitness"
      };
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error("Chat error:", err);
    }
  };
  return (
    <div className="max-w-5xl mx-auto h-[80vh] flex flex-col animate-fade-in">
      <div className="flex-1 glass-card overflow-hidden flex flex-col relative border-white/5">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${coach.bg} ${coach.color} rounded-2xl flex items-center justify-center text-2xl border border-white/5`}>
              {coach.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{coach.name}</h2>
              <p className="text-xs text-white/40">{coach.subtitle}</p>
            </div>
          </div>
          <button className="text-white/20 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
          </button>
        </div>
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
                  <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${msg.sender === "user"
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
        <div className="p-6 bg-white/[0.02] border-t border-white/5">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask anything about fitness, nutrition, or wellness..."
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