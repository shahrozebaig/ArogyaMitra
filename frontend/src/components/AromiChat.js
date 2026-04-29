import { useState } from "react";
import API from "../api/axios";

function AromiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await API.post("/aromi/chat", { message: input });

      const botMsg = { role: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      alert("Chat failed");
    }

    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-72 bg-white shadow-lg rounded p-3">
      <div className="h-40 overflow-y-auto mb-2 text-sm">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-1 text-sm"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-2">
          Send
        </button>
      </div>
    </div>
  );
}

export default AromiChat;