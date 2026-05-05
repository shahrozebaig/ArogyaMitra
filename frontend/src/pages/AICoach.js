import { useState, useRef, useEffect } from "react";
import API from "../api/axios";
import useUserStore from "../store/userStore";
import "./AICoach.css";
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
    const greetingText = `${getGreeting()}, ${user?.name?.split(' ')[0] || "there"}! I'm your AI Coach. How can I help you reach your fitness goals today? 🏃‍♂️`;
    setMessages([
      {
        sender: "ai",
        text: greetingText,
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
    <div className="ac-root">
      <div className="ac-container">
        <div ref={scrollRef} className="ac-messages custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`ac-msg-row ${msg.sender === "user" ? "ac-msg-row-user" : "ac-msg-row-ai"}`}>
              <div className={`ac-avatar ${msg.sender === "user" ? "ac-avatar-user" : "ac-avatar-ai"}`}>
                {msg.sender === "user" ? (user?.name?.charAt(0) || "U") : "🤖"}
              </div>
              <div>
                <div className={`ac-bubble ${msg.sender === "user" ? "ac-bubble-user" : "ac-bubble-ai"}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="ac-time">{msg.time}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="ac-loading">
              <div className="ac-spinner"></div>
              <span className="ac-loading-text">Coach is thinking...</span>
            </div>
          )}
        </div>
        <div className="ac-footer">
          {messages.length < 3 && !loading && (
            <div className="ac-suggestions">
              {suggestions.map((s, i) => (
                <button key={i} className="ac-suggestion-btn" onClick={() => handleSend(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="ac-input-wrapper">
            <textarea
              rows="1"
              placeholder="Ask your AI Coach anything..."
              className="ac-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              className="ac-send-btn"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <p className="ac-disclaimer">
            AI Coach provides guidance but does not replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
export default AICoach;