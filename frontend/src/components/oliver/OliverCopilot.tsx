import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOliver } from '../../context/OliverContext';
import { useCart } from '../../context/CartContext';
import {
  Bot,
  User,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Plus,
  Star,
  Zap,
  X,
  Minus,
  ShoppingCart,
  Cpu,
  History,
  Trash2,
  MessageSquare,
  CheckCircle2,
  Volume2,
  VolumeX,
  ArrowRight,
  Sliders,
} from 'lucide-react';

const SoundWave: React.FC<{ color?: string }> = ({ color = '#38bdf8' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', height: '14px', margin: '0 4px', verticalAlign: 'middle' }}>
    <span style={{ width: '3px', background: color, borderRadius: '3px', animation: 'waveBar 0.8s infinite ease-in-out 0s', display: 'inline-block' }} />
    <span style={{ width: '3px', background: color, borderRadius: '3px', animation: 'waveBar 0.8s infinite ease-in-out 0.2s', display: 'inline-block' }} />
    <span style={{ width: '3px', background: color, borderRadius: '3px', animation: 'waveBar 0.8s infinite ease-in-out 0.4s', display: 'inline-block' }} />
    <span style={{ width: '3px', background: color, borderRadius: '3px', animation: 'waveBar 0.8s infinite ease-in-out 0.1s', display: 'inline-block' }} />
  </span>
);

export const OliverCopilot: React.FC = () => {
  const {
    isOpen,
    isMinimized,
    messages,
    sessions,
    activeSessionId,
    loading,
    isListening,
    voiceSpeechEnabled,
    speakingMsgId,
    speechInterimText,
    speechError,
    actionStatus,
    inputQuery,
    setInputQuery,
    openCopilot,
    closeCopilot,
    minimizeCopilot,
    expandCopilot,
    sendMessage,
    startNewChat,
    selectSession,
    deleteSession,
    toggleVoice,
    toggleVoiceSpeechEnabled,
    speakMessage,
    executeDirectAddToCart,
  } = useOliver();

  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading, actionStatus]);

  const samplePrompts = [
    'Find headphones under ₹5,000',
    'Which one is best for gaming?',
    'Take me to my cart',
    'Show me active offers',
  ];

  const renderFormattedText = (text: string, isUserMessage: boolean = false) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((rawLine, idx) => {
      const line = rawLine.trim();

      if (!line) return <div key={idx} style={{ height: '0.35rem' }} />;

      if (line === '---' || line === '***') {
        return <div key={idx} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', margin: '0.75rem 0' }} />;
      }

      if (line.startsWith('#')) {
        const headerText = line.replace(/^#+\s*/, '').replace(/\*\*/g, '');
        return (
          <div
            key={idx}
            style={{
              fontSize: '1rem',
              fontWeight: 900,
              color: isUserMessage ? '#ffffff' : '#38bdf8',
              marginTop: '0.75rem',
              marginBottom: '0.35rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            {headerText}
          </div>
        );
      }

      const formatInline = (str: string) => {
        const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        return parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} style={{ color: '#ffffff', fontWeight: 900 }}>
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
            return (
              <span key={pIdx} style={{ color: isUserMessage ? '#f1f5f9' : '#e2e8f0', fontStyle: 'italic' }}>
                {part.slice(1, -1)}
              </span>
            );
          }
          return part;
        });
      };

      const isBullet = line.startsWith('->') || line.startsWith('•') || line.startsWith('- ') || (line.startsWith('* ') && !line.startsWith('**'));

      if (isBullet) {
        const bulletText = line.replace(/^(->|•|-|\*)\s*/, '');
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              margin: '0.3rem 0',
              paddingLeft: '0.2rem',
              lineHeight: 1.55,
              fontSize: isUserMessage ? '0.94rem' : '0.9rem',
              color: isUserMessage ? '#ffffff' : '#e2e8f0',
              fontWeight: isUserMessage ? 600 : 400,
            }}
          >
            <span style={{ color: isUserMessage ? '#93c5fd' : '#38bdf8', fontWeight: 900, fontSize: '0.82rem', marginTop: '2px', flexShrink: 0 }}>➔</span>
            <div style={{ flex: 1 }}>{formatInline(bulletText)}</div>
          </div>
        );
      }

      return (
        <div key={idx} style={{ marginBottom: '0.3rem', lineHeight: 1.55, color: isUserMessage ? '#ffffff' : '#cbd5e1', fontSize: isUserMessage ? '0.94rem' : '0.91rem', fontWeight: isUserMessage ? 600 : 400 }}>
          {formatInline(line)}
        </div>
      );
    });
  };

  // 1. FLOATING MINIMIZED BUTTON OR CLOSED ORB
  if (!isOpen || isMinimized) {
    return (
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
        <button
          onClick={isOpen ? expandCopilot : () => openCopilot()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
            color: '#ffffff',
            padding: '0.85rem 1.4rem',
            borderRadius: '50px',
            border: '1.5px solid rgba(147, 197, 253, 0.4)',
            fontWeight: 800,
            fontSize: '0.9rem',
            boxShadow: '0 10px 30px rgba(37, 99, 235, 0.45)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 14px 35px rgba(37, 99, 235, 0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(37, 99, 235, 0.45)';
          }}
        >
          <Bot size={22} color="#ffffff" />
          <span>Ask AI Shopping Copilot</span>
          <span style={{ background: '#f59e0b', color: '#000000', fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '10px', fontWeight: 900 }}>
            LIVE
          </span>
        </button>
      </div>
    );
  }

  // 2. OPEN FLOATING AUTONOMOUS COPILOT PANEL OVERLAY
  return (
    <div className="oliver-copilot-container">
      <style>{`
        .oliver-copilot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 460px;
          max-width: calc(100vw - 32px);
          height: 670px;
          max-height: calc(100vh - 40px);
          background: linear-gradient(135deg, #0b0f19 0%, #0f172a 60%, #1e1b4b 100%);
          border-radius: 20px;
          border: 1.5px solid rgba(99, 102, 241, 0.35);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Outfit', 'Inter', sans-serif;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .oliver-copilot-container {
            bottom: 0;
            right: 0;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            max-width: 100vw;
            max-height: 100vh;
            border-radius: 0;
          }
        }

        .copilot-chat-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .copilot-msg-user-row {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          padding-left: 12px;
          padding-right: 12px;
        }

        .copilot-msg-user-wrapper {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: flex-end;
          gap: 0.65rem;
          width: fit-content;
          max-width: 82%;
          min-width: 0;
          box-sizing: border-box;
        }

        .copilot-user-bubble {
          padding: 0.9rem 1.2rem;
          border-radius: 18px 4px 18px 18px;
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
          color: #ffffff;
          border: 1px solid rgba(147, 197, 253, 0.4);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
          width: fit-content;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow-wrap: anywhere;
          word-break: break-word;
          white-space: pre-wrap;
        }
      `}</style>

      {/* TOP COPILOT HEADER BAR */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          padding: '0.9rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)',
              border: '1px solid #60a5fa',
              position: 'relative',
            }}
          >
            <Bot size={22} />
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', border: '1.5px solid #0f172a' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>
                OLIVER<span style={{ color: '#38bdf8' }}>.AI</span>
              </span>
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.15rem 0.5rem', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 800 }}>
                GLOBAL AGENT
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Autonomous Shopping Copilot</span>
          </div>
        </div>

        {/* Top Control Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={toggleVoiceSpeechEnabled}
            title={voiceSpeechEnabled ? 'Speech Synthesis Enabled' : 'Speech Muted'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: voiceSpeechEnabled ? '#4ade80' : '#64748b', padding: '0.35rem' }}
          >
            {voiceSpeechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            onClick={startNewChat}
            title="Start New Conversation"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '0.35rem' }}
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            title="History"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: showHistory ? '#38bdf8' : '#cbd5e1', padding: '0.35rem' }}
          >
            <History size={16} />
          </button>
          <button
            onClick={minimizeCopilot}
            title="Minimize"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '0.35rem' }}
          >
            <Minus size={16} />
          </button>
          <button
            onClick={closeCopilot}
            title="Close"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.35rem' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ACTION STATUS BANNER */}
      {actionStatus && (
        <div style={{ background: 'rgba(56, 189, 248, 0.15)', borderBottom: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.5rem 1rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={14} /> {actionStatus}
        </div>
      )}

      {/* HISTORY DRAWER VIEW */}
      {showHistory ? (
        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: 'rgba(15, 23, 42, 0.95)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📜 Conversation Threads</span>
            <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              Back to chat ➔
            </button>
          </div>
          {sessions.map((sess) => (
            <div
              key={sess.id}
              onClick={() => {
                selectSession(sess);
                setShowHistory(false);
              }}
              style={{
                padding: '0.75rem',
                borderRadius: '10px',
                background: sess.id === activeSessionId ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: sess.id === activeSessionId ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {sess.title || 'Session'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{sess.messages?.length || 0} messages</div>
              </div>
              <button onClick={(e) => deleteSession(e, sess.id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* MAIN CHAT MESSAGES SCROLL AREA */
        <div ref={chatScrollRef} className="copilot-chat-scroll">
          {messages.map((msg) => {
            const isUser = msg.sender === 'USER';

            if (isUser) {
              return (
                <div key={msg.id} className="copilot-msg-user-row">
                  <div className="copilot-msg-user-wrapper">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 0, maxWidth: 'calc(100% - 46px)' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#60a5fa', marginBottom: '0.25rem' }}>
                        YOUR PROMPT
                      </div>
                      <div className="copilot-user-bubble">
                        {renderFormattedText(msg.text, true)}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                        {msg.timestamp}
                      </span>
                    </div>

                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid rgba(147, 197, 253, 0.4)',
                      }}
                    >
                      <User size={17} />
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} style={{ display: 'flex', gap: '0.65rem', width: '100%', minWidth: 0 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                  }}
                >
                  <Bot size={19} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0, maxWidth: 'calc(100% - 46px)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Cpu size={13} /> OLIVER.AI
                  </div>

                  <div
                    style={{
                      padding: '0.9rem 1.15rem',
                      borderRadius: '4px 18px 18px 18px',
                      background: 'rgba(30, 41, 59, 0.75)',
                      color: '#ffffff',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderLeft: '3px solid #38bdf8',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      width: '100%',
                      boxSizing: 'border-box',
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                    }}
                  >
                    {renderFormattedText(msg.text, false)}

                    {/* RECOMMENDED PRODUCTS CARDS INSIDE COPILOT */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div style={{ marginTop: '0.85rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {msg.recommendedProducts.slice(0, 3).map((prod: any, pIdx: number) => (
                          <div
                            key={pIdx}
                            style={{
                              background: 'rgba(15, 23, 42, 0.8)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '12px',
                              padding: '0.75rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem',
                            }}
                          >
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                              <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: '#ffffff', padding: '0.2rem', flexShrink: 0 }}>
                                <img src={prod.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120'} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {prod.name}
                                </div>
                                <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#38bdf8' }}>
                                  ₹{prod.price?.toLocaleString('en-IN')}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.45rem' }}>
                              <button
                                onClick={() => executeDirectAddToCart(prod)}
                                style={{
                                  flex: 1,
                                  padding: '0.45rem',
                                  borderRadius: '8px',
                                  border: 'none',
                                  background: '#2563eb',
                                  color: '#ffffff',
                                  fontWeight: 800,
                                  fontSize: '0.76rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.35rem',
                                }}
                              >
                                <ShoppingCart size={14} /> Add to Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Speech Replay Button */}
                    <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <button
                        onClick={() => speakMessage(msg.id, msg.text)}
                        style={{
                          background: speakingMsgId === msg.id ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                          border: speakingMsgId === msg.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '6px',
                          padding: '0.25rem 0.55rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: speakingMsgId === msg.id ? '#38bdf8' : '#cbd5e1',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        {speakingMsgId === msg.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        {speakingMsgId === msg.id ? 'Speaking...' : 'Replay Voice'}
                      </button>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#38bdf8', padding: '0.4rem 0' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #38bdf8', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>OLIVER.AI is evaluating catalog & execute action...</span>
            </div>
          )}
        </div>
      )}

      {/* BOTTOM COPILOT INPUT AREA */}
      <div
        style={{
          padding: '0.85rem 1rem',
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}
      >
        {/* Sample Prompt Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.15rem' }}>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(p)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                padding: '0.25rem 0.65rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#cbd5e1',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              "{p}"
            </button>
          ))}
        </div>

        {/* Listening Bar */}
        {isListening && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', padding: '0.45rem 0.75rem', color: '#f87171', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Mic size={14} />
              <span>🎙️ Listening... {speechInterimText ? `"${speechInterimText}"` : 'Speak now'}</span>
            </div>
            <button onClick={toggleVoice} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '0.15rem 0.45rem', fontSize: '0.7rem', cursor: 'pointer' }}>
              Stop
            </button>
          </div>
        )}

        {/* Input Controls */}
        <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={toggleVoice}
            title="Voice Recognition"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              border: isListening ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
              background: isListening ? '#ef4444' : 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            placeholder="Ask OLIVER anything..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
            style={{
              flex: 1,
              padding: '0.65rem 0.9rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading || !inputQuery.trim()}
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              border: 'none',
              background: loading || !inputQuery.trim() ? '#475569' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: loading || !inputQuery.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
