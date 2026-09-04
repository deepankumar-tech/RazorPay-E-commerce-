import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOliver } from '../../context/OliverContext';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  MessageSquare,
  Volume2,
  VolumeX,
  Send,
  Bot,
  Zap,
} from 'lucide-react';

export const OliverVoiceOverlay: React.FC = () => {
  const {
    isVoiceOverlayOpen,
    closeVoiceOverlay,
    voiceState,
    audioLevel,
    speechInterimText,
    speechError,
    messages,
    sendMessage,
    toggleVoice,
    openCopilot,
  } = useOliver();

  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  if (!isVoiceOverlayOpen) return null;

  const getOrbGradient = () => {
    switch (voiceState) {
      case 'LISTENING':
        return 'radial-gradient(circle at 30% 30%, #38bdf8 0%, #0284c7 60%, #0369a1 100%)';
      case 'PROCESSING':
        return 'radial-gradient(circle at 30% 30%, #c084fc 0%, #9333ea 60%, #581c87 100%)';
      case 'EXECUTING':
        return 'radial-gradient(circle at 30% 30%, #4ade80 0%, #16a34a 60%, #15803d 100%)';
      case 'SPEAKING':
        return 'radial-gradient(circle at 30% 30%, #60a5fa 0%, #2563eb 60%, #1d4ed8 100%)';
      case 'ERROR':
        return 'radial-gradient(circle at 30% 30%, #f87171 0%, #dc2626 60%, #991b1b 100%)';
      default:
        return 'radial-gradient(circle at 30% 30%, #38bdf8 0%, #1d4ed8 60%, #0f172a 100%)';
    }
  };

  const getOrbGlow = () => {
    switch (voiceState) {
      case 'LISTENING':
        return '0 0 70px rgba(56, 189, 248, 0.65), inset 0 0 30px rgba(255, 255, 255, 0.4)';
      case 'PROCESSING':
        return '0 0 70px rgba(168, 85, 247, 0.65), inset 0 0 30px rgba(255, 255, 255, 0.4)';
      case 'EXECUTING':
        return '0 0 70px rgba(34, 197, 94, 0.65), inset 0 0 30px rgba(255, 255, 255, 0.4)';
      case 'SPEAKING':
        return '0 0 80px rgba(37, 99, 235, 0.75), inset 0 0 35px rgba(255, 255, 255, 0.5)';
      case 'ERROR':
        return '0 0 60px rgba(239, 68, 68, 0.65)';
      default:
        return '0 0 50px rgba(56, 189, 248, 0.45)';
    }
  };

  const getStatusText = () => {
    switch (voiceState) {
      case 'LISTENING':
        return 'Listening... Speak naturally';
      case 'PROCESSING':
        return 'OLIVER.AI is thinking...';
      case 'EXECUTING':
        return 'Executing application action...';
      case 'SPEAKING':
        return 'OLIVER is speaking...';
      case 'ERROR':
        return speechError || 'Voice connection issue';
      default:
        return 'Tap microphone to speak';
    }
  };

  const lastAiMessage = [...messages].reverse().find((m) => m.sender === 'AI');

  const handleSendText = () => {
    if (!textInput.trim()) return;
    sendMessage(textInput);
    setTextInput('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, #0f172a 0%, #090d16 80%, #020617 100%)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2rem 1.5rem',
          backdropFilter: 'blur(20px)',
          fontFamily: "'Outfit', 'Inter', sans-serif",
        }}
      >
        {/* TOP HEADER CONTROL BAR */}
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(37,99,235,0.4)', border: '1px solid #60a5fa' }}>
              <Bot size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
                OLIVER<span style={{ color: '#38bdf8' }}>.AI</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>REAL-TIME VOICE MODE</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => {
                closeVoiceOverlay();
                openCopilot();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                padding: '0.45rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <MessageSquare size={14} /> Open Text Chat
            </button>

            <button
              onClick={closeVoiceOverlay}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CENTER ANIMATED OLIVER ORB */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative', width: '100%' }}>
          {/* Ambient Outer Ring Pulse */}
          <motion.div
            animate={{
              scale: voiceState === 'LISTENING' ? [1, 1.25, 1] : voiceState === 'SPEAKING' ? [1, 1.35, 1] : [1, 1.1, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: voiceState === 'SPEAKING' ? 1.2 : 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.05) 70%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Central OLIVER Orb */}
          <motion.div
            animate={{
              scale: voiceState === 'LISTENING' ? 1 + audioLevel * 0.25 : voiceState === 'SPEAKING' ? [1, 1.18, 1.05, 1.15, 1] : voiceState === 'PROCESSING' ? [1, 1.08, 1] : [1, 1.04, 1],
              rotate: voiceState === 'PROCESSING' ? 360 : 0,
            }}
            transition={{
              scale: voiceState === 'SPEAKING' ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 },
              rotate: voiceState === 'PROCESSING' ? { duration: 3, repeat: Infinity, ease: 'linear' } : { duration: 0.5 },
            }}
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: getOrbGradient(),
              boxShadow: getOrbGlow(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 2,
            }}
            onClick={toggleVoice}
          >
            <Bot size={54} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />
          </motion.div>

          {/* Live Status Headline */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="#38bdf8" />
              <span>{getStatusText()}</span>
            </div>

            {/* Interim Transcript Preview */}
            {speechInterimText && (
              <div style={{ marginTop: '0.85rem', color: '#38bdf8', fontSize: '1rem', fontWeight: 600, maxWidth: '600px', padding: '0 1rem' }}>
                "{speechInterimText}"
              </div>
            )}

            {/* Last AI Voice Text Preview */}
            {!speechInterimText && lastAiMessage && (
              <div style={{ marginTop: '0.85rem', color: '#cbd5e1', fontSize: '0.9rem', maxWidth: '600px', padding: '0 1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {lastAiMessage.text.replace(/\*\*/g, '')}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM FLOATING CONTROL BAR */}
        <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          {showTextInput && (
            <div style={{ width: '100%', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Type query to OLIVER..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendText(); }}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  color: '#ffffff',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
              <button
                onClick={handleSendText}
                style={{
                  background: '#2563eb',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 1.2rem',
                  color: '#ffffff',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Send size={18} />
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'rgba(15, 23, 42, 0.85)', padding: '0.65rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)' }}>
            <button
              onClick={() => setShowTextInput(!showTextInput)}
              title="Type input"
              style={{ background: 'none', border: 'none', color: showTextInput ? '#38bdf8' : '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700 }}
            >
              <MessageSquare size={18} />
              <span>{showTextInput ? 'Hide Input' : 'Type'}</span>
            </button>

            {/* Central Mic Pulse Button */}
            <button
              onClick={toggleVoice}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: 'none',
                background: voiceState === 'LISTENING' ? '#ef4444' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: voiceState === 'LISTENING' ? '0 0 25px rgba(239,68,68,0.6)' : '0 0 25px rgba(37,99,235,0.6)',
                cursor: 'pointer',
              }}
            >
              {voiceState === 'LISTENING' ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            <button
              onClick={closeVoiceOverlay}
              title="End Voice Session"
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700 }}
            >
              <X size={18} />
              <span>End Voice</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
