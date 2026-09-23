import React from 'react';
import { ScreenType, Language } from '../types';
import { ASSETS } from '../data/mockData';
import { useLoading } from '../context/LoadingContext';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
  onToggleLang: (lang: Language) => void;
  onOpenNotifications?: () => void;
  onOpenSupportBot?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  lang,
  onToggleLang,
  onOpenNotifications,
  onOpenSupportBot,
  unreadCount = 3
}) => {
  const { showLoading } = useLoading();
  const isChildScreen = currentScreen === 'esign' || currentScreen === 'login' || currentScreen === '2fa' || currentScreen === 'notifications' || currentScreen === 'new-agreement';

  const handleLogoClick = () => {
    showLoading({
      titleEn: 'Synchronizing Sovereign Vault',
      titleHi: 'संप्रभु वॉल्ट समन्वय जारी',
      subtitleEn: 'Querying Mumbai Node IN-MUM-1, verifying Polygon PoS block state, and refreshing contract manifests.',
      subtitleHi: 'मुंबई नोड IN-MUM-1 से संपर्क, पॉलीगॉन ब्लॉक स्थिति का सत्यापन एवं अनुबंधों का नवीनीकरण।',
      duration: 1500,
      customSteps: [
        'Connecting to Mumbai Node (IN-MUM-1)...',
        'Fetching Polygon PoS block consensus #48,912,840...',
        'Validating IT Act 2000 Section 10A digital signatures...',
        'Refreshing local vault cache & sovereign contracts...',
        'Vault state synchronized successfully!',
      ],
      customStepsHi: [
        'मुंबई नोड (IN-MUM-1) से जुड़ाव स्थापित...',
        'पॉलीगॉन पीओएस ब्लॉक सर्वसम्मति #48,912,840 की जांच...',
        'आईटी अधिनियम २००० धारा १०क हस्ताक्षरों का सत्यापन...',
        'स्थानीय वॉल्ट कैश एवं अनुबंधों का नवीनीकरण...',
        'वॉल्ट स्थिति सफलतापूर्वक समन्वयित हुई!',
      ],
      onComplete: () => {
        onNavigate('contracts');
      },
    });
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-xs pt-safe border-b border-slate-200/80">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left section: Back button (if child screen) or Brand Logo */}
        <div className="flex items-center gap-3 min-w-0">
          {isChildScreen ? (
            <button
              onClick={() => {
                if (currentScreen === '2fa') onNavigate('login');
                else if (currentScreen === 'login') onNavigate('landing');
                else onNavigate('contracts');
              }}
              aria-label="Back"
              className="w-9 h-9 -ml-1 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          ) : null}

          <div
            onClick={handleLogoClick}
            title={lang === 'EN' ? 'Click to view Contracts Dashboard' : 'अनुबंध डैशबोर्ड देखने के लिए क्लिक करें'}
            className="flex items-center cursor-pointer group py-1 rounded-lg transition-all"
          >
            <div className="relative flex items-center justify-center">
              <img
                alt="PAKT Brand Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-102"
                src={ASSETS.logo}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => onNavigate('contracts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentScreen === 'contracts' || currentScreen === 'esign'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#ac2e00]">description</span>
            <span>{lang === 'EN' ? 'Contracts & Vault' : 'अनुबंध एवं वॉल्ट'}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('copilot')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentScreen === 'copilot'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-amber-500">auto_awesome</span>
            <span>{lang === 'EN' ? 'AI Copilot' : 'एआई साथी'}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('verify')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentScreen === 'verify'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-indigo-500">verified</span>
            <span>{lang === 'EN' ? 'Verify Terminal' : 'सत्यापन टर्मिनल'}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentScreen === 'settings'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">settings</span>
            <span>{lang === 'EN' ? 'Settings' : 'सेटिंग्स'}</span>
          </button>
        </nav>

        {/* Right: Dual Language Toggle, Notifications, Profile Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Dual Language Switcher */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/80">
            <button
              type="button"
              onClick={() => onToggleLang('EN')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                lang === 'EN'
                  ? 'bg-white text-[#ac2e00] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onToggleLang('HI')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                lang === 'HI'
                  ? 'bg-white text-[#ac2e00] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Notifications Button with Badge */}
          <button
            type="button"
            onClick={() => {
              if (onOpenNotifications) {
                onOpenNotifications();
              } else {
                onNavigate('notifications');
              }
            }}
            aria-label="Notifications"
            className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-all active:scale-95 ${
              currentScreen === 'notifications'
                ? 'bg-[#ffdbd1] text-[#ac2e00]'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#ac2e00] text-white font-mono text-[9px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* AI Support Bot Trigger Button */}
          {onOpenSupportBot && (
            <button
              type="button"
              onClick={onOpenSupportBot}
              title="PAKT Sahayak AI Support Bot"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white"></span>
            </button>
          )}

          {/* User Profile Avatar */}
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            title="Priya Sharma Profile"
            className="flex items-center pl-1 group focus:outline-none"
          >
            <img
              alt="Priya Sharma Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-[#ac2e00] transition-all"
              src={ASSETS.avatar}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
