import React from 'react';
import { ScreenType, Language } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, lang }) => {
  // If in landing, login, or 2fa, we might still provide nav or keep it clean
  const showNav = ['contracts', 'copilot', 'verify', 'settings', 'notifications'].includes(currentScreen);

  if (!showNav) return null;

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-white/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)] border-t border-slate-200/80">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {/* Tab 1: Contracts */}
        <button
          type="button"
          onClick={() => onNavigate('contracts')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-all ${
            currentScreen === 'contracts'
              ? 'text-[#ac2e00] font-bold scale-105'
              : 'text-[#575e70] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">description</span>
          <span className="font-sans text-[10px] tracking-tight whitespace-nowrap">
            {lang === 'EN' ? 'Contracts' : 'अनुबंध'}
          </span>
        </button>

        {/* Tab 2: AI Copilot */}
        <button
          type="button"
          onClick={() => onNavigate('copilot')}
          className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-all ${
            currentScreen === 'copilot'
              ? 'text-[#ac2e00] font-bold scale-105'
              : 'text-[#575e70] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
          <span className="absolute top-1 right-3.5 w-2 h-2 rounded-full bg-[#ac2e00] ring-1 ring-white"></span>
          <span className="font-sans text-[10px] tracking-tight whitespace-nowrap">
            {lang === 'EN' ? 'AI Copilot' : 'एआई साथी'}
          </span>
        </button>

        {/* Tab 3: Verify */}
        <button
          type="button"
          onClick={() => onNavigate('verify')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-all ${
            currentScreen === 'verify'
              ? 'text-[#ac2e00] font-bold scale-105'
              : 'text-[#575e70] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">verified</span>
          <span className="font-sans text-[10px] tracking-tight whitespace-nowrap">
            {lang === 'EN' ? 'Verify' : 'सत्यापन'}
          </span>
        </button>

        {/* Tab 4: Settings */}
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-all ${
            currentScreen === 'settings'
              ? 'text-[#ac2e00] font-bold scale-105'
              : 'text-[#575e70] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">gshield</span>
          <span className="font-sans text-[10px] tracking-tight whitespace-nowrap">
            {lang === 'EN' ? 'Settings' : 'सेटिंग्स'}
          </span>
        </button>
      </div>
    </nav>
  );
};
