import React, { useState } from 'react';
import { ScreenType, Language } from '../../types';
import { ASSETS } from '../../data/mockData';
import { t } from '../../data/translations';
import { connectMetaMaskWallet } from '../../utils/web3Wallet';

interface LoginScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, lang }) => {
  const [fullName, setFullName] = useState(lang === 'HI' ? 'प्रिया शर्मा' : 'Priya Sharma');
  const [contact, setContact] = useState('98765 43210');
  const [password, setPassword] = useState('Krypt0#Mumbai2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isConnectingWeb3, setIsConnectingWeb3] = useState(false);
  const [web3Status, setWeb3Status] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('2fa');
  };

  const handleWeb3Connect = async () => {
    setIsConnectingWeb3(true);
    setWeb3Status(lang === 'HI' ? 'वॉलेट से जुड़ रहा है...' : 'Connecting to Web3 Wallet...');
    try {
      const result = await connectMetaMaskWallet();
      setWeb3Status(result.statusMessage);
      setTimeout(() => {
        setIsConnectingWeb3(false);
        onNavigate('contracts');
      }, 700);
    } catch {
      setIsConnectingWeb3(false);
      onNavigate('contracts');
    }
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-5 pb-12 max-w-md mx-auto">
      {/* Subtle Trust Banner / Sovereign Infrastructure Chip */}
      <div className="flex items-center justify-between mt-2 mb-4 p-2.5 bg-[#f2f4f6] rounded-xl shadow-xs border border-[#e4beb4]/30">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="inline-block w-2 h-2 rounded-full bg-[#ac2e00] animate-pulse shrink-0"></span>
          <span className="font-mono text-[11px] text-[#191c1e] truncate">{t('loginMumbaiNode', lang)}</span>
        </div>
        <div className="flex items-center gap-1 bg-[#e0e3e5] px-2 py-0.5 rounded-full shrink-0">
          <span className="material-symbols-outlined text-[13px] text-[#ac2e00]" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <span className="font-sans text-[10px] font-bold text-[#191c1e] uppercase">{t('statutoryChip', lang)}</span>
        </div>
      </div>

      {/* Hero Visual Framing: Micro Web2.5 Decorative Scene */}
      <div className="relative w-full rounded-xl overflow-hidden mb-4 shadow-sm bg-[#eceef0]">
        <div
          className="w-full h-32 bg-cover bg-center"
          style={{ backgroundImage: `url('${ASSETS.loginHero}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#2d3133] via-[#2d3133]/60 to-transparent flex flex-col justify-end p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-[#ffb5a0] text-[18px]">lock_clock</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffdbd1]">
              {t('decentralizedProtocol', lang)}
            </span>
          </div>
          <h1 className="text-[20px] font-bold text-white leading-tight">
            {t('welcomeBack', lang)}
          </h1>
        </div>
      </div>

      {/* Subtitle Description */}
      <p className="text-[13px] text-[#5b4139] mb-5 leading-relaxed">
        {t('loginSubtitle', lang)}
      </p>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Field 1: Full Legal Name */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="fullName">
              {t('fullNameLabel', lang)}
            </label>
            <span className="font-mono text-[11px] text-[#575e70]">{t('aadhaarPanMatch', lang)}</span>
          </div>
          <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 focus-within:border-[#ac2e00] focus-within:ring-2 focus-within:ring-[#ac2e00]/20 transition-all">
            <span className="material-symbols-outlined absolute left-3.5 text-[#575e70] text-[20px] pointer-events-none">
              person_outline
            </span>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-transparent rounded-xl text-[#191c1e] text-[14px] placeholder:text-gray-400 focus:outline-none"
              placeholder={t('namePlaceholder', lang)}
            />
          </div>
        </div>

        {/* Field 2: Email or Registered Mobile */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="contactIdentifier">
            {t('contactLabel', lang)}
          </label>
          <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 focus-within:border-[#ac2e00] focus-within:ring-2 focus-within:ring-[#ac2e00]/20 transition-all">
            <div className="flex items-center gap-1 pl-3 pr-2.5 py-1 shrink-0 bg-[#f2f4f6] rounded-l-xl mr-2">
              <span className="text-[16px] leading-none">🇮🇳</span>
              <span className="font-mono text-[11px] text-[#191c1e] font-semibold">+91</span>
              <span className="material-symbols-outlined text-[14px] text-[#575e70]">expand_more</span>
            </div>
            <input
              id="contactIdentifier"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full h-12 pr-4 bg-transparent rounded-r-xl text-[#191c1e] text-[14px] placeholder:text-gray-400 focus:outline-none"
              placeholder={t('contactPlaceholder', lang)}
            />
          </div>
        </div>

        {/* Field 3: Password + Strength Indicator */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="userPassword">
              {t('passwordLabel', lang)}
            </label>
            <button
              type="button"
              onClick={() => alert(lang === 'HI' ? 'पासवर्ड रीसेट लिंक आपके पंजीकृत मोबाइल/ईमेल पर भेजा गया।' : 'Password reset link sent to your registered UIDAI mobile/email.')}
              className="font-mono text-[11px] text-[#ac2e00] hover:underline"
            >
              {t('forgotPassword', lang)}
            </button>
          </div>

          <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 focus-within:border-[#ac2e00] focus-within:ring-2 focus-within:ring-[#ac2e00]/20 transition-all">
            <span className="material-symbols-outlined absolute left-3.5 text-[#575e70] text-[20px] pointer-events-none">
              lock_outline
            </span>
            <input
              id="userPassword"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-11 pr-11 bg-transparent rounded-xl text-[#191c1e] text-[14px] focus:outline-none"
              placeholder={t('passwordPlaceholder', lang)}
            />
            <button
              id="togglePassword"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              className="absolute right-2 p-1.5 rounded-lg text-[#575e70] hover:text-[#191c1e] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>

          {/* Security Strength Bar */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex-1 flex gap-1 h-1.5">
              <div className="flex-1 bg-[#ac2e00] rounded-full"></div>
              <div className="flex-1 bg-[#ac2e00] rounded-full"></div>
              <div className="flex-1 bg-[#ac2e00] rounded-full"></div>
              <div className="flex-1 bg-[#d53e07] rounded-full"></div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-[#ac2e00] text-[14px]">shield</span>
              <span className="font-mono text-[11px] text-[#ac2e00] font-semibold">
                {lang === 'HI' ? 'मजबूत (Argon2id)' : 'Strong (Argon2id)'}
              </span>
            </div>
          </div>
        </div>

        {/* Field 4: Remember Device (DPDP 2023 Compliant) */}
        <label className="flex items-start gap-3 p-3 bg-[#f2f4f6] rounded-xl cursor-pointer select-none border border-[#e4beb4]/20">
          <input
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-[#ac2e00] accent-[#ac2e00] shrink-0 cursor-pointer"
          />
          <div className="flex flex-col">
            <span className="text-[12px] text-[#191c1e] font-semibold leading-tight">
              {t('rememberDevice', lang)}
            </span>
            <span className="font-mono text-[11px] text-[#575e70] mt-0.5">
              {t('rememberDeviceSub', lang)}
            </span>
          </div>
        </label>

        {/* Primary Action CTA */}
        <button
          type="submit"
          className="w-full h-[50px] bg-[#ac2e00] hover:bg-[#d53e07] active:scale-[0.99] text-white text-[15px] font-bold rounded-xl shadow-md shadow-[#ac2e00]/20 flex items-center justify-center gap-2 transition-all mt-1"
        >
          <span>{t('continueToAuth', lang)}</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </form>

      {/* Divider: Sovereign & Web3 Auth Options */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-[#e0e3e5]"></div>
        </div>
        <span className="relative bg-[#f7f9fb] px-3 text-[10px] font-bold uppercase tracking-wider text-[#575e70]">
          {t('orUseWebAuthn', lang)}
        </span>
      </div>

      {/* Web3 / Sovereign Auth Modular Cards */}
      <div className="flex flex-col gap-2.5 mb-6">
        {/* Web3 Wallet (MetaMask / Polygon PoS SIWE) */}
        <button
          type="button"
          disabled={isConnectingWeb3}
          onClick={handleWeb3Connect}
          className="w-full p-3.5 bg-white hover:bg-[#f2f4f6] rounded-xl shadow-xs border border-[#ac2e00]/30 flex items-center justify-between transition-all group text-left relative overflow-hidden"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#ffdbd1] flex items-center justify-center shrink-0 group-hover:bg-[#ac2e00] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px] text-[#ac2e00] group-hover:text-white">
                account_balance_wallet
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-bold text-[#191c1e] truncate">
                  {lang === 'HI' ? 'मेटामास्क / वेब३ वॉलेट' : 'MetaMask / Web3 Wallet'}
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#ffdbd1] text-[#3b0a00] font-mono text-[10px] font-bold">
                  POLYGON
                </span>
              </div>
              <span className="text-[12px] text-[#575e70] truncate">
                {web3Status || (lang === 'HI' ? 'ईआईपी-४३६१ संप्रभु वॉलेट प्रमाणीकरण' : 'EIP-4361 SIWE & Polygon On-Chain Auth')}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#ac2e00] group-hover:translate-x-0.5 transition-transform text-[20px] shrink-0">
            {isConnectingWeb3 ? 'sync' : 'chevron_right'}
          </span>
        </button>

        {/* Aadhaar Biometric */}
        <button
          type="button"
          onClick={() => {
            onNavigate('contracts');
          }}
          className="w-full p-3.5 bg-white hover:bg-[#f2f4f6] rounded-xl shadow-xs border border-[#e4beb4]/30 flex items-center justify-between transition-all group text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#eceef0] flex items-center justify-center shrink-0 group-hover:bg-[#ac2e00] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px] text-[#ac2e00] group-hover:text-white">
                fingerprint
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-bold text-[#191c1e] truncate">{t('aadhaarBiometric', lang)}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#d9dff5] text-[#5c6274] font-mono text-[10px] font-bold">
                  UIDAI L3
                </span>
              </div>
              <span className="text-[12px] text-[#575e70] truncate">
                {lang === 'HI' ? 'बायोमेट्रिक प्रमाणीकरण एवं संप्रभु सत्यापन' : 'Biometric Iris / Fingerprint via UIDAI Gateway'}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#575e70] group-hover:translate-x-0.5 transition-transform text-[20px] shrink-0">
            chevron_right
          </span>
        </button>

        {/* DigiLocker / FIDO2 Passkey */}
        <button
          type="button"
          onClick={() => {
            onNavigate('2fa');
          }}
          className="w-full p-3.5 bg-white hover:bg-[#f2f4f6] rounded-xl shadow-xs border border-[#e4beb4]/30 flex items-center justify-between transition-all group text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#eceef0] flex items-center justify-center shrink-0 group-hover:bg-[#ac2e00] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px] text-[#ac2e00] group-hover:text-white">
                key
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-bold text-[#191c1e] truncate">{t('fidoPasskey', lang)}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#ffdbd1] text-[#862200] font-mono text-[10px] font-bold">
                  FIDO2
                </span>
              </div>
              <span className="text-[12px] text-[#575e70] truncate">
                {lang === 'HI' ? 'हार्डवेयर कुंजी अथवा उपकरण बायोमेट्रिक पासकी' : 'Hardware Enclave Security Key / Touch ID'}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#575e70] group-hover:translate-x-0.5 transition-transform text-[20px] shrink-0">
            chevron_right
          </span>
        </button>
      </div>

      {/* Institutional Audit & Compliance Micro-Badges */}
      <div className="p-4 bg-[#f2f4f6] rounded-xl shadow-xs border border-[#e4beb4]/30 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ac2e00] text-[16px]">verified</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#191c1e]">
              {lang === 'HI' ? 'विधिक मान्यता सुरक्षित' : 'Legal Validity Assured'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#575e70]">v2.5.9-in</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 p-2 bg-white rounded-lg border border-[#e4beb4]/20">
            <span className="material-symbols-outlined text-[#575e70] text-[16px]">lock</span>
            <span className="font-mono text-[11px] text-[#191c1e]">Argon2id + AES-256</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-white rounded-lg border border-[#e4beb4]/20">
            <span className="material-symbols-outlined text-[#575e70] text-[16px]">gavel</span>
            <span className="font-mono text-[11px] text-[#191c1e]">{lang === 'HI' ? 'आईटी अधिनियम धारा १०क' : 'Sec 10A IT Act 2000'}</span>
          </div>
        </div>
        <p className="text-[11px] text-[#575e70] mt-2.5 leading-snug">
          {t('termsAgreement', lang)}
        </p>
      </div>

      {/* Create Account Footer Anchor */}
      <div className="text-center pt-1 pb-4">
        <p className="text-[13px] text-[#191c1e]">
          {lang === 'HI' ? 'क्या आपका पाक्त खाता नहीं है?' : "Don't have a PAKT ID?"}{' '}
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="font-bold text-[#ac2e00] hover:underline ml-1 inline-flex items-center gap-0.5"
          >
            {lang === 'HI' ? 'नया खाता बनाएं' : 'Create Account'}
            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
          </button>
        </p>
      </div>
    </div>
  );
};
