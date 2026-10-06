import React, { useState } from 'react';
import { ScreenType, Language } from '../../types';
import { ASSETS } from '../../data/mockData';
import { connectMetaMaskWallet } from '../../utils/web3Wallet';

interface LoginScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
}

const COUNTRY_CODES = [
  { code: '+1', label: '+1 (US/CA)' },
  { code: '+44', label: '+44 (UK)' },
  { code: '+971', label: '+971 (UAE)' },
  { code: '+65', label: '+65 (SG)' },
  { code: '+49', label: '+49 (DE)' },
  { code: '+33', label: '+33 (FR)' },
  { code: '+81', label: '+81 (JP)' },
  { code: '+61', label: '+61 (AU)' },
  { code: '+41', label: '+41 (CH)' },
  { code: '+353', label: '+353 (IE)' },
  { code: '+91', label: '+91 (Global)' },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, lang }) => {
  // Auth mode switch: email vs phone
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('signatory@vault.io');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('9876543210');
  const [fullName, setFullName] = useState('Alexander Vance');
  const [password, setPassword] = useState('Crypt0#Vault2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // OTP Sidebar State
  const [isOtpSidebarOpen, setIsOtpSidebarOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTarget, setOtpTarget] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(60);

  // Web3 state
  const [isConnectingWeb3, setIsConnectingWeb3] = useState(false);
  const [web3Status, setWeb3Status] = useState<string | null>(null);

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const passwordStrengthScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('2fa');
  };

  const handleSendOtp = () => {
    const target = authMode === 'email' ? email : `${countryCode} ${phone}`;
    setOtpTarget(target);
    setOtpSent(true);
    setOtpCountdown(60);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length >= 4) {
      setIsOtpSidebarOpen(false);
      onNavigate('contracts');
    }
  };

  const handleWeb3Connect = async () => {
    setIsConnectingWeb3(true);
    setWeb3Status('Connecting to Web3 Wallet on Sepolia...');
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
    <div className="relative min-h-screen bg-[#f7f9fb] flex flex-col justify-between px-4 sm:px-6 py-6 max-w-md mx-auto">
      {/* Top Header / Back Navigation */}
      <div className="flex items-center justify-between w-full mb-3">
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#191c1e] text-[13px] font-semibold rounded-xl border border-[#e4beb4]/40 shadow-xs hover:bg-[#f2f4f6] transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>{lang === 'HI' ? 'होम' : 'Home'}</span>
        </button>

        {/* Trigger for OTP Sidebar */}
        <button
          type="button"
          onClick={() => {
            setIsOtpSidebarOpen(true);
            if (!otpSent) handleSendOtp();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffdbd1] text-[#ac2e00] text-[12px] font-bold rounded-xl border border-[#ac2e00]/20 hover:bg-[#ffb5a0] transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">sms</span>
          <span>{lang === 'HI' ? 'ओटीपी लॉगिन' : 'Instant OTP Login'}</span>
        </button>
      </div>

      {/* Hero Visual Banner */}
      <div className="relative w-full rounded-2xl overflow-hidden mb-4 shadow-sm bg-[#eceef0]">
        <div
          className="w-full h-28 bg-cover bg-center"
          style={{ backgroundImage: `url('${ASSETS.loginHero}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#191c1e] via-[#191c1e]/60 to-transparent flex flex-col justify-end p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-[#ffb5a0] text-[16px]">lock_clock</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffdbd1]">
              Sovereign Cryptographic Protocol
            </span>
          </div>
          <h1 className="text-[20px] font-bold text-white leading-tight">
            Sign In to Sovereign Vault
          </h1>
        </div>
      </div>

      {/* Switch Option: Email vs Phone Number */}
      <div className="mb-4">
        <div className="flex p-1 bg-white rounded-xl border border-[#e4beb4]/40 shadow-xs">
          <button
            type="button"
            onClick={() => setAuthMode('email')}
            className={`flex-1 py-2 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'email'
                ? 'bg-[#ac2e00] text-white shadow-xs'
                : 'text-[#575e70] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            <span>Email Address</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('phone')}
            className={`flex-1 py-2 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'phone'
                ? 'bg-[#ac2e00] text-white shadow-xs'
                : 'text-[#575e70] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">phone_iphone</span>
            <span>Mobile Phone</span>
          </button>
        </div>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="loginFullName">
            Full Name
          </label>
          <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 focus-within:border-[#ac2e00] focus-within:ring-2 focus-within:ring-[#ac2e00]/20 transition-all">
            <span className="material-symbols-outlined absolute left-3.5 text-[#575e70] text-[20px] pointer-events-none">
              person_outline
            </span>
            <input
              id="loginFullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-transparent text-[#191c1e] text-[14px] placeholder:text-gray-400 focus:outline-none"
              placeholder="Your full legal name"
            />
          </div>
        </div>

        {/* Email or Phone Field (based on switch) */}
        {authMode === 'email' ? (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="loginEmail">
              Email Address
            </label>
            <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 focus-within:border-[#ac2e00] focus-within:ring-2 focus-within:ring-[#ac2e00]/20 transition-all">
              <span className="material-symbols-outlined absolute left-3.5 text-[#575e70] text-[20px] pointer-events-none">
                mail
              </span>
              <input
                id="loginEmail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-transparent text-[#191c1e] text-[14px] placeholder:text-gray-400 focus:outline-none"
                placeholder="name@organization.com"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-baseline">
              <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="loginPhone">
                Mobile Number (10 Digits)
              </label>
              <span className="font-mono text-[10px] text-[#575e70]">
                {phone.length}/10 digits
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Country Code Picker */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-11 px-2 bg-white rounded-xl border border-[#e4beb4]/40 text-[#191c1e] text-[12px] font-mono font-semibold focus:outline-none focus:border-[#ac2e00] shadow-xs"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>

              {/* 10-Digit Limited Input */}
              <div className="relative flex-1 flex items-center bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 focus-within:border-[#ac2e00] focus-within:ring-2 focus-within:ring-[#ac2e00]/20 transition-all">
                <span className="material-symbols-outlined absolute left-3 text-[#575e70] text-[18px] pointer-events-none">
                  call
                </span>
                <input
                  id="loginPhone"
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 bg-transparent text-[#191c1e] text-[14px] font-mono placeholder:text-gray-400 focus:outline-none"
                  placeholder="9876543210"
                />
              </div>
            </div>
          </div>
        )}

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-baseline">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="loginPassword">
              Master Password
            </label>
            <button
              type="button"
              onClick={() => alert('Password reset verification dispatched to your registered address.')}
              className="font-mono text-[11px] text-[#ac2e00] hover:underline"
            >
              Forgot?
            </button>
          </div>

          <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 focus-within:border-[#ac2e00] focus-within:ring-2 focus-within:ring-[#ac2e00]/20 transition-all">
            <span className="material-symbols-outlined absolute left-3.5 text-[#575e70] text-[20px] pointer-events-none">
              lock_outline
            </span>
            <input
              id="loginPassword"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 pl-11 pr-11 bg-transparent text-[#191c1e] text-[14px] focus:outline-none"
              placeholder="Enter master password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 p-1.5 rounded-lg text-[#575e70] hover:text-[#191c1e]"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>

          {/* Regular Password Traits & Rules Feedback Box */}
          <div className="p-2.5 bg-white rounded-xl border border-[#e4beb4]/40 shadow-xs mt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#575e70]">
                Password Strength Checklist:
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold text-[#ac2e00]">
                  {passwordStrengthScore === 5 ? 'High Security' : `${passwordStrengthScore}/5 Met`}
                </span>
              </div>
            </div>

            {/* Strength Bar */}
            <div className="flex gap-1 h-1 mb-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`flex-1 rounded-full transition-all ${
                    level <= passwordStrengthScore
                      ? passwordStrengthScore === 5
                        ? 'bg-emerald-500'
                        : 'bg-[#ac2e00]'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Checklist Items */}
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-gray-400'}`}>
                <span className="material-symbols-outlined text-[13px]">
                  {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>8+ Characters</span>
              </div>

              <div className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-700 font-semibold' : 'text-gray-400'}`}>
                <span className="material-symbols-outlined text-[13px]">
                  {hasUppercase ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Uppercase (A-Z)</span>
              </div>

              <div className={`flex items-center gap-1 ${hasLowercase ? 'text-emerald-700 font-semibold' : 'text-gray-400'}`}>
                <span className="material-symbols-outlined text-[13px]">
                  {hasLowercase ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Lowercase (a-z)</span>
              </div>

              <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-gray-400'}`}>
                <span className="material-symbols-outlined text-[13px]">
                  {hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Number (0-9)</span>
              </div>

              <div className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-700 font-semibold' : 'text-gray-400'} col-span-2`}>
                <span className="material-symbols-outlined text-[13px]">
                  {hasSpecial ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Special Symbol (!@#$%^&*)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Remember Device Option */}
        <label className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-[#e4beb4]/30 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
            className="w-4 h-4 rounded text-[#ac2e00] accent-[#ac2e00] shrink-0 cursor-pointer"
          />
          <span className="text-[12px] text-[#191c1e] font-semibold">
            Remember this sovereign device for 30 days
          </span>
        </label>

        {/* Primary Submit CTA */}
        <button
          type="submit"
          className="w-full h-12 bg-[#ac2e00] hover:bg-[#d53e07] active:scale-[0.99] text-white text-[15px] font-bold rounded-xl shadow-md shadow-[#ac2e00]/20 flex items-center justify-center gap-2 transition-all mt-1"
        >
          <span>Continue to Verification</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </form>

      {/* Alternative Auth Methods Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-[#e0e3e5]"></div>
        </div>
        <span className="relative bg-[#f7f9fb] px-3 text-[10px] font-bold uppercase tracking-wider text-[#575e70]">
          Or Connect Via Web3 / Enclave
        </span>
      </div>

      {/* Modular Auth Cards */}
      <div className="flex flex-col gap-2 mb-4">
        {/* Web3 Wallet */}
        <button
          type="button"
          disabled={isConnectingWeb3}
          onClick={handleWeb3Connect}
          className="w-full p-3 bg-white hover:bg-[#f2f4f6] rounded-xl shadow-xs border border-[#ac2e00]/30 flex items-center justify-between transition-all group text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#ffdbd1] flex items-center justify-center shrink-0 group-hover:bg-[#ac2e00] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px] text-[#ac2e00] group-hover:text-white">
                account_balance_wallet
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-[#191c1e] truncate">
                  MetaMask / Web3 Wallet
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#ffdbd1] text-[#3b0a00] font-mono text-[9px] font-bold">
                  SEPOLIA
                </span>
              </div>
              <span className="text-[11px] text-[#575e70] truncate">
                {web3Status || 'Direct Ethereum Sepolia On-Chain Sign-In'}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#ac2e00] text-[18px] shrink-0">
            {isConnectingWeb3 ? 'sync' : 'chevron_right'}
          </span>
        </button>

        {/* Biometric Iris / Fingerprint Button -> Navigates to FeatureBuildingScreen */}
        <button
          type="button"
          onClick={() => onNavigate('feature-building')}
          className="w-full p-3 bg-white hover:bg-[#f2f4f6] rounded-xl shadow-xs border border-[#e4beb4]/30 flex items-center justify-between transition-all group text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#eceef0] flex items-center justify-center shrink-0 group-hover:bg-[#ac2e00] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px] text-[#ac2e00] group-hover:text-white">
                fingerprint
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-[#191c1e] truncate">
                  Biometric Iris / Fingerprint
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#d9dff5] text-[#5c6274] font-mono text-[9px] font-bold">
                  ENCLAVE
                </span>
              </div>
              <span className="text-[11px] text-[#575e70] truncate">
                Hardware Enclave Biometric Gateway
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#575e70] text-[18px] shrink-0">
            chevron_right
          </span>
        </button>

        {/* Face ID / Passkey Button -> Navigates to FeatureBuildingScreen */}
        <button
          type="button"
          onClick={() => onNavigate('feature-building')}
          className="w-full p-3 bg-white hover:bg-[#f2f4f6] rounded-xl shadow-xs border border-[#e4beb4]/30 flex items-center justify-between transition-all group text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#eceef0] flex items-center justify-center shrink-0 group-hover:bg-[#ac2e00] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px] text-[#ac2e00] group-hover:text-white">
                key
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-[#191c1e] truncate">
                  Face ID / Passkey (FIDO2)
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#ffdbd1] text-[#862200] font-mono text-[9px] font-bold">
                  FIDO2
                </span>
              </div>
              <span className="text-[11px] text-[#575e70] truncate">
                Hardware Security Key / Touch ID
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#575e70] text-[18px] shrink-0">
            chevron_right
          </span>
        </button>
      </div>

      {/* Footer: Create Account Link -> Navigates to SignUpScreen */}
      <div className="text-center pt-2 pb-4">
        <p className="text-[13px] text-[#191c1e]">
          Don't have a Sovereign ID?{' '}
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="font-bold text-[#ac2e00] hover:underline ml-1 inline-flex items-center gap-0.5"
          >
            <span>Create Account</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </p>
      </div>

      {/* Slide-in OTP Sidebar / Drawer */}
      {isOtpSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#ffdbd1] text-[#ac2e00] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">sms</span>
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#191c1e]">Instant OTP Login</h2>
                    <span className="text-[11px] text-[#575e70]">Zero-Password Verification</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOtpSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Sidebar Body */}
              <p className="text-[12px] text-[#575e70] leading-relaxed mb-4">
                We send a 6-digit cryptographic verification code to your verified endpoint:
              </p>

              <div className="p-3 bg-[#f7f9fb] rounded-xl border border-[#e4beb4]/30 mb-4 flex items-center justify-between">
                <span className="font-mono text-[13px] font-semibold text-[#191c1e]">
                  {otpTarget || (authMode === 'email' ? email : `${countryCode} ${phone}`)}
                </span>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-[11px] text-[#ac2e00] font-bold hover:underline"
                >
                  Resend
                </button>
              </div>

              {otpSent && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[12px] flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[16px]">mark_email_read</span>
                  <span>OTP code sent! Use test code: <strong className="font-mono">842910</strong></span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="842910"
                    className="w-full h-12 text-center font-mono text-[22px] tracking-[0.3em] font-bold bg-[#f7f9fb] rounded-xl border border-[#e4beb4]/50 focus:outline-none focus:border-[#ac2e00] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#ac2e00] hover:bg-[#d53e07] text-white text-[14px] font-bold rounded-xl shadow-md shadow-[#ac2e00]/20 flex items-center justify-center gap-1.5 transition-all mt-2"
                >
                  <span>Authenticate & Enter Vault</span>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </button>
              </form>
            </div>

            {/* Sidebar Footer */}
            <div className="pt-4 border-t border-gray-100 text-center">
              <span className="text-[11px] text-[#575e70]">
                Cryptographic session expires in 15 minutes.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
