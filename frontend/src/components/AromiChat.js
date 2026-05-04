import { useState, useRef, useEffect } from "react";
import API from "../api/axios";

function AromiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Neural mapping complete. I am your Assistant. How can I facilitate your health objectives today? 👋",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-aromi-chat", handleOpen);
    return () => window.removeEventListener("open-aromi-chat", handleOpen);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    const newUserMsg = {
      sender: "user",
      text: userMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newUserMsg]);
    setInput("");
    try {
      const res = await API.post("/aromi/chat", {
        message: userMessage,
        context: "AROMI"
      });
      const aiReply = {
        sender: "ai",
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[2000] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-32px)] sm:w-[380px] h-[70vh] sm:h-[550px] bg-[#111114] text-white border border-white/10 rounded-[32px] flex flex-col overflow-hidden animate-fade-in shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] pointer-events-auto backdrop-blur-xl">
          {/* Executive Chat Header */}
          <div className="p-6 bg-white/[0.03] border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center text-xl shadow-xl shadow-purple-600/20">
                ✨
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black uppercase tracking-widest">Health Intelligence</h4>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Synchronized</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-90"
            >
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Content */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-slide-up`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-[24px] text-sm leading-relaxed font-medium shadow-sm ${msg.sender === "user"
                  ? "bg-purple-600 text-white rounded-tr-none italic"
                  : "bg-white/[0.03] border border-white/10 text-white/90 rounded-tl-none"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white/[0.02] border-t border-white/5">
            <div className="relative group">
              <input
                type="text"
                placeholder="Synchronize with assistant..."
                className="w-full bg-white/[0.05] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-purple-500/50 pr-14 transition-all placeholder:text-white/10"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-2xl hover:bg-purple-600 hover:text-white transition-all active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-purple-600 rounded-[24px] flex items-center justify-center text-3xl shadow-[0_16px_32px_-8px_rgba(147,51,234,0.5)] hover:scale-110 active:scale-90 transition-all duration-300 pointer-events-auto text-white group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-700 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <svg className="w-8 h-8 relative z-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.2L4 17.2V4H20V16Z" />
        </svg>
      </button>
    </div>
  );
}

export default AromiChat;