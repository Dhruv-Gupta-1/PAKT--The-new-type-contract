import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  PenTool, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  User, 
  Building2, 
  FileText, 
  Wallet,
  ArrowRight,
  Info
} from 'lucide-react';
import { UserProfile, Language } from '../../types';
import { 
  syncUserProfileToSupabase, 
  fetchUserProfileFromSupabase 
} from '../../services/supabaseService';
import { 
  SUPABASE_SQL_SCHEMA, 
  checkSupabaseHealth, 
  SUPABASE_URL 
} from '../../utils/supabaseClient';
import { 
  connectMetaMaskSepolia, 
  switchToSepoliaNetwork, 
  SEPOLIA_EXPLORER, 
  isMetaMaskInjected 
} from '../../utils/ethereumSepolia';

interface UserDetailsScreenProps {
  lang: Language;
  onNavigate: (screen: any) => void;
  currentUserProfile?: UserProfile;
  onProfileUpdated?: (updated: UserProfile) => void;
}

export const UserDetailsScreen: React.FC<UserDetailsScreenProps> = ({
  lang,
  onNavigate,
  currentUserProfile,
  onProfileUpdated,
}) => {
  const [formData, setFormData] = useState({
    name: currentUserProfile?.name || 'Alexander Vance',
    email: currentUserProfile?.email || 'alexander.vance@apexglobal.io',
    phone: currentUserProfile?.phone || '+1 415 555 0192',
    entityType: currentUserProfile?.entityType || 'Enterprise Entity (Corp/LLC)',
    organization: currentUserProfile?.organization || 'Apex Global Ventures Ltd.',
    idType: currentUserProfile?.idType || 'Tax ID',
    idNumber: currentUserProfile?.idNumber || 'US-982410-X',
    role: currentUserProfile?.role || 'Director / Authorized Signatory',
    location: currentUserProfile?.location || 'San Francisco, CA, USA',
    walletAddress: currentUserProfile?.walletAddress || '',
  });

  const [signatureData, setSignatureData] = useState<string>(currentUserProfile?.digitalSignatureData || '');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [metaMaskState, setMetaMaskState] = useState<{
    connected: boolean;
    address: string | null;
    isSepolia: boolean;
    balanceETH: string;
    loading: boolean;
  }>({
    connected: false,
    address: null,
    isSepolia: false,
    balanceETH: '0.00',
    loading: false,
  });

  const [syncStatus, setSyncStatus] = useState<{
    saving: boolean;
    success: boolean;
    error: string | null;
    lastSaved: string | null;
  }>({
    saving: false,
    success: false,
    error: null,
    lastSaved: null,
  });

  const [supabaseHealth, setSupabaseHealth] = useState<{
    checking: boolean;
    connected: boolean;
    hasTables: boolean;
    message: string;
  }>({
    checking: true,
    connected: false,
    hasTables: false,
    message: 'Testing Supabase connection...',
  });

  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Check Supabase Health on mount
  useEffect(() => {
    checkHealth();
    checkMetaMask();
  }, []);

  const checkHealth = async () => {
    setSupabaseHealth(prev => ({ ...prev, checking: true }));
    const health = await checkSupabaseHealth();
    setSupabaseHealth({
      checking: false,
      connected: health.connected,
      hasTables: health.hasTables,
      message: health.message,
    });
  };

  const checkMetaMask = async () => {
    if (isMetaMaskInjected()) {
      const state = await connectMetaMaskSepolia();
      setMetaMaskState({
        connected: state.isConnected,
        address: state.address,
        isSepolia: state.isSepolia,
        balanceETH: state.balanceETH,
        loading: false,
      });
      if (state.address && !formData.walletAddress) {
        setFormData(prev => ({ ...prev, walletAddress: state.address || '' }));
      }
    }
  };

  const handleConnectWallet = async () => {
    setMetaMaskState(prev => ({ ...prev, loading: true }));
    const state = await connectMetaMaskSepolia();
    setMetaMaskState({
      connected: state.isConnected,
      address: state.address,
      isSepolia: state.isSepolia,
      balanceETH: state.balanceETH,
      loading: false,
    });
    if (state.address) {
      setFormData(prev => ({ ...prev, walletAddress: state.address || '' }));
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#0284c7';
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
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
    setSignatureData('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setSignatureData(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToSupabase = async () => {
    setSyncStatus({ saving: true, success: false, error: null, lastSaved: null });

    const updatedProfile: UserProfile = {
      ...(currentUserProfile || {}),
      name: formData.name,
      nameHindi: formData.name,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization,
      organizationHindi: formData.organization,
      role: formData.role,
      roleHindi: formData.role,
      location: formData.location,
      locationHindi: formData.location,
      bio: `Authorized legal representative for ${formData.organization}. Verified on Ethereum Sepolia.`,
      bioHindi: '',
      twitterHandle: currentUserProfile?.twitterHandle || '@aaravsharma_pakt',
      linkedinHandle: currentUserProfile?.linkedinHandle || 'linkedin.com/in/aarav-sharma-legal',
      githubHandle: currentUserProfile?.githubHandle || 'aarav-pakt',
      telegramHandle: currentUserProfile?.telegramHandle || '@aarav_legal',
      web3Ens: metaMaskState.address ? `${metaMaskState.address.slice(0, 6)}...eth` : 'aarav.eth',
      didIdentifier: `did:pakt:global:${formData.idNumber || 'AUTH'}`,
      aadhaarMasked: formData.idType === 'National ID' ? formData.idNumber : 'XXXX-XXXX-4819',
      panMasked: formData.idType === 'Tax ID' ? formData.idNumber : 'ABCDE1234F',
      dinNumber: 'DIN-09823412',
      avatarUrl: currentUserProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      kycLevel: 'Tier 3 (Government ID & Sepolia On-Chain Bound)',
      jurisdiction: formData.location || 'Global Commercial Arbitration Jurisdiction',
      entityType: formData.entityType,
      idType: formData.idType,
      idNumber: formData.idNumber,
      digitalSignatureData: signatureData,
      walletAddress: formData.walletAddress || metaMaskState.address || '',
      sepoliaAddress: metaMaskState.address || formData.walletAddress || '',
      syncedWithSupabase: true,
      lastSyncedAt: new Date().toISOString(),
    };

    const result = await syncUserProfileToSupabase(updatedProfile);

    if (result.success) {
      setSyncStatus({
        saving: false,
        success: true,
        error: null,
        lastSaved: new Date().toLocaleTimeString(),
      });
      if (onProfileUpdated) {
        onProfileUpdated(updatedProfile);
      }
      checkHealth();
    } else {
      setSyncStatus({
        saving: false,
        success: false,
        error: result.error || 'Failed to save to Supabase. Check database schema.',
        lastSaved: null,
      });
    }
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span className="cursor-pointer hover:underline" onClick={() => onNavigate('contracts')}>PAKT</span>
              <span>/</span>
              <span className="text-slate-400">Identity & Real Details</span>
              <span>/</span>
              <span className="text-emerald-400">Supabase Storage</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
              Verified Signatory Profile & Real Details
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage your real legal entity credentials, digital signature, and Ethereum Sepolia wallet for enforceable e-signing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('contracts')}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm text-slate-300 font-medium transition"
            >
              Back to Contracts
            </button>
            <button
              onClick={handleSaveToSupabase}
              disabled={syncStatus.saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
            >
              {syncStatus.saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Storing in Supabase...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  Save & Sync to Supabase
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Supabase & Sepolia Network Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Supabase Status Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-lg ${supabaseHealth.connected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-200">Supabase Database</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${supabaseHealth.connected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                    {supabaseHealth.connected ? (supabaseHealth.hasTables ? 'Connected & Ready' : 'Tables Pending SQL') : 'Connecting...'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono truncate max-w-xs">
                  {SUPABASE_URL}
                </p>
                <p className="text-xs text-slate-300 mt-0.5">{supabaseHealth.message}</p>
              </div>
            </div>

            <button
              onClick={() => setShowSqlModal(true)}
              className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-400 border border-cyan-500/30 transition flex items-center gap-1.5"
              title="View & copy SQL Schema for Supabase"
            >
              <FileText className="w-3.5 h-3.5" />
              SQL Schema
            </button>
          </div>

          {/* MetaMask Sepolia Status Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-lg ${metaMaskState.connected && metaMaskState.isSepolia ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-200">Ethereum Sepolia (11155111)</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${metaMaskState.connected && metaMaskState.isSepolia ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-slate-400'}`}>
                    {metaMaskState.connected ? (metaMaskState.isSepolia ? 'Sepolia Connected' : 'Wrong Network') : 'MetaMask Not Connected'}
                  </span>
                </div>
                {metaMaskState.address ? (
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    {metaMaskState.address.slice(0, 8)}...{metaMaskState.address.slice(-6)} • {metaMaskState.balanceETH} SepoliaETH
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">Connect your MetaMask browser wallet for real on-chain testing</p>
                )}
              </div>
            </div>

            <button
              onClick={handleConnectWallet}
              disabled={metaMaskState.loading}
              className="px-3 py-1.5 rounded-md bg-cyan-600/20 hover:bg-cyan-600/30 text-xs font-medium text-cyan-300 border border-cyan-500/40 transition flex items-center gap-1.5"
            >
              {metaMaskState.loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Wallet className="w-3.5 h-3.5" />
              )}
              {metaMaskState.connected ? 'Switch / Refresh' : 'Connect Wallet'}
            </button>
          </div>

        </div>

        {/* Sync Status Notifications */}
        {syncStatus.success && (
          <div className="bg-emerald-950/60 border border-emerald-600/50 rounded-lg p-3.5 flex items-center gap-3 text-emerald-300 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <div className="flex-1">
              <span className="font-semibold">Successfully synced to Supabase!</span> Details and signature were saved to the <code className="bg-emerald-900/50 px-1.5 py-0.5 rounded text-xs font-mono">user_profiles</code> table at {syncStatus.lastSaved}.
            </div>
          </div>
        )}

        {syncStatus.error && (
          <div className="bg-amber-950/60 border border-amber-600/50 rounded-lg p-3.5 flex items-center justify-between gap-3 text-amber-200 text-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
              <div>
                <span className="font-semibold">Notice:</span> {syncStatus.error}. 
                <span className="text-slate-300 block text-xs mt-0.5">
                  Have you run the database schema in Supabase yet? Click "SQL Schema" to copy and execute it in your Supabase SQL Editor.
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowSqlModal(true)}
              className="px-3 py-1 rounded bg-amber-600 text-white text-xs font-semibold hover:bg-amber-500 transition whitespace-nowrap"
            >
              Get SQL Script
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Real Details Input Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal & Corporate Identity */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <User className="w-5 h-5 text-cyan-400" />
                Signatory Identity & Entity Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Legal Name (as per ID) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    placeholder="e.g. Aarav Sharma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Corporate / Legal Entity Type
                  </label>
                  <select
                    value={formData.entityType}
                    onChange={e => setFormData({ ...formData, entityType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                  >
                    <option value="Private Limited (Pvt Ltd)">Private Limited Company (Pvt Ltd)</option>
                    <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                    <option value="Public Limited Company">Public Limited Company</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Individual / Consultant">Individual / Consultant</option>
                    <option value="Foreign Corporation / LLC">Foreign Corporation / LLC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Organization / Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={e => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    placeholder="e.g. Apex Global Ventures Pvt. Ltd."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Designation / Corporate Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    placeholder="e.g. Director / Authorized Signatory"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Mobile Phone (with country code)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    placeholder="+91 98201 54321"
                  />
                </div>
              </div>
            </div>

            {/* Statutory Identification (PAN / Aadhaar / GSTIN) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <FileText className="w-5 h-5 text-cyan-400" />
                Statutory Identification & Verification Numbers
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Primary Identification Document Type
                  </label>
                  <select
                    value={formData.idType}
                    onChange={e => setFormData({ ...formData, idType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                  >
                    <option value="Tax ID">Tax ID / EIN / VAT Number</option>
                    <option value="National ID">National Identity Card / Social ID</option>
                    <option value="Passport">Passport Document Number</option>
                    <option value="Commercial Register">Commercial Registry / Incorporation Number</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Identification Document / Certificate Number *
                  </label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500 transition uppercase"
                    placeholder="US-982410-X"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Registered Legal Jurisdiction / Place of Business
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    placeholder="San Francisco, CA, USA"
                  />
                </div>
              </div>
            </div>

            {/* Ethereum Sepolia Wallet Binding */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-cyan-400" />
                  Ethereum Sepolia Wallet Address
                </span>
                <span className="text-xs text-cyan-400 font-mono">Chain ID: 11155111</span>
              </h2>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.walletAddress}
                    onChange={e => setFormData({ ...formData, walletAddress: e.target.value })}
                    placeholder="0x..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition"
                  />
                  <button
                    onClick={handleConnectWallet}
                    className="px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs whitespace-nowrap transition flex items-center gap-1.5"
                  >
                    <Wallet className="w-4 h-4" />
                    Auto-Fill from MetaMask
                  </button>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  This wallet will be bound to your identity record in Supabase and used for EIP-712 smart contract signing on Sepolia.
                </p>
              </div>
            </div>

          </div>

          {/* Column 3: Digital Signature & On-Chain Tools */}
          <div className="space-y-6">
            
            {/* Digital Signature Pad */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-cyan-400" />
                  Digital Legal Signature
                </h3>
                {signatureData && (
                  <button
                    onClick={clearCanvas}
                    className="text-xs text-rose-400 hover:text-rose-300 transition"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="bg-slate-950 border border-slate-700 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full cursor-crosshair block bg-slate-950 touch-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Draw your signature above</span>
                <label className="cursor-pointer text-cyan-400 hover:underline flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {signatureData && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2 flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Signature captured & ready to save to Supabase</span>
                </div>
              )}
            </div>

            {/* Quick Actions & Sepolia Faucet Info */}
            <div className="bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/20 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                Sepolia Testnet Resources
              </h3>
              
              <p className="text-xs text-slate-300 leading-relaxed">
                To test real on-chain contract formation and e-signing on Ethereum Sepolia, you need free testnet SepoliaETH:
              </p>

              <div className="space-y-2 pt-1">
                <a
                  href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-cyan-300 font-medium flex items-center justify-between transition"
                >
                  <span>Google Cloud Web3 Sepolia Faucet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://sepolia.etherscan.io"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-cyan-300 font-medium flex items-center justify-between transition"
                >
                  <span>Sepolia Etherscan Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => onNavigate('esign')}
                  className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition shadow-md shadow-cyan-600/20"
                >
                  <span>Go to E-Sign Room</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* SQL Schema Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  Supabase Database Schema Script
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Copy and run this SQL script in your Supabase Dashboard: <strong>SQL Editor → New Query → Run</strong>
                </p>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-cyan-300 bg-slate-950">
              <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900">
              <span className="text-xs text-slate-400">
                Creates: <code className="text-cyan-400">user_profiles</code>, <code className="text-cyan-400">agreements</code>, <code className="text-cyan-400">signatures</code>, <code className="text-cyan-400">audit_logs</code>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={copySqlToClipboard}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-1.5 transition"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Entire SQL
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
