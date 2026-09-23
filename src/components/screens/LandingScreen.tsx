import React from 'react';
import { ScreenType, Language } from '../../types';
import { t } from '../../data/translations';
import { useLoading } from '../../context/LoadingContext';

interface LandingScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate, lang }) => {
  const { showLoading } = useLoading();

  const handleEmblemClick = () => {
    showLoading({
      titleEn: 'Initializing PAKT Sovereign Enclave',
      titleHi: 'पाक्ट संप्रभु एन्क्लेव का आरंभ',
      subtitleEn: 'Bootstrapping local cryptographic enclave, verifying Polygon PoS RPC, and checking IT Act 2000 compliance state.',
      subtitleHi: 'स्थानीय क्रिप्टोग्राफ़िक एन्क्लेव बूटस्ट्रैप, पॉलीगॉन पीओएस आरपीसी एवं आईटी अधिनियम विधिक स्थिति जांच।',
      duration: 1500,
      customSteps: [
        'Bootstrapping IN-BOM sovereign node...',
        'Checking Polygon PoS consensus layer...',
        'Validating FIDO2 / WebAuthn cryptographic keys...',
        'Decrypting local session cache...',
        'Enclave initialized!',
      ],
      customStepsHi: [
        'IN-BOM संप्रभु नोड बूटस्ट्रैप जारी...',
        'पॉलीगॉन पीओएस सर्वसम्मति स्तर की जांच...',
        'FIDO2 / WebAuthn क्रिप्टोग्राफ़िक कुंजियों का सत्यापन...',
        'स्थानीय सत्र कैश डिक्रिप्शन...',
        'एन्क्लेव आरंभ पूर्ण हुआ!',
      ],
      onComplete: () => {
        onNavigate('contracts');
      },
    });
  };
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between px-5 py-6 max-w-md mx-auto select-none overflow-hidden">
      {/* Ambient Atmospheric Backdrops */}
      <div className="absolute -top-16 -right-12 w-64 h-64 bg-[#ac2e00]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-20 w-72 h-72 bg-[#ffdbc8]/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Metadata Bar: Sovereign Geo & EVM Node status */}
      <div className="flex items-center justify-between w-full z-10 pt-2 mb-6">
        <div className="inline-flex items-center gap-2 bg-[#f2f4f6] px-3 py-1.5 rounded-full shadow-xs border border-[#e4beb4]/30">
          <span className="w-2 h-2 rounded-full bg-[#ac2e00] animate-ping"></span>
          <span className="font-mono text-[11px] text-[#191c1e] flex items-center gap-1.5">
            <span className="font-bold text-[#ac2e00]">IN-BOM</span>
            <span className="text-gray-400">|</span>
            <span>{t('sovereignNode', lang)}</span>
          </span>
        </div>

        <div className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-xs border border-[#e4beb4]/30 text-[#575e70]">
          <span className="material-symbols-outlined text-[14px] text-[#954500]">lock</span>
          <span className="font-mono text-[11px] font-semibold">{t('shaLock', lang)}</span>
        </div>
      </div>

      {/* Center Stage Graphic & Emblem */}
      <div className="relative flex flex-col items-center justify-center my-auto py-4 z-10">
        {/* Animated Concentric Trust Rings */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ac2e00]/20 via-[#d53e07]/10 to-transparent animate-spin"
            style={{ animationDuration: '18s' }}
          ></div>
          <div className="absolute inset-3 rounded-full bg-[#f2f4f6] shadow-sm flex items-center justify-center"></div>
          <div className="absolute inset-6 rounded-full bg-white shadow-md flex items-center justify-center"></div>

          {/* Verified Floating Protocol Seal */}
          <div className="absolute -top-1 right-2 bg-[#2d3133] text-[#eff1f3] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#ffdbd1]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="font-mono text-[10px] tracking-wide uppercase font-semibold">
              {t('immutableBadge', lang)}
            </span>
          </div>

          {/* PAKT Master Symbol */}
          <div
            onClick={handleEmblemClick}
            title={lang === 'EN' ? 'Click to synchronize Sovereign Vault' : 'संप्रभु वॉल्ट समन्वय हेतु क्लिक करें'}
            className="relative z-10 flex flex-col items-center justify-center cursor-pointer group"
          >
            <div className="w-20 h-20 bg-[#ac2e00] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 transition-transform group-hover:rotate-0 group-hover:scale-105 duration-300">
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

          {/* Holographic Micro-Indicators */}
          <div className="absolute -bottom-2 bg-[#e0e3e5]/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#954500]"></span>
            <span className="font-mono text-[11px] font-bold text-[#191c1e]">Polygon PoS L2</span>
          </div>
        </div>

        {/* Title & Web 2.5 Badge */}
        <div className="flex items-center gap-2 mt-6">
          <h1 className="font-extrabold text-[32px] tracking-tight text-[#191c1e]">PAKT</h1>
          <span className="bg-[#2d3133] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider">
            {t('web25Badge', lang)}
          </span>
        </div>

        {/* Brand Manifesto */}
        <div className="text-center mt-2 px-2 max-w-xs">
          <p className="text-[17px] text-[#191c1e] font-bold leading-snug">
            {t('landingTagline', lang)}
          </p>
        </div>

        {/* Regulatory Compliance & Cryptographic Validation Chips */}
        <div className="flex flex-col gap-2 mt-6 w-full max-w-xs">
          {/* Statutory Accord Pill */}
          <div className="flex items-center gap-2.5 bg-white px-3 py-2.5 rounded-xl shadow-xs border border-[#e4beb4]/30">
            <span className="text-xl">🇮🇳</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-bold text-[#191c1e] truncate">
                {t('itActCompliance', lang)}
              </span>
              <span className="text-[10px] text-[#575e70] truncate">
                {t('evidenceActSub', lang)}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#ac2e00] text-[18px] ml-auto">gavel</span>
          </div>

          {/* Smart Legal Contract Assurance */}
          <div className="flex items-center gap-2.5 bg-white px-3 py-2.5 rounded-xl shadow-xs border border-[#e4beb4]/30">
            <span className="material-symbols-outlined text-[18px] text-[#954500]">shield_lock</span>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[11px] font-bold text-[#191c1e] truncate">
                {t('evmSmartClause', lang)}
              </span>
              <span className="text-[10px] text-[#575e70] truncate">
                {t('polygonPoSSub', lang)}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#5b4139] text-[16px] ml-auto">bolt</span>
          </div>
        </div>
      </div>

      {/* Interactive Action & Legal Anchor Area */}
      <div className="flex flex-col items-center w-full z-10 mt-auto pt-4">
        {/* Primary Start Execution Button */}
        <button
          onClick={() => onNavigate('login')}
          className="w-full h-12 bg-[#ac2e00] hover:bg-[#d53e07] active:scale-[0.98] text-white text-[15px] font-bold rounded-xl shadow-md shadow-[#ac2e00]/20 flex items-center justify-between px-5 transition-all duration-200"
          type="button"
        >
          <span className="flex items-center gap-2">
            <span>{t('getStarted', lang)}</span>
          </span>
          <div className="flex items-center justify-center w-7 h-7 bg-white/20 rounded-full">
            <span className="material-symbols-outlined text-[18px] text-white">arrow_forward</span>
          </div>
        </button>

        {/* Direct access to dashboard link */}
        <button
          onClick={() => onNavigate('contracts')}
          className="mt-2 text-[12px] text-[#ac2e00] font-semibold hover:underline"
        >
          {t('skipToContracts', lang)}
        </button>

        {/* Statutory Agreement Sub-clause */}
        <p className="text-[10px] text-center text-[#575e70] mt-3 leading-snug max-w-xs">
          {t('statutoryFootnote', lang)}
        </p>

        {/* Version & Network Latency Footnote */}
        <div className="flex items-center justify-between w-full mt-4 pt-2 text-[#575e70]/70 border-t border-[#e4beb4]/20">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ac2e00]"></span>
            <span className="font-mono text-[10px]">{t('mainnetVersion', lang)}</span>
          </div>
          <span className="font-mono text-[10px] tracking-tight">{t('zeroGasTag', lang)}</span>
        </div>
      </div>
    </div>
  );
};
