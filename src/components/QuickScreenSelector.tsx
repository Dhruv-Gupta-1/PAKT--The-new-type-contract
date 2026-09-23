import React, { useState } from 'react';
import { ScreenType, Language } from '../types';

interface QuickScreenSelectorProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  lang?: Language;
}

export const QuickScreenSelector: React.FC<QuickScreenSelectorProps> = ({ currentScreen, onNavigate, lang = 'EN' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const screens: { id: ScreenType; labelEn: string; labelHi: string; tag: string }[] = [
    { id: 'landing', labelEn: '1. Welcome Splash', labelHi: '१. स्वागत स्क्रीन', tag: 'Web 2.5' },
    { id: 'login', labelEn: '2. Login Credentials', labelHi: '२. लॉगिन क्रेडेंशियल', tag: 'Auth' },
    { id: '2fa', labelEn: '3. 2FA Verification', labelHi: '३. २एफए सत्यापन', tag: 'TOTP' },
    { id: 'contracts', labelEn: '4. Contracts Vault', labelHi: '४. अनुबंध वॉल्ट', tag: 'Pipeline' },
    { id: 'esign', labelEn: '5. Execution & eSign', labelHi: '५. निष्पादन व हस्ताक्षर', tag: 'IT Act' },
    { id: 'copilot', labelEn: '6. AI Copilot', labelHi: '६. एआई विधिक साथी', tag: 'Analysis' },
    { id: 'verify', labelEn: '7. Verify Terminal', labelHi: '७. सत्यापन टर्मिनल', tag: 'Polygon' },
    { id: 'settings', labelEn: '8. Settings & Profile', labelHi: '८. सेटिंग्स एवं प्रोफ़ाइल', tag: 'Config' }
  ];

  return (
    <div className="fixed top-16 right-3 z-40">
      <div className="flex flex-col items-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#191c1e] text-white hover:bg-[#2d3133] text-[11px] font-mono rounded-full shadow-lg border border-[#ac2e00]/40 transition-all active:scale-95"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ac2e00] animate-ping"></span>
          <span>
            {currentScreen === 'notifications'
              ? (lang === 'HI' ? 'सूचनाएं (अलर्ट)' : 'Alerts (Inbox)')
              : `${lang === 'HI' ? 'स्क्रीन' : 'Screens'} (${screens.findIndex(s => s.id === currentScreen) + 1}/8)`}
          </span>
          <span className="material-symbols-outlined text-[14px]">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {isOpen && (
          <div className="mt-2 w-64 bg-white/95 backdrop-blur-xl border border-[#e4beb4] rounded-xl shadow-2xl p-2 flex flex-col gap-1 text-left animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-2 py-1 flex items-center justify-between border-b border-[#e4beb4]/30 pb-1.5 mb-1">
              <span className="font-mono text-[10px] text-[#5b4139] uppercase font-bold tracking-wider">
                {lang === 'HI' ? 'स्क्रीन चुनें' : 'Select Screen View'}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
            {screens.map(s => {
              const active = currentScreen === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onNavigate(s.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left transition-colors text-[12px] ${
                    active
                      ? 'bg-[#ffdbd1] text-[#ac2e00] font-bold'
                      : 'hover:bg-[#f2f4f6] text-[#191c1e]'
                  }`}
                >
                  <span className="truncate">{lang === 'HI' ? s.labelHi : s.labelEn}</span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                    {s.tag}
                  </span>
                </button>
              );
            })}

            {/* Notifications shortcut */}
            <div className="border-t border-[#e4beb4]/30 pt-1 mt-0.5">
              <button
                onClick={() => {
                  onNavigate('notifications');
                  setIsOpen(false);
                }}
                className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left transition-colors text-[12px] ${
                  currentScreen === 'notifications'
                    ? 'bg-[#ffdbd1] text-[#ac2e00] font-bold'
                    : 'hover:bg-[#f2f4f6] text-[#191c1e]'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-[14px] text-[#ac2e00]">notifications</span>
                  <span>{lang === 'HI' ? 'सूचनाएं एवं अलर्ट' : 'Notifications & Alerts'}</span>
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#ac2e00]/10 text-[#ac2e00] font-bold">
                  Bell
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
