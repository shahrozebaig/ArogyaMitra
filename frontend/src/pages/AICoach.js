import { useState, useRef, useEffect } from "react";
import API from "../api/axios";
import useUserStore from "../store/userStore";

function AICoach() {
  const user = useUserStore((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    // Initial greeting
    const greeting = `${getGreeting()}, ${user?.name?.split(' ')[0] || "there"}! I'm your AI Coach. How can I help you reach your fitness goals today?`;
    setMessages([
      {
        sender: "ai",
        text: greeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    const newUserMsg = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newUserMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/aromi/chat", {
        message: textToSend,
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

  const suggestions = [
    "Give me a 15-min home workout",
    "How much protein do I need?",
    "Best exercises for back pain",
    "Simple healthy breakfast ideas"
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col pb-8 px-6 md:px-10 animate-fade-in">
      {/* Chat Interface Container */}
      <div className="flex-1 bg-[#0d0d0f] border border-white/5 rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              <div className={`flex gap-5 max-w-[90%] sm:max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 shrink-0 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${msg.sender === "user" ? "bg-purple-600 border-purple-500 text-white" : "bg-emerald-600 border-emerald-500 text-white"}`}>
                  {msg.sender === "user" ? (user?.name?.charAt(0) || "U") : "A"}
                </div>
                
                {/* Message Bubble */}
                <div className="space-y-2">
                  <div className={`px-6 py-4 rounded-[28px] text-[15px] leading-relaxed font-medium transition-all ${msg.sender === "user"
                    ? "bg-[#1a1a1c] text-white rounded-tr-none border border-white/5 shadow-lg"
                    : "bg-[#212124] text-white/90 rounded-tl-none border border-white/5"
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
              <div className="flex gap-5 items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Coach is analyzing...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input & Suggestions Section */}
        <div className="p-6 md:p-10 bg-gradient-to-t from-black/20 to-transparent border-t border-white/5 space-y-6">
          
          {/* Suggestion Chips */}
          {messages.length < 3 && !loading && (
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="relative max-w-4xl mx-auto w-full">
            <textarea
              rows="1"
              placeholder="Ask your AI Coach anything..."
              className="w-full bg-[#1a1a1c] border border-white/10 rounded-[24px] px-6 py-5 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 focus:bg-[#212124] transition-all pr-16 placeholder:text-white/20 resize-none overflow-hidden"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all disabled:opacity-20 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-white/20 font-medium tracking-wide">
            AI Coach can provide guidance but should not replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AICoach;