import { useEffect, useRef, useState } from "react";
import { INITIAL_MESSAGES } from "../data/sampleData";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input };
    const q = input;
    setInput("");
    setMsgs((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...msgs
              .filter((m) => m.role !== "ai" || INITIAL_MESSAGES[0] !== m)
              .map((m) => ({
                role: m.role === "ai" ? "assistant" : "user",
                content: m.text,
              })),
            { role: "user", content: q },
          ],
        }),
      });
      const data = await response.json();
      const txt =
        data.reply ||
        "Let me help you with that! Could you provide more details about your preferences?";
      setMsgs((m) => [...m, { role: "ai", text: txt }]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text: "I can suggest: For rice and eggs, try Egg Fried Rice (320 kcal) or an omelette with a rice bowl.",
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      {open && (
        <div className="chatbot-window">
          <div className="chat-header">
            <div>
              <div className="chat-title">🤖 NutriAI Assistant</div>
              <div className="chat-status">Online</div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
          <div className="chat-messages">
            {msgs.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                <div className="chat-bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg ai">
                <div className="chat-bubble">
                  <div className="chat-typing">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Ask about food, recipes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="chat-send" onClick={send}>
              Send
            </button>
          </div>
        </div>
      )}
      <button className="chatbot-fab" onClick={() => setOpen((o) => !o)}>
        {open ? "×" : "🤖"}
      </button>
    </>
  );
}

export default Chatbot;
