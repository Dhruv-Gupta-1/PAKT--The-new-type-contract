import React, { useEffect, useState } from 'react';
import { ASSETS } from '../data/mockData';
import { Language } from '../types';

export interface LoadingOptions {
  titleEn?: string;
  titleHi?: string;
  subtitleEn?: string;
  subtitleHi?: string;
  duration?: number; // duration in ms, default 1500
  onComplete?: () => void;
  customSteps?: string[];
  customStepsHi?: string[];
}

interface SovereignLoadingScreenProps {
  isOpen: boolean;
  options: LoadingOptions | null;
  lang: Language;
  onClose: () => void;
}

const DEFAULT_STEPS_EN = [
  'Connecting to Mumbai Node (IN-MUM-1)...',
  'Computing SHA-256 canonical cryptographic digest...',
  'Verifying statutory rules under Indian IT Act 2000...',
  'Synchronizing state with Polygon PoS blockchain...',
  'Finalizing sovereign state transition...',
];

const DEFAULT_STEPS_HI = [
  'मुंबई नोड (IN-MUM-1) से जुड़ाव जारी...',
  'SHA-256 कैनोनिकल क्रिप्टोग्राफ़िक डाइजेस्ट की गणना...',
  'भारतीय आईटी अधिनियम २००० के तहत विधिक नियमों का सत्यापन...',
  'पॉलीगॉन पीओएस ब्लॉकचेन के साथ स्थिति का समन्वय...',
  'संप्रभु स्थिति पूर्ण की जा रही है...',
];

export const SovereignLoadingScreen: React.FC<SovereignLoadingScreenProps> = ({
  isOpen,
  options,
  lang,
  onClose,
}) => {
  const [progress, setProgress] = useState(10);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const duration = options?.duration || 1600;
  const title = lang === 'HI'
    ? (options?.titleHi || options?.titleEn || 'संप्रभु कार्य निष्पादन जारी...')
    : (options?.titleEn || 'Processing Sovereign Operation...');

  const subtitle = lang === 'HI'
    ? (options?.subtitleHi || options?.subtitleEn || 'कृपया प्रतीक्षा करें, मुंबई नोड एवं पॉलीगॉन ब्लॉकचेन समन्वयित हो रहे हैं।')
    : (options?.subtitleEn || 'Please wait while Mumbai Node IN-MUM-1 and Polygon PoS blockchain synchronize.');

  const steps = lang === 'HI'
    ? (options?.customStepsHi || DEFAULT_STEPS_HI)
    : (options?.customSteps || DEFAULT_STEPS_EN);

  useEffect(() => {
    if (!isOpen) {
      setProgress(10);
      setCurrentStepIndex(0);
      return;
    }

    setProgress(15);
    setCurrentStepIndex(0);

    const stepIntervalTime = Math.max(200, Math.floor(duration / steps.length));
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, stepIntervalTime);

    const start = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(progressInterval);
        clearInterval(stepInterval);
        setTimeout(() => {
          if (options?.onComplete) {
            options.onComplete();
          }
          onClose();
        }, 150);
      }
    }, 40);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isOpen, duration, options, steps.length, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#191c1e]/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#e4beb4]/50 flex flex-col items-center text-center overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Subtle background ambient glow behind the logo */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#ac2e00]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#ffdbd1]/60 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Node Indicator Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f4f6] border border-[#e4beb4]/40 text-[11px] font-mono text-[#5b4139] mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>NODE: IN-MUM-1 (MUMBAI)</span>
          <span className="text-[#ac2e00] font-bold">•</span>
          <span className="text-[#ac2e00] font-bold">POLYGON PoS</span>
        </div>

        {/* ========================================================== */}
        {/* THE LOGO WITH ROTATING DYNAMIC CRYPTOGRAPHIC ORBITAL RING */}
        {/* ========================================================== */}
        <div className="relative flex items-center justify-center my-2">
          {/* Outer rotating dashed ring */}
          <div className="absolute w-36 h-36 rounded-full border-2 border-dashed border-[#ac2e00]/40 animate-spin-slow"></div>

          {/* Middle counter-rotating gradient accent ring with orbiting node */}
          <div className="absolute w-32 h-32 rounded-full border border-[#ac2e00]/20 animate-spin-reverse-slow">
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#ac2e00] rounded-full shadow-[0_0_10px_#ac2e00] border-2 border-white"></span>
          </div>

          {/* Glowing pulse aura ring */}
          <div className="absolute w-28 h-28 rounded-full bg-[#ffdbd1]/50 animate-pulse"></div>

          {/* Inner Logo Card */}
          <div className="relative z-10 w-24 h-24 rounded-2xl bg-white shadow-xl border-2 border-[#ac2e00]/30 flex items-center justify-center p-3 transition-transform hover:scale-105">
            <img
              src={ASSETS.logo}
              alt="PAKT Sovereign Protocol Logo"
              className="w-full h-auto object-contain drop-shadow-sm select-none"
            />
          </div>
        </div>

        {/* ========================================================== */}
        {/* DYNAMIC TEXT UNDERNEATH THE LOGO */}
        {/* ========================================================== */}
        <div className="mt-5 w-full">
          {/* Main Action Title */}
          <h2 className="text-[17px] sm:text-[19px] font-bold text-[#191c1e] tracking-tight leading-snug">
            {title}
          </h2>

          {/* Detailed Subtitle */}
          <p className="text-[12px] sm:text-[13px] text-[#5b4139] mt-1.5 leading-relaxed px-2 font-medium">
            {subtitle}
          </p>

          {/* Live Step Ticker with Material Icon */}
          <div className="mt-4 px-3 py-2 bg-[#f2f4f6] rounded-xl border border-[#e4beb4]/30 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[17px] text-[#ac2e00] animate-spin">
              progress_activity
            </span>
            <span className="text-[12px] font-mono text-[#191c1e] font-semibold truncate max-w-[280px]">
              {steps[currentStepIndex] || steps[0]}
            </span>
          </div>

          {/* Progress Bar & Percentage */}
          <div className="mt-4 w-full">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#575e70] mb-1 px-0.5 font-bold">
              <span>{lang === 'HI' ? 'प्रगति' : 'OPERATION PROGRESS'}</span>
              <span className="text-[#ac2e00]">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-[#eceef0] rounded-full overflow-hidden border border-[#e4beb4]/20">
              <div
                className="h-full bg-gradient-to-r from-[#ac2e00] via-[#d63b00] to-amber-500 rounded-full transition-all duration-100 ease-out shadow-xs"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Sovereign Protocol Badges */}
          <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap text-[9px] font-mono font-bold text-[#575e70]">
            <span className="px-2 py-0.5 rounded bg-[#f2f4f6] border border-gray-200">
              SHA-256 PROOF
            </span>
            <span className="px-2 py-0.5 rounded bg-[#f2f4f6] border border-gray-200">
              IT ACT § 10A
            </span>
            <span className="px-2 py-0.5 rounded bg-[#f2f4f6] border border-gray-200">
              DPDP ACT 2023
            </span>
          </div>

          {/* Close / Dismiss action (in case user wants to run in background) */}
          <div className="mt-4 pt-2 border-t border-[#f2f4f6]">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] text-[#5b4139] hover:text-[#ac2e00] transition-colors font-medium underline"
            >
              {lang === 'HI' ? 'पृष्ठभूमि में चलाएं (बंद करें)' : 'Run in background (Dismiss)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
