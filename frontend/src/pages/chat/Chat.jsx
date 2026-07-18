import DashboardLayout from '../../layouts/DashboardLayout';
import { Send, Phone, MoreVertical } from 'lucide-react';
import { useState } from 'react';

function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi, are you still offering a ride to Office Block A?', sender: 'me', time: '09:00 AM' },
    { id: 2, text: 'Yes! I have 2 seats left. Pick up is at Green Valley.', sender: 'other', time: '09:02 AM' },
    { id: 3, text: 'Great, I will be waiting near Gate 2.', sender: 'me', time: '09:05 AM' },
  ]);

  const contacts = [
    { id: 1, name: 'Rahul Sharma', lastMessage: 'Great, I will be waiting near...', time: '09:05 AM', unread: 0, active: true },
    { id: 2, name: 'Priya Patel', lastMessage: 'Can we stop by the cafe?', time: 'Yesterday', unread: 2, active: false },
  ];

  return (
    <DashboardLayout title="Messages">
      <div className="erp-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', height: 'calc(100vh - 200px)' }}>
        
        {/* Contact List */}
        <div style={{ width: '320px', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--line)' }}>
            <input type="text" placeholder="Search chats..." style={{ 
              width: '100%', 
              padding: '10px 16px', 
              borderRadius: '8px', 
              border: '1px solid var(--line-strong)',
              background: 'var(--bg-soft)',
              outline: 'none'
            }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {contacts.map(c => (
              <div key={c.id} style={{ 
                padding: '16px 20px', 
                borderBottom: '1px solid var(--line)', 
                display: 'flex', 
                gap: '12px',
                cursor: 'pointer',
                background: c.active ? 'rgba(34, 160, 107, 0.05)' : 'transparent'
              }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                  {c.name[0]}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{c.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.lastMessage}
                    </p>
                    {c.unread > 0 && (
                      <span style={{ background: 'var(--accent)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Chat Header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                R
              </div>
              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: '1rem' }}>Rahul Sharma</h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Online</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--muted)' }}>
              <button className="secondary-button" style={{ width: '36px', height: '36px', padding: 0 }}><Phone size={16} /></button>
              <button className="secondary-button" style={{ width: '36px', height: '36px', padding: 0 }}><MoreVertical size={16} /></button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-soft)' }}>
            {messages.map(m => (
              <div key={m.id} style={{ 
                alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start',
                maxWidth: '70%'
              }}>
                <div style={{ 
                  background: m.sender === 'me' ? 'var(--brand)' : 'var(--panel-solid)', 
                  color: m.sender === 'me' ? 'var(--brand-dark)' : 'var(--text)',
                  padding: '12px 16px',
                  borderRadius: m.sender === 'me' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  marginBottom: '4px'
                }}>
                  <p style={{ margin: 0, lineHeight: 1.5 }}>{m.text}</p>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block', textAlign: m.sender === 'me' ? 'right' : 'left' }}>
                  {m.time}
                </span>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line)', background: 'var(--panel-solid)' }}>
            <div className="input-shell" style={{ borderRadius: '24px', paddingRight: '8px' }}>
              <input type="text" placeholder="Type a message..." style={{ fontSize: '0.95rem' }} />
              <button className="primary-button" style={{ width: '36px', height: '36px', minHeight: '36px', padding: 0, borderRadius: '50%' }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Chat;
