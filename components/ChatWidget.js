'use client';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const WELCOME_MESSAGE = "Hi! 👋 I'm here to help with anything about SmartProfile — plans, pricing, features, or how to get your business listed. What would you like to know?";
const PRECHAT_SESSION_KEY = 'smartprofile_chat_prechat_done';

// Safety net: the system prompt instructs the model to avoid markdown, but
// just in case it slips in **bold** or bullet markers, strip them so the
// visitor never sees raw asterisks in the plain-text chat bubble.
function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^[-*]\s+/gm, '• ');
}

// Same Digital Card route detection used by Navbar/Footer — the chatbot
// stays hidden there too, since those pages are for a single business's
// QR/NFC visitors, not for platform-wide sales conversations.
const RESERVED_TOP_LEVEL = [
  '', 'admin', 'api', 'contact', 'dashboard', 'directory', 'free-listing',
  'login', 'privacy', 'refund', 'register', 'shipping', 'terms', 'blog', 'pricing',
];
function isDigitalCardRoute(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return false;
  if (RESERVED_TOP_LEVEL.includes(parts[0])) return false;
  if (parts.length === 1) return true;
  if (parts.length === 2 && parts[1] === 'review') return true;
  return false;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME_MESSAGE }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const [preChatDone, setPreChatDone] = useState(false);
  const [preChatName, setPreChatName] = useState('');
  const [preChatPhone, setPreChatPhone] = useState('');
  const [preChatEmail, setPreChatEmail] = useState('');
  const [preChatError, setPreChatError] = useState('');
  const [preChatSubmitting, setPreChatSubmitting] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(PRECHAT_SESSION_KEY) === '1') {
        setPreChatDone(true);
      }
    } catch {
      // sessionStorage unavailable (e.g. privacy mode) — just ask every time
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  if (isDigitalCardRoute(pathname)) return null;

  async function submitPreChat() {
    setPreChatError('');
    const name = preChatName.trim();
    const phone = preChatPhone.trim();
    if (!name) { setPreChatError('Please enter your name.'); return; }
    if (!phone || phone.replace(/\D/g, '').length < 10) { setPreChatError('Please enter a valid phone number.'); return; }

    setPreChatSubmitting(true);
    try {
      await fetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact: preChatEmail.trim() ? (phone + ' / ' + preChatEmail.trim()) : phone,
          message: 'Started a chat on the website',
          source: 'chatbot_prechat',
        }),
      });
    } catch {
      // Non-critical — don't block the visitor from chatting over a network hiccup.
    }
    try {
      sessionStorage.setItem(PRECHAT_SESSION_KEY, '1');
    } catch {}
    setPreChatSubmitting(false);
    setPreChatDone(true);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble responding right now. Please try again in a moment." }]);
        setLoading(false);
        return;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: stripMarkdown(data.reply) }]);

      if (data.lead && data.lead.contact) {
        try {
          await fetch('/api/leads/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: data.lead.name,
              contact: data.lead.contact,
              message: data.lead.message,
              source: 'chatbot_website',
            }),
          });
        } catch {
          // Non-critical — the visitor's conversation already succeeded.
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, something went wrong. Please try again." }]);
    }
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handlePreChatKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitPreChat();
    }
  }

  const fieldStyle = { width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, padding: '9px 12px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box', marginBottom: 10 };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, fontFamily: "'Inter', sans-serif" }}>
      {open && (
        <div style={{
          width: 340, maxWidth: '90vw', height: 460, maxHeight: '75vh',
          background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', marginBottom: 12,
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ background: '#005DFF', color: 'white', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>SmartProfile Assistant</div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>Usually replies instantly</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: 4 }} aria-label="Close chat">×</button>
          </div>

          {!preChatDone ? (
            <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#f8fafc' }}>
              <p style={{ fontSize: 13.5, color: '#334155', marginTop: 0, marginBottom: 16, lineHeight: 1.5 }}>
                Before we chat, could you share your name and phone number? This helps our team follow up if needed.
              </p>
              <input
                value={preChatName}
                onChange={e => setPreChatName(e.target.value)}
                onKeyDown={handlePreChatKeyDown}
                placeholder="Your name *"
                style={fieldStyle}
              />
              <input
                value={preChatPhone}
                onChange={e => setPreChatPhone(e.target.value)}
                onKeyDown={handlePreChatKeyDown}
                placeholder="Phone number *"
                style={fieldStyle}
              />
              <input
                value={preChatEmail}
                onChange={e => setPreChatEmail(e.target.value)}
                onKeyDown={handlePreChatKeyDown}
                placeholder="Email (optional)"
                style={fieldStyle}
              />
              {preChatError && <p style={{ color: '#dc2626', fontSize: 12.5, margin: '0 0 10px' }}>{preChatError}</p>}
              <button
                onClick={submitPreChat}
                disabled={preChatSubmitting}
                style={{ background: '#005DFF', color: 'white', border: 'none', borderRadius: 10, padding: '10px 16px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', opacity: preChatSubmitting ? 0.6 : 1 }}
              >
                {preChatSubmitting ? 'Starting…' : 'Start Chat'}
              </button>
            </div>
          ) : (
            <>
              <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10, background: '#f8fafc' }}>
                {messages.map((m, i) => (
                  <div key={i} style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    background: m.role === 'user' ? '#005DFF' : 'white',
                    color: m.role === 'user' ? 'white' : '#1e293b',
                    padding: '9px 13px',
                    borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                    fontSize: 13.5, lineHeight: 1.5,
                    boxShadow: m.role === 'assistant' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {m.content}
                  </div>
                ))}
                {loading && (
                  <div style={{ alignSelf: 'flex-start', background: 'white', border: '1px solid #e2e8f0', padding: '9px 13px', borderRadius: '14px 14px 14px 3px', fontSize: 13, color: '#94a3b8' }}>
                    typing…
                  </div>
                )}
              </div>

              <div style={{ padding: 10, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8, background: 'white' }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your question…"
                  style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 10, padding: '9px 12px', fontSize: 13.5, outline: 'none' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  style={{ background: '#005DFF', color: 'white', border: 'none', borderRadius: 10, padding: '0 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: (loading || !input.trim()) ? 0.5 : 1 }}
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          width: 60, height: 60, borderRadius: '50%',
          background: open ? '#005DFF' : 'transparent',
          border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          float: 'right', padding: 0, overflow: 'visible',
        }}
      >
        {open ? (
          <span style={{ fontSize: 24, lineHeight: 1, color: 'white' }}>×</span>
        ) : (
          <svg width="60" height="60" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="botBubbleGrad" x1="15%" y1="10%" x2="85%" y2="95%">
                <stop offset="0%" stopColor="#fbaa3f"/>
                <stop offset="45%" stopColor="#f7791e"/>
                <stop offset="100%" stopColor="#ef4410"/>
              </linearGradient>
              <linearGradient id="botHeadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff"/>
                <stop offset="100%" stopColor="#dde3e9"/>
              </linearGradient>
              <filter id="botShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000000" floodOpacity="0.28"/>
              </filter>
            </defs>
            {/* Speech-bubble body with tail, glossy orange */}
            <circle cx="512" cy="440" r="440" fill="url(#botBubbleGrad)"/>
            <path d="M310 790 Q345 850 300 940 Q220 900 190 800 Q250 780 310 790Z" fill="url(#botBubbleGrad)"/>
            {/* Robot head, lifted with a soft shadow */}
            <g filter="url(#botShadow)">
              <rect x="490" y="180" width="44" height="90" rx="22" fill="url(#botHeadGrad)"/>
              <rect x="230" y="330" width="564" height="330" rx="100" fill="url(#botHeadGrad)"/>
              <rect x="150" y="410" width="70" height="150" rx="35" fill="#dbe1e8"/>
              <rect x="804" y="410" width="70" height="150" rx="35" fill="#dbe1e8"/>
            </g>
            <rect x="290" y="390" width="444" height="220" rx="70" fill="#22405f"/>
            <circle cx="400" cy="500" r="34" fill="#f7791e"/>
            <circle cx="624" cy="500" r="34" fill="#f7791e"/>
            <path d="M462 555q50 42 100 0" stroke="#f7791e" strokeWidth="20" strokeLinecap="round" fill="none"/>
          </svg>
        )}
      </button>
    </div>
  );
}