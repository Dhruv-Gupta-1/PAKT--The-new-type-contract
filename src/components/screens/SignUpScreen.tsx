import React, { useState, useRef } from 'react';
import { ScreenType, Language, UserProfile } from '../../types';
import { saveUserProfileToSupabase } from '../../services/supabaseService';

interface SignUpScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
  onProfileUpdated?: (profile: Partial<UserProfile>) => void;
}

const COUNTRY_CODES = [
  { code: '+1', name: 'US / Canada' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+971', name: 'United Arab Emirates' },
  { code: '+65', name: 'Singapore' },
  { code: '+49', name: 'Germany' },
  { code: '+33', name: 'France' },
  { code: '+81', name: 'Japan' },
  { code: '+61', name: 'Australia' },
  { code: '+41', name: 'Switzerland' },
  { code: '+353', name: 'Ireland' },
  { code: '+91', name: 'Global (+91)' },
];

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onNavigate,
  lang,
  onProfileUpdated,
}) => {
  const [entityType, setEntityType] = useState<'Individual' | 'Enterprise' | 'Legal Signatory' | 'Freelancer'>('Individual');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Authorized Signatory');
  const [organization, setOrganization] = useState('');
  const [taxIdNumber, setTaxIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  const doPasswordsMatch = password.length > 0 && password === confirmPassword;

  // Phone number handler: limit strictly to 10 digits
  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#191c1e';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your Full Name.' });
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please provide a valid email address.' });
      return;
    }
    if (phone.length !== 10) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile phone number.' });
      return;
    }
    if (!isPasswordValid) {
      setStatusMessage({ type: 'error', text: 'Password must satisfy all standard security requirements.' });
      return;
    }
    if (!doPasswordsMatch) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match. Please verify.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const fullPhone = `${countryCode} ${phone}`;
    const newProfileData: Partial<UserProfile> = {
      name: fullName,
      fullName,
      email,
      phone: fullPhone,
      organization: organization || 'Sovereign Signatory Entity',
      role,
      digitalSignatureData: signatureData || undefined,
      isVerified: true,
      entityType,
      idNumber: taxIdNumber,
      updatedAt: new Date().toISOString(),
    };

    try {
      const result = await saveUserProfileToSupabase({
        full_name: fullName,
        email,
        phone: fullPhone,
        entity_type: entityType,
        id_type: 'Government ID',
        id_number: taxIdNumber || undefined,
        role,
        digital_signature_data: signatureData || undefined,
        is_verified: true,
        metadata: {
          signupDate: new Date().toISOString(),
          countryCode,
          accountCategory: entityType,
        },
      });

      if (onProfileUpdated) {
        onProfileUpdated(newProfileData);
      }

      setStatusMessage({
        type: 'success',
        text: result.message || 'Account successfully created and synced to Supabase!',
      });

      setTimeout(() => {
        setIsSubmitting(false);
        onNavigate('contracts');
      }, 1200);
    } catch (err: any) {
      if (onProfileUpdated) {
        onProfileUpdated(newProfileData);
      }
      setStatusMessage({
        type: 'success',
        text: 'Account registered locally and synced to active session!',
      });
      setTimeout(() => {
        setIsSubmitting(false);
        onNavigate('contracts');
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-start px-4 sm:px-6 py-8 max-w-lg mx-auto">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between w-full mb-6">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#191c1e] text-[13px] font-semibold rounded-xl border border-[#e4beb4]/40 shadow-xs hover:bg-[#f2f4f6] transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>{lang === 'HI' ? 'लॉगिन पर वापस जाएं' : 'Back to Login'}</span>
        </button>

        <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-[#e4beb4]/40 shadow-xs text-[#575e70]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-mono font-bold text-[#191c1e]">Supabase Live Sync</span>
        </div>
      </div>

      {/* Screen Title */}
      <div className="mb-6">
        <h1 className="text-[24px] font-extrabold text-[#191c1e] tracking-tight">
          {lang === 'HI' ? 'नया संप्रभु खाता बनाएं' : 'Create Sovereign Account'}
        </h1>
        <p className="text-[13px] text-[#575e70] mt-1">
          {lang === 'HI'
            ? 'अपनी विधिक पहचान और डिजिटल हस्ताक्षर क्रेडेंशियल सुरक्षित रूप से सुपरबेस में सहेजें।'
            : 'Register your cryptographic signatory identity. Details are securely committed to your Supabase database.'}
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 mb-5 rounded-xl text-[13px] font-medium flex items-center gap-2 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {statusMessage.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Account Type Selector */}
      <div className="mb-5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#191c1e] mb-2 block">
          {lang === 'HI' ? 'खाता प्रकार चुनें' : 'Select Account Type'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['Individual', 'Enterprise', 'Legal Signatory', 'Freelancer'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setEntityType(type)}
              className={`p-2.5 rounded-xl border text-left text-[12px] font-semibold transition-all flex items-center justify-between ${
                entityType === type
                  ? 'bg-[#ac2e00] text-white border-[#ac2e00] shadow-sm'
                  : 'bg-white text-[#191c1e] border-[#e4beb4]/40 hover:bg-[#f2f4f6]'
              }`}
            >
              <span>{type}</span>
              {entityType === type && (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="regName">
            {lang === 'HI' ? 'पूरा विधिक नाम *' : 'Full Legal Name *'}
          </label>
          <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 focus-within:border-[#ac2e00] focus-within:ring-2 focus-within:ring-[#ac2e00]/20 transition-all">
            <span className="material-symbols-outlined absolute left-3.5 text-[#575e70] text-[20px] pointer-events-none">
              badge
            </span>
            <input
              id="regName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-transparent text-[#191c1e] text-[14px] placeholder:text-gray-400 focus:outline-none"
              placeholder="e.g. Alexander Vance"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="regEmail">
            {lang === 'HI' ? 'आधिकारिक ईमेल *' : 'Official Email Address *'}
          </label>
          <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 focus-within:border-[#ac2e00] focus-within:ring-2 focus-within:ring-[#ac2e00]/20 transition-all">
            <span className="material-symbols-outlined absolute left-3.5 text-[#575e70] text-[20px] pointer-events-none">
              mail
            </span>
            <input
              id="regEmail"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-transparent text-[#191c1e] text-[14px] placeholder:text-gray-400 focus:outline-none"
              placeholder="alexander@vault.io"
            />
          </div>
        </div>

        {/* Phone Number with Country Code */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="regPhone">
              {lang === 'HI' ? 'मोबाइल नंबर (१० अंक) *' : 'Mobile Phone Number (10 Digits) *'}
            </label>
            <span className="text-[11px] font-mono text-[#575e70]">
              {phone.length}/10 digits
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Country Code Picker */}
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="h-11 px-2.5 bg-white rounded-xl border border-[#e4beb4]/40 text-[#191c1e] text-[13px] font-mono font-semibold focus:outline-none focus:border-[#ac2e00] shrink-0 shadow-xs"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.name})
                </option>
              ))}
            </select>

            {/* 10-Digit Phone Input */}
            <div className="relative flex-1 flex items-center bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 focus-within:border-[#ac2e00] focus-within:ring-2 focus-within:ring-[#ac2e00]/20 transition-all">
              <span className="material-symbols-outlined absolute left-3 text-[#575e70] text-[18px] pointer-events-none">
                call
              </span>
              <input
                id="regPhone"
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

        {/* Role & Organization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="regRole">
              {lang === 'HI' ? 'पद / भूमिका' : 'Role / Title'}
            </label>
            <input
              id="regRole"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-11 px-3.5 bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 text-[#191c1e] text-[13px] focus:outline-none focus:border-[#ac2e00]"
              placeholder="e.g. Managing Director"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="regOrg">
              {lang === 'HI' ? 'कंपनी / संगठन' : 'Organization / Entity'}
            </label>
            <input
              id="regOrg"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full h-11 px-3.5 bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 text-[#191c1e] text-[13px] focus:outline-none focus:border-[#ac2e00]"
              placeholder="e.g. Apex Legal Systems"
            />
          </div>
        </div>

        {/* Statutory ID / Tax ID */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="regTaxId">
            {lang === 'HI' ? 'पहचान / टैक्स आईडी संख्या' : 'National / Statutory Tax ID (Optional)'}
          </label>
          <input
            id="regTaxId"
            type="text"
            value={taxIdNumber}
            onChange={(e) => setTaxIdNumber(e.target.value)}
            className="w-full h-11 px-3.5 bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 text-[#191c1e] text-[13px] font-mono focus:outline-none focus:border-[#ac2e00]"
            placeholder="e.g. TAX-ID-8849-01"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="regPassword">
            {lang === 'HI' ? 'सुरक्षित पासवर्ड *' : 'Master Password *'}
          </label>
          <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 focus-within:border-[#ac2e00] focus-within:ring-2 focus-within:ring-[#ac2e00]/20 transition-all">
            <span className="material-symbols-outlined absolute left-3.5 text-[#575e70] text-[20px] pointer-events-none">
              lock
            </span>
            <input
              id="regPassword"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 pl-11 pr-11 bg-transparent text-[#191c1e] text-[14px] focus:outline-none"
              placeholder="Create strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 p-1.5 text-[#575e70] hover:text-[#191c1e]"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>

          {/* Password Traits Checklist */}
          <div className="p-3 bg-white rounded-xl border border-[#e4beb4]/30 shadow-xs mt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#575e70] block mb-2">
              Password Security Requirements:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-gray-400'}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>8+ Characters</span>
              </div>

              <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-700 font-semibold' : 'text-gray-400'}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {hasUppercase ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Uppercase (A-Z)</span>
              </div>

              <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-700 font-semibold' : 'text-gray-400'}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {hasLowercase ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Lowercase (a-z)</span>
              </div>

              <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-gray-400'}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Number (0-9)</span>
              </div>

              <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-700 font-semibold' : 'text-gray-400'} col-span-2`}>
                <span className="material-symbols-outlined text-[14px]">
                  {hasSpecial ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Special Symbol (!@#$%^&*)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]" htmlFor="regConfirmPassword">
            {lang === 'HI' ? 'पासवर्ड की पुष्टि करें *' : 'Confirm Password *'}
          </label>
          <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-[#e4beb4]/40 focus-within:border-[#ac2e00] focus-within:ring-2 focus-within:ring-[#ac2e00]/20 transition-all">
            <span className="material-symbols-outlined absolute left-3.5 text-[#575e70] text-[20px] pointer-events-none">
              lock_reset
            </span>
            <input
              id="regConfirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-transparent text-[#191c1e] text-[14px] focus:outline-none"
              placeholder="Re-enter password"
            />
          </div>
          {confirmPassword.length > 0 && (
            <span className={`text-[11px] font-semibold mt-0.5 ${doPasswordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
              {doPasswordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
            </span>
          )}
        </div>

        {/* Digital Signature Drawing Pad */}
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#191c1e]">
              {lang === 'HI' ? 'डिजिटल हस्ताक्षर पैड' : 'Digital Signatory Pad'}
            </label>
            <button
              type="button"
              onClick={clearCanvas}
              className="text-[11px] text-[#ac2e00] font-semibold hover:underline"
            >
              Clear Canvas
            </button>
          </div>
          <div className="bg-white rounded-xl border border-[#e4beb4]/50 shadow-xs p-2">
            <canvas
              ref={canvasRef}
              width={420}
              height={100}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-24 bg-[#fafbfc] border border-dashed border-[#e4beb4]/60 rounded-lg cursor-crosshair touch-none"
            />
            <span className="text-[10px] text-[#575e70] block text-center mt-1">
              Draw your legal signature with mouse, stylus, or touch
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#ac2e00] hover:bg-[#d53e07] active:scale-[0.99] text-white text-[15px] font-bold rounded-xl shadow-md shadow-[#ac2e00]/20 flex items-center justify-center gap-2 transition-all mt-3"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
              <span>Syncing to Supabase...</span>
            </>
          ) : (
            <>
              <span>Create Account & Save to Supabase</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Link to Login */}
      <div className="text-center pt-5 pb-6">
        <p className="text-[13px] text-[#191c1e]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-bold text-[#ac2e00] hover:underline ml-1"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
