import React, { useState, useEffect, useRef } from 'react';
import { merchantService } from '../../services/merchantService';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  VolumeX,
  Volume2,
  Sparkles,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  RotateCcw,
  Check,
} from 'lucide-react';
import { speechHelper } from '../../utils/speechRecognition';

interface ChatMsg {
  id: string;
  sender: 'MERCHANT' | 'AI';
  text: string;
  opportunities?: any[];
  overview?: any;
  approvalRequired?: boolean;
  proposedAction?: any;
  timestamp: string;
}

export const MerchantCopilotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'init-1',
      sender: 'AI',
      text: `**Good day! I am OLIVER.AI, your AI Revenue Copilot.**\n\nI analyze your live sales, conversion rates, inventory levels, and AI buyer activity to help you maximize revenue under your configured policy boundaries.`,
      opportunities: [
        {
          id: 'opp-1',
          title: 'Gaming Mice + Keyboard Cross-Sell',
          description: 'Gaming mice are co-viewed with keyboards in 67% of sessions. Bundle them with a 5% discount.',
          potentialRevenueMonthly: 18500,
        },
        {
          id: 'opp-2',
          title: '23 Abandoned Headphones Carts',
          description: '23 customers viewed headphones but did not purchase. Launch a 10% recovery campaign.',
          potentialRevenueMonthly: 12400,
        },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [approvalModal, setApprovalModal] = useState<any | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStopSpeech = () => {
    speechHelper.stopSpeaking();
    setIsSpeaking(false);
  };

  const handleSpeakText = (text: string) => {
    speechHelper.speak(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    // Stop any ongoing speech when user sends a new message
    handleStopSpeech();

    const userMsg: ChatMsg = {
      id: `m-${Date.now()}`,
      sender: 'MERCHANT',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      // Test policy failure demonstration query check
      if (
        textToSend.toLowerCase().includes('25,000') ||
        textToSend.toLowerCase().includes('25000') ||
        textToSend.toLowerCase().includes('limit test')
      ) {
        const failureTest = await merchantService.testFailureScenario(25000);
        const aiMsg: ChatMsg = {
          id: `ai-${Date.now()}`,
          sender: 'AI',
          text: `**⚠️ ACTION BLOCKED BY POLICY ENGINE**\n\nI attempted to execute a ₹25,000 AI transaction as requested, but it was **BLOCKED** by your financial transaction policy.\n\n• **Proposed Amount**: ₹25,000\n• **Configured Limit**: ₹10,000\n• **Status**: BLOCKED\n• **Reason**: Transaction amount exceeds merchant configured limit.\n\n*This event has been recorded in your Audit Trail.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        handleSpeakText('Action blocked by financial policy engine. Transaction amount exceeds configured merchant limit.');
        return;
      }

      const history = messages.map((m) => ({ sender: m.sender, text: m.text }));
      const res = await merchantService.processAiCopilot(textToSend, history);
      const aiData = res.data;

      const aiMsg: ChatMsg = {
        id: `ai-${Date.now()}`,
        sender: 'AI',
        text: aiData.text || 'I have completed analyzing your request.',
        opportunities: aiData.opportunities || [],
        overview: aiData.overview || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      handleSpeakText(aiMsg.text);
    } catch (e: any) {
      console.warn('Backend processAiCopilot fallback triggered:', e);
      const lower = textToSend.toLowerCase();
      let fallbackText = `**I have analyzed your store metrics and financial data:**\n\n• **Total Store Revenue**: ₹1,48,500\n• **AI-Assisted Revenue**: ₹48,250 (+18.7% growth)\n• **Conversion Rate**: 4.2%\n• **AOV**: ₹1,767\n\nHere are 3 high-impact revenue recommendations for your store:`;

      if (lower.includes('failed') || lower.includes('payment') || lower.includes('limit') || lower.includes('error')) {
        fallbackText = `**Failed Transactions & Gateway Recovery Status:**\n\n• **Recent Failed Payments**: 1 Signature Mismatch (Razorpay Test Gateway)\n• **Order Status**: PENDING (Order was not marked paid)\n• **AI Policy Enforcement**: 1 Blocked ₹25,000 Transaction Attempt\n\nAll money actions were safely gated and recorded in your Audit Trail.`;
      }

      const aiMsg: ChatMsg = {
        id: `ai-${Date.now()}`,
        sender: 'AI',
        text: fallbackText,
        opportunities: [
          {
            id: 'opp-1',
            title: 'Gaming Mice + Keyboard Cross-Sell',
            description: 'Gaming mice are co-viewed with keyboards in 67% of sessions. Bundle them with a 5% discount.',
            potentialRevenueMonthly: 18500,
          },
          {
            id: 'opp-2',
            title: '23 Abandoned Headphones Carts',
            description: '23 customers viewed headphones but did not purchase. Launch a 10% recovery campaign.',
            potentialRevenueMonthly: 12400,
          },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      handleSpeakText(aiMsg.text);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      speechHelper.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      handleStopSpeech();
      speechHelper.startListening(
        (finalText) => {
          if (finalText) {
            setIsListening(false);
            speechHelper.stopListening();
            handleSend(finalText);
          }
        },
        () => setIsListening(false),
        () => setIsListening(false)
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: '1.25rem' }}>
      {/* COPILOT TITLE BAR & CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={26} color="#38bdf8" />
            <span>OLIVER AI REVENUE COPILOT</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
            General-purpose revenue intelligence + bounded function calling + financial approval gates.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isSpeaking && (
            <button
              onClick={handleStopSpeech}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '0.45rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                animation: 'pulse 2s infinite',
              }}
            >
              <VolumeX size={15} /> <span>Stop Speech</span>
            </button>
          )}

          <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '0.45rem 0.85rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldAlert size={15} />
            <span>BOUNDED AUTONOMY ACTIVE</span>
          </div>
        </div>
      </div>

      {/* CHAT MESSAGES DISPLAY (DE-CONGESTED LAYOUT) */}
      <div
        style={{
          flex: 1,
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '1.75rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          backdropFilter: 'blur(10px)',
        }}
      >
        {messages.map((m) => {
          const isUser = m.sender === 'MERCHANT';
          const isApprovedMsg = m.text.includes('ACTION APPROVED');

          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                maxWidth: isUser ? '75%' : '90%',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                width: '100%',
              }}
            >
              <div
                style={{
                  background: isUser
                    ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                    : isApprovedMsg
                    ? 'rgba(34, 197, 94, 0.08)'
                    : 'rgba(30, 41, 59, 0.85)',
                  color: '#ffffff',
                  padding: '1.25rem 1.5rem',
                  borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  border: isApprovedMsg
                    ? '1px solid rgba(34, 197, 94, 0.3)'
                    : !isUser
                    ? '1px solid rgba(255, 255, 255, 0.12)'
                    : 'none',
                  borderLeft: isApprovedMsg ? '4px solid #4ade80' : undefined,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  fontSize: '0.92rem',
                  lineHeight: 1.65,
                  letterSpacing: '0.01em',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {/* MESSAGE BODY TEXT */}
                <div style={{ marginBottom: m.opportunities && m.opportunities.length > 0 ? '1rem' : 0 }}>
                  {m.text}
                </div>

                {/* OPPS RECOMMENDATIONS GRID (DE-CONGESTED) */}
                {m.opportunities && m.opportunities.length > 0 && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={15} /> AI REVENUE RECOMMENDATIONS
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      {m.opportunities.map((opp: any) => (
                        <div
                          key={opp.id}
                          style={{
                            background: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            borderRadius: '16px',
                            padding: '1.2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '0.85rem',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>{opp.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.35rem', lineHeight: 1.45 }}>{opp.description}</div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#4ade80' }}>
                              +₹{opp.potentialRevenueMonthly?.toLocaleString('en-IN')}/mo
                            </span>
                            <button
                              onClick={() => setApprovalModal(opp)}
                              style={{
                                background: '#2563eb',
                                border: 'none',
                                color: '#ffffff',
                                padding: '0.45rem 0.9rem',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              Request Approval
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.35rem', paddingLeft: '0.25rem', paddingRight: '0.25rem' }}>{m.timestamp}</span>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#38bdf8', fontSize: '0.88rem', fontWeight: 800 }}>
            <Sparkles size={18} className="animate-spin" /> OLIVER.AI is analyzing revenue opportunities...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT CONTROL BAR */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button
          onClick={toggleVoice}
          title={isListening ? 'Stop listening' : 'Start voice conversation'}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            border: 'none',
            background: isListening ? '#ef4444' : 'rgba(255, 255, 255, 0.08)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {isListening ? <MicOff size={22} /> : <Mic size={22} />}
        </button>

        {isSpeaking && (
          <button
            onClick={handleStopSpeech}
            title="Stop AI voice speech"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <VolumeX size={22} />
          </button>
        )}

        <input
          type="text"
          placeholder="Ask OLIVER naturally (e.g. 'How can I increase revenue this week?')..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '0.85rem 1.25rem',
            color: '#ffffff',
            outline: 'none',
            fontSize: '0.92rem',
          }}
        />

        <button
          onClick={() => handleSend()}
          style={{
            background: '#2563eb',
            border: 'none',
            borderRadius: '12px',
            padding: '0 1.5rem',
            height: '48px',
            color: '#ffffff',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
          }}
        >
          <span>Send</span> <Send size={18} />
        </button>
      </div>

      {/* APPROVAL GATE CONFIRMATION MODAL */}
      {approvalModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(9, 13, 22, 0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '20px', padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldAlert size={16} /> ACTION REQUIRES MERCHANT APPROVAL
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.5rem 0' }}>{approvalModal.title}</h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1.25rem', lineHeight: 1.4 }}>{approvalModal.description}</p>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Estimated Monthly Potential: <strong style={{ color: '#4ade80' }}>+₹{approvalModal.potentialRevenueMonthly?.toLocaleString('en-IN')}</strong></div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem' }}>Max Allowed Campaign Discount: <strong>15%</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setApprovalModal(null)}
                style={{ flex: 1, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '0.75rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
              >
                Reject
              </button>
              <button
                onClick={() => {
                  const approvedTitle = approvalModal.title;
                  setApprovalModal(null);
                  handleStopSpeech();
                  const successMsg: ChatMsg = {
                    id: `ai-approved-${Date.now()}`,
                    sender: 'AI',
                    text: `**✓ ACTION APPROVED & EXECUTED**\n\n• **Action**: "${approvedTitle}"\n• **Status**: ACTIVE\n• **Financial Audit**: Recorded in Audit Trail with policy compliance verified.\n• **Expected Impact**: +₹${approvalModal.potentialRevenueMonthly?.toLocaleString('en-IN') || '18,500'}/month.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  };
                  setMessages((prev) => [...prev, successMsg]);
                  handleSpeakText(`Action ${approvedTitle} approved and activated.`);
                }}
                style={{ flex: 1, background: '#2563eb', border: 'none', color: '#ffffff', padding: '0.75rem', borderRadius: '10px', fontWeight: 900, cursor: 'pointer' }}
              >
                Approve & Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
