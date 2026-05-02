import { useState, useRef, useEffect } from "react";
import API from "../api/axios";
function AromiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi, I'm AROMI your health companion, how can I help you? 🧠",
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
    const newUserMsg = { sender: "user", text: userMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
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
    <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="mb-6 w-[350px] md:w-[420px] h-[550px] bg-[#1a1c2e] border border-white/10 rounded-3xl flex flex-col overflow-hidden animate-fade-in shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
          <div className="p-5 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-white/10 flex justify-between items-center backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg ring-2 ring-purple-500/20">
                  🧠
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#1a1c2e] rounded-full shadow-lg"></div>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-base font-black tracking-tight">AROMI AI</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active & Ready</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/40">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-[13px] leading-relaxed shadow-xl ${msg.sender === "user"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none"
                  : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none backdrop-blur-sm"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 bg-[#1a1c2e] border-t border-white/10">
            <div className="relative group">
              <input
                type="text"
                placeholder="Message AROMI..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500/50 pr-14 transition-all placeholder:text-white/20"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-[0_10px_30px_rgba(124,58,237,0.4)] hover:scale-110 hover:rotate-3 active:scale-95 transition-all pointer-events-auto relative group"
      >
        🧠
      </button>

    </div>
  );
}
export default AromiChat;