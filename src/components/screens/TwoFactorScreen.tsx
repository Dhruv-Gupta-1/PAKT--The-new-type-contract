import React, { useState, useEffect } from 'react';
import { ScreenType, Language } from '../../types';
import { t } from '../../data/translations';

interface TwoFactorScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
}

export const TwoFactorScreen: React.FC<TwoFactorScreenProps> = ({ onNavigate, lang }) => {
  const [selectedMethod, setSelectedMethod] = useState<'totp' | 'sms' | 'aadhaar'>('totp');
  const [otp, setOtp] = useState<string[]>(['7', '4', '2', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(108); // 1:48
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // auto advance
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResend = () => {
    setResendStatus(lang === 'HI' ? 'नया कोड भेजा जा रहा है...' : 'Sending new code...');
    setTimeout(() => {
      setTimerSeconds(120);
      setResendStatus(lang === 'HI' ? 'नया कोड सफलतापूर्वक भेजा गया' : 'New code sent successfully');
      setTimeout(() => setResendStatus(null), 2500);
    }, 1000);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      setTimeout(() => {
        onNavigate('contracts');
      }, 700);
    }, 1100);
  };

  return (
    <div className="flex flex-col w-full pb-12 max-w-md mx-auto px-4 sm:px-5">
      {/* Top Security Assurance Banner */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e4beb4]/30 flex items-start gap-3 relative overflow-hidden mb-4 mt-2">
        <div className="w-10 h-10 rounded-full bg-[#ac2e00]/10 flex items-center justify-center shrink-0 text-[#ac2e00]">
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            encrypted
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ac2e00]">
              {t('zeroKnowledgeGate', lang)}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#eceef0] font-mono text-[10px] text-[#5b4139]">
              {t('uidaiLevel3', lang)}
            </span>
          </div>
          <h1 className="text-[18px] font-bold text-[#191c1e] tracking-tight">
            {t('twoFactorTitle', lang)}
          </h1>
          <p className="text-[12px] text-[#5b4139]">{t('twoFactorSubtitle', lang)}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none text-[#191c1e]">
          <span className="material-symbols-outlined text-[80px]">fingerprint</span>
        </div>
      </div>

      {/* Subtitle instruction */}
      <div className="bg-[#f2f4f6] p-3.5 rounded-xl border border-[#e4beb4]/20 mb-4">
        <p className="text-[13px] text-[#191c1e] font-bold mb-1">
          {t('twoFactorPrompt', lang)}
        </p>
        <p className="text-[12px] text-[#575e70] leading-relaxed">
          {lang === 'HI' ? 'अपने पंजीकृत ऑथेंटिकेटर ऐप अथवा मोबाइल पर प्राप्त ६-अंकीय कोड दर्ज करें।' : 'Sent to your registered TOTP authenticator device or phone.'}
        </p>
      </div>

      {/* Verification Method Selector (Pills) */}
      <div className="flex flex-col gap-2 mb-4">
        <span className="text-[10px] font-bold uppercase text-[#575e70] tracking-wider">
          {t('selectAuthMethod', lang)}
        </span>
        <div className="grid grid-cols-1 gap-2">
          {/* Option 1: TOTP */}
          <button
            type="button"
            onClick={() => setSelectedMethod('totp')}
            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
              selectedMethod === 'totp'
                ? 'bg-white border-[#ac2e00] shadow-sm'
                : 'bg-white/80 border-[#e4beb4]/30 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedMethod === 'totp'
                    ? 'bg-[#ac2e00] text-white'
                    : 'bg-[#eceef0] text-[#575e70]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">smart_display</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#191c1e]">{t('totpApp', lang)}</span>
                  <span className="font-mono text-[9px] bg-[#ffdbd1] text-[#3b0a00] px-1.5 py-0.5 rounded font-bold">
                    TOTP
                  </span>
                </div>
                <span className="text-[11px] text-[#575e70] truncate">
                  {lang === 'HI' ? 'गूगल ऑथेंटिकेटर अथवा माइक्रोसॉफ्ट' : 'Google Auth, Microsoft, or Aegis'}
                </span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 ml-2 ${
                selectedMethod === 'totp' ? 'bg-[#ac2e00]' : 'bg-gray-200 text-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
          </button>

          {/* Option 2: SMS / WhatsApp OTP */}
          <button
            type="button"
            onClick={() => setSelectedMethod('sms')}
            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
              selectedMethod === 'sms'
                ? 'bg-white border-[#ac2e00] shadow-sm'
                : 'bg-white/80 border-[#e4beb4]/30 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedMethod === 'sms'
                    ? 'bg-[#ac2e00] text-white'
                    : 'bg-[#eceef0] text-[#575e70]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">sms</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#191c1e]">{t('hardwareFido', lang)}</span>
                </div>
                <span className="font-mono text-[11px] text-[#575e70] truncate">+91 98*** **420</span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 ml-2 ${
                selectedMethod === 'sms' ? 'bg-[#ac2e00]' : 'bg-gray-200 text-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
          </button>

          {/* Option 3: Aadhaar eSign OTP */}
          <button
            type="button"
            onClick={() => setSelectedMethod('aadhaar')}
            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
              selectedMethod === 'aadhaar'
                ? 'bg-white border-[#ac2e00] shadow-sm'
                : 'bg-white/80 border-[#e4beb4]/30 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedMethod === 'aadhaar'
                    ? 'bg-[#ac2e00] text-white'
                    : 'bg-[#eceef0] text-[#575e70]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">shield_person</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#191c1e]">{t('aadhaarOtp', lang)}</span>
                  <span className="font-mono text-[9px] bg-[#eceef0] text-[#191c1e] px-1.5 py-0.5 rounded font-semibold">
                    UIDAI
                  </span>
                </div>
                <span className="text-[11px] text-[#575e70] truncate">
                  {lang === 'HI' ? 'आधार से लिंक मोबाइल पर एसएमएस' : 'Linked mobile via National Identity Stack'}
                </span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 ml-2 ${
                selectedMethod === 'aadhaar' ? 'bg-[#ac2e00]' : 'bg-gray-200 text-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
          </button>
        </div>
      </div>

      {/* 6-Digit OTP Interactive Component */}
      <div className="bg-white p-5 rounded-xl shadow-xs border border-[#e4beb4]/30 flex flex-col items-center mb-4">
        <div className="flex items-center justify-between w-full mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#575e70]">
            {lang === 'HI' ? 'सुरक्षा पिन मैट्रिक्स' : 'Security PIN Matrix'}
          </span>
          <span className="font-mono text-[11px] text-[#ac2e00] font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ac2e00] animate-pulse"></span>
            {lang === 'HI' ? 'लाइव सिंक' : 'Live Sync'}
          </span>
        </div>

        {/* 6 Individual Pin Digits Row */}
        <div className="flex items-center justify-between w-full max-w-xs gap-2 mb-5">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-box-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-13 text-center text-[22px] font-bold font-mono bg-[#f2f4f6] text-[#191c1e] rounded-lg border border-transparent focus:border-[#ac2e00] focus:bg-[#ffdbd1]/30 focus:outline-none transition-all caret-[#ac2e00]"
              placeholder="•"
            />
          ))}
        </div>

        {/* Expiry Countdown & Resend Section */}
        <div className="flex flex-col items-center gap-1 text-center w-full">
          <div className="flex items-center justify-center gap-2 bg-[#f2f4f6] px-3.5 py-1.5 rounded-full border border-[#e4beb4]/20">
            <span className="material-symbols-outlined text-[16px] text-[#ac2e00] animate-spin">
              autorenew
            </span>
            <span className="font-mono text-[12px] text-[#191c1e]">
              {lang === 'HI' ? 'कोड की वैधता:' : 'Code expires in'}{' '}
              <span className="font-bold text-[#ac2e00]">{formatTimer(timerSeconds)}</span> min
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1">
            <span className="text-[12px] text-[#575e70]">{t('didNotReceive', lang)}</span>
            <button
              type="button"
              onClick={handleResend}
              className="text-[12px] font-bold text-[#ac2e00] underline underline-offset-4 hover:opacity-80 transition-opacity ml-1"
            >
              {t('resendOtp', lang)}
            </button>
          </div>

          {resendStatus && (
            <span className="text-[11px] font-mono text-emerald-700 mt-1 font-semibold">
              {resendStatus}
            </span>
          )}
        </div>
      </div>

      {/* Security Checkpoint Details Card */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e4beb4]/30 flex flex-col gap-2.5 mb-4">
        <div className="flex items-center justify-between pb-1 border-b border-[#e4beb4]/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#dce2f7] flex items-center justify-center text-[#141b2b]">
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-bold uppercase text-[#575e70]">
                {lang === 'HI' ? 'प्रमाणित सत्र' : 'Authenticated Session'}
              </span>
              <span className="text-[13px] font-bold text-[#191c1e] truncate">
                {lang === 'HI' ? 'प्रिया शर्मा (priya.sharma@tata...)' : 'Priya Sharma (priya.sharma@tata...)'}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-[#ac2e00]">verified_user</span>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1">
          <div className="flex items-center justify-between bg-[#f2f4f6] px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#ac2e00]">location_on</span>
              <span className="text-[12px] text-[#191c1e]">
                {lang === 'HI' ? 'सत्र उत्पत्ति स्थान' : 'Origin Location'}
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#191c1e] font-semibold">
              {lang === 'HI' ? 'मुंबई, महाराष्ट्र (Jio 5G)' : 'Mumbai, Maharashtra (Jio 5G)'}
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#f2f4f6] px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#ac2e00]">security</span>
              <span className="text-[12px] text-[#191c1e]">
                {lang === 'HI' ? 'सुरक्षा प्रोटोकॉल' : 'Security Protocol'}
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#191c1e]">RFC 6238 TOTP / SHA-256</span>
          </div>
        </div>

        {/* Backup recovery key button */}
        <button
          type="button"
          onClick={() => alert(lang === 'HI' ? 'आपातकालीन रिकवरी कुंजी: PAKT-RECOV-9941-BOM-EVM-2026' : 'Emergency Recovery Key: PAKT-RECOV-9941-BOM-EVM-2026')}
          className="w-full mt-1 py-2 px-3 rounded-lg bg-[#eceef0] hover:bg-[#e0e3e5] transition-colors flex items-center justify-center gap-2 text-[#191c1e]"
        >
          <span className="material-symbols-outlined text-[16px]">key</span>
          <span className="text-[12px] font-semibold">
            {lang === 'HI' ? 'आपातकालीन रिकवरी कुंजी का उपयोग करें' : 'Use emergency recovery key'}
          </span>
        </button>
      </div>

      {/* Primary Action Controls */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full h-12 bg-[#ac2e00] hover:bg-[#d53e07] active:scale-[0.99] text-white rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#ac2e00]/20 transition-all font-bold text-[14px]"
        >
          {isVerifying ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
              <span>{t('verifyingCode', lang)}</span>
            </>
          ) : verifiedSuccess ? (
            <>
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{lang === 'HI' ? 'प्रमाणीकृत!' : 'Authenticated'}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock_open
              </span>
              <span>{t('confirmVerify', lang)}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full h-11 bg-[#f2f4f6] hover:bg-[#eceef0] text-[#191c1e] rounded-xl flex items-center justify-center gap-2 transition-colors text-[13px] font-semibold border border-[#e4beb4]/30"
        >
          <span className="material-symbols-outlined text-[18px]">switch_account</span>
          <span>{lang === 'HI' ? 'रद्द करें एवं खाता बदलें' : 'Cancel & Switch Account'}</span>
        </button>
      </div>

      {/* Statutory & Compliance Notice */}
      <div className="mt-4 p-3.5 rounded-xl bg-[#f2f4f6] text-center flex flex-col items-center gap-1 border border-[#e4beb4]/20">
        <div className="flex items-center gap-1.5 text-[#5b4139]">
          <span className="material-symbols-outlined text-[16px] text-[#ac2e00]">verified</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">{t('sec65BCertified', lang)}</span>
        </div>
        <p className="text-[10px] text-[#575e70] leading-tight">
          {t('statutorySealNote', lang)}
        </p>
      </div>
    </div>
  );
};
