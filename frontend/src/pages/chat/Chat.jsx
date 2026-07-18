import { useState } from 'react';
import { Send, Phone, MoreVertical } from 'lucide-react';
import AppShell from '../../layouts/AppShell';

const initMessages = [
  { id: 1, text: 'Hi, are you still offering a ride to Infinity?', sender: 'me', time: '09:00 AM' },
  { id: 2, text: 'Yes! 2 seats left. Pickup at ISKCON gate.', sender: 'other', time: '09:02 AM' },
  { id: 3, text: "Perfect, I'll be at Gate 2.", sender: 'me', time: '09:05 AM' },
];

const contacts = [
  { id: 1, name: 'Raj Patel', last: "Perfect, I'll be at Gate 2.", time: '09:05 AM', unread: 0, active: true },
  { id: 2, name: 'Sneha Mehta', last: 'Can we stop at the café?', time: 'Yesterday', unread: 2, active: false },
  { id: 3, name: 'Krishna Singh', last: 'See you tomorrow!', time: 'Mon', unread: 0, active: false },
];

export default function Chat() {
  const [messages, setMessages] = useState(initMessages);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { id: Date.now(), text: input.trim(), sender: 'me', time: 'Now' }]);
    setInput('');
  };

  return (
    <AppShell title="Messages">
      <div className="chat-shell">
        {/* Contact list */}
        <div className="contact-list">
          <div className="contact-search">
            <input placeholder="Search conversations..." />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {contacts.map(c => (
              <div key={c.id} className={`contact-item ${c.active ? 'active' : ''}`}>
                <div className="user-avatar" style={{ width: 38, height: 38, flexShrink: 0 }}>{c.name[0]}</div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span className="contact-name">{c.name}</span>
                    <span className="contact-time">{c.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="contact-last">{c.last}</span>
                    {c.unread > 0 && <span className="unread-badge">{c.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="chat-area">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="user-avatar" style={{ width: 36, height: 36 }}>R</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Raj Patel</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600 }}>Online</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost btn-icon"><Phone size={16} /></button>
              <button className="btn btn-ghost btn-icon"><MoreVertical size={16} /></button>
            </div>
          </div>

          <div className="messages-area">
            {messages.map(m => (
              <div key={m.id}>
                <div className={`message-bubble ${m.sender === 'me' ? 'message-me' : 'message-other'}`}>{m.text}</div>
                <div className={`message-time ${m.sender === 'me' ? 'message-time-me' : ''}`}>{m.time}</div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              className="chat-input"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button className="btn btn-primary btn-icon" onClick={send} aria-label="Send">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
