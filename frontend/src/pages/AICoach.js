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
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col pb-12 px-6 md:px-10 animate-fade-in">
      <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            AI <span className="text-emerald-500">Coach</span>
          </h1>
          <p className="text-sm text-white/40 font-medium">Your personalized training and nutrition assistant.</p>
        </div>
      </div>
      <div className="flex-1 bg-[#111114] border border-white/5 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20">
              <div className="text-7xl">💪</div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white">How can I help you today?</h3>
                <p className="text-xs font-medium text-white/60">Ask about workouts, nutrition, or recovery tips.</p>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              <div className={`flex gap-4 max-w-[85%] sm:max-w-[75%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-9 h-9 shrink-0 rounded-xl border flex items-center justify-center text-xs font-bold transition-all ${msg.sender === "user" ? "bg-white border-white text-black" : "bg-white/5 border-white/10 text-emerald-500"}`}>
                  {msg.sender === "user" ? "U" : "C"}
                </div>
                <div className="space-y-2">
                  <div className={`px-6 py-4 rounded-[24px] text-sm leading-relaxed font-medium transition-all ${msg.sender === "user"
                    ? "bg-white text-black shadow-md rounded-tr-none"
                    : "bg-white/[0.03] border border-white/5 text-white/90 rounded-tl-none"
                    }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <p className={`text-[10px] font-bold text-white/20 uppercase tracking-widest px-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex gap-4 items-center">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Coach is typing...</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-8 bg-white/[0.01] border-t border-white/5">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask anything about training or nutrition..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all pr-24 placeholder:text-white/10"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-6 py-2.5 bg-white text-black rounded-xl font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-20 shadow-md"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AICoach;