'use client';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

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
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);
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

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      setVoiceSupported(true);
    }
  }, []);

  if (isDigitalCardRoute(pathname)) return null;

  function toggleVoiceInput() {
    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionApi) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognitionApi();
    // Use the visitor's own browser/device language automatically — most
    // phones in India are already set to the owner's preferred language,
    // so this avoids making them pick from a dropdown. Falls back to
    // Indian English if the browser doesn't report a specific language.
    recognition.lang = (navigator.language || 'en-IN');
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setInput(prev => (prev ? prev + ' ' : '') + transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

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
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
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

              <div style={{ padding: 10, borderTop: '1px solid #e2e8f0', background: 'white' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {voiceSupported && (
                    <button
                      onClick={toggleVoiceInput}
                      aria-label={listening ? 'Stop recording' : 'Speak your question'}
                      style={{
                        background: listening ? '#dc2626' : '#f1f5f9',
                        color: listening ? 'white' : '#334155',
                        border: 'none', borderRadius: 10, width: 38, height: 38, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', fontSize: 16,
                      }}
                    >
                      {listening ? '⏹️' : '🎤'}
                    </button>
                  )}
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={listening ? 'Listening…' : 'Type your question…'}
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
          padding: 0, overflow: 'hidden',
        }}
      >
        {open ? (
          <span style={{ fontSize: 24, lineHeight: 1, color: 'white' }}>×</span>
        ) : (
          <Image src="/chatbot-icon.png" alt="Chat with us" width={60} height={60} priority />
        )}
      </button>
    </div>
  );
}