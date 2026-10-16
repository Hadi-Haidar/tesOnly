import { useCallback, useRef, useEffect } from 'react';

// SHAR7 BEL LEBNENE: 
// هيدا الـ Hook بيستعمل Web Audio API ليعمل صوت "Click" ناعم جداً (مثل الـ Mac Trackpad أو Mechanical Keyboard).
// الفكرة إنو ما منحمل ملف صوت خارجي كرمال ما يصير في أي تأخير (Zero Lag) ويكون الأداء سريع 100%.

export function useSound() {
  const audioCtxRef = useRef(null);

  useEffect(() => {
    // منفعل الـ AudioContext بس لما المستخدم يعمل click لأول مرة لتفادي قوانين الـ Autoplay بالمقصفحات
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
    };
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    }
  }, []);

  const playHoverTick = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    // Start medium-high, drop extremely fast (classic soft pop/tick)
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.015);
    
    // Very quiet, extremely short decay
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  }, []);

  const playClick = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Slightly deeper, more pronounced tick for actual clicks
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.02);
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }, []);

  return { playClick, playHoverTick };
}
