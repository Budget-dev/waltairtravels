import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Navigation, MapPin } from 'lucide-react';

interface TravelSplashScreenProps {
  onComplete: () => void;
}

export const TravelSplashScreen: React.FC<TravelSplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'journey' | 'welcome' | 'done'>('journey');
  const [isDismissing, setIsDismissing] = useState<boolean>(false);

  useEffect(() => {
    // Phase 1 -> Phase 2 at 850ms
    const t1 = setTimeout(() => {
      setPhase('welcome');
    }, 850);

    // Phase 2 -> Fade out at 1450ms
    const t2 = setTimeout(() => {
      setIsDismissing(true);
    }, 1450);

    // Complete and unmount at 1800ms
    const t3 = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsDismissing(true);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070d19] text-white transition-opacity duration-500 select-none ${
        isDismissing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 40%, rgba(15, 118, 110, 0.15) 0%, rgba(7, 13, 25, 0.95) 70%, #070d19 100%)',
      }}
    >
      {/* Top Quick Skip Control */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleSkip}
          className="text-[11px] tracking-widest uppercase font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-full border border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/60 backdrop-blur-sm transition-all cursor-pointer"
        >
          Skip <span className="opacity-60">→</span>
        </button>
      </div>

      {/* Main Elegant Travel Composition */}
      <div className="flex flex-col items-center justify-center max-w-md w-full px-6 text-center">
        
        {/* Heritage Pill Crest */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/25 bg-amber-400/5 text-amber-200/90 text-[10px] font-semibold tracking-[0.22em] uppercase mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
          <span>ESTD. VISAKHAPATNAM • ANDHRA PRADESH</span>
        </motion.div>

        {/* Minimalist Coastal Travel Motif */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-5 flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-2xl border border-teal-500/25 bg-gradient-to-b from-teal-500/10 to-teal-950/30 flex items-center justify-center shadow-lg shadow-teal-950/40">
            <Compass className="w-8 h-8 text-teal-300 stroke-[1.5]" />
          </div>
          {/* Subtle Accent Beacon */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-400/20 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-300" />
          </div>
        </motion.div>

        {/* Typography: Brand Hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-1.5"
        >
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-[0.14em] uppercase font-sans">
            WALTAIR TRAVELS & CABS
          </h1>
          <p className="text-[12px] sm:text-[13px] text-slate-300 tracking-[0.08em] font-light">
            Premier Chauffeur & Outstation Travel Service
          </p>
        </motion.div>

        {/* Refined Vizag Travel Corridor Micro-Route */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full mt-7 pt-5 border-t border-slate-800/80 flex flex-col items-center"
        >
          {/* Waypoints Row */}
          <div className="flex items-center justify-between w-full max-w-xs text-[10.5px] font-medium text-slate-400 tracking-wider uppercase mb-2">
            <span className="flex items-center gap-1 text-teal-300 font-semibold">
              <MapPin className="w-3 h-3 text-teal-400" /> VTZ Airport
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-semibold">Siripuram Hub</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              Araku Valley <Navigation className="w-2.5 h-2.5 text-amber-300 rotate-45" />
            </span>
          </div>

          {/* Hairline Progress Track */}
          <div className="w-full max-w-xs h-[2px] bg-slate-800 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-300"
            />
          </div>

          {/* Dynamic Status Text */}
          <div className="h-5 mt-3.5 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {phase === 'journey' ? (
                <motion.span
                  key="journey"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.25 }}
                  className="text-[11px] text-slate-400 tracking-wider font-medium"
                >
                  Curating your premium Vizag journey...
                </motion.span>
              ) : (
                <motion.span
                  key="welcome"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.25 }}
                  className="text-[11px] text-teal-300 tracking-wider font-semibold"
                >
                  Welcome to Visakhapatnam
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Discreet Geo-Coord Anchor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-6 text-[10px] tracking-[0.2em] font-mono text-slate-500 uppercase"
        >
          17.7208° N, 83.3184° E • BAY OF BENGAL
        </motion.div>
      </div>
    </div>
  );
};
