import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Check, Lock, Cpu, UserCheck, Building2, ArrowRight, ShoppingBag, MapPin, Package, CreditCard, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { paymentSound } from '../../utils/paymentSound';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface DigitalMoneyFlowModalProps {
  orderData: {
    orderId?: string;
    orderNumber?: string;
    amount: number;
    paymentMethod?: string;
    customerName?: string;
    deliveryAddress?: string;
    productName?: string;
    productImage?: string;
    items?: OrderItem[];
  };
  onClose?: () => void;
  onContinueShopping?: () => void;
}

type AnimationStage = 'AMOUNT_APPEAR' | 'TRANSFORMATION' | 'DIGITAL_FLOW' | 'SECURE_VERIFIED' | 'MERCHANT_CONVERGE' | 'FINAL_SUCCESS';

// Official Razorpay Geometric Lightning Bolt Logomark SVG
const RazorpayLogoMark: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rzpGradLarge" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0284c7" />
        <stop offset="40%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
    </defs>
    <path
      d="M38 12L12 68H40L34 88L88 32H54L64 12H38Z"
      fill="url(#rzpGradLarge)"
    />
  </svg>
);

export const DigitalMoneyFlowModal: React.FC<DigitalMoneyFlowModalProps> = ({ orderData, onContinueShopping }) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<AnimationStage>('AMOUNT_APPEAR');
  const [activeNode, setActiveNode] = useState<'YOU' | 'AI' | 'RAZORPAY' | 'MERCHANT'>('YOU');
  const [lockTransformed, setLockTransformed] = useState(false);
  const [permissionAsked, setPermissionAsked] = useState(false);

  const formattedAmount = useMemo(() => {
    return (orderData.amount || 0).toLocaleString('en-IN');
  }, [orderData.amount]);

  const orderNumber = useMemo(() => {
    return orderData.orderNumber || `ORD-${Date.now().toString().slice(-8)}`;
  }, [orderData.orderNumber]);

  // Product items fallback
  const displayItems = useMemo(() => {
    if (orderData.items && orderData.items.length > 0) {
      return orderData.items;
    }
    return [
      {
        name: orderData.productName || 'OLIVER Premium Purchase',
        quantity: 1,
        price: orderData.amount || 2499,
        image: orderData.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
      },
    ];
  }, [orderData]);

  // Precise Animation Sequence Timeline (No Auto Redirect)
  useEffect(() => {
    paymentSound.playPaymentSuccessSound(orderData.amount);

    // 0.0s - 0.7s: Amount Appears with Particle Convergence
    // 0.7s - 1.4s: Money Transformation into Energy Particles
    const t1 = setTimeout(() => {
      setStage('TRANSFORMATION');
    }, 700);

    // 1.4s - 2.0s: Digital Money Flow across nodes (YOU -> AI)
    const t2 = setTimeout(() => {
      setStage('DIGITAL_FLOW');
      setActiveNode('AI');
    }, 1400);

    // 2.0s - 2.7s: Flow into RAZORPAY GATEWAY Node
    const t3 = setTimeout(() => {
      setActiveNode('RAZORPAY');
      setStage('SECURE_VERIFIED');
      setLockTransformed(true);
    }, 2000);

    // 2.7s - 3.3s: Release particles to MERCHANT node & converge
    const t4 = setTimeout(() => {
      setActiveNode('MERCHANT');
      setStage('MERCHANT_CONVERGE');
    }, 2700);

    // 3.3s+: Recreate symbol & reveal order placed product summary card
    const t5 = setTimeout(() => {
      setStage('FINAL_SUCCESS');
    }, 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Generate 52 particle coordinates for orbital & flow animations
  const particles = useMemo(() => {
    return Array.from({ length: 52 }).map((_, i) => {
      const angle = (i / 52) * Math.PI * 2;
      const radius = 90 + (i % 6) * 16;
      return {
        id: i,
        radius,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        duration: 1.6 + (i % 4) * 0.35,
        delay: i * 0.025,
      };
    });
  }, []);

  const handleViewOrder = () => {
    if (orderData.orderId) {
      navigate(`/customer/orders?newOrder=true&orderId=${orderData.orderId}`);
    } else {
      navigate('/customer/orders');
    }
  };

  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping();
    } else {
      navigate('/customer/products');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(2, 6, 23, 0.96)',
        backdropFilter: 'blur(28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
        overflowY: 'auto',
      }}
    >
      {/* Background Holographic Grid Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.12) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />

      {/* Large Cyber Ambient Light Glow */}
      <div
        style={{
          position: 'absolute',
          width: '750px',
          height: '750px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(34, 197, 94, 0.1) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* CINEMATIC GLASSMORPHISM MODAL CONTAINER (maxWidth: 840px) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(155deg, rgba(15, 23, 42, 0.97) 0%, rgba(6, 11, 24, 0.99) 100%)',
          border: '2px solid rgba(56, 189, 248, 0.45)',
          borderRadius: '36px',
          boxShadow: '0 35px 110px rgba(0, 0, 0, 0.9), 0 0 65px rgba(37, 99, 235, 0.3)',
          padding: '2.5rem 2.5rem',
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Glowing Ambient Top Laser Beam */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #0284c7 0%, #2563eb 35%, #38bdf8 70%, #34d399 100%)',
            boxShadow: '0 0 15px #38bdf8',
          }}
        />

        {/* Ambient Rising Particles */}
        {stage === 'FINAL_SUCCESS' && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.9, y: 400, x: (i - 8) * 45 }}
                animate={{ opacity: 0, y: -60, x: (i - 8) * 52 }}
                transition={{ duration: 2.5 + (i % 4) * 0.4, repeat: Infinity, delay: i * 0.12 }}
                style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: i % 2 === 0 ? '#38bdf8' : '#34d399',
                  boxShadow: `0 0 12px ${i % 2 === 0 ? '#38bdf8' : '#34d399'}`,
                }}
              />
            ))}
          </div>
        )}

        {/* Top Security Status Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'rgba(37, 99, 235, 0.22)',
            border: '1.5px solid rgba(56, 189, 248, 0.5)',
            padding: '0.45rem 1.3rem',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#38bdf8',
            marginBottom: '1.4rem',
            letterSpacing: '0.05em',
            boxShadow: '0 0 25px rgba(37, 99, 235, 0.35)',
          }}
        >
          <RazorpayLogoMark size={20} /> POWERED BY RAZORPAY GATEWAY • AI GUARDRAILS VERIFIED
        </div>

        {/* --- TRANSACTION PATH NODES --- */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '1.25rem 1.8rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Node Track Line */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '55px',
              right: '55px',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.12)',
              transform: 'translateY(-50%)',
              zIndex: 1,
            }}
          />

          {/* Active Laser Pulse Line */}
          <motion.div
            animate={{
              width:
                activeNode === 'YOU'
                  ? '0%'
                  : activeNode === 'AI'
                  ? '33%'
                  : activeNode === 'RAZORPAY'
                  ? '66%'
                  : '100%',
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '55px',
              height: '3.5px',
              background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 50%, #34d399 100%)',
              boxShadow: '0 0 18px #38bdf8',
              transform: 'translateY(-50%)',
              zIndex: 2,
            }}
          />

          {/* NODE 1: YOU */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem', zIndex: 3 }}>
            <motion.div
              animate={{
                scale: activeNode === 'YOU' ? 1.2 : 1,
                borderColor: activeNode === 'YOU' ? '#38bdf8' : 'rgba(255, 255, 255, 0.25)',
                boxShadow: activeNode === 'YOU' ? '0 0 25px rgba(56, 189, 248, 0.8)' : 'none',
              }}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: '#0f172a',
                border: '2px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <UserCheck size={24} />
            </motion.div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#93c5fd' }}>YOU</span>
          </div>

          {/* NODE 2: AI GUARD */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem', zIndex: 3 }}>
            <motion.div
              animate={{
                scale: activeNode === 'AI' ? 1.2 : 1,
                borderColor: activeNode === 'AI' || activeNode === 'RAZORPAY' || activeNode === 'MERCHANT' ? '#818cf8' : 'rgba(255, 255, 255, 0.25)',
                boxShadow: activeNode === 'AI' ? '0 0 25px rgba(129, 140, 248, 0.8)' : 'none',
              }}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: '#0f172a',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeNode === 'AI' || activeNode === 'RAZORPAY' || activeNode === 'MERCHANT' ? '#818cf8' : '#64748b',
              }}
            >
              <Cpu size={24} />
            </motion.div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: activeNode === 'AI' || activeNode === 'RAZORPAY' || activeNode === 'MERCHANT' ? '#c7d2fe' : '#64748b' }}>
              AI GUARD
            </span>
          </div>

          {/* NODE 3: RAZORPAY GATEWAY */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem', zIndex: 3 }}>
            <motion.div
              animate={{
                scale: activeNode === 'RAZORPAY' ? 1.25 : 1,
                borderColor: lockTransformed ? '#34d399' : '#2563eb',
                boxShadow: lockTransformed ? '0 0 35px rgba(52, 211, 153, 0.9)' : '0 0 25px rgba(37, 99, 235, 0.75)',
              }}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: lockTransformed ? 'rgba(52, 211, 153, 0.2)' : '#02042b',
                border: '2px solid #2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: lockTransformed ? '#34d399' : '#38bdf8',
                position: 'relative',
              }}
            >
              <AnimatePresence mode="wait">
                {lockTransformed ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <Check size={30} color="#34d399" />
                  </motion.div>
                ) : (
                  <motion.div key="logo" exit={{ scale: 0, rotate: 90 }}>
                    <RazorpayLogoMark size={28} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: lockTransformed ? '#a7f3d0' : '#38bdf8' }}>
              {lockTransformed ? 'RAZORPAY ✓' : 'RAZORPAY'}
            </span>
          </div>

          {/* NODE 4: MERCHANT */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem', zIndex: 3 }}>
            <motion.div
              animate={{
                scale: activeNode === 'MERCHANT' ? 1.2 : 1,
                borderColor: activeNode === 'MERCHANT' ? '#34d399' : 'rgba(255, 255, 255, 0.25)',
                boxShadow: activeNode === 'MERCHANT' ? '0 0 30px rgba(52, 211, 153, 0.9)' : 'none',
              }}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: '#0f172a',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeNode === 'MERCHANT' ? '#34d399' : '#64748b',
              }}
            >
              <Building2 size={24} />
            </motion.div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: activeNode === 'MERCHANT' ? '#a7f3d0' : '#64748b' }}>
              STORE
            </span>
          </div>
        </div>

        {/* --- MAIN CENTER CANVAS ANIMATION STAGES --- */}
        <div style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* STEP 1: AMOUNT APPEARS */}
          {stage === 'AMOUNT_APPEAR' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.12em' }}>
                <RazorpayLogoMark size={20} /> RAZORPAY VERIFIED PAYMENT AMOUNT
              </div>
              <motion.div
                animate={{ textShadow: ['0 0 15px #38bdf8', '0 0 35px #38bdf8', '0 0 15px #38bdf8'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ fontSize: '4.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em' }}
              >
                ₹{formattedAmount}
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: MONEY TRANSFORMATION INTO PARTICLES */}
          {(stage === 'TRANSFORMATION' || stage === 'DIGITAL_FLOW' || stage === 'SECURE_VERIFIED') && (
            <div style={{ position: 'relative', width: '300px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                animate={{ opacity: [1, 0.7, 1] }}
                style={{ fontSize: '3.2rem', fontWeight: 900, color: stage === 'SECURE_VERIFIED' ? '#34d399' : '#38bdf8' }}
              >
                ₹{formattedAmount}
              </motion.div>

              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  animate={{
                    x: [0, p.x, p.x * 1.35, p.x * 0.4],
                    y: [0, p.y, p.y * 1.35, p.y * 0.4],
                    opacity: [0, 1, 0.8, 0],
                    scale: [0.5, 1.4, 0.8, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                    ease: 'easeInOut',
                  }}
                  style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: p.id % 2 === 0 ? '#38bdf8' : '#34d399',
                    boxShadow: `0 0 14px ${p.id % 2 === 0 ? '#38bdf8' : '#34d399'}`,
                  }}
                />
              ))}
            </div>
          )}

          {/* STEP 4: SECURE PAYMENT RIPPLE */}
          {stage === 'SECURE_VERIFIED' && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '3px solid #34d399',
                boxShadow: '0 0 40px #34d399',
              }}
            />
          )}

          {/* STEP 5: SUCCESSFUL SETTLEMENT HEADLINE */}
          {(stage === 'MERCHANT_CONVERGE' || stage === 'FINAL_SUCCESS') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
            >
              <div style={{ position: 'relative' }}>
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    border: '3.5px solid #a7f3d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 55px rgba(16, 185, 129, 0.95), 0 0 25px #a7f3d0',
                    color: '#ffffff',
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    position: 'relative',
                  }}
                >
                  ₹
                </motion.div>

                {/* Razorpay Logo Pill */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    background: '#02042b',
                    border: '2px solid #38bdf8',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 12px rgba(56,189,248,0.7)',
                  }}
                >
                  <RazorpayLogoMark size={20} />
                </div>
              </div>

              <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
                ORDER PLACED SUCCESSFULLY! 🎉
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>
                ₹{formattedAmount} Paid via Razorpay Gateway
              </div>
            </motion.div>
          )}
        </div>

        {/* --- DETAILED PRODUCT RECEIPT & ORDER SUMMARY CARD (DISPLAYS DIRECTLY ON PAYMENT PAGE) --- */}
        {stage === 'FINAL_SUCCESS' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '1.5rem 1.6rem',
              margin: '1.25rem 0',
              textAlign: 'left',
            }}
          >
            {/* Header with Order Reference */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8' }}>
                <Package size={18} /> PAYMENT PAGE PRODUCT & ORDER DETAILS
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                Order #{orderNumber}
              </div>
            </div>

            {/* List of Purchased Products */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.2rem' }}>
              {displayItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '16px',
                    padding: '0.75rem 1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                      alt={item.name}
                      style={{
                        width: '52px',
                        height: '52px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: '#ffffff',
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                        Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#34d399' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Address & Customer Meta Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.82rem', color: '#cbd5e1', paddingTop: '0.5rem', borderTop: '1px stroke rgba(255, 255, 255, 0.08)' }}>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>📍 Delivery Address:</span>
                <strong style={{ color: '#ffffff', lineHeight: 1.4, display: 'block' }}>
                  {orderData.deliveryAddress || 'Flat 402, Skyline Residency, Outer Ring Road, Bengaluru, Karnataka - 560103'}
                </strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>👤 Customer & Mode:</span>
                <strong style={{ color: '#ffffff', display: 'block' }}>
                  {orderData.customerName || 'Rahul Sharma'}
                </strong>
                <span style={{ color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700 }}>
                  {orderData.paymentMethod || 'Razorpay Gateway Instant Settlement'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- EXPLICIT USER PERMISSION CARD & ACTION BUTTONS --- */}
        {stage === 'FINAL_SUCCESS' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{
              background: 'rgba(37, 99, 235, 0.14)',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '20px',
              padding: '1.15rem 1.4rem',
              marginTop: '1.25rem',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: '#2563eb', padding: '0.4rem', borderRadius: '10px', color: '#ffffff', flexShrink: 0 }}>
                <HelpCircle size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#ffffff' }}>
                  Do you permit navigating to the Orders Page now?
                </div>
                <div style={{ fontSize: '0.82rem', color: '#93c5fd', marginTop: '0.2rem', lineHeight: 1.4 }}>
                  Your complete payment verification and product details are shown above directly on this page. You can stay here as long as you like, or grant permission to view live order tracking.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              {/* Permission YES button */}
              <button
                type="button"
                onClick={handleViewOrder}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '0.85rem 1.4rem',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  boxShadow: '0 6px 20px rgba(37, 99, 235, 0.5)',
                  transition: 'all 0.2s ease',
                }}
              >
                Yes, Grant Permission & Go to Orders <ArrowRight size={18} />
              </button>

              {/* Permission STAY HERE button */}
              <button
                type="button"
                onClick={() => setPermissionAsked(true)}
                style={{
                  padding: '0.85rem 1.4rem',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  transition: 'all 0.2s ease',
                }}
              >
                {permissionAsked ? '✓ Staying on Payment Summary' : 'No, Stay on Payment Page'}
              </button>

              {/* Continue Shopping button */}
              <button
                type="button"
                onClick={handleContinueShopping}
                style={{
                  padding: '0.85rem 1.4rem',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                }}
              >
                <ShoppingBag size={18} /> Continue Shopping
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
