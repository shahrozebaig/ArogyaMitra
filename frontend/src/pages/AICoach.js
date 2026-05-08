import { Bot, SendHorizontal, Trash2, Plus, MessageSquare, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import API from "../api/axios";
import useUserStore from "../store/userStore";
import "./AICoach.css";
function AICoach() {
  const user = useUserStore((state) => state.user);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('arogya_chat_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeId, setActiveId] = useState(() => {
    return localStorage.getItem('arogya_active_session_id') || null;
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const scrollRef = useRef(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };
  useEffect(() => {
    if (sessions.length === 0 && user) {
      const newId = Date.now().toString();
      const greetingText = `${getGreeting()}, ${user?.name?.split(' ')[0] || "there"}! I'm your AI Coach. How can I help you reach your fitness goals today?`;
      const initialSession = {
        id: newId,
        title: "New Conversation",
        messages: [{
          sender: "ai",
          text: greetingText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }],
        timestamp: Date.now()
      };
      setSessions([initialSession]);
      setActiveId(newId);
    }
  }, [user, sessions.length]);
  useEffect(() => {
    localStorage.setItem('arogya_chat_sessions', JSON.stringify(sessions));
    if (activeId) localStorage.setItem('arogya_active_session_id', activeId);
  }, [sessions, activeId]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeId, sessions]);
  const activeSession = sessions.find(s => s.id === activeId) || sessions[0];
  const createNewChat = () => {
    const newId = Date.now().toString();
    const greetingText = `${getGreeting()}! Starting a new session. How can I assist you now?`;
    const newSession = {
      id: newId,
      title: "New Conversation",
      messages: [{
        sender: "ai",
        text: greetingText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }],
      timestamp: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveId(newId);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };
  const deleteSession = (e, id) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeId === id) {
      setActiveId(filtered.length > 0 ? filtered[0].id : null);
    }
  };
  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading || !activeId) return;
    const newMessage = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSessions(prev => prev.map(s => {
      if (s.id === activeId) {
        const isFirstUserMsg = s.messages.filter(m => m.sender === 'user').length === 0;
        return {
          ...s,
          title: isFirstUserMsg ? (textToSend.length > 25 ? textToSend.substring(0, 25) + "..." : textToSend) : s.title,
          messages: [...s.messages, newMessage],
          timestamp: Date.now()
        };
      }
      return s;
    }));
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
      setSessions(prev => prev.map(s => {
        if (s.id === activeId) {
          return { ...s, messages: [...s.messages, aiReply] };
        }
        return s;
      }));
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };
  const suggestions = [
    "Give me a 15-min home workout",
    "Best exercises for back pain",
    "Simple healthy breakfast ideas"
  ];
  if (!activeSession) return <div className="ac-loading-screen">Initializing Coach...</div>;
  return (
    <div className="ac-root">
      <div className={`ac-sidebar ${sidebarOpen ? 'ac-sidebar-open' : 'ac-sidebar-closed'}`}>
        <div className="ac-sidebar-header">
          <button className="ac-new-chat-btn" onClick={createNewChat}>
            <Plus size={18} /> New Chat
          </button>
        </div>
        <div className="ac-history custom-scrollbar">
          <div className="ac-history-label">Recent Conversations</div>
          {sessions.map(s => (
            <div
              key={s.id}
              className={`ac-history-item ${s.id === activeId ? 'ac-history-item-active' : ''}`}
              onClick={() => {
                setActiveId(s.id);
                if (window.innerWidth <= 768) setSidebarOpen(false);
              }}
            >
              <MessageSquare size={16} className="ac-history-icon" />
              <span className="ac-history-title">{s.title}</span>
              <button className="ac-history-delete" onClick={(e) => deleteSession(e, s.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="ac-main" style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.1,
          pointerEvents: 'none',
          zIndex: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img src="/Logo.png" alt="" style={{ width: '300px', height: '300px', objectFit: 'contain' }} />
        </div>

        <div className="ac-top-bar" style={{ position: 'relative', zIndex: 1 }}>
          <button className="ac-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
          <h2 className="ac-current-title">{activeSession.title}</h2>
          <div style={{ width: 40 }}></div> {/* spacer */}
        </div>
        <div ref={scrollRef} className="ac-messages custom-scrollbar" style={{ position: 'relative', zIndex: 1 }}>
          {activeSession.messages.map((msg, i) => (
            <div key={i} className={`ac-msg-row ${msg.sender === "user" ? "ac-msg-row-user" : "ac-msg-row-ai"}`}>
              <div className={`ac-avatar ${msg.sender === "user" ? "ac-avatar-user" : "ac-avatar-ai"}`}>
                {msg.sender === "user" ? (user?.name?.charAt(0) || "U") : <Bot size={20} />}
              </div>
              <div className="ac-msg-body">
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
        <div className="ac-footer" style={{ position: 'relative', zIndex: 1 }}>
          {activeSession.messages.length < 3 && !loading && (
            <div className="ac-suggestions">
              {suggestions.map((s, i) => (
                <button key={i} className="ac-suggestion-btn" onClick={() => handleSend(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="ac-input-wrapper">
            <input
              type="text"
              placeholder="Ask your AI Coach anything..."
              className="ac-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
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
              <SendHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AICoach;