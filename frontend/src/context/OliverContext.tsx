import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { aiService } from '../services/aiService';
import { cartService } from '../services/cartService';
import { productService } from '../services/productService';
import { paymentService } from '../services/paymentService';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { speechHelper } from '../utils/speechRecognition';

export type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'EXECUTING' | 'SPEAKING' | 'ERROR';

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  recommendedProducts?: any[];
  upsellProducts?: any[];
  comparedProducts?: any[];
  cartActionSuccess?: boolean;
  cartActionMessage?: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const createWelcomeMessage = (userName?: string): ChatMessage => {
  const name = userName ? userName.trim().split(' ')[0] : '';
  const greeting = name ? `Hi ${name}! 👋 I am OLIVER.AI, your Autonomous Shopping Copilot.` : `Hi there! 👋 I am OLIVER.AI, your Autonomous Shopping Copilot.`;

  return {
    id: `msg-${Date.now()}`,
    sender: 'AI',
    text: `**${greeting}**\n\nI am connected to your live shopping session. I can answer general knowledge questions, discover products, compare choices, update your cart, and guide you through checkout anywhere on the site!\n\nTry asking me:\n• *"Find headphones under ₹5,000"*\n• *"What is artificial intelligence?"*\n• *"Add the cheapest gaming mouse to my cart"*\n• *"Take me to checkout"*`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};

interface OliverContextType {
  isOpen: boolean;
  isMinimized: boolean;
  isVoiceOverlayOpen: boolean;
  voiceState: VoiceState;
  isListening: boolean;
  audioLevel: number;
  messages: ChatMessage[];
  sessions: ChatSession[];
  activeSessionId: string;
  loading: boolean;
  voiceSpeechEnabled: boolean;
  speakingMsgId: string | null;
  speechInterimText: string;
  speechError: string | null;
  actionStatus: string | null;
  currentProduct: any | null;
  inputQuery: string;
  setInputQuery: (val: string) => void;
  openCopilot: (query?: string) => void;
  closeCopilot: () => void;
  toggleCopilot: () => void;
  minimizeCopilot: () => void;
  expandCopilot: () => void;
  openVoiceOverlay: () => void;
  closeVoiceOverlay: () => void;
  toggleVoiceOverlay: () => void;
  sendMessage: (queryText?: string) => Promise<void>;
  startNewChat: () => void;
  selectSession: (session: ChatSession) => void;
  deleteSession: (e: React.MouseEvent, id: string) => void;
  toggleVoice: () => void;
  toggleVoiceSpeechEnabled: () => void;
  speakMessage: (id: string, text: string) => void;
  stopSpeaking: () => void;
  setCurrentProduct: (product: any) => void;
  executeDirectAddToCart: (product: any) => Promise<void>;
}

const OliverContext = createContext<OliverContextType | undefined>(undefined);

export const OliverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { cart, itemCount, fetchCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const userStorageKey = `commerceai_sessions_${user?.id || 'guest'}`;

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVoiceOverlayOpen, setIsVoiceOverlayOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [audioLevel, setAudioLevel] = useState<number>(0.2);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(true);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [speechInterimText, setSpeechInterimText] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);

  const latestTranscriptRef = useRef<string>('');
  const hasSentCurrentTranscriptRef = useRef<boolean>(false);
  const isContinuousVoiceModeRef = useRef<boolean>(false);

  // Load sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const savedActiveId = sessionStorage.getItem('commerceai_active_session_id');
    if (savedActiveId) return savedActiveId;
    const newId = generateUUID();
    sessionStorage.setItem('commerceai_active_session_id', newId);
    return newId;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const existing = sessions.find((s) => s.id === activeSessionId);
    if (existing && existing.messages?.length > 0) return existing.messages;
    return [createWelcomeMessage(user?.name)];
  });

  // Save sessions on messages change
  useEffect(() => {
    setSessions((prevSessions) => {
      const firstUserMsg = messages.find((m) => m.sender === 'USER');
      const title = firstUserMsg
        ? firstUserMsg.text.length > 32
          ? firstUserMsg.text.substring(0, 32) + '...'
          : firstUserMsg.text
        : 'Shopping Mission';

      const existingIndex = prevSessions.findIndex((s) => s.id === activeSessionId);
      const updatedSession: ChatSession = {
        id: activeSessionId,
        title,
        createdAt: existingIndex >= 0 ? prevSessions[existingIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages,
      };

      let newSessions: ChatSession[];
      if (existingIndex >= 0) {
        newSessions = [...prevSessions];
        newSessions[existingIndex] = updatedSession;
      } else {
        newSessions = [updatedSession, ...prevSessions];
      }

      try {
        localStorage.setItem(userStorageKey, JSON.stringify(newSessions));
      } catch (e) {
        console.error(e);
      }

      return newSessions;
    });
  }, [messages, activeSessionId, userStorageKey]);

  const openCopilot = (query?: string) => {
    setIsOpen(true);
    setIsMinimized(false);
    if (query) {
      sendMessage(query);
    }
  };

  const closeCopilot = () => {
    setIsOpen(false);
    setIsMinimized(false);
    stopSpeaking();
    speechHelper.stopListening();
    setVoiceState('IDLE');
  };

  const toggleCopilot = () => {
    if (isOpen) {
      closeCopilot();
    } else {
      openCopilot();
    }
  };

  const minimizeCopilot = () => {
    setIsMinimized(true);
  };

  const expandCopilot = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const openVoiceOverlay = () => {
    setIsVoiceOverlayOpen(true);
    isContinuousVoiceModeRef.current = true;
    startListeningLoop();
  };

  const closeVoiceOverlay = () => {
    setIsVoiceOverlayOpen(false);
    isContinuousVoiceModeRef.current = false;
    stopSpeaking();
    speechHelper.stopListening();
    setVoiceState('IDLE');
  };

  const toggleVoiceOverlay = () => {
    if (isVoiceOverlayOpen) {
      closeVoiceOverlay();
    } else {
      openVoiceOverlay();
    }
  };

  const startNewChat = () => {
    const newId = generateUUID();
    setActiveSessionId(newId);
    sessionStorage.setItem('commerceai_active_session_id', newId);
    setMessages([createWelcomeMessage(user?.name)]);
  };

  const selectSession = (sess: ChatSession) => {
    setActiveSessionId(sess.id);
    sessionStorage.setItem('commerceai_active_session_id', sess.id);
    if (sess.messages && sess.messages.length > 0) {
      setMessages(sess.messages);
    } else {
      setMessages([createWelcomeMessage(user?.name)]);
    }
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    if (id === activeSessionId) {
      if (updated.length > 0) {
        selectSession(updated[0]);
      } else {
        startNewChat();
      }
    }
  };

  const stopSpeaking = () => {
    speechHelper.stopSpeaking();
    setSpeakingMsgId(null);
    if (voiceState === 'SPEAKING') {
      setVoiceState('IDLE');
    }
  };

  const speakMessage = (id: string, text: string) => {
    if (speakingMsgId === id) {
      stopSpeaking();
      return;
    }

    // Barge-in: cancel any current speech synthesis
    speechHelper.stopSpeaking();
    setSpeakingMsgId(id);
    setVoiceState('SPEAKING');

    speechHelper.speak(
      text,
      () => {
        setSpeakingMsgId(id);
        setVoiceState('SPEAKING');
      },
      () => {
        setSpeakingMsgId(null);
        setVoiceState('IDLE');
        // Auto-resume continuous listening if voice overlay is active
        if (isContinuousVoiceModeRef.current) {
          setTimeout(() => {
            startListeningLoop();
          }, 400);
        }
      },
      () => {
        setSpeakingMsgId(null);
        setVoiceState('IDLE');
        if (isContinuousVoiceModeRef.current) {
          setTimeout(() => {
            startListeningLoop();
          }, 400);
        }
      }
    );
  };

  const toggleVoiceSpeechEnabled = () => {
    if (voiceSpeechEnabled) {
      stopSpeaking();
      setVoiceSpeechEnabled(false);
    } else {
      setVoiceSpeechEnabled(true);
    }
  };

  const startListeningLoop = () => {
    // BARGE-IN: stop active TTS if user starts listening
    stopSpeaking();
    setSpeechError(null);
    setSpeechInterimText('');
    latestTranscriptRef.current = '';
    hasSentCurrentTranscriptRef.current = false;
    setVoiceState('LISTENING');

    speechHelper.startListening(
      (finalText, interimText) => {
        setSpeechInterimText(interimText || finalText);
        latestTranscriptRef.current = finalText || interimText;

        // Dynamic audio volume animation simulation
        const lengthLevel = Math.min(1, Math.max(0.3, (interimText || finalText).length / 40));
        setAudioLevel(lengthLevel);

        if (finalText && finalText.trim().length > 2 && !hasSentCurrentTranscriptRef.current) {
          hasSentCurrentTranscriptRef.current = true;
          speechHelper.stopListening();
          setSpeechInterimText('');
          sendMessage(finalText);
        }
      },
      (err) => {
        console.warn('Voice error:', err);
        setVoiceState('ERROR');
        if (err === 'not-allowed') {
          setSpeechError('Microphone permission blocked. Please enable mic access in your browser.');
        } else {
          setSpeechError(typeof err === 'string' ? err : 'Voice recognition error.');
        }
      },
      () => {
        if (voiceState === 'LISTENING' && !hasSentCurrentTranscriptRef.current) {
          const finalPrompt = latestTranscriptRef.current.trim();
          if (finalPrompt && finalPrompt.length > 2) {
            hasSentCurrentTranscriptRef.current = true;
            sendMessage(finalPrompt);
          } else {
            setVoiceState('IDLE');
          }
        }
      }
    );
  };

  const toggleVoice = () => {
    if (voiceState === 'LISTENING') {
      speechHelper.stopListening();
      setVoiceState('IDLE');
      setSpeechInterimText('');

      const finalText = latestTranscriptRef.current.trim();
      if (finalText && !hasSentCurrentTranscriptRef.current) {
        hasSentCurrentTranscriptRef.current = true;
        sendMessage(finalText);
      }
    } else {
      startListeningLoop();
    }
  };

  const executeDirectAddToCart = async (product: any) => {
    setActionStatus(`🛒 Adding "${product.name}" to cart...`);
    setVoiceState('EXECUTING');
    try {
      await cartService.addItem(product.id, 1);
      await fetchCart();
      setActionStatus(`✓ Added to Cart`);
      setTimeout(() => {
        setActionStatus(null);
        setVoiceState('IDLE');
      }, 2500);
    } catch (e: any) {
      setActionStatus(`❌ Failed to add item`);
      setTimeout(() => {
        setActionStatus(null);
        setVoiceState('IDLE');
      }, 2500);
    }
  };

  const processAgentIntentActions = async (userQueryLower: string, aiData: any) => {
    // 1. Navigation intent
    if (userQueryLower.includes('go to cart') || userQueryLower.includes('open cart') || userQueryLower.includes('take me to cart') || userQueryLower.includes('view cart')) {
      setActionStatus('⚡ Opening Cart...');
      setVoiceState('EXECUTING');
      navigate('/customer/cart');
      setTimeout(() => { setActionStatus(null); setVoiceState('IDLE'); }, 2000);
    } else if (userQueryLower.includes('go to checkout') || userQueryLower.includes('open checkout') || userQueryLower.includes('proceed to checkout')) {
      setActionStatus('💳 Opening Checkout...');
      setVoiceState('EXECUTING');
      navigate('/customer/checkout');
      setTimeout(() => { setActionStatus(null); setVoiceState('IDLE'); }, 2000);
    } else if (userQueryLower.includes('show orders') || userQueryLower.includes('my orders') || userQueryLower.includes('track order')) {
      setActionStatus('📋 Opening Orders...');
      setVoiceState('EXECUTING');
      navigate('/customer/orders');
      setTimeout(() => { setActionStatus(null); setVoiceState('IDLE'); }, 2000);
    } else if (userQueryLower.includes('go home') || userQueryLower.includes('open dashboard')) {
      setActionStatus('🏠 Opening Dashboard...');
      setVoiceState('EXECUTING');
      navigate('/customer/dashboard');
      setTimeout(() => { setActionStatus(null); setVoiceState('IDLE'); }, 2000);
    }

    // 2. Add to Cart Intent
    if (
      userQueryLower.includes('add') && (userQueryLower.includes('cart') || userQueryLower.includes('buy'))
    ) {
      let targetProduct = null;
      if (aiData.recommendedProducts && aiData.recommendedProducts.length > 0) {
        targetProduct = aiData.recommendedProducts[0];
      } else if (currentProduct) {
        targetProduct = currentProduct;
      }

      if (targetProduct) {
        setActionStatus(`🛒 Adding ${targetProduct.name} to cart...`);
        setVoiceState('EXECUTING');
        try {
          await cartService.addItem(targetProduct.id, 1);
          await fetchCart();
          setActionStatus(`✓ Added to Cart!`);
        } catch (e) {
          setActionStatus(`❌ Cart update failed`);
        }
        setTimeout(() => { setActionStatus(null); setVoiceState('IDLE'); }, 2500);
      }
    }
  };

  const sendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    // BARGE-IN: stop any ongoing TTS speech output immediately
    stopSpeaking();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);
    setVoiceState('PROCESSING');
    setActionStatus('🧠 OLIVER.AI is processing request...');

    try {
      const chatHistory = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await aiService.chat(
        textToSend,
        activeSessionId,
        cart?.id,
        chatHistory
      );
      const aiData = res.data.data || res.data;
      const aiText = aiData.text || 'I have processed your request.';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'AI',
        text: aiText,
        recommendedProducts: aiData.recommendedProducts || [],
        upsellProducts: aiData.upsellProducts || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Execute live action
      await processAgentIntentActions(textToSend.toLowerCase(), aiData);

      // Voice output & continuous listening resumption
      if (voiceSpeechEnabled && aiText) {
        speakMessage(aiMsg.id, aiText);
      } else {
        setVoiceState('IDLE');
        if (isContinuousVoiceModeRef.current) {
          setTimeout(() => startListeningLoop(), 400);
        }
      }

    } catch (err: any) {
      console.error(err);
      setVoiceState('ERROR');
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'AI',
        text: 'Sorry, I encountered an issue connecting to the system. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setActionStatus(null);
    }
  };

  return (
    <OliverContext.Provider
      value={{
        isOpen,
        isMinimized,
        isVoiceOverlayOpen,
        voiceState,
        isListening: voiceState === 'LISTENING',
        audioLevel,
        messages,
        sessions,
        activeSessionId,
        loading,
        voiceSpeechEnabled,
        speakingMsgId,
        speechInterimText,
        speechError,
        actionStatus,
        currentProduct,
        inputQuery,
        setInputQuery,
        openCopilot,
        closeCopilot,
        toggleCopilot,
        minimizeCopilot,
        expandCopilot,
        openVoiceOverlay,
        closeVoiceOverlay,
        toggleVoiceOverlay,
        sendMessage,
        startNewChat,
        selectSession,
        deleteSession,
        toggleVoice,
        toggleVoiceSpeechEnabled,
        speakMessage,
        stopSpeaking,
        setCurrentProduct,
        executeDirectAddToCart,
      }}
    >
      {children}
    </OliverContext.Provider>
  );
};

export const useOliver = () => {
  const context = useContext(OliverContext);
  if (!context) {
    throw new Error('useOliver must be used within an OliverProvider');
  }
  return context;
};
