import React from 'react';
import { ScreenType, Language } from '../../types';

interface FeatureBuildingScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
}

export const FeatureBuildingScreen: React.FC<FeatureBuildingScreenProps> = ({
  onNavigate,
  lang,
}) => {
  return (
    <div className="relative min-h-screen flex flex-col justify-between px-5 py-8 max-w-md mx-auto select-none">
      {/* Ambient background glows */}
      <div className="absolute top-10 right-4 w-60 h-60 bg-[#ac2e00]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-4 w-60 h-60 bg-[#ffdbc8]/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header / Back Nav */}
      <div className="flex items-center justify-between w-full z-10 mb-6">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#191c1e] text-[13px] font-semibold rounded-xl border border-[#e4beb4]/50 shadow-xs hover:bg-[#f2f4f6] transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>{lang === 'HI' ? 'लॉगिन पर वापस जाएं' : 'Back to Login'}</span>
        </button>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-300 rounded-full text-amber-800 text-[11px] font-mono font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>BUILDING PHASE</span>
        </span>
      </div>

      {/* Main Content Area */}
      <div className="relative flex flex-col items-center justify-center my-auto py-6 z-10 text-center">
        {/* Animated Feature Emblem */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-3xl bg-[#ac2e00]/10 animate-pulse"></div>
          <div className="absolute inset-2 rounded-2xl bg-white shadow-md flex items-center justify-center border border-[#e4beb4]/40">
            <span className="material-symbols-outlined text-[54px] text-[#ac2e00]">
              construction
            </span>
          </div>
          <div className="absolute -bottom-2 -right-1 bg-[#191c1e] text-white px-2 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[12px] text-amber-400">build</span>
            <span>v2.6.0-dev</span>
          </div>
        </div>

        {/* Feature Title */}
        <h1 className="text-[22px] font-extrabold text-[#191c1e] tracking-tight mb-2">
          {lang === 'HI'
            ? 'यह सुविधा वर्तमान में विकासाधीन है'
            : 'This Feature is in the Building Phase'}
        </h1>

        {/* Status Description */}
        <p className="text-[14px] text-[#575e70] leading-relaxed max-w-sm mb-6">
          {lang === 'HI'
            ? 'हम हार्डवेयर एन्क्लेव और आधुनिक बायोमेट्रिक प्रमाणीकरण का परीक्षण कर रहे हैं। यह सुविधा जल्द ही इस ऐप पर लाइव कर दी जाएगी।'
            : 'We are currently completing cryptographic security audits and hardware enclave bindings for this authentication module. It will be deployed to the app soon.'}
        </p>

        {/* Development Roadmap Cards */}
        <div className="w-full flex flex-col gap-2.5 text-left mb-6">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#e4beb4]/40 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-bold text-[#191c1e]">
                {lang === 'HI' ? 'क्रिप्टोग्राफ़िक सुरक्षा मॉडल' : 'Cryptographic Security Engine'}
              </span>
              <span className="text-[11px] text-[#575e70]">
                {lang === 'HI' ? 'अंतिम परीक्षण एवं ऑडिट जारी' : 'Final audit & hardware testing in progress'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
              90%
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#e4beb4]/40 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">engineering</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-bold text-[#191c1e]">
                {lang === 'HI' ? 'हार्डवेयर गेटवे डिप्लॉयमेंट' : 'Hardware Gateway Deployment'}
              </span>
              <span className="text-[11px] text-[#575e70]">
                {lang === 'HI' ? 'आगामी रिलीज़ में सक्रिय होगा' : 'Scheduled for rollout in upcoming release'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded ml-auto">
              Sprint 4
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation CTAs */}
      <div className="flex flex-col gap-2.5 w-full z-10 pt-2">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full h-12 bg-[#ac2e00] hover:bg-[#d53e07] active:scale-[0.98] text-white text-[14px] font-bold rounded-xl shadow-md shadow-[#ac2e00]/20 flex items-center justify-center gap-2 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">login</span>
          <span>{lang === 'HI' ? 'लॉगिन पृष्ठ पर वापस जाएं' : 'Return to Login Page'}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('signup')}
          className="w-full h-11 bg-white hover:bg-[#f2f4f6] text-[#191c1e] text-[13px] font-bold rounded-xl border border-[#e4beb4]/50 shadow-xs flex items-center justify-center gap-2 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>{lang === 'HI' ? 'नया खाता बनाएं' : 'Create an Account'}</span>
        </button>
      </div>
    </div>
  );
};
