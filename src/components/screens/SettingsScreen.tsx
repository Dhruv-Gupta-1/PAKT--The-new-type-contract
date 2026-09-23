import React, { useState } from 'react';
import { ScreenType, Language, ContractLanguage, UserProfile } from '../../types';
import { ASSETS, INITIAL_USER_PROFILE } from '../../data/mockData';
import { connectMetaMaskWallet, Web3ConnectionState } from '../../utils/web3Wallet';
import { useLoading } from '../../context/LoadingContext';

interface SettingsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
  contractLanguage?: ContractLanguage;
  onSelectContractLanguage?: (cl: ContractLanguage) => void;
  userProfile?: UserProfile;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
}

const AVATAR_PRESETS = [
  { label: 'Priya (Executive)', url: ASSETS.avatar },
  { label: 'Corporate Legal', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Modern Professional', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  { label: 'Tech Counsel', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigate,
  lang,
  contractLanguage = 'en',
  onSelectContractLanguage,
  userProfile = INITIAL_USER_PROFILE,
  onUpdateProfile,
}) => {
  // Protocol toggles
  const [zeroGasRelay, setZeroGasRelay] = useState(true);
  const [passkeyActive, setPasskeyActive] = useState(true);
  const [digilockerSync, setDigilockerSync] = useState(true);
  const [whatsappSmsAlerts, setWhatsappSmsAlerts] = useState(true);
  const [emailCertificates, setEmailCertificates] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(userProfile);
  const [saveSuccessBanner, setSaveSuccessBanner] = useState<string | null>(null);
  const [activeTabGroup, setActiveTabGroup] = useState<'all' | 'identity' | 'drafting' | 'web3' | 'compliance'>('all');

  // Web3 state
  const [web3State, setWeb3State] = useState<Web3ConnectionState>({
    isConnected: true,
    address: '0x71C857835B551339A471026027a48911C36b5A01',
    chainId: '0x89',
    providerName: 'MetaMask / Sovereign Mumbai Node',
    isFallback: false,
    statusMessage: 'Ready (Polygon PoS)',
  });
  const { showLoading } = useLoading();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    showLoading({
      titleEn: 'Connecting MetaMask Web3 Signer',
      titleHi: 'मेटामास्क वेब३ हस्ताक्षरकर्ता से जुड़ाव',
      subtitleEn: 'Requesting Ethereum provider accounts and establishing EIP-4361 handshake with Polygon PoS.',
      subtitleHi: 'एथेरियम प्रदाता खातों का अनुरोध एवं पॉलीगॉन पीओएस के साथ EIP-4361 हैंडशेक।',
      duration: 1400,
      customSteps: [
        'Querying window.ethereum provider...',
        'Checking Polygon PoS chain ID 137...',
        'Validating EIP-4361 SIWE signature permissions...',
        'Connecting sovereign enclave signer...',
        'MetaMask synchronized successfully!',
      ],
      customStepsHi: [
        'window.ethereum प्रदाता की जांच...',
        'पॉलीगॉन पीओएस चेन आईडी १३७ का सत्यापन...',
        'EIP-4361 SIWE हस्ताक्षर अनुमतियों की जांच...',
        'संप्रभु एन्क्लेव हस्ताक्षरकर्ता से जुड़ाव...',
        'मेटामास्क सफलतापूर्वक समन्वयित हुआ!',
      ],
      onComplete: async () => {
        try {
          const res = await connectMetaMaskWallet();
          setWeb3State(res);
          triggerBanner(lang === 'EN' ? 'MetaMask wallet synchronized with Polygon PoS' : 'मेटामास्क वॉलेट पॉलीगॉन पीओएस के साथ समन्वयित');
        } catch {
          // Handled cleanly
        } finally {
          setIsConnecting(false);
        }
      },
    });
  };

  const triggerBanner = (msg: string) => {
    setSaveSuccessBanner(msg);
    setTimeout(() => {
      setSaveSuccessBanner(null);
    }, 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showLoading({
      titleEn: 'Updating Sovereign Profile & Identity',
      titleHi: 'संप्रभु प्रोफ़ाइल एवं पहचान अद्यतन जारी',
      subtitleEn: 'Re-anchoring statutory metadata, updating verified contact endpoints, and synchronizing with Mumbai Enclave.',
      subtitleHi: 'सांविधिक मेटाडेटा का पुनर्स्थापन, सत्यापित संपर्क बिंदुओं का अद्यतन एवं मुंबई एन्क्लेव समन्वय।',
      duration: 1600,
      customSteps: [
        'Validating DPDP Act 2023 consent manifest...',
        'Updating phone/email alert endpoints (+91 / SMTP)...',
        'Recomputing DID signature & sovereign KYC record...',
        'Anchoring changes to Mumbai Node IN-MUM-1...',
        'Profile updated successfully!',
      ],
      customStepsHi: [
        'डीपीडीपी अधिनियम २०२३ सहमति घोषणापत्र की पुष्टि...',
        'फ़ोन/ईमेल अलर्ट एंडपॉइंट्स (+91 / SMTP) का अद्यतन...',
        'डीआईडी हस्ताक्षर एवं संप्रभु केवाईसी रिकॉर्ड की पुनर्गणना...',
        'मुंबई नोड IN-MUM-1 में परिवर्तनों का अंकन...',
        'प्रोफ़ाइल सफलतापूर्वक अद्यतन हुई!',
      ],
      onComplete: () => {
        if (onUpdateProfile) {
          onUpdateProfile(editForm);
        }
        setIsEditingProfile(false);
        triggerBanner(
          lang === 'EN'
            ? 'Profile updated successfully • Sovereign Node IN-MUM-1 synced'
            : 'प्रोफ़ाइल सफलतापूर्वक अद्यतन हुई • संप्रभु नोड IN-MUM-1 समन्वयित'
        );
      },
    });
  };

  const handleCancelEdit = () => {
    setEditForm(userProfile);
    setIsEditingProfile(false);
  };

  const handleResetToDefault = () => {
    setEditForm(INITIAL_USER_PROFILE);
    if (onUpdateProfile) {
      onUpdateProfile(INITIAL_USER_PROFILE);
    }
    triggerBanner(lang === 'EN' ? 'Profile reset to sovereign default' : 'प्रोफ़ाइल डिफ़ॉल्ट पर रीसेट हुई');
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-2xl mx-auto px-4 sm:px-5">
      {/* Top Header & Sovereign Badge */}
      <div className="flex items-center justify-between mt-2 mb-3">
        <div>
          <h1 className="text-[19px] font-bold text-[#191c1e] tracking-tight flex items-center gap-2">
            <span>{lang === 'EN' ? 'Settings & Sovereign Identity' : 'सेटिंग्स एवं संप्रभु पहचान'}</span>
            <span className="font-mono text-[10px] bg-[#ffdbd1] text-[#ac2e00] px-2 py-0.5 rounded-full font-bold">
              v2.5
            </span>
          </h1>
          <p className="text-[12px] text-[#5b4139] mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {lang === 'EN'
                ? 'Sovereign Node IN-MUM-1 • Polygon PoS Enclave'
                : 'संप्रभु नोड IN-MUM-1 • पॉलीगॉन पीओएस एन्क्लेव'}
            </span>
          </p>
        </div>
        <span className="font-mono text-[10px] bg-[#dce2f7] text-[#141b2b] px-2.5 py-1 rounded-full font-bold shrink-0 border border-[#dce2f7]">
          {userProfile.kycLevel.split(' ')[0]} {userProfile.kycLevel.split(' ')[1]} {userProfile.kycLevel.split(' ')[2]}
        </span>
      </div>

      {/* Save Success Alert Banner */}
      {saveSuccessBanner && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-[12px] flex items-center justify-between gap-2 animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
            <span className="font-medium">{saveSuccessBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-950 p-0.5"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Navigation Filter Tabs for Working Groups */}
      <div className="flex items-center gap-1 mb-5 p-1 bg-[#f2f4f6] rounded-xl border border-[#e4beb4]/30 overflow-x-auto scrollbar-none text-[12px]">
        <button
          type="button"
          onClick={() => setActiveTabGroup('all')}
          className={`py-1.5 px-3 rounded-lg font-bold whitespace-nowrap transition-all ${
            activeTabGroup === 'all'
              ? 'bg-white text-[#191c1e] shadow-xs'
              : 'text-[#5b4139] hover:text-[#191c1e]'
          }`}
        >
          {lang === 'EN' ? 'All Settings' : 'सभी सेटिंग्स'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTabGroup('identity')}
          className={`py-1.5 px-3 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
            activeTabGroup === 'identity'
              ? 'bg-white text-[#191c1e] shadow-xs'
              : 'text-[#5b4139] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">person</span>
          <span>{lang === 'EN' ? 'Profile & Handles' : 'प्रोफ़ाइल व हैंडल्स'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTabGroup('drafting')}
          className={`py-1.5 px-3 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
            activeTabGroup === 'drafting'
              ? 'bg-white text-[#191c1e] shadow-xs'
              : 'text-[#5b4139] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">gavel</span>
          <span>{lang === 'EN' ? 'Legal Drafting' : 'विधिक प्रारूपण'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTabGroup('web3')}
          className={`py-1.5 px-3 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
            activeTabGroup === 'web3'
              ? 'bg-white text-[#191c1e] shadow-xs'
              : 'text-[#5b4139] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">link</span>
          <span>{lang === 'EN' ? 'Web3 & Infra' : 'वेब३ एवं अवसंरचना'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTabGroup('compliance')}
          className={`py-1.5 px-3 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
            activeTabGroup === 'compliance'
              ? 'bg-white text-[#191c1e] shadow-xs'
              : 'text-[#5b4139] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">verified_user</span>
          <span>{lang === 'EN' ? 'DPDP & Alerts' : 'डीपीडीपी व अलर्ट'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* GROUP 1: SOVEREIGN IDENTITY & PERSONAL PROFILE */}
      {/* ========================================================================= */}
      {(activeTabGroup === 'all' || activeTabGroup === 'identity') && (
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ac2e00] text-[18px]">badge</span>
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#191c1e]">
                {lang === 'EN' ? '1. Sovereign Identity & Profile' : '१. संप्रभु पहचान एवं प्रोफ़ाइल'}
              </h2>
            </div>
            {!isEditingProfile && (
              <button
                type="button"
                onClick={() => {
                  setEditForm(userProfile);
                  setIsEditingProfile(true);
                }}
                className="px-2.5 py-1 bg-[#191c1e] hover:bg-[#ac2e00] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[13px]">edit</span>
                <span>{lang === 'EN' ? 'Edit Profile' : 'प्रोफ़ाइल संपादित करें'}</span>
              </button>
            )}
          </div>

          {/* VIEW MODE: User Profile Card */}
          {!isEditingProfile ? (
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-[#e4beb4]/40 flex flex-col gap-4">
              {/* Top Row: Avatar, Name, Designation & Badges */}
              <div className="flex items-start gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#ac2e00]/20 shadow-xs"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white" title="DPDP Verified Principal">
                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-[17px] font-bold text-[#191c1e] leading-snug">
                      {lang === 'EN' ? userProfile.name : userProfile.nameHindi}
                    </h3>
                    <span className="material-symbols-outlined text-[#ac2e00] text-[18px]">verified</span>
                    <span className="font-mono text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      GOV BHARAT VERIFIED
                    </span>
                  </div>

                  <p className="text-[12px] text-[#5b4139] font-medium mt-0.5">
                    {lang === 'EN' ? userProfile.role : userProfile.roleHindi} •{' '}
                    <span className="font-semibold text-[#191c1e]">
                      {lang === 'EN' ? userProfile.organization : userProfile.organizationHindi}
                    </span>
                  </p>

                  <p className="text-[11px] text-[#575e70] flex items-center gap-1 mt-1 font-mono">
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    <span>{lang === 'EN' ? userProfile.location : userProfile.locationHindi}</span>
                  </p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="p-3 bg-[#f2f4f6] rounded-xl border border-[#e4beb4]/20">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#ac2e00] mb-1">
                  <span className="material-symbols-outlined text-[14px]">format_quote</span>
                  <span>{lang === 'EN' ? 'Professional & Legal Bio' : 'व्यावसायिक एवं विधिक परिचय'}</span>
                </div>
                <p className="text-[12px] text-[#191c1e] leading-relaxed italic">
                  "{lang === 'EN' ? userProfile.bio : userProfile.bioHindi}"
                </p>
              </div>

              {/* Contact Information & Handles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-[#f2f4f6]">
                {/* Email Update */}
                <div className="p-2.5 rounded-lg bg-[#fafbfc] border border-[#e4beb4]/20 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#ffdbd1] text-[#ac2e00] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[10px] text-[#5b4139] uppercase font-bold tracking-wider">
                      {lang === 'EN' ? 'Email Address' : 'ईमेल पता'}
                    </span>
                    <span className="text-[12px] font-mono font-medium text-[#191c1e] truncate">
                      {userProfile.email}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                    Verified
                  </span>
                </div>

                {/* Phone Number Update */}
                <div className="p-2.5 rounded-lg bg-[#fafbfc] border border-[#e4beb4]/20 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">phone_iphone</span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[10px] text-[#5b4139] uppercase font-bold tracking-wider">
                      {lang === 'EN' ? 'Mobile / WhatsApp' : 'मोबाइल / व्हाट्सएप'}
                    </span>
                    <span className="text-[12px] font-mono font-medium text-[#191c1e] truncate">
                      {userProfile.phone}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                    OTP Active
                  </span>
                </div>
              </div>

              {/* Social & Sovereign Web3 Handles */}
              <div className="pt-1">
                <span className="text-[10px] text-[#5b4139] uppercase font-bold tracking-wider block mb-2">
                  {lang === 'EN' ? 'Social Handles & Sovereign DID' : 'सोशल हैंडल्स एवं संप्रभु डीआईडी'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {userProfile.twitterHandle && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f2f4f6] text-[#191c1e] text-[11px] font-medium border border-[#e4beb4]/30">
                      <span className="font-bold text-[#ac2e00]">𝕏</span>
                      <span>{userProfile.twitterHandle}</span>
                    </span>
                  )}
                  {userProfile.linkedinHandle && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f2f4f6] text-[#191c1e] text-[11px] font-medium border border-[#e4beb4]/30">
                      <span className="font-bold text-[#0077b5]">in</span>
                      <span>{userProfile.linkedinHandle}</span>
                    </span>
                  )}
                  {userProfile.githubHandle && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f2f4f6] text-[#191c1e] text-[11px] font-medium border border-[#e4beb4]/30">
                      <span className="font-mono text-[11px]">gh/</span>
                      <span>{userProfile.githubHandle}</span>
                    </span>
                  )}
                  {userProfile.telegramHandle && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f2f4f6] text-[#191c1e] text-[11px] font-medium border border-[#e4beb4]/30">
                      <span className="material-symbols-outlined text-[13px] text-sky-600">send</span>
                      <span>{userProfile.telegramHandle}</span>
                    </span>
                  )}
                  {userProfile.web3Ens && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 text-[11px] font-bold border border-purple-200">
                      <span className="material-symbols-outlined text-[13px] text-purple-700">token</span>
                      <span>{userProfile.web3Ens}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Statutory KYC Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#f2f4f6]">
                <span className="font-mono text-[10px] text-[#575e70] bg-[#f2f4f6] px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-emerald-600">fingerprint</span>
                  <span>Aadhaar: {userProfile.aadhaarMasked}</span>
                </span>
                <span className="font-mono text-[10px] text-[#575e70] bg-[#f2f4f6] px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-amber-600">credit_card</span>
                  <span>PAN: {userProfile.panMasked}</span>
                </span>
                {userProfile.dinNumber && (
                  <span className="font-mono text-[10px] text-[#575e70] bg-[#f2f4f6] px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-blue-600">gavel</span>
                    <span>MCA DIN: {userProfile.dinNumber}</span>
                  </span>
                )}
                <span className="font-mono text-[10px] text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 truncate max-w-[240px]" title={userProfile.didIdentifier}>
                  DID: {userProfile.didIdentifier}
                </span>
              </div>
            </div>
          ) : (
            /* EDIT MODE: Interactive Form */
            <form
              onSubmit={handleSaveProfile}
              className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border-2 border-[#ac2e00]/40 flex flex-col gap-4 animate-fadeIn"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#e4beb4]/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ac2e00] text-[20px]">edit_note</span>
                  <h3 className="text-[14px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'Edit Sovereign Profile Details' : 'संप्रभु प्रोफ़ाइल विवरण संपादित करें'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-[#5b4139] hover:text-[#191c1e] text-[12px] font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  <span>{lang === 'EN' ? 'Cancel' : 'रद्द करें'}</span>
                </button>
              </div>

              {/* Avatar Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#5b4139] uppercase tracking-wider">
                  {lang === 'EN' ? 'Profile Avatar & Photo' : 'प्रोफ़ाइल अवतार एवं फ़ोटो'}
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={editForm.avatarUrl}
                    alt="Current Avatar"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#ac2e00] shrink-0"
                  />
                  <div className="flex flex-wrap gap-2 flex-1">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, avatarUrl: preset.url })}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          editForm.avatarUrl === preset.url
                            ? 'bg-[#ffdbd1] border-[#ac2e00] text-[#3b0a00] font-bold'
                            : 'bg-[#f2f4f6] border-[#e4beb4]/40 text-[#5b4139] hover:bg-[#e0e3e5]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-1">
                  <input
                    type="url"
                    value={editForm.avatarUrl}
                    onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                    placeholder="Or enter custom avatar image URL..."
                    className="w-full text-[11px] font-mono px-3 py-1.5 bg-[#f2f4f6] border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                  />
                </div>
              </div>

              {/* Name & Title Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'Full Legal Name (English)' : 'पूर्ण विधिक नाम (अंग्रेज़ी)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="text-[13px] px-3 py-2 bg-[#f2f4f6] border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'Full Legal Name (हिन्दी)' : 'पूर्ण विधिक नाम (हिन्दी)'}
                  </label>
                  <input
                    type="text"
                    value={editForm.nameHindi}
                    onChange={(e) => setEditForm({ ...editForm, nameHindi: e.target.value })}
                    className="text-[13px] px-3 py-2 bg-[#f2f4f6] border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                  />
                </div>
              </div>

              {/* Role & Organization Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'Designation / Role' : 'पदनाम / भूमिका'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="text-[13px] px-3 py-2 bg-[#f2f4f6] border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'Organization / Corporate Entity' : 'संस्था / कॉर्पोरेट निकाय'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.organization}
                    onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                    className="text-[13px] px-3 py-2 bg-[#f2f4f6] border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                  />
                </div>
              </div>

              {/* Professional & Legal Bio */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'Professional Bio (Appears on Execution Manifests)' : 'व्यावसायिक परिचय (निष्पादन घोषणापत्र पर दिखाई देगा)'}
                  </label>
                  <span className="text-[10px] font-mono text-[#5b4139]">{editForm.bio.length}/300</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Provide a concise description of your statutory authority, legal role, or tech practice..."
                  className="text-[12px] px-3 py-2 bg-[#f2f4f6] border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00] leading-relaxed resize-none"
                />
              </div>

              {/* Contact Updates (Email & Phone) */}
              <div className="p-3 bg-[#fafbfc] rounded-xl border border-[#e4beb4]/30 flex flex-col gap-3">
                <span className="text-[11px] font-bold text-[#ac2e00] uppercase tracking-wider">
                  {lang === 'EN' ? 'Contact Updates & Milestone Routing' : 'संपर्क अद्यतन एवं अलर्ट रूटिंग'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[#191c1e]">
                      {lang === 'EN' ? 'Email Address' : 'ईमेल पता'} *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full text-[12px] font-mono pl-8 pr-3 py-2 bg-white border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                      />
                      <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[15px] text-[#5b4139]">
                        mail
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[#191c1e]">
                      {lang === 'EN' ? 'Phone / WhatsApp eSign Alert Number' : 'फ़ोन / व्हाट्सएप ई-साइन अलर्ट नंबर'} *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full text-[12px] font-mono pl-8 pr-3 py-2 bg-white border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                      />
                      <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[15px] text-[#5b4139]">
                        phone
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'Primary Legal Jurisdiction & Location' : 'प्राथमिक विधिक क्षेत्राधिकार एवं स्थान'}
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="text-[12px] px-3 py-2 bg-white border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                  />
                </div>
              </div>

              {/* Other Handles & Web3 Sovereign Identifiers */}
              <div className="p-3 bg-[#fafbfc] rounded-xl border border-[#e4beb4]/30 flex flex-col gap-3">
                <span className="text-[11px] font-bold text-[#ac2e00] uppercase tracking-wider">
                  {lang === 'EN' ? 'Social Handles & Web3 Sovereign Enclave' : 'सोशल हैंडल्स एवं वेब३ संप्रभु एन्क्लेव'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#191c1e]">
                      Twitter / X Handle
                    </label>
                    <input
                      type="text"
                      value={editForm.twitterHandle || ''}
                      onChange={(e) => setEditForm({ ...editForm, twitterHandle: e.target.value })}
                      placeholder="@handle"
                      className="text-[12px] px-3 py-1.5 bg-white border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#191c1e]">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="text"
                      value={editForm.linkedinHandle || ''}
                      onChange={(e) => setEditForm({ ...editForm, linkedinHandle: e.target.value })}
                      placeholder="linkedin.com/in/username"
                      className="text-[12px] px-3 py-1.5 bg-white border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#191c1e]">
                      GitHub Username
                    </label>
                    <input
                      type="text"
                      value={editForm.githubHandle || ''}
                      onChange={(e) => setEditForm({ ...editForm, githubHandle: e.target.value })}
                      placeholder="github-username"
                      className="text-[12px] px-3 py-1.5 bg-white border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#191c1e]">
                      Telegram / Signal
                    </label>
                    <input
                      type="text"
                      value={editForm.telegramHandle || ''}
                      onChange={(e) => setEditForm({ ...editForm, telegramHandle: e.target.value })}
                      placeholder="@username"
                      className="text-[12px] px-3 py-1.5 bg-white border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                    />
                  </div>

                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-[11px] font-medium text-[#191c1e]">
                      Web3 ENS Domain / Sovereign DID
                    </label>
                    <input
                      type="text"
                      value={editForm.web3Ens || ''}
                      onChange={(e) => setEditForm({ ...editForm, web3Ens: e.target.value })}
                      placeholder="username.pakt.eth"
                      className="text-[12px] font-mono px-3 py-1.5 bg-white border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                    />
                  </div>
                </div>
              </div>

              {/* Statutory ID Updates (Aadhaar / PAN / DIN) */}
              <div className="p-3 bg-[#fafbfc] rounded-xl border border-[#e4beb4]/30 flex flex-col gap-3">
                <span className="text-[11px] font-bold text-[#ac2e00] uppercase tracking-wider">
                  {lang === 'EN' ? 'Statutory KYC Identifiers' : 'सांविधिक केवाईसी पहचानकर्ता'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#191c1e]">
                      Aadhaar Masked
                    </label>
                    <input
                      type="text"
                      value={editForm.aadhaarMasked}
                      onChange={(e) => setEditForm({ ...editForm, aadhaarMasked: e.target.value })}
                      className="text-[12px] font-mono px-3 py-1.5 bg-white border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#191c1e]">
                      PAN Masked
                    </label>
                    <input
                      type="text"
                      value={editForm.panMasked}
                      onChange={(e) => setEditForm({ ...editForm, panMasked: e.target.value })}
                      className="text-[12px] font-mono px-3 py-1.5 bg-white border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#191c1e]">
                      MCA DIN / Bar ID
                    </label>
                    <input
                      type="text"
                      value={editForm.dinNumber || ''}
                      onChange={(e) => setEditForm({ ...editForm, dinNumber: e.target.value })}
                      placeholder="DIN-XXXXXXXX"
                      className="text-[12px] font-mono px-3 py-1.5 bg-white border border-[#e4beb4]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ac2e00]"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-[11px] text-[#5b4139] hover:text-[#191c1e] underline"
                >
                  {lang === 'EN' ? 'Reset to Default' : 'डिफ़ॉल्ट पर रीसेट करें'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] text-[12px] font-bold rounded-lg transition-colors"
                  >
                    {lang === 'EN' ? 'Cancel' : 'रद्द करें'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#191c1e] hover:bg-[#ac2e00] text-white text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[15px]">save</span>
                    <span>{lang === 'EN' ? 'Save Changes' : 'बदलाव सहेजें'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* GROUP 2: LEGAL DRAFTING & LANGUAGE ENGINE */}
      {/* ========================================================================= */}
      {(activeTabGroup === 'all' || activeTabGroup === 'drafting') && (
        <section className="mb-6">
          <div className="flex items-center gap-1.5 mb-2.5 px-1">
            <span className="material-symbols-outlined text-[#ac2e00] text-[18px]">gavel</span>
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#191c1e]">
              {lang === 'EN' ? '2. Legal Drafting & Language Engine' : '२. विधिक प्रारूपण एवं भाषा इंजन'}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e4beb4]/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ac2e00] text-[20px]">translate</span>
                <span className="text-[13px] font-bold text-[#191c1e]">
                  {lang === 'EN' ? 'Independent Contract Drafting Language' : 'स्वतंत्र अनुबंध प्रारूपण भाषा'}
                </span>
              </div>
              <span className="font-mono text-[9px] bg-[#ffdbd1] text-[#3b0a00] px-2 py-0.5 rounded font-bold">
                {lang === 'EN' ? 'Independent' : 'स्वतंत्र'}
              </span>
            </div>

            <p className="text-[11px] text-[#5b4139] leading-relaxed">
              {lang === 'EN'
                ? 'Set your preferred language for legal contracts, smart clauses, and AI generation (English, Hindi, or Hinglish). Changing this will NOT change your screen interface language.'
                : 'विधिक अनुबंधों, स्मार्ट धाराओं एवं एआई ड्राफ्टिंग के लिए अपनी पसंदीदा भाषा (अंग्रेज़ी, हिन्दी, या हिंग्लिश) चुनें। इसे बदलने पर आपकी स्क्रीन इंटरफ़ेस भाषा नहीं बदलेगी।'}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {/* English Option */}
              <button
                type="button"
                onClick={() => onSelectContractLanguage && onSelectContractLanguage('en')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  contractLanguage === 'en'
                    ? 'bg-[#ffdbd1]/30 border-[#ac2e00] text-[#ac2e00] font-bold ring-1 ring-[#ac2e00]'
                    : 'bg-[#f2f4f6] border-[#e4beb4]/30 text-[#5b4139] hover:bg-[#e0e3e5]'
                }`}
              >
                <span className="text-[16px]">🇬🇧</span>
                <span className="text-[12px] font-bold">English</span>
                <span className="font-mono text-[9px] text-[#5b4139]">Standard Legal</span>
              </button>

              {/* Hindi Option */}
              <button
                type="button"
                onClick={() => onSelectContractLanguage && onSelectContractLanguage('hi')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  contractLanguage === 'hi'
                    ? 'bg-[#ffdbd1]/30 border-[#ac2e00] text-[#ac2e00] font-bold ring-1 ring-[#ac2e00]'
                    : 'bg-[#f2f4f6] border-[#e4beb4]/30 text-[#5b4139] hover:bg-[#e0e3e5]'
                }`}
              >
                <span className="text-[16px]">🇮🇳</span>
                <span className="text-[12px] font-bold">हिन्दी</span>
                <span className="font-mono text-[9px] text-[#5b4139]">शुद्ध विधिक</span>
              </button>

              {/* Hinglish Option */}
              <button
                type="button"
                onClick={() => onSelectContractLanguage && onSelectContractLanguage('hinglish')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  contractLanguage === 'hinglish'
                    ? 'bg-[#ffdbd1]/30 border-[#ac2e00] text-[#ac2e00] font-bold ring-1 ring-[#ac2e00]'
                    : 'bg-[#f2f4f6] border-[#e4beb4]/30 text-[#5b4139] hover:bg-[#e0e3e5]'
                }`}
              >
                <span className="text-[16px]">✨</span>
                <span className="text-[12px] font-bold">Hinglish</span>
                <span className="font-mono text-[9px] text-[#5b4139]">Colloquial IN</span>
              </button>
            </div>

            {/* Jurisdiction Preset Information */}
            <div className="p-2.5 rounded-lg bg-[#f2f4f6] flex items-center justify-between text-[11px] mt-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#ac2e00]">balance</span>
                <span className="font-bold text-[#191c1e]">
                  {lang === 'EN' ? 'Statutory Governing Law:' : 'सांविधिक शासी विधि:'}
                </span>
              </div>
              <span className="font-medium text-[#5b4139]">
                Indian Contract Act 1872 & DPDP Act 2023
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* GROUP 3: SOVEREIGN WEB3 & BLOCKCHAIN NODE */}
      {/* ========================================================================= */}
      {(activeTabGroup === 'all' || activeTabGroup === 'web3') && (
        <section className="mb-6">
          <div className="flex items-center gap-1.5 mb-2.5 px-1">
            <span className="material-symbols-outlined text-[#ac2e00] text-[18px]">link</span>
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#191c1e]">
              {lang === 'EN' ? '3. Sovereign Web3 & Polygon Blockchain Node' : '३. संप्रभु वेब३ एवं पॉलीगॉन ब्लॉकचेन नोड'}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e4beb4]/30 flex flex-col gap-3">
            {/* Web3 / MetaMask Wallet Status Card */}
            <div className="p-3.5 rounded-xl bg-[#ffdbd1]/20 border border-[#ac2e00]/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#ac2e00]">account_balance_wallet</span>
                  <span className="text-[13px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'MetaMask / Polygon Web3 Signer' : 'मेटामास्क / पॉलीगॉन वेब३ हस्ताक्षरकर्ता'}
                  </span>
                </div>
                <span className="font-mono text-[9px] bg-[#ac2e00] text-white px-2 py-0.5 rounded font-bold">
                  POLYGON POS
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#5b4139]">{lang === 'EN' ? 'Signer Address:' : 'हस्ताक्षरकर्ता पता:'}</span>
                <span className="text-[#191c1e] font-bold truncate max-w-[220px]">
                  {web3State.address ? `${web3State.address.slice(0, 10)}...${web3State.address.slice(-6)}` : 'Not Connected'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-[#ac2e00]/10">
                <span className="text-[11px] text-[#5b4139] truncate max-w-[180px]">
                  {web3State.statusMessage}
                </span>
                <button
                  type="button"
                  disabled={isConnecting}
                  onClick={handleConnectWallet}
                  className="px-2.5 py-1 bg-[#191c1e] hover:bg-[#ac2e00] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[13px]">{isConnecting ? 'sync' : 'link'}</span>
                  <span>{isConnecting ? (lang === 'EN' ? 'Connecting...' : 'जुड़ रहा है...') : (lang === 'EN' ? 'Reconnect MetaMask' : 'मेटामास्क पुनः जोड़ें')}</span>
                </button>
              </div>
            </div>

            {/* Toggle: Zero Gas Relayer */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f2f4f6]">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-[13px] font-bold text-[#191c1e]">
                  {lang === 'EN' ? 'Zero-Gas Protocol Relayer' : 'शून्य-गैस प्रोटोकॉल रिलेयर'}
                </span>
                <span className="text-[11px] text-[#5b4139]">
                  {lang === 'EN'
                    ? 'Sponsored gas execution for all Indian IT Act digital agreements on Polygon (ERC-4337).'
                    : 'पॉलीगॉन पर सभी भारतीय आईटी अधिनियम डिजिटल अनुबंधों हेतु प्रायोजित गैस निष्पादन।'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={zeroGasRelay}
                  onChange={(e) => setZeroGasRelay(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ac2e00]"></div>
              </label>
            </div>

            {/* Toggle: Passkeys & Biometric Attestation */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f2f4f6]">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-[13px] font-bold text-[#191c1e]">
                  {lang === 'EN' ? 'Hardware Key / Passkeys Attestation' : 'हार्डवेयर की / पासकी प्रमाणीकरण'}
                </span>
                <span className="text-[11px] text-[#5b4139]">
                  {lang === 'EN'
                    ? 'FIDO2 / WebAuthn biometric signature generation inside secure enclave.'
                    : 'सुरक्षित एन्क्लेव के भीतर FIDO2 / WebAuthn बायोमेट्रिक हस्ताक्षर निर्माण।'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={passkeyActive}
                  onChange={(e) => setPasskeyActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ac2e00]"></div>
              </label>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* GROUP 4: NATIONAL DIGITAL PUBLIC INFRASTRUCTURE */}
      {/* ========================================================================= */}
      {(activeTabGroup === 'all' || activeTabGroup === 'web3') && (
        <section className="mb-6">
          <div className="flex items-center gap-1.5 mb-2.5 px-1">
            <span className="material-symbols-outlined text-[#ac2e00] text-[18px]">account_balance</span>
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#191c1e]">
              {lang === 'EN' ? '4. National Digital Public Infrastructure' : '४. राष्ट्रीय डिजिटल सार्वजनिक अवसंरचना'}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e4beb4]/30 flex flex-col gap-3">
            {/* DigiLocker Direct Certificate Archive */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f2f4f6]">
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'DigiLocker Direct Certificate Archive' : 'डिजिलॉकर प्रत्यक्ष प्रमाणपत्र पुरालेख'}
                  </span>
                  <span className="font-mono text-[9px] bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-bold">
                    IT ACT § 6A
                  </span>
                </div>
                <span className="text-[11px] text-[#5b4139] mt-0.5">
                  {lang === 'EN'
                    ? 'Auto-deposit executed contracts into national citizen locker under IT Act § 6A.'
                    : 'आईटी अधिनियम धारा ६क के तहत निष्पादित अनुबंध स्वतः राष्ट्रीय नागरिक लॉकर में जमा।'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={digilockerSync}
                  onChange={(e) => setDigilockerSync(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ac2e00]"></div>
              </label>
            </div>

            {/* GRAS & NeSL Gateway Status */}
            <div className="p-3 rounded-lg bg-[#f2f4f6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-amber-600">receipt_long</span>
                <div>
                  <div className="text-[12px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'Maharashtra GRAS & NeSL e-Stamping' : 'महाराष्ट्र ग्रास एवं एनईएसएल ई-स्टाम्पिंग'}
                  </div>
                  <div className="text-[10px] text-[#5b4139]">
                    Bombay Stamp Act 1958 Art. 5(h) • Challan Verified
                  </div>
                </div>
              </div>
              <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                ACTIVE
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* GROUP 5: MILESTONE COMMUNICATIONS & ALERT ROUTING */}
      {/* ========================================================================= */}
      {(activeTabGroup === 'all' || activeTabGroup === 'compliance') && (
        <section className="mb-6">
          <div className="flex items-center gap-1.5 mb-2.5 px-1">
            <span className="material-symbols-outlined text-[#ac2e00] text-[18px]">notifications_active</span>
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#191c1e]">
              {lang === 'EN' ? '5. Milestone Communications & Alert Routing' : '५. अनुबंध चरण संचार एवं अलर्ट रूटिंग'}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e4beb4]/30 flex flex-col gap-3">
            {/* WhatsApp & SMS Alerts */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f2f4f6]">
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'WhatsApp & SMS Execution Alerts' : 'व्हाट्सएप एवं एसएमएस निष्पादन अलर्ट'}
                  </span>
                  <span className="font-mono text-[10px] text-[#ac2e00] font-bold bg-[#ffdbd1] px-1.5 py-0.2 rounded">
                    {userProfile.phone}
                  </span>
                </div>
                <span className="text-[11px] text-[#5b4139] mt-0.5">
                  {lang === 'EN'
                    ? 'Receive instant WhatsApp push alerts when counterparties sign contract milestones.'
                    : 'प्रतिपक्ष द्वारा अनुबंध चरण निष्पादित होने पर तत्काल व्हाट्सएप पुश अलर्ट प्राप्त करें।'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={whatsappSmsAlerts}
                  onChange={(e) => setWhatsappSmsAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ac2e00]"></div>
              </label>
            </div>

            {/* Email Certificate Dispatch */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f2f4f6]">
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'Section 65B IT Act Evidence Dispatch' : 'धारा ६५ख आईटी अधिनियम साक्ष्य प्रेषण'}
                  </span>
                  <span className="font-mono text-[10px] text-[#575e70] bg-white px-1.5 py-0.2 rounded border border-gray-200">
                    {userProfile.email}
                  </span>
                </div>
                <span className="text-[11px] text-[#5b4139] mt-0.5">
                  {lang === 'EN'
                    ? 'Automatically dispatch verified Section 65B electronic certificate PDF to your inbox upon execution.'
                    : 'निष्पादन पर अपने इनबॉक्स में स्वचालित रूप से ६५ख इलेक्ट्रॉनिक प्रमाणपत्र पीडीएफ प्राप्त करें।'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={emailCertificates}
                  onChange={(e) => setEmailCertificates(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ac2e00]"></div>
              </label>
            </div>

            {/* In-App Sovereign Node Notifications */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f2f4f6]">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-[13px] font-bold text-[#191c1e]">
                  {lang === 'EN' ? 'Sovereign Node Event Stream' : 'संप्रभु नोड इवेंट स्ट्रीम'}
                </span>
                <span className="text-[11px] text-[#5b4139]">
                  {lang === 'EN'
                    ? 'Bell icon inbox badges for on-chain block confirmations and AI legal risk flags.'
                    : 'ऑन-चेन ब्लॉक पुष्टिकरण और एआई विधिक जोखिम झंडों के लिए घंटी इनबॉक्स बैज।'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={(e) => setPushNotifs(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ac2e00]"></div>
              </label>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* GROUP 6: DPDP ACT 2023 COMPLIANCE & DATA SOVEREIGNTY */}
      {/* ========================================================================= */}
      {(activeTabGroup === 'all' || activeTabGroup === 'compliance') && (
        <section className="mb-6">
          <div className="flex items-center gap-1.5 mb-2.5 px-1">
            <span className="material-symbols-outlined text-[#ac2e00] text-[18px]">shield_person</span>
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#191c1e]">
              {lang === 'EN' ? '6. DPDP Act 2023 Compliance & Data Sovereignty' : '६. डीपीडीपी अधिनियम २०२३ अनुपालन एवं डेटा संप्रभुता'}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e4beb4]/30 flex flex-col gap-3">
            <p className="text-[11px] text-[#5b4139] leading-relaxed">
              {lang === 'EN'
                ? 'As a Data Principal under India Digital Personal Data Protection Act 2023, you retain sovereign rights to withdraw consent, erase local session logs, or export your cryptographic history at any time.'
                : 'भारतीय डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम २०२३ के तहत डेटा स्वामी के रूप में आपके पास सहमति वापस लेने, सत्र लॉग मिटाने या किसी भी समय क्रिप्टोग्राफ़िक इतिहास निर्यात करने का संप्रभु अधिकार है।'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  triggerBanner(
                    lang === 'EN'
                      ? 'Consent Audit Log exported: PAKT-DPDP-CONSENT-2026.json'
                      : 'सहमति ऑडिट लॉग निर्यातित: PAKT-DPDP-CONSENT-2026.json'
                  )
                }
                className="py-2.5 px-3 bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] font-bold text-[12px] rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-gray-200"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>{lang === 'EN' ? 'Export Consent Audit Log (.JSON)' : 'सहमति ऑडिट लॉग डाउनलोड करें'}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  triggerBanner(
                    lang === 'EN'
                      ? 'Local ephemeral cache cleared • Sovereign state maintained'
                      : 'स्थानीय कैश साफ़ किया गया • संप्रभु स्थिति सुरक्षित'
                  )
                }
                className="py-2.5 px-3 bg-gray-50 hover:bg-gray-100 text-[#5b4139] hover:text-[#191c1e] font-bold text-[12px] rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-gray-200"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                <span>{lang === 'EN' ? 'Clear Local Cache' : 'लोकल कैश साफ़ करें'}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* GROUP 7: SESSION & SECURITY ACTIONS */}
      {/* ========================================================================= */}
      <section className="mb-4">
        <div className="flex items-center gap-1.5 mb-2.5 px-1">
          <span className="material-symbols-outlined text-[#ac2e00] text-[18px]">lock_reset</span>
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#191c1e]">
            {lang === 'EN' ? '7. Session & Security' : '७. सत्र एवं सुरक्षा'}
          </h2>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e4beb4]/30 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] font-mono p-2 bg-[#f2f4f6] rounded-lg">
            <span className="text-[#5b4139]">
              {lang === 'EN' ? 'Active Enclave Session:' : 'सक्रिय एन्क्लेव सत्र:'}
            </span>
            <span className="text-[#191c1e] font-bold">
              IN-MUM-1 • TLS 1.3 • EIP-4361
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="w-full py-3 bg-red-50 hover:bg-red-100 text-[#ba1a1a] rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 border border-red-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>{lang === 'EN' ? 'Sign Out of Sovereign Node' : 'संप्रभु नोड से लॉग आउट करें'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
