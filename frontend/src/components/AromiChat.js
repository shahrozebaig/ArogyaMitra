import { useState, useRef, useEffect } from "react";
import API from "../api/axios";
function AromiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi, I'm your Health Assistant. How can I help you today? 👋",
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
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="mb-4 w-[320px] md:w-[380px] h-[500px] bg-white text-black border border-black/10 rounded-2xl flex flex-col overflow-hidden animate-fade-in shadow-2xl pointer-events-auto">
          {/* Chat Header */}
          <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg">
                ✨
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold">Health Assistant</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  <p className="text-[10px] font-medium opacity-70">Active</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed font-medium ${msg.sender === "user"
                  ? "bg-purple-600 text-white rounded-tr-none"
                  : "bg-white border border-black/5 text-gray-800 rounded-tl-none shadow-sm"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative group">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 pr-12 transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white shadow-md hover:bg-purple-700 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all pointer-events-auto text-white shadow-purple-600/20"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.2L4 17.2V4H20V16Z" />
        </svg>
      </button>
    </div>
  );
}
export default AromiChat;