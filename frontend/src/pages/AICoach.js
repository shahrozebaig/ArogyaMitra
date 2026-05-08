import { Bot, SendHorizontal, Trash2, Plus, MessageSquare, Menu, X, MoreHorizontal, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import API from "../api/axios";
import useUserStore from "../store/userStore";
import useToastStore from "../store/toastStore";
import "./AICoach.css";
function AICoach() {
  const user = useUserStore((state) => state.user);
  const profileImage = useUserStore((state) => state.profileImage);
  const preferredVoice = useUserStore((state) => state.preferredVoice);
  const addToast = useToastStore((state) => state.addToast);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('arogya_chat_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeId, setActiveId] = useState(() => {
    return localStorage.getItem('arogya_active_session_id') || null;
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const scrollRef = useRef(null);

  const speakText = (text) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find the preferred voice if set
    if (preferredVoice) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.voiceURI === preferredVoice);
      if (selectedVoice) utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };
  const animateAiMessage = (sessionId, fullText) => {
    let currentText = "";
    let i = 0;
    const speed = 25; 

    const type = () => {
      if (i < fullText.length) {
        currentText += fullText.charAt(i);
        setSessions(prev => prev.map(s => {
          if (s.id === sessionId) {
            const updatedMessages = [...s.messages];
            const lastMsg = updatedMessages[updatedMessages.length - 1];
            if (lastMsg && lastMsg.sender === 'ai') {
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMsg,
                text: currentText
              };
            }
            return { ...s, messages: updatedMessages };
          }
          return s;
        }));
        i++;
        setTimeout(type, speed);
      }
    };
    type();
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
          text: "", // Start empty for typing effect
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }],
        timestamp: Date.now()
      };
      setSessions([initialSession]);
      setActiveId(newId);
      
      // Start typing effect after a small delay
      setTimeout(() => animateAiMessage(newId, greetingText), 500);
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
  const createNewChat = () => {
    const newId = Date.now().toString();
    const greetingText = `${getGreeting()}! Starting a new session. How can I assist you now?`;
    const newSession = {
      id: newId,
      title: "New Conversation",
      messages: [{
        sender: "ai",
        text: "",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }],
      timestamp: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveId(newId);
    if (window.innerWidth <= 768) setSidebarOpen(false);
    
    // Start typing effect
    setTimeout(() => animateAiMessage(newId, greetingText), 300);
  };
  const deleteSession = (e, id) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeId === id) {
      setActiveId(filtered.length > 0 ? filtered[0].id : null);
    }
  };
  const activeSession = sessions.find(s => s.id === activeId) || sessions[0];
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
      const res = await API.post("/coach/chat", {
        message: textToSend,
        context: "AROMI"
      });
      
      const fullText = res.data.reply;
      const aiReply = {
        sender: "ai",
        text: "",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeId) return { ...s, messages: [...s.messages, aiReply] };
        return s;
      }));


      animateAiMessage(activeId, fullText);
    } catch (err) {
      console.error("Chat error:", err);
      addToast("Failed to get response from AI Coach.", "error");
      setLoading(false);
    }
  };
  if (!activeSession) return <div className="ac-loading-screen">Initializing Coach...</div>;
  return (
    <div className="ac-root">
      {sidebarOpen && (
        <div className="ac-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
      <div className={`ac-sidebar ${sidebarOpen ? 'ac-sidebar-open' : 'ac-sidebar-closed'}`}>
        <div className="ac-sidebar-header" style={{ display: 'flex', gap: '10px' }}>
          <button className="ac-new-chat-btn" onClick={createNewChat} style={{ flex: 1 }}>
            <Plus size={18} /> New Chat
          </button>
          {window.innerWidth <= 768 && (
            <button 
              className="ac-menu-btn" 
              onClick={() => setSidebarOpen(false)}
              style={{ background: '#374151', border: '1px solid #4b5563', borderRadius: '12px' }}
            >
              <X size={20} color="#f9fafb" />
            </button>
          )}
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
              <div className="ac-history-actions" style={{ position: 'relative' }}>
                <button 
                  className="ac-history-more" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === s.id ? null : s.id);
                  }}
                >
                  <MoreHorizontal size={16} />
                </button>
                {menuOpenId === s.id && (
                  <div className="ac-history-menu">
                    <button onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(s.id);
                      setMenuOpenId(null);
                    }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="ac-main" style={{ position: 'relative' }}>
        {confirmDeleteId && (
          <div className="ac-modal-overlay">
            <div className="ac-modal">
              <h3 className="ac-modal-title">Delete Conversation</h3>
              <p className="ac-modal-desc">Are you sure you want to permanently delete this conversation? This action cannot be undone.</p>
              <div className="ac-modal-actions">
                <button className="ac-modal-cancel" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                <button className="ac-modal-confirm" onClick={(e) => {
                  deleteSession(e, confirmDeleteId);
                  setConfirmDeleteId(null);
                  addToast("Conversation deleted", "info");
                }}>Permanently Delete</button>
              </div>
            </div>
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.05,
          pointerEvents: 'none',
          zIndex: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img src="/Logo.png" alt="" style={{ width: '180px', height: '180px', objectFit: 'contain' }} />
        </div>

        <div className="ac-top-bar" style={{ position: 'relative', zIndex: 1 }}>
          <button className="ac-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
          <h2 className="ac-current-title">{activeSession.title}</h2>
          <div style={{ width: 40 }}></div>
        </div>
        <div ref={scrollRef} className="ac-messages custom-scrollbar" style={{ position: 'relative', zIndex: 1 }}>
          {activeSession.messages.map((msg, i) => (
            <div key={i} className={`ac-msg-row ${msg.sender === "user" ? "ac-msg-row-user" : "ac-msg-row-ai"}`}>
              <div className={`ac-avatar ${msg.sender === "user" ? "ac-avatar-user" : "ac-avatar-ai"}`}>
                {msg.sender === "user" ? (
                  profileImage ? (
                    <img src={profileImage} alt="User" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
                  ) : (
                    user?.name?.charAt(0) || "U"
                  )
                ) : <Bot size={20} />}
              </div>
              <div className="ac-msg-body">
                <div className={`ac-bubble ${msg.sender === "user" ? "ac-bubble-user" : "ac-bubble-ai"}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.sender === "ai" && msg.text && (
                    <button 
                      className={`ac-speak-btn ${isSpeaking ? 'ac-speak-btn-active' : ''}`} 
                      onClick={() => speakText(msg.text)}
                      title={isSpeaking ? "Stop listening" : "Listen to response"}
                    >
                      {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  )}
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
          <div className="ac-input-wrapper">
            <input
              type="text"
              placeholder="Message..."
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