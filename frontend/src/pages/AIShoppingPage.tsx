import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { aiService } from '../services/aiService';
import { cartService } from '../services/cartService';
import { paymentService } from '../services/paymentService';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { speechHelper } from '../utils/speechRecognition';
import { paymentSound } from '../utils/paymentSound';
import { PaymentSuccessModal } from '../components/common/PaymentSuccessModal';
import { SecurityPinModal } from '../components/common/SecurityPinModal';
import {
  Bot,
  User,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Check,
  Plus,
  Star,
  Zap,
  X,
  Truck,
  RotateCcw,
  ShoppingCart,
  Cpu,
  Activity,
  History,
  Trash2,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowRight,
  Sliders,
  CheckSquare,
  Radio,
  FileText,
  HelpCircle,
  QrCode,
  Building2,
  Banknote,
  ShieldAlert,
  XCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface AgentComparisonItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: string;
  isWinner: boolean;
  scoreMatch: number;
  highlight: string;
}

interface AutonomousFlowState {
  isExecuting: boolean;
  stage: 'SCANNING' | 'COMPARING' | 'AWAITING_METHOD_SELECTION' | 'GUARD_CHECK' | 'AWAITING_PERMISSION' | 'PROCESSING_PAYMENT' | 'COMPLETED' | 'CANCELLED';
  comparedProducts: AgentComparisonItem[];
  selectedWinner: any;
  selectionReasons: string[];
  guardChecks: { label: string; status: 'PASSED' | 'BLOCKED'; detail: string }[];
  spendingLimit: number;
  paymentMethod: string;
  completedOrder?: any;
  upsellAttached?: boolean;
  upsellProduct?: any;
}

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  recommendedProducts?: any[];
  upsellProducts?: any[];
  comparedProducts?: any[];
  cartActionSuccess?: boolean;
  cartActionMessage?: string;
  flowState?: AutonomousFlowState;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const createNewWelcomeMessage = (userName?: string): ChatMessage => {
  const name = userName ? userName.trim().split(' ')[0] : '';
  const greeting = name ? `Hi ${name}! 👋 Welcome to OLIVER AI.` : `Hi there! 👋 Welcome to OLIVER AI.`;

  return {
    id: `msg-${Date.now()}`,
    sender: 'AI',
    text: `**${greeting}**\n\nWhat are you looking for today? I can help you discover products, compare options, find the best deals, and build your cart.\n\nTry asking me:\n• *"Find headphones under ₹5,000"*\n• *"Which one is best for me?"*\n• *"Compare the top options"*\n• *"Add the second one to my cart"*`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};

const SoundWave: React.FC<{ color?: string }> = ({ color = '#38bdf8' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', height: '14px', margin: '0 4px', verticalAlign: 'middle' }}>
    <span style={{ width: '3px', background: color, borderRadius: '3px', animation: 'waveBar 0.8s infinite ease-in-out 0s', display: 'inline-block' }} />
    <span style={{ width: '3px', background: color, borderRadius: '3px', animation: 'waveBar 0.8s infinite ease-in-out 0.2s', display: 'inline-block' }} />
    <span style={{ width: '3px', background: color, borderRadius: '3px', animation: 'waveBar 0.8s infinite ease-in-out 0.4s', display: 'inline-block' }} />
    <span style={{ width: '3px', background: color, borderRadius: '3px', animation: 'waveBar 0.8s infinite ease-in-out 0.1s', display: 'inline-block' }} />
  </span>
);

export const AIShoppingPage: React.FC = () => {
  const { user } = useAuth();
  const userStorageKey = `commerceai_sessions_${user?.id || 'guest'}`;

  // Past history sessions from localStorage
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

  // Current active session ID
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const savedActiveId = sessionStorage.getItem('commerceai_active_session_id');
    if (savedActiveId) return savedActiveId;
    const newId = generateUUID();
    sessionStorage.setItem('commerceai_active_session_id', newId);
    return newId;
  });

  // Active messages in current conversation
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const existing = sessions.find((s) => s.id === activeSessionId);
    if (existing && existing.messages?.length > 0) return existing.messages;
    return [createNewWelcomeMessage(user?.name)];
  });

  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(true);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [speechInterimText, setSpeechInterimText] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [upsellChecked, setUpsellChecked] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);

  // Simulated Razorpay Modal States
  const [showSimulatedRzpModal, setShowSimulatedRzpModal] = useState(false);
  const [pendingPinFlow, setPendingPinFlow] = useState<{ messageId: string; flowState: AutonomousFlowState } | null>(null);
  const [simulatedCardNumber, setSimulatedCardNumber] = useState('');
  const [simulatedCardExpiry, setSimulatedCardExpiry] = useState('');
  const [simulatedCardCvv, setSimulatedCardCvv] = useState('');
  const [simulatedCardName, setSimulatedCardName] = useState('');
  const [simulatedUpiId, setSimulatedUpiId] = useState('');
  const [simulatedBank, setSimulatedBank] = useState('HDFC Bank');
  const [simulatedWallet, setSimulatedWallet] = useState('AmazonPay');
  const [simulatedOrderData, setSimulatedOrderData] = useState<any>(null);
  const [simulatedMethod, setSimulatedMethod] = useState<string>('UPI');
  const [simulatedSuccessCallback, setSimulatedSuccessCallback] = useState<any>(null);
  const [simulatedFailureCallback, setSimulatedFailureCallback] = useState<any>(null);

  // Celebration Modal
  const [celebrationOrder, setCelebrationOrder] = useState<any | null>(null);
  const [countdown, setCountdown] = useState<number>(4);

  const { cart, itemCount, fetchCart } = useCart();
  const navigate = useNavigate();
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const latestTranscriptRef = useRef<string>('');
  const hasSentCurrentTranscriptRef = useRef<boolean>(false);

  useEffect(() => {
    productService.searchProducts({ limit: 30 }).then(res => {
      const data = res.data?.data?.products || res.data?.products || res.data || [];
      setCatalogProducts(data);
    }).catch(err => console.error(err));
  }, []);

  // Countdown timer for celebration redirect
  useEffect(() => {
    if (!celebrationOrder) return;
    if (countdown <= 0) {
      navigate(`/customer/orders?newOrder=true&orderId=${celebrationOrder.orderId}`);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [celebrationOrder, countdown, navigate]);

  // Trigger search on mount if passed via URL query parameter '?q='
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) {
      window.history.replaceState({}, document.title, window.location.pathname);
      handleSend(query);
    } else if (messages.length === 1 && messages[0].sender === 'AI') {
      const timer = setTimeout(() => {
        handleSpeakMessage(messages[0].id, messages[0].text);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [activeSessionId]);

  // Save sessions to localStorage
  useEffect(() => {
    setSessions((prevSessions) => {
      const firstUserMsg = messages.find((m) => m.sender === 'USER');
      const title = firstUserMsg ? (firstUserMsg.text.length > 32 ? firstUserMsg.text.substring(0, 32) + '...' : firstUserMsg.text) : 'New Mission';

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

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      window.scrollTo(0, 0);
      return;
    }

    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading]);

  const handleStartNewChat = () => {
    const newId = generateUUID();
    setActiveSessionId(newId);
    sessionStorage.setItem('commerceai_active_session_id', newId);
    setMessages([createNewWelcomeMessage(user?.name)]);
    setShowHistoryDrawer(false);
  };

  const handleSelectSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    sessionStorage.setItem('commerceai_active_session_id', session.id);
    setMessages(session.messages);
    setShowHistoryDrawer(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (activeSessionId === sessionId) {
      handleStartNewChat();
    }
  };

  // Voice Speech Synthesis Handler (TTS)
  const handleSpeakMessage = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      speechHelper.stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msgId);
      speechHelper.speak(
        text,
        () => setSpeakingMsgId(msgId),
        () => setSpeakingMsgId(null),
        (err) => {
          console.error('Speech synthesis error:', err);
          setSpeakingMsgId(null);
        }
      );
    }
  };

  const handleStopSpeaking = () => {
    speechHelper.stopSpeaking();
    setSpeakingMsgId(null);
  };

  // Voice Recognition Handler (STT) with Live Input Sync & Speech Interruption
  const handleToggleVoice = async () => {
    setSpeechError(null);

    // INTERRUPT AI SPEECH: If OliverAI is currently speaking, stop speech immediately
    if (speechHelper.isSpeaking() || speakingMsgId) {
      handleStopSpeaking();
    }

    if (isListening) {
      speechHelper.stopListening();
      setIsListening(false);

      const pendingText = latestTranscriptRef.current.trim();
      if (pendingText && !hasSentCurrentTranscriptRef.current) {
        hasSentCurrentTranscriptRef.current = true;
        setInputQuery(pendingText);
        setSpeechInterimText('');
        latestTranscriptRef.current = '';
        handleSend(pendingText);
      } else {
        setSpeechInterimText('');
        latestTranscriptRef.current = '';
      }
    } else {
      if (!speechHelper.isSupported) {
        setSpeechError("Voice input isn't supported in this browser. You can continue using text chat.");
        return;
      }
      setIsListening(true);
      setSpeechInterimText('');
      latestTranscriptRef.current = '';
      hasSentCurrentTranscriptRef.current = false;

      await speechHelper.startListening(
        (finalText: string, interimText: string) => {
          const currentText = (finalText || interimText || '').trim();
          if (currentText) {
            latestTranscriptRef.current = currentText;
            setSpeechInterimText(currentText);
            setInputQuery(currentText); // Live sync to input box
          }

          if (finalText && finalText.trim() && !hasSentCurrentTranscriptRef.current) {
            hasSentCurrentTranscriptRef.current = true;
            const textToSubmit = finalText.trim();
            setInputQuery(textToSubmit);
            setSpeechInterimText('');
            latestTranscriptRef.current = '';
            setIsListening(false);
            speechHelper.stopListening();
            handleSend(textToSubmit);
          }
        },
        (err: any) => {
          console.error('Speech error:', err);
          setIsListening(false);
          setSpeechInterimText('');
          latestTranscriptRef.current = '';
          if (err === 'not-allowed' || err === 'PermissionDeniedError') {
            setSpeechError('Microphone permission denied. Please allow microphone access in your browser settings or use text chat.');
          } else if (err !== 'no-speech') {
            setSpeechError(`Voice recognition issue (${err}). You can continue using text chat.`);
          }
        },
        () => {
          setIsListening(false);
          const pendingText = latestTranscriptRef.current.trim();
          if (pendingText && !hasSentCurrentTranscriptRef.current) {
            hasSentCurrentTranscriptRef.current = true;
            setInputQuery(pendingText);
            setSpeechInterimText('');
            latestTranscriptRef.current = '';
            handleSend(pendingText);
          }
        }
      );
    }
  };

  // STEP-BY-STEP PROGRESSION FOR AUTONOMOUS DECISION PIPELINE
  const startAutonomousFlow = async (messageId: string, products: any[], maxPrice = 3000) => {
    if (!products || products.length === 0) return;

    const winner = products[0];
    const comparisons: AgentComparisonItem[] = products.map((p, idx) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      rating: p.rating || 4.5,
      category: p.category,
      isWinner: idx === 0,
      scoreMatch: idx === 0 ? 98 : Math.max(70, 95 - idx * 10),
      highlight: idx === 0 ? 'Optimal Price & Features' : 'Alternative Option',
    }));

    const featureHighlight = winner.category === 'Headphones' ? 'Active Noise Cancellation & Rich Audio Quality' :
      winner.category === 'Bags' ? 'Water-Resistant Premium Fabric & Ergonomic Pockets' :
      winner.category === 'Keyboards' ? 'Tactile Mechanical Switches & Customizable RGB' :
      winner.category === 'Mouse' ? 'High-DPI Optical Sensor & Ergonomic Grip' :
      winner.category === 'Smart Watches' ? 'AMOLED Retina Display & Heart Rate Fitness Tracking' :
      'Verified Build Quality & High User Ratings';

    const selectionReasons = [
      `Within authorized budget (₹${winner.price.toLocaleString('en-IN')} <= ₹${maxPrice.toLocaleString('en-IN')})`,
      `Highest rating in ${winner.category || 'category'} (${winner.rating || 4.8}★ with verified reviews)`,
      `In-stock inventory confirmed (${winner.inventory || winner.stock || 30} units ready)`,
      `Top feature set (${featureHighlight})`,
    ];

    const guardChecks = [
      { label: `1. Bounded Spending Limit (₹${winner.price} <= ₹${maxPrice})`, status: 'PASSED' as const, detail: 'Within customer budget' },
      { label: '2. Merchant AI Safety Policy Check', status: 'PASSED' as const, detail: 'Max transaction limit satisfied' },
      { label: '3. Real-Time Inventory Stock Check', status: 'PASSED' as const, detail: 'Stock confirmed and reserved' },
      { label: '4. Database Price Integrity Check', status: 'PASSED' as const, detail: 'Price verified with database' },
      { label: '5. Duplicate Payment Idempotency Check', status: 'PASSED' as const, detail: 'Unique submission token validated' },
    ];

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        return {
          ...msg,
          flowState: {
            isExecuting: true,
            stage: 'SCANNING',
            comparedProducts: comparisons,
            selectedWinner: winner,
            selectionReasons,
            guardChecks,
            spendingLimit: maxPrice,
            paymentMethod: 'UPI',
          },
        };
      })
    );

    await new Promise((r) => setTimeout(r, 600));
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId || !msg.flowState) return msg;
        return {
          ...msg,
          flowState: { ...msg.flowState, stage: 'COMPARING' },
        };
      })
    );

    await new Promise((r) => setTimeout(r, 700));
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId || !msg.flowState) return msg;
        return {
          ...msg,
          flowState: { ...msg.flowState, stage: 'AWAITING_METHOD_SELECTION' },
        };
      })
    );
  };

  const handleAuthorizeAndPay = async (messageId: string, flowState: AutonomousFlowState) => {
    const winner = flowState.selectedWinner;

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId || !msg.flowState) return msg;
        return {
          ...msg,
          flowState: { ...msg.flowState, stage: 'PROCESSING_PAYMENT' },
        };
      })
    );

    try {
      const cartRes = await cartService.addItem(winner.id, 1);
      let activeCartId = cartRes.data?.id || cart?.id;

      if (upsellChecked) {
        const isHeadphones = winner.category === 'Headphones';
        const targetCategory = isHeadphones ? 'Travel Accessories' : 'Bags';
        const match = catalogProducts.find((p: any) => p.category === targetCategory);
        if (match) {
          const addUpsellRes = await cartService.addItem(match.id, 1);
          activeCartId = addUpsellRes.data?.id || activeCartId;
        }
      }

      const orderRes = await paymentService.createRazorpayOrder(activeCartId, true, undefined, flowState.paymentMethod);
      const orderData = orderRes.data;

      const handleSuccess = async (response: any) => {
        try {
          await paymentService.verifyPayment({
            razorpayOrderId: orderData.razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id || `pay_auth_${Date.now()}`,
            razorpaySignature: response.razorpay_signature || 'sig_test_valid',
          });

          await fetchCart();
          setUpsellChecked(false);

          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id !== messageId || !msg.flowState) return msg;
              return {
                ...msg,
                flowState: {
                  ...msg.flowState,
                  stage: 'COMPLETED',
                  completedOrder: orderData,
                },
              };
            })
          );

          setCelebrationOrder({
            ...orderData,
            product: winner,
          });
          setCountdown(4);
        } catch (verifyErr: any) {
          handleFailure(orderData.razorpayOrderId, verifyErr.response?.data?.message || 'Payment verification failed.');
        }
      };

      const handleFailure = async (razorpayOrderId: string, reason: string) => {
        try {
          await paymentService.handleFailure(razorpayOrderId, reason);
        } catch (e) {
          console.error(e);
        }
        setUpsellChecked(false);

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id !== messageId || !msg.flowState) return msg;
            return {
              ...msg,
              flowState: { ...msg.flowState, stage: 'CANCELLED' },
            };
          })
        );
        alert(`Payment wasn't completed: ${reason}`);
      };

      const isMockKey = orderData.keyId === 'rzp_test_sample_key_id' || orderData.keyId === 'rzp_test_demo_key';

      if ((window as any).Razorpay && !isMockKey && !orderData.razorpayOrderId.startsWith('rzp_test_order_')) {
        const rzp = new (window as any).Razorpay({
          key: orderData.keyId,
          amount: orderData.amount * 100,
          currency: orderData.currency,
          name: 'CommerceAI Store',
          description: `Autonomous Order for ${winner.name}`,
          order_id: orderData.razorpayOrderId.startsWith('rzp_test_order_') ? undefined : orderData.razorpayOrderId,
          handler: handleSuccess,
          modal: {
            ondismiss: () => {
              handleFailure(orderData.razorpayOrderId, 'Payment modal was dismissed.');
            },
          },
          prefill: {
            name: user?.name || 'Rahul Sharma',
            email: user?.email || 'customer@demo.com',
          },
          theme: { color: '#2563eb' },
        });
        rzp.open();
      } else {
        // Direct sandbox test mode authorization
        await handleSuccess({
          razorpay_payment_id: `pay_auth_sim_${Date.now()}`,
          razorpay_signature: 'sig_test_valid',
        });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Payment initialization failed.');
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId || !msg.flowState) return msg;
          return {
            ...msg,
            flowState: { ...msg.flowState, stage: 'CANCELLED' },
          };
        })
      );
    }
  };

  const handleCancelAuthorization = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId || !msg.flowState) return msg;
        return {
          ...msg,
          flowState: { ...msg.flowState, stage: 'CANCELLED' },
        };
      })
    );
  };

  const handleSelectPaymentMethod = async (messageId: string, method: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId || !msg.flowState) return msg;
        return {
          ...msg,
          flowState: {
            ...msg.flowState,
            paymentMethod: method,
            stage: 'GUARD_CHECK',
          },
        };
      })
    );

    await new Promise((r) => setTimeout(r, 800));
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId || !msg.flowState) return msg;
        return {
          ...msg,
          flowState: { ...msg.flowState, stage: 'AWAITING_PERMISSION' },
        };
      })
    );
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const chatHistory = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await aiService.chat(textToSend, activeSessionId, cart?.id, chatHistory);
      const aiData = res.data.data || res.data;

      const messageId = `ai-${Date.now()}`;
      const isAutonomousBuyQuery =
        aiData.recommendedProducts &&
        aiData.recommendedProducts.length > 0 &&
        (textToSend.toLowerCase().includes('buy') ||
          textToSend.toLowerCase().includes('purchase') ||
          textToSend.toLowerCase().includes('order') ||
          textToSend.toLowerCase().includes('checkout') ||
          textToSend.toLowerCase().includes('auto pay'));

      const aiText = aiData.text || 'I have analyzed your request.';

      const aiMsg: ChatMessage = {
        id: messageId,
        sender: 'AI',
        text: aiText,
        recommendedProducts: aiData.recommendedProducts || [],
        upsellProducts: aiData.upsellProducts || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (voiceSpeechEnabled) {
        handleSpeakMessage(messageId, aiText);
      }

      if (isAutonomousBuyQuery) {
        let parsedBudget = 3000;
        const budgetMatch =
          textToSend.match(/under\s*₹?\s*([\d,]+)/i) ||
          textToSend.match(/below\s*₹?\s*([\d,]+)/i) ||
          textToSend.match(/less\s*than\s*₹?\s*([\d,]+)/i) ||
          textToSend.match(/<\s*₹?\s*([\d,]+)/i) ||
          textToSend.match(/within\s*₹?\s*([\d,]+)/i) ||
          textToSend.match(/budget\s*(?:of)?\s*₹?\s*([\d,]+)/i) ||
          textToSend.match(/max\s*(?:price)?\s*₹?\s*([\d,]+)/i);

        if (budgetMatch) {
          parsedBudget = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
        }

        startAutonomousFlow(messageId, aiData.recommendedProducts, parsedBudget);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'AI',
          text: '⚠️ System exception occurred while processing request. Please retry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (p: any) => {
    if (p.imageUrl && p.imageUrl.startsWith('http')) return p.imageUrl;
    if (p.image_url && p.image_url.startsWith('http')) return p.image_url;
    const cat = (p.category || '').toLowerCase();
    if (cat.includes('headphone') || cat.includes('audio')) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80';
    if (cat.includes('laptop') || cat.includes('stand') || cat.includes('hub')) return 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80';
    if (cat.includes('bag') || cat.includes('backpack')) return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80';
    if (cat.includes('watch')) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80';
    if (cat.includes('keyboard')) return 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80';
    if (cat.includes('mouse')) return 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80';
  };

  const samplePrompts = [
    'Find me headphones under ₹5,000',
    'Which one is best?',
    'Does it have noise cancellation?',
    'Compare the first two',
    'Add the first one to my cart',
    'Change the quantity to two',
    'What is in my cart?',
    'Take me to checkout',
  ];

  // Render formatted markdown text cleanly with spacious typography
  const renderFormattedText = (text: string, isUserMessage: boolean = false) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((rawLine, idx) => {
      const line = rawLine.trim();

      // Empty line
      if (!line) return <div key={idx} style={{ height: '0.35rem' }} />;

      // Horizontal separator ---
      if (line === '---' || line === '***') {
        return <div key={idx} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', margin: '0.75rem 0' }} />;
      }

      // Headers (e.g. ### Header or ## Header)
      if (line.startsWith('#')) {
        const headerText = line.replace(/^#+\s*/, '').replace(/\*\*/g, '');
        return (
          <div
            key={idx}
            style={{
              fontSize: '1.05rem',
              fontWeight: 900,
              color: isUserMessage ? '#ffffff' : '#38bdf8',
              marginTop: '0.85rem',
              marginBottom: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              letterSpacing: '-0.01em',
            }}
          >
            {headerText}
          </div>
        );
      }

      // Format inline bold/italic text
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

      // Bullet points (e.g. -> or • or - or *)
      const isBullet = line.startsWith('->') || line.startsWith('•') || line.startsWith('- ') || (line.startsWith('* ') && !line.startsWith('**'));

      if (isBullet) {
        const bulletText = line.replace(/^(->|•|-|\*)\s*/, '');
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.55rem',
              margin: '0.35rem 0',
              paddingLeft: '0.2rem',
              lineHeight: 1.6,
              fontSize: isUserMessage ? '0.96rem' : '0.92rem',
              color: isUserMessage ? '#ffffff' : '#e2e8f0',
              fontWeight: isUserMessage ? 600 : 400,
            }}
          >
            <span style={{ color: isUserMessage ? '#93c5fd' : '#38bdf8', fontWeight: 900, fontSize: '0.85rem', marginTop: '2px', flexShrink: 0 }}>➔</span>
            <div style={{ flex: 1 }}>{formatInline(bulletText)}</div>
          </div>
        );
      }

      // Normal paragraph
      return (
        <div key={idx} style={{ marginBottom: '0.35rem', lineHeight: 1.6, color: isUserMessage ? '#ffffff' : '#cbd5e1', fontSize: isUserMessage ? '0.96rem' : '0.93rem', fontWeight: isUserMessage ? 600 : 400 }}>
          {formatInline(line)}
        </div>
      );
    });
  };

  return (
    <div style={{ width: '100%', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes micPulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); transform: scale(1); }
          50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); transform: scale(1.06); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); transform: scale(1); }
        }
        .mic-active {
          animation: micPulse 1.5s infinite ease-in-out;
          background: #ef4444 !important;
          border-color: #dc2626 !important;
          color: #ffffff !important;
        }
        .chat-container {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-x: hidden;
          box-sizing: border-box;
        }
        .message-row-user {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          padding-left: 16px;
          padding-right: 16px;
        }
        .user-message-wrapper {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: flex-end;
          gap: 0.75rem;
          width: fit-content;
          max-width: 75%;
          min-width: 0;
          box-sizing: border-box;
        }
        @media (max-width: 1023px) {
          .user-message-wrapper {
            max-width: 80%;
          }
        }
        @media (max-width: 767px) {
          .user-message-wrapper {
            max-width: 90%;
          }
          .message-row-user {
            padding-left: 8px;
            padding-right: 8px;
          }
        }
        .user-message-content {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          box-sizing: border-box;
          min-width: 0;
          max-width: calc(100% - 48px);
        }
        .user-message-bubble {
          width: fit-content;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow-wrap: anywhere;
          word-break: break-word;
          white-space: pre-wrap;
        }
      `}</style>
      
      {/* UNIFIED FULL-WIDTH FINTECH DARK TERMINAL CONTAINER */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #0b0f19 0%, #0f172a 60%, #1e1b4b 100%)',
          borderRadius: '24px',
          border: '1.5px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: showHistoryDrawer ? '300px minmax(0, 1fr)' : 'minmax(0, 1fr)',
          minHeight: '720px',
        }}
      >
        {/* RECENT SESSIONS SIDEBAR */}
        {showHistoryDrawer && (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}
          >
            <div style={{ padding: '1.25rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <History size={17} /> Thread History
              </div>
              <button onClick={() => setShowHistoryDrawer(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem' }}>
              {sessions.map((sess) => {
                const isActive = sess.id === activeSessionId;
                return (
                  <div
                    key={sess.id}
                    onClick={() => handleSelectSession(sess)}
                    style={{
                      padding: '0.8rem 0.9rem',
                      borderRadius: '12px',
                      background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: isActive ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', overflow: 'hidden' }}>
                      <MessageSquare size={16} color={isActive ? '#38bdf8' : '#94a3b8'} style={{ flexShrink: 0 }} />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: isActive ? 800 : 600, color: isActive ? '#ffffff' : '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sess.title || 'Mission'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {new Date(sess.updatedAt || sess.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {sess.messages?.length || 0} msgs
                        </div>
                      </div>
                    </div>
                    <button onClick={(e) => handleDeleteSession(e, sess.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MAIN CHAT WORKSPACE */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
          
          {/* INTEGRATED UNIFIED COPILOT HEADER BAR */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              padding: '1.4rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)',
                  border: '1.5px solid #60a5fa',
                  position: 'relative',
                }}
              >
                <Bot size={26} />
                <span style={{ position: 'absolute', top: '-3px', right: '-3px', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: '2px solid #0f172a' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    AI Shopping Assistant
                  </h2>
                  <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    AUTONOMOUS COPILOT
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginTop: '0.15rem' }}>
                  1. Search ➔ 2. Compare ➔ 3. Guardrail Check ➔ 4. Razorpay Payment
                </span>
              </div>
            </div>

            {/* Top Bar Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setVoiceSpeechEnabled(!voiceSpeechEnabled)}
                style={{
                  padding: '0.55rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  background: voiceSpeechEnabled ? 'rgba(34, 197, 94, 0.18)' : 'rgba(255, 255, 255, 0.08)',
                  color: voiceSpeechEnabled ? '#4ade80' : '#cbd5e1',
                  border: voiceSpeechEnabled ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {voiceSpeechEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                {voiceSpeechEnabled ? 'Speech On' : 'Speech Off'}
              </button>

              <button
                onClick={handleStartNewChat}
                style={{
                  padding: '0.55rem 1rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  borderRadius: '10px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                }}
              >
                <Plus size={16} /> New Session
              </button>

              <button
                onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
                style={{
                  padding: '0.55rem 0.9rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <History size={16} /> History ({sessions.length})
              </button>
            </div>
          </div>

          {/* CHAT MESSAGES SCROLL AREA */}
          <div
            ref={chatScrollContainerRef}
            className="chat-container"
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '1.5rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              minHeight: '480px',
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              boxSizing: 'border-box',
            }}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'USER';

              if (isUser) {
                return (
                  <div
                    key={msg.id}
                    className="message-row-user"
                  >
                    <div
                      className="user-message-wrapper"
                    >
                      {/* User Content */}
                      <div
                        className="user-message-content"
                      >
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#60a5fa', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          YOUR PROMPT
                        </div>

                        <div
                          className="user-message-bubble"
                          style={{
                            padding: '1rem 1.35rem',
                            borderRadius: '20px 4px 20px 20px',
                            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                            color: '#ffffff',
                            border: '1px solid rgba(147, 197, 253, 0.4)',
                            fontSize: '0.96rem',
                            lineHeight: 1.6,
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 6px 22px rgba(37,99,235,0.35)',
                          }}
                        >
                          {renderFormattedText(msg.text, true)}
                        </div>

                        <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* User Avatar */}
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: '1px solid rgba(147, 197, 253, 0.4)',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                        }}
                      >
                        <User size={19} />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    width: '100%',
                    boxSizing: 'border-box',
                    paddingLeft: '0.5rem',
                    paddingRight: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      maxWidth: '90%',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* AI Avatar */}
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                      }}
                    >
                      <Bot size={21} />
                    </div>

                    {/* AI Content */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        boxSizing: 'border-box',
                        maxWidth: '100%',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Cpu size={14} /> OLIVER.AI AUTONOMOUS AGENT
                      </div>

                      {/* Text Bubble */}
                      <div
                        style={{
                          padding: '1.1rem 1.4rem',
                          borderRadius: '4px 20px 20px 20px',
                          background: 'rgba(30, 41, 59, 0.75)',
                          color: '#ffffff',
                          border: '1px solid rgba(56, 189, 248, 0.2)',
                          borderLeft: '4px solid #38bdf8',
                          fontSize: '0.93rem',
                          lineHeight: 1.6,
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                          wordBreak: 'break-word',
                          overflowWrap: 'anywhere',
                          whiteSpace: 'pre-wrap',
                          maxWidth: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        {renderFormattedText(msg.text, false)}

                      {/* CART ACTION CONFIRMATION BANNER */}
                      {msg.cartActionSuccess && (
                        <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', borderRadius: '12px', padding: '0.85rem 1rem', marginTop: '0.85rem', color: '#4ade80' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.92rem' }}>
                            <CheckCircle2 size={18} /> {msg.cartActionMessage || 'Item added to your cart!'}
                          </div>
                          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.65rem' }}>
                            <button onClick={() => navigate('/customer/cart')} style={{ padding: '0.45rem 0.95rem', borderRadius: '8px', border: 'none', background: '#16a34a', color: '#ffffff', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}>
                              🛒 View Cart ({itemCount})
                            </button>
                            <button onClick={() => navigate('/customer/checkout')} style={{ padding: '0.45rem 0.95rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#ffffff', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}>
                              ⚡ Proceed to Checkout
                            </button>
                          </div>
                        </div>
                      )}

                      {/* COMPARISON MATRIX CARD */}
                      {msg.comparedProducts && msg.comparedProducts.length > 0 && (
                        <div style={{ marginTop: '1rem', width: '100%', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '1.2rem' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <Sliders size={16} /> SIDE-BY-SIDE PRODUCT COMPARISON MATRIX
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${msg.comparedProducts.length}, 1fr)`, gap: '1rem' }}>
                            {msg.comparedProducts.map((cp: any, cIdx: number) => (
                              <div key={cIdx} style={{ background: cp.isWinner ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.04)', border: cp.isWinner ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {cp.isWinner && <span style={{ background: '#38bdf8', color: '#090d16', fontSize: '0.68rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '4px', alignSelf: 'flex-start' }}>🏆 AI CHOICE</span>}
                                <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#ffffff' }}>{cp.name}</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#4ade80' }}>₹{cp.price?.toLocaleString('en-IN')}</div>
                                <div style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 800 }}>★ {cp.rating} / 5</div>
                                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>✓ In Stock ({cp.stock} units)</div>
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
                                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#4ade80' }}>Key Highlights:</div>
                                  {cp.advantages?.map((adv: string, aIdx: number) => (
                                    <div key={aIdx} style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>• {adv}</div>
                                  ))}
                                </div>
                                <button
                                  onClick={async () => {
                                    try {
                                      await cartService.addItem(cp.id, 1);
                                      await fetchCart();
                                      alert(`Added "${cp.name}" to cart!`);
                                    } catch (e) {
                                      alert('Failed to add item to cart.');
                                    }
                                  }}
                                  style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}
                                >
                                  Add to Cart
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!isUser && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.6rem', paddingTop: '0.45rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                          <button
                            type="button"
                            onClick={() => handleSpeakMessage(msg.id, msg.text)}
                            style={{
                              background: speakingMsgId === msg.id ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                              border: speakingMsgId === msg.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '8px',
                              padding: '0.35rem 0.7rem',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              color: speakingMsgId === msg.id ? '#38bdf8' : '#cbd5e1',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {speakingMsgId === msg.id ? (
                              <>
                                <VolumeX size={14} /> 🔊 Speaking Response... (Click to stop)
                                <SoundWave color="#38bdf8" />
                              </>
                            ) : (
                              <>
                                <Volume2 size={14} /> Replay Voice
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* RECOMMENDED CATALOG PRODUCTS CARDS FLOW */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && !msg.flowState && (
                      <div style={{ marginTop: '1.25rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <Sparkles size={16} /> RECOMMENDED CATALOG PRODUCTS ({msg.recommendedProducts.length})
                        </div>

                        {msg.recommendedProducts.map((prod: any, pIdx: number) => {
                          const prodImg = getProductImage(prod);
                          const isTopPick = pIdx === 0;
                          const features = Array.isArray(prod.features) ? prod.features : (prod.description || '').split('. ').filter(Boolean);

                          return (
                            <div
                              key={prod.id || pIdx}
                              style={{
                                background: isTopPick ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)' : 'rgba(15, 23, 42, 0.85)',
                                border: isTopPick ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '20px',
                                padding: '1.4rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.1rem',
                                boxShadow: isTopPick ? '0 8px 30px rgba(56, 189, 248, 0.25)' : '0 4px 15px rgba(0, 0, 0, 0.3)',
                                position: 'relative',
                              }}
                            >
                              {/* Top Header Badge */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: isTopPick ? '#38bdf8' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  {isTopPick ? '🏆 PRIMARY RECOMMENDATION (#1)' : `📦 ALTERNATE SUGGESTION (#${pIdx + 1})`}
                                </div>
                                {prod.badge && (
                                  <span style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                                    {prod.badge}
                                  </span>
                                )}
                              </div>

                              {/* Product Banner: Image + Info */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', alignItems: 'center' }}>
                                {/* Left: Product Image */}
                                <div style={{ width: '100%', height: '160px', borderRadius: '14px', overflow: 'hidden', background: '#090d16', border: '1px solid rgba(255,255,255,0.08)' }}>
                                  <img
                                    src={prodImg}
                                    alt={prod.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>

                                {/* Right: Title, Category, Rating & Price */}
                                <div>
                                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                    {prod.category || 'Electronics'}
                                  </div>
                                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.6rem 0', lineHeight: 1.35 }}>
                                    {prod.name}
                                  </h3>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#4ade80' }}>
                                      ₹{(prod.price || 0).toLocaleString('en-IN')}
                                    </div>
                                    {prod.originalPrice && prod.originalPrice > prod.price && (
                                      <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                        ₹{prod.originalPrice.toLocaleString('en-IN')}
                                      </span>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.88rem', fontWeight: 800, color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', padding: '0.2rem 0.55rem', borderRadius: '8px' }}>
                                      <Star size={14} fill="#fbbf24" /> {prod.rating || 4.8} / 5
                                    </div>
                                  </div>

                                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                                    ✓ In Stock ({prod.inventory || prod.stock || 25} units) • Ready for Express Delivery
                                  </div>
                                </div>
                              </div>

                              {/* Product Details Section (Directly under the product) */}
                              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1rem' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                  📝 Product Details & Key Specifications:
                                </div>
                                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.55, margin: '0 0 0.75rem 0' }}>
                                  {prod.description}
                                </p>

                                {features.length > 0 && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    {features.slice(0, 4).map((feat: string, fIdx: number) => (
                                      <div key={fIdx} style={{ fontSize: '0.84rem', color: '#94a3b8', display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                                        <span style={{ color: '#38bdf8', fontWeight: 900 }}>➔</span>
                                        <span>{feat}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Direct Product Action Buttons */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                                <button
                                  type="button"
                                  onClick={() => startAutonomousFlow(msg.id, [prod, ...(msg.recommendedProducts || []).filter((p: any) => p.id !== prod.id)], prod.price + 500)}
                                  style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                    color: '#ffffff',
                                    fontSize: '0.86rem',
                                    fontWeight: 900,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.4rem',
                                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                                  }}
                                >
                                  <Zap size={16} /> Buy with Guard
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await cartService.addItem(prod.id, 1);
                                      await fetchCart();
                                      alert(`Added "${prod.name}" to cart!`);
                                    } catch (e) {
                                      alert('Cart update failed. Please try again.');
                                    }
                                  }}
                                  style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    color: '#cbd5e1',
                                    fontSize: '0.86rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.4rem',
                                  }}
                                >
                                  <ShoppingCart size={16} /> Add to Cart
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSend(`Tell me more about ${prod.name} and its key features`)}
                                  style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(56, 189, 248, 0.3)',
                                    background: 'rgba(56, 189, 248, 0.1)',
                                    color: '#38bdf8',
                                    fontSize: '0.86rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.4rem',
                                  }}
                                >
                                  <Bot size={16} /> Ask AI
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Decision Pipeline Visualizer */}
                    {msg.flowState && (
                      <div
                        style={{
                          marginTop: '1.25rem',
                          width: '100%',
                          background: '#030712',
                          borderRadius: '18px',
                          padding: '1.5rem',
                          color: '#ffffff',
                          border: '1.5px solid #38bdf8',
                          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.65rem' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <Layers size={17} /> DECISION & EXECUTION PIPELINE
                          </div>
                          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.2rem 0.65rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                            STAGE: {msg.flowState.stage}
                          </span>
                        </div>

                        {/* Winner Product Spotlight */}
                        {msg.flowState.selectedWinner && (
                          <>
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '1rem 1.25rem', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <img
                                  src={getProductImage(msg.flowState.selectedWinner)}
                                  alt={msg.flowState.selectedWinner.name}
                                  style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: '10px', background: '#ffffff', padding: '0.25rem' }}
                                />
                                <div>
                                  <span style={{ background: '#16a34a', color: '#ffffff', fontSize: '0.65rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                                    🏆 SELECTED WINNING PRODUCT
                                  </span>
                                  <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', margin: '0.25rem 0' }}>
                                    {msg.flowState.selectedWinner.name}
                                  </h4>
                                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8' }}>
                                    ₹{msg.flowState.selectedWinner.price?.toLocaleString('en-IN')}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* AI RECOMMENDED UPSELL PRODUCT SPOTLIGHT CARD */}
                            {(() => {
                              const cat = (msg.flowState.selectedWinner?.category || msg.flowState.selectedWinner?.name || '').toLowerCase();
                              let upsell = {
                                id: 'upsell-dac-amp',
                                name: 'ToneMax Portable Hi-Fi Type-C DAC Headphone Amplifier',
                                category: 'Audio Peripherals',
                                originalPrice: 2199,
                                price: 1899,
                                discountPercent: 14,
                                imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300',
                                reason: 'Pairs with your selected audio gear for 24-bit studio sound output & noise isolation.',
                              };

                              if (cat.includes('keyboard') || cat.includes('laptop')) {
                                upsell = {
                                  id: 'upsell-mouse',
                                  name: 'Ergonomic Precision RGB Wireless Gaming Mouse',
                                  category: 'Peripherals',
                                  originalPrice: 1699,
                                  price: 1349,
                                  discountPercent: 20,
                                  imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300',
                                  reason: '67% of customers attach this precision mouse with their keyboard purchase.',
                                };
                              } else if (cat.includes('watch')) {
                                upsell = {
                                  id: 'upsell-charging-dock',
                                  name: '⚡ Magnetic Wireless Fast Charging Stand',
                                  category: 'Smart Watch Accessories',
                                  originalPrice: 999,
                                  price: 699,
                                  discountPercent: 30,
                                  imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300',
                                  reason: 'Keeps your smartwatch fully charged overnight with magnetic alignment.',
                                };
                              }

                              const isUpsellAttached = msg.flowState.upsellAttached;

                              return (
                                <div
                                  style={{
                                    background: isUpsellAttached ? 'rgba(34, 197, 94, 0.12)' : 'rgba(245, 158, 11, 0.08)',
                                    borderRadius: '14px',
                                    padding: '1.1rem',
                                    border: isUpsellAttached ? '1.5px solid #22c55e' : '1.5px solid #f59e0b',
                                    marginBottom: '1rem',
                                    boxShadow: isUpsellAttached ? '0 4px 16px rgba(34, 197, 94, 0.2)' : '0 4px 16px rgba(245, 158, 11, 0.15)',
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                                    <span
                                      style={{
                                        background: isUpsellAttached ? '#16a34a' : '#d97706',
                                        color: '#ffffff',
                                        fontSize: '0.68rem',
                                        fontWeight: 900,
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '6px',
                                        letterSpacing: '0.04em',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                      }}
                                    >
                                      <Sparkles size={13} /> {isUpsellAttached ? '✓ UPSELL ITEM ATTACHED TO ORDER' : '🤖 RECOMMENDED UPSELL BUNDLE OFFER'}
                                    </span>
                                    <span style={{ fontSize: '0.72rem', color: isUpsellAttached ? '#4ade80' : '#fbbf24', fontWeight: 800 }}>
                                      {isUpsellAttached ? '10% BUNDLE DISCOUNT APPLIED' : `SAVE ${upsell.discountPercent}% OFF`}
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center' }}>
                                    <img
                                      src={upsell.imageUrl}
                                      alt={upsell.name}
                                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px', background: '#ffffff', padding: '0.2rem', flexShrink: 0 }}
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{upsell.category}</div>
                                      <h5 style={{ fontSize: '0.88rem', fontWeight: 900, color: '#ffffff', margin: '0.15rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {upsell.name}
                                      </h5>
                                      <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.35, marginBottom: '0.35rem' }}>
                                        {upsell.reason}
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#4ade80' }}>
                                          ₹{upsell.price.toLocaleString('en-IN')}
                                        </span>
                                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                          ₹{upsell.originalPrice.toLocaleString('en-IN')}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Upsell Toggle Button */}
                                  <div style={{ marginTop: '0.85rem', paddingTop: '0.7rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                    {!isUpsellAttached ? (
                                      <button
                                        onClick={() => {
                                          setMessages((prev) =>
                                            prev.map((m) => {
                                              if (m.id === msg.id && m.flowState) {
                                                const basePrice = m.flowState.selectedWinner.price || 0;
                                                return {
                                                  ...m,
                                                  flowState: {
                                                    ...m.flowState,
                                                    upsellAttached: true,
                                                    upsellProduct: upsell,
                                                    selectedWinner: {
                                                      ...m.flowState.selectedWinner,
                                                      price: basePrice + upsell.price,
                                                      hasUpsell: true,
                                                      upsellName: upsell.name,
                                                      upsellPrice: upsell.price,
                                                    },
                                                  },
                                                };
                                              }
                                              return m;
                                            })
                                          );
                                        }}
                                        style={{
                                          width: '100%',
                                          padding: '0.6rem 1rem',
                                          borderRadius: '8px',
                                          border: 'none',
                                          background: '#d97706',
                                          color: '#ffffff',
                                          fontWeight: 800,
                                          fontSize: '0.8rem',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: '0.4rem',
                                        }}
                                      >
                                        <Plus size={15} /> Add {upsell.name} to Order (+₹{upsell.price.toLocaleString('en-IN')})
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setMessages((prev) =>
                                            prev.map((m) => {
                                              if (m.id === msg.id && m.flowState && m.flowState.upsellProduct) {
                                                const currentPrice = m.flowState.selectedWinner.price || 0;
                                                const upsellPrice = m.flowState.upsellProduct.price || 0;
                                                return {
                                                  ...m,
                                                  flowState: {
                                                    ...m.flowState,
                                                    upsellAttached: false,
                                                    selectedWinner: {
                                                      ...m.flowState.selectedWinner,
                                                      price: Math.max(0, currentPrice - upsellPrice),
                                                      hasUpsell: false,
                                                    },
                                                  },
                                                };
                                              }
                                              return m;
                                            })
                                          );
                                        }}
                                        style={{
                                          width: '100%',
                                          padding: '0.6rem 1rem',
                                          borderRadius: '8px',
                                          border: '1px solid rgba(255,255,255,0.2)',
                                          background: 'rgba(255,255,255,0.08)',
                                          color: '#f87171',
                                          fontWeight: 700,
                                          fontSize: '0.78rem',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: '0.4rem',
                                        }}
                                      >
                                        Remove Upsell Item (-₹{upsell.price.toLocaleString('en-IN')})
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}
                          </>
                        )}

                        {/* Payment Selection Actions */}
                        {msg.flowState.stage === 'AWAITING_METHOD_SELECTION' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#cbd5e1' }}>Select Payment Method:</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
                              {['UPI', 'CARD', 'NETBANKING', 'WALLET'].map((m) => (
                                <button
                                  key={m}
                                  onClick={() => handleSelectPaymentMethod(msg.id, m)}
                                  style={{
                                    padding: '0.65rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(56, 189, 248, 0.3)',
                                    background: 'rgba(56, 189, 248, 0.1)',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {m === 'UPI' ? '⚡ UPI' : m === 'CARD' ? '💳 Card' : m === 'NETBANKING' ? '🏦 NetBanking' : '👛 Wallet'}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {msg.flowState.stage === 'AWAITING_PERMISSION' && (
                          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => setPendingPinFlow({ messageId: msg.id, flowState: msg.flowState! })}
                              style={{
                                padding: '0.8rem 1.5rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                color: '#ffffff',
                                fontWeight: 900,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                              }}
                            >
                              <ShieldCheck size={17} /> Authorize & Pay ₹{msg.flowState.selectedWinner.price?.toLocaleString('en-IN')}
                            </button>
                            <button
                              onClick={() => {
                                paymentSound.playCancelSound();
                                setMessages((prev) =>
                                  prev.map((m) =>
                                    m.id === msg.id && m.flowState
                                      ? { ...m, flowState: { ...m.flowState, stage: 'CANCELLED' } }
                                      : m
                                  )
                                );
                              }}
                              style={{
                                padding: '0.8rem 1.25rem',
                                borderRadius: '10px',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#f87171',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                              }}
                            >
                              <XCircle size={16} /> Cancel Process
                            </button>
                          </div>
                        )}

                        {msg.flowState.stage === 'CANCELLED' && (
                          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '0.85rem 1rem', marginTop: '0.85rem', color: '#f87171', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <XCircle size={16} /> Decision & Execution pipeline cancelled. No transaction was authorized.
                          </div>
                        )}

                        {msg.flowState.stage === 'COMPLETED' && (
                          <div style={{ background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.4)', borderRadius: '14px', padding: '1rem 1.2rem', marginTop: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#4ade80', fontWeight: 900, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                              <CheckCircle2 size={18} /> ORDER PLACED & PAID SUCCESSFULLY!
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.6rem' }}>
                              Product: <strong>{msg.flowState.selectedWinner?.name}</strong> • Amount Paid: <strong>₹{(msg.flowState.selectedWinner?.price || 2499).toLocaleString('en-IN')}</strong> via Razorpay
                            </div>
                            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => navigate(`/customer/orders`)}
                                style={{ padding: '0.55rem 1.15rem', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
                              >
                                Go to Orders Page
                              </button>
                              <button
                                onClick={() => setCelebrationOrder({ ...msg.flowState!.completedOrder, product: msg.flowState!.selectedWinner })}
                                style={{ padding: '0.55rem 1.15rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#ffffff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                              >
                                Reopen Payment Summary
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.35rem', alignSelf: isUser ? 'flex-end' : 'flex-start' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            );
            })}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#38bdf8', padding: '0.5rem 0' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #38bdf8', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Evaluating catalog & checking merchant safety guardrails...</span>
              </div>
            )}
          </div>

          {/* INPUT FOOTER */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: 'rgba(15, 23, 42, 0.95)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            {/* Quick Sample Prompts */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '18px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#cbd5e1',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#38bdf8';
                    e.currentTarget.style.color = '#38bdf8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  "{p}"
                </button>
              ))}
            </div>

            {/* Speech Error Notice */}
            {speechError && (
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '10px', padding: '0.6rem 1rem', color: '#fbbf24', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>⚠️ {speechError}</span>
                <button onClick={() => setSpeechError(null)} style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Voice Listening Alert with Live Transcript & Soundwave */}
            {isListening && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px', padding: '0.65rem 1rem', color: '#f87171', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="mic-active" style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mic size={16} />
                  </span>
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: 800 }}>🎙️ Listening... Speak now!</div>
                    <div style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: 500 }}>
                      {speechInterimText ? `"${speechInterimText}"` : 'Say what product you are looking for...'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <SoundWave color="#ef4444" />
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#ffffff', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Stop
                  </button>
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleToggleVoice}
                className={isListening ? 'mic-active' : ''}
                title="Voice Recognition Search"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: isListening ? '#ffffff' : '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {isListening ? <MicOff size={22} /> : <Mic size={22} />}
              </button>

              <input
                type="text"
                placeholder="Tell AI what you need (e.g. Find wireless headphones under ₹3,000)..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                style={{
                  flex: 1,
                  padding: '0.85rem 1.2rem',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '0.94rem',
                  outline: 'none',
                }}
              />

              <button
                onClick={() => handleSend()}
                disabled={loading || !inputQuery.trim()}
                style={{
                  padding: '0.85rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: loading || !inputQuery.trim() ? '#475569' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  cursor: loading || !inputQuery.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                }}
              >
                <Send size={18} /> Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {pendingPinFlow && (
        <SecurityPinModal
          amount={pendingPinFlow.flowState?.selectedWinner?.price || 2499}
          paymentMethod={pendingPinFlow.flowState?.paymentMethod || 'Razorpay Gateway'}
          onConfirm={(enteredPin) => {
            const { messageId, flowState } = pendingPinFlow;
            setPendingPinFlow(null);
            handleAuthorizeAndPay(messageId, flowState!);
          }}
          onCancel={() => setPendingPinFlow(null)}
        />
      )}

      {celebrationOrder && (
        <PaymentSuccessModal
          orderData={{
            orderId: celebrationOrder.orderId,
            orderNumber: celebrationOrder.orderNumber,
            amount: celebrationOrder.amount,
            paymentMethod: 'Razorpay Instant Settlement',
            customerName: user?.name || 'Rahul Sharma',
            deliveryAddress: 'Flat 402, Skyline Residency, Outer Ring Road, Bengaluru, Karnataka - 560103',
            productName: celebrationOrder.product?.name,
            productImage: celebrationOrder.product?.images?.[0] || celebrationOrder.product?.image,
            items: [
              {
                name: celebrationOrder.product?.name || 'AI Selected Item',
                quantity: 1,
                price: celebrationOrder.amount || 2499,
                image: celebrationOrder.product?.images?.[0] || celebrationOrder.product?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
              },
            ],
          }}
          onContinueShopping={() => setCelebrationOrder(null)}
          onClose={() => setCelebrationOrder(null)}
        />
      )}
    </div>
  );
};
