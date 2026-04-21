import React, { useState, useRef, useEffect } from "react";

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "안녕하세요! 이 제품에 대해 궁금한 점을 물어보세요 😊\n예: 냄새가 나나요? 소음은 어떤가요?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const API = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.answer || data.error }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "오류가 발생했습니다. 다시 시도해주세요." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <>
      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            🤖 AI 리뷰 분석
            <p>실제 구매 후기를 기반으로 답변해드려요</p>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`} style={{ whiteSpace: "pre-wrap" }}>
                {m.text}
              </div>
            ))}
            {loading && <div className="msg bot loading">답변을 생성 중이에요...</div>}
            <div ref={bottomRef} />
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="질문을 입력하세요"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="chat-send" onClick={sendMessage} disabled={loading}>
              전송
            </button>
          </div>
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen((v) => !v)}>
        {open ? "✕ 닫기" : "🤖 AI에게 물어보기"}
      </button>
    </>
  );
}
