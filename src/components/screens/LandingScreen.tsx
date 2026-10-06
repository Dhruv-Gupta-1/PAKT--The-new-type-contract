import React from 'react';
import { ScreenType, Language } from '../../types';

interface LandingScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate, lang }) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between px-5 py-6 max-w-md mx-auto select-none overflow-hidden">
      {/* Ambient Atmospheric Backdrops */}
      <div className="absolute -top-16 -right-12 w-64 h-64 bg-[#ac2e00]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-20 w-72 h-72 bg-[#ffdbc8]/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Metadata Bar: Sovereign Geo & EVM Node status */}
      <div className="flex items-center justify-between w-full z-10 pt-2 mb-6">
        <div className="inline-flex items-center gap-2 bg-[#f2f4f6] px-3 py-1.5 rounded-full shadow-xs border border-[#e4beb4]/30 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#ac2e00] animate-ping"></span>
          <span className="font-mono text-[11px] text-[#191c1e] flex items-center gap-1.5">
            <span className="font-bold text-[#ac2e00]">GLOBAL-EDGE</span>
            <span className="text-gray-400">|</span>
            <span>{lang === 'HI' ? 'विकेंद्रीकृत नोड' : 'Decentralized Consensus'}</span>
          </span>
        </div>

        <div className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-xs border border-[#e4beb4]/30 text-[#575e70] pointer-events-none">
          <span className="material-symbols-outlined text-[14px] text-[#954500]">lock</span>
          <span className="font-mono text-[11px] font-semibold">SHA-256 EIP-712</span>
        </div>
      </div>

      {/* Center Stage Graphic & Emblem - Logo is NOT clickable */}
      <div className="relative flex flex-col items-center justify-center my-auto py-4 z-10">
        {/* Concentric Trust Rings */}
        <div className="relative w-44 h-44 flex items-center justify-center pointer-events-none">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ac2e00]/20 via-[#d53e07]/10 to-transparent animate-spin"
            style={{ animationDuration: '18s' }}
          ></div>
          <div className="absolute inset-3 rounded-full bg-[#f2f4f6] shadow-sm flex items-center justify-center"></div>
          <div className="absolute inset-6 rounded-full bg-white shadow-md flex items-center justify-center"></div>

          {/* Floating Protocol Seal */}
          <div className="absolute -top-1 right-2 bg-[#2d3133] text-[#eff1f3] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#ffdbd1]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="font-mono text-[10px] tracking-wide uppercase font-semibold">
              IMMUTABLE
            </span>
          </div>

          {/* PAKT Master Symbol - Purely Decorative, Not Clickable */}
          <div
            className="relative z-10 flex flex-col items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <div className="w-20 h-20 bg-[#ac2e00] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
              <svg className="w-11 h-11 text-white" fill="none" viewBox="0 0 40 40">
                <path
                  d="M11 8H23C27.4183 8 31 11.5817 31 16C31 20.4183 27.4183 24 23 24H19L28 32H20L12 24.5V32H11V8Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M19 19.5H22.5C24.433 19.5 26 17.933 26 16C26 14.067 24.433 12.5 22.5 12.5H19V19.5Z"
                  fill="#141B2B"
                ></path>
              </svg>
            </div>
          </div>

          {/* Micro-Indicators */}
          <div className="absolute -bottom-2 bg-[#e0e3e5]/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#954500]"></span>
            <span className="font-mono text-[11px] font-bold text-[#191c1e]">Ethereum Sepolia L2</span>
          </div>
        </div>

        {/* Title & Badge */}
        <div className="flex items-center gap-2 mt-6 pointer-events-none">
          <h1 className="font-extrabold text-[32px] tracking-tight text-[#191c1e]">PAKT</h1>
          <span className="bg-[#2d3133] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider">
            Web 2.5
          </span>
        </div>

        {/* Brand Tagline */}
        <div className="text-center mt-2 px-2 max-w-xs pointer-events-none">
          <p className="text-[17px] text-[#191c1e] font-bold leading-snug">
            {lang === 'HI'
              ? 'डिजिटल अनुबंधों का संप्रभु एवं अपरिवर्तनीय निष्पादन'
              : 'Sovereign Digital Contract Execution & Verification'}
          </p>
        </div>

        {/* Cryptographic Security & Smart Contract Chips */}
        <div className="flex flex-col gap-2 mt-6 w-full max-w-xs pointer-events-none">
          {/* Cryptographic Protocol Pill */}
          <div className="flex items-center gap-2.5 bg-white px-3 py-2.5 rounded-xl shadow-xs border border-[#e4beb4]/30">
            <span className="material-symbols-outlined text-[18px] text-[#ac2e00]">verified_user</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-bold text-[#191c1e] truncate">
                {lang === 'HI' ? 'शून्य-ज्ञान एन्क्रिप्शन प्रोटोकॉल' : 'Zero-Knowledge Protocol'}
              </span>
              <span className="text-[10px] text-[#575e70] truncate">
                {lang === 'HI' ? 'अपरिवर्तनीय विकेंद्रीकृत सत्यापन' : 'Tamper-Evident Multi-Party Attestation'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#ac2e00] text-[18px] ml-auto">lock</span>
          </div>

          {/* Smart Agreement Assurance */}
          <div className="flex items-center gap-2.5 bg-white px-3 py-2.5 rounded-xl shadow-xs border border-[#e4beb4]/30">
            <span className="material-symbols-outlined text-[18px] text-[#954500]">shield_lock</span>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[11px] font-bold text-[#191c1e] truncate">
                {lang === 'HI' ? 'स्मार्ट क्लॉज़ रजिस्ट्री' : 'On-Chain Smart Registry'}
              </span>
              <span className="text-[10px] text-[#575e70] truncate">
                {lang === 'HI' ? 'तत्काल विकेंद्रीकृत सत्यापन' : 'Real-Time Cryptographic Settlement'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#5b4139] text-[16px] ml-auto">bolt</span>
          </div>
        </div>
      </div>

      {/* Action Area - ONLY Get Started button is clickable */}
      <div className="flex flex-col items-center w-full z-10 mt-auto pt-4">
        {/* Primary Start Execution Button - ONLY CLICKABLE BUTTON */}
        <button
          onClick={() => onNavigate('login')}
          className="w-full h-12 bg-[#ac2e00] hover:bg-[#d53e07] active:scale-[0.98] text-white text-[15px] font-bold rounded-xl shadow-md shadow-[#ac2e00]/20 flex items-center justify-between px-5 transition-all duration-200 cursor-pointer"
          type="button"
        >
          <span className="flex items-center gap-2">
            <span>{lang === 'HI' ? 'शुरू करें' : 'Get Started'}</span>
          </span>
          <div className="flex items-center justify-center w-7 h-7 bg-white/20 rounded-full">
            <span className="material-symbols-outlined text-[18px] text-white">arrow_forward</span>
          </div>
        </button>

        {/* Network Footnote */}
        <div className="flex items-center justify-between w-full mt-6 pt-2 text-[#575e70]/70 border-t border-[#e4beb4]/20 pointer-events-none">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ac2e00]"></span>
            <span className="font-mono text-[10px]">v2.6.0 Sovereign</span>
          </div>
          <span className="font-mono text-[10px] tracking-tight">Zero-Gas Relayer</span>
        </div>
      </div>
    </div>
  );
};
