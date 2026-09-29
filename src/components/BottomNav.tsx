import React from 'react';
import { ScreenType, Language } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, lang }) => {
  // If in landing, login, or 2fa, we might still provide nav or keep it clean
  const showNav = ['contracts', 'copilot', 'verify', 'settings', 'notifications', 'profile'].includes(currentScreen);

  if (!showNav) return null;

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-white/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)] border-t border-slate-200/80">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {/* Tab 1: Contracts */}
        <button
          type="button"
          onClick={() => onNavigate('contracts')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-all ${
            currentScreen === 'contracts'
              ? 'text-[#ac2e00] font-bold scale-105'
              : 'text-[#575e70] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">description</span>
          <span className="font-sans text-[10px] tracking-tight whitespace-nowrap">
            {lang === 'EN' ? 'Contracts' : 'अनुबंध'}
          </span>
        </button>

        {/* Tab 2: Identity / Supabase */}
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-all ${
            currentScreen === 'profile'
              ? 'text-cyan-700 font-bold scale-105'
              : 'text-[#575e70] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">badge</span>
          <span className="font-sans text-[10px] tracking-tight whitespace-nowrap">
            {lang === 'EN' ? 'Identity' : 'पहचान'}
          </span>
        </button>

        {/* Tab 3: AI Copilot */}
        <button
          type="button"
          onClick={() => onNavigate('copilot')}
          className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-all ${
            currentScreen === 'copilot'
              ? 'text-[#ac2e00] font-bold scale-105'
              : 'text-[#575e70] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          <span className="font-sans text-[10px] tracking-tight whitespace-nowrap">
            {lang === 'EN' ? 'AI Copilot' : 'एआई साथी'}
          </span>
        </button>

        {/* Tab 4: Verify */}
        <button
          type="button"
          onClick={() => onNavigate('verify')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-all ${
            currentScreen === 'verify'
              ? 'text-[#ac2e00] font-bold scale-105'
              : 'text-[#575e70] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">verified</span>
          <span className="font-sans text-[10px] tracking-tight whitespace-nowrap">
            {lang === 'EN' ? 'Verify' : 'सत्यापन'}
          </span>
        </button>

        {/* Tab 5: Settings */}
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-all ${
            currentScreen === 'settings'
              ? 'text-[#ac2e00] font-bold scale-105'
              : 'text-[#575e70] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">gshield</span>
          <span className="font-sans text-[10px] tracking-tight whitespace-nowrap">
            {lang === 'EN' ? 'Settings' : 'सेटिंग्स'}
          </span>
        </button>
      </div>
    </nav>
  );
};
