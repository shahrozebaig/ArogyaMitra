import { useState, useRef, useEffect } from "react";
import API from "../api/axios";
function AICoach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input;
    const newUserMsg = {
      sender: "user",
      text: userMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newUserMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await API.post("/aromi/chat", {
        message: userMessage,
        context: "Fitness"
      });
      const aiReply = {
        sender: "ai",
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col pb-12 px-6 md:px-8 animate-fade-in">
      <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10 mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
              AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">Coach</span>
            </h1>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-[#111114] border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-2xl relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative z-10">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-20">
              <div className="text-8xl">💪</div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black italic uppercase tracking-widest">Coach is Ready</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Ask anything about your fitness journey</p>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              <div className={`flex gap-6 max-w-[85%] sm:max-w-[70%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center text-sm transition-all ${msg.sender === "user" ? "bg-white border-white text-black" : "bg-white/5 border-white/10 text-emerald-500"}`}>
                  {msg.sender === "user" ? "U" : "C"}
                </div>
                <div className="space-y-3">
                  <div className={`px-8 py-6 rounded-[32px] text-sm leading-relaxed font-medium transition-all ${msg.sender === "user"
                    ? "bg-white text-black italic font-bold shadow-2xl shadow-white/5 rounded-tr-none"
                    : "bg-white/[0.03] border border-white/5 text-white/90 rounded-tl-none hover:bg-white/[0.05]"
                    }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <div className={`flex items-center gap-3 px-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <span className="w-1.5 h-1.5 bg-white/10 rounded-full"></span>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 italic">{msg.time} {" // "} {msg.sender === "user" ? "You" : "Coach"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex gap-6 items-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Coach is thinking...</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-10 bg-white/[0.01] border-t border-white/5 relative z-10">
          <div className="relative group">
            <input
              type="text"
              placeholder="Ask anything about training or nutrition..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] px-8 py-6 text-sm font-bold italic uppercase tracking-tight focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.05] transition-all pr-24 placeholder:text-white/10 group-hover:border-white/10"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-6 py-4 bg-white text-black rounded-xl flex items-center justify-center shadow-2xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
              >
                <span className="text-[10px] font-black uppercase tracking-widest italic mr-2 hidden sm:block">Send</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AICoach;