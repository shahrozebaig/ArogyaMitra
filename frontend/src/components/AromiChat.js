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
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] glass-card flex flex-col overflow-hidden animate-slide-up border-white/10 shadow-2xl">
          <div className="p-4 bg-purple-600/20 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-lg shadow-lg">🧠</div>
              <div>
                <h4 className="text-sm font-bold">AROMI Health</h4>
                <p className="text-[10px] text-white/40">Always Active</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-xs leading-relaxed ${msg.sender === "user"
                  ? "bg-purple-600 text-white rounded-tr-none shadow-lg"
                  : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white/[0.02] border-t border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask AROMI..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500/50 pr-12"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-2xl shadow-purple-600/40 hover:scale-110 active:scale-95 transition-all"
      >
        🧠
      </button>
    </div>
  );
}
export default AromiChat;