import React, { useState } from 'react';
import { ScreenType, Language, AuditVerificationData } from '../../types';
import { SAMPLE_VERIFICATION_RESULT } from '../../data/mockData';
import { useLoading } from '../../context/LoadingContext';

interface VerifyScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
}

export const VerifyScreen: React.FC<VerifyScreenProps> = ({ onNavigate, lang }) => {
  const { showLoading } = useLoading();
  const [activeTab, setActiveTab] = useState<'hash' | 'contract' | 'qr'>('hash');
  const [hashInput, setHashInput] = useState(
    '0x7f8a9291bb4021e41c469b83b320147668616c133279524365b6d21fafb2b0c1b1'
  );
  const [isQuerying, setIsQuerying] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditVerificationData | null>(
    SAMPLE_VERIFICATION_RESULT
  );
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [fileAttachedName, setFileAttachedName] = useState<string | null>(null);

  const handleQuery = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!hashInput.trim()) return;

    setIsQuerying(true);
    setAuditResult(null);

    showLoading({
      titleEn: 'Verifying Cryptographic Evidence On-Chain',
      titleHi: 'ऑन-चेन क्रिप्टोग्राफ़िक साक्ष्य का सत्यापन',
      subtitleEn: 'Recomputing canonical SHA-256 digest, verifying Merkle proof, and validating against Polygon PoS block state.',
      subtitleHi: 'कैनोनिकल SHA-256 डाइजेस्ट की पुनर्गणना, मर्कल प्रूफ एवं पॉलीगॉन पीओएस ब्लॉक स्थिति सत्यापन।',
      duration: 1500,
      customSteps: [
        'Connecting to Polygon PoS node RPC (Chain ID: 137)...',
        'Validating canonical SHA-256 cryptographic digest...',
        'Checking Indian IT Act 2000 Section 65B electronic admissibility...',
        'Matching block timestamp & EIP-712 signer address...',
        'Verification confirmed: Immutable & Tamper-proof!',
      ],
      customStepsHi: [
        'पॉलीगॉन पीओएस नोड आरपीसी (चेन आईडी: १३७) से जुड़ाव...',
        'कैनोनिकल SHA-256 क्रिप्टोग्राफ़िक डाइजेस्ट का सत्यापन...',
        'भारतीय आईटी अधिनियम २००० धारा ६५ख साक्ष्य ग्राह्यता जांच...',
        'ब्लॉक टाइमस्टैम्प एवं EIP-712 हस्ताक्षरकर्ता पते का मिलान...',
        'सत्यापन प्रमाणित: अपरिवर्तनीय एवं छेड़छाड़-रहित!',
      ],
      onComplete: () => {
        setIsQuerying(false);
        setAuditResult(SAMPLE_VERIFICATION_RESULT);
      },
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setHashInput(text);
      }
    } catch {
      setHashInput('0x7f8a9291bb4021e41c469b83b320147668616c133279524365b6d21fafb2b0c1b1');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileAttachedName(file.name);
      setHashInput(
        '0x' +
          Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
      );
    }
  };

  const copyToClipboard = (text: string, isTx = false) => {
    navigator.clipboard?.writeText(text);
    if (isTx) {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } else {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* Title & Sovereign Network Anchor */}
      <div className="flex items-center justify-between mt-2 mb-3">
        <div>
          <h1 className="text-[18px] font-bold text-[#191c1e] tracking-tight">
            {lang === 'EN'
              ? 'On-Chain Audit & Verification Terminal'
              : 'ऑन-चेन ऑडिट एवं सत्यापन टर्मिनल'}
          </h1>
          <p className="text-[12px] text-[#5b4139]">
            {lang === 'EN'
              ? 'Polygon PoS Mainnet • Immutable Ledger Verification'
              : 'पॉलीगॉन मेननेट • अपरिवर्तनीय लेजर सत्यापन'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#ffdbd1] text-[#3b0a00] rounded-full font-mono text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ac2e00] animate-ping"></span>
          <span>Polygon PoS</span>
        </div>
      </div>

      {/* Verification Mode Selector: 3 Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-[#eceef0] p-1 rounded-xl mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('hash')}
          className={`py-2 px-1 text-center transition-all text-[11px] rounded-lg truncate flex items-center justify-center gap-1 ${
            activeTab === 'hash'
              ? 'bg-white text-[#191c1e] font-bold shadow-xs'
              : 'text-[#5b4139] font-semibold hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">tag</span>
          <span>{lang === 'EN' ? '1. File Hash SHA-256' : '१. फ़ाइल हैश SHA-256'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('contract')}
          className={`py-2 px-1 text-center transition-all text-[11px] rounded-lg truncate flex items-center justify-center gap-1 ${
            activeTab === 'contract'
              ? 'bg-white text-[#191c1e] font-bold shadow-xs'
              : 'text-[#5b4139] font-semibold hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">contract</span>
          <span>{lang === 'EN' ? '2. PAKT Code' : '२. पाक्ट कोड'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('qr')}
          className={`py-2 px-1 text-center transition-all text-[11px] rounded-lg truncate flex items-center justify-center gap-1 ${
            activeTab === 'qr'
              ? 'bg-white text-[#191c1e] font-bold shadow-xs'
              : 'text-[#5b4139] font-semibold hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">qr_code_scanner</span>
          <span>{lang === 'EN' ? '3. Scan QR' : '३. क्यूआर स्कैन'}</span>
        </button>
      </div>

      {/* Input Form Panel */}
      <div className="bg-white rounded-xl p-4 shadow-xs mb-4 border border-[#e4beb4]/30">
        <form onSubmit={handleQuery} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] uppercase tracking-wider font-bold text-[#5b4139]">
              {activeTab === 'hash'
                ? (lang === 'EN' ? 'Cryptographic Digest (Hexadecimal 64-char)' : 'क्रिप्टोग्राफ़िक डाइजेस्ट (६४-वर्ण हेक्साडेसिमल)')
                : activeTab === 'contract'
                ? (lang === 'EN' ? 'PAKT Contract Code or Token ID' : 'पाक्ट अनुबंध कोड या टोकन आईडी')
                : (lang === 'EN' ? 'Certificate QR Anchor' : 'प्रमाणपत्र क्यूआर एंकर')}
            </label>
            <button
              type="button"
              onClick={handlePaste}
              className="text-[#ac2e00] font-mono text-[11px] font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">content_paste</span>
              <span>{lang === 'EN' ? 'Paste Sample' : 'नमूना पेस्ट करें'}</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="0x7f8a9291bb4021e41c469b83b320147668616c133279524365b6d21fafb2b0c1b1"
              className="w-full bg-[#f2f4f6] text-[#191c1e] font-mono text-[12px] p-3 rounded-lg border border-[#e4beb4]/40 focus:outline-none focus:border-[#ac2e00] transition-colors"
            />
          </div>

          {/* Drag & Drop File Verification Option */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-[#ac2e00] font-bold text-[12px] hover:underline">
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>
                {fileAttachedName || (lang === 'EN' ? 'Or attach original signed PDF / file' : 'या मूल हस्ताक्षरित पीडीएफ / फ़ाइल जोड़ें')}
              </span>
              <input
                type="file"
                accept=".pdf,.json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <span className="text-[10px] font-mono text-[#5b4139]">
              {lang === 'EN' ? 'Instant Client-side Hashing' : 'त्वरित क्लाइंट-साइड हैशिंग'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isQuerying}
            className="w-full py-3 bg-[#ac2e00] hover:bg-[#d53e07] text-white font-bold text-[13px] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-1"
          >
            {isQuerying ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                <span>{lang === 'EN' ? 'Querying Polygon PoS Node (Mumbai)...' : 'पॉलीगॉन नोड से पूछताछ जारी...'}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{lang === 'EN' ? 'Verify On-Chain Integrity' : 'ऑन-चेन सत्यता सत्यापित करें'}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Verification Ledger Proof Result Card */}
      {auditResult && (
        <div className="bg-white rounded-xl p-4 shadow-xs mb-4 border border-[#e4beb4]/30 flex flex-col gap-3.5 animate-in fade-in slide-in-from-bottom-2">
          {/* Status Header */}
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#e4beb4]/20">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">task_alt</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? '100% Cryptographically Verified' : '१००% क्रिप्टोग्राफ़िक रूप से सत्यापित'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold">
                    VALID
                  </span>
                </div>
                <p className="text-[11px] text-[#5b4139] mt-0.5">
                  {lang === 'EN'
                    ? 'Document hash matches on-chain state root exactly. Zero tampering detected.'
                    : 'दस्तावेज़ हैश ऑन-चेन स्टेट रूट से पूर्णतः मेल खाता है। कोई छेड़छाड़ नहीं मिली।'}
                </p>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="flex flex-col gap-2 font-mono text-[11px]">
            {/* Hash */}
            <div className="flex items-center justify-between p-2 rounded bg-[#f2f4f6]">
              <span className="text-[#5b4139]">{lang === 'EN' ? 'Canonical SHA-256:' : 'प्रमाणित SHA-256:'}</span>
              <div className="flex items-center gap-1 text-[#191c1e] font-bold">
                <span className="truncate max-w-[180px]">{auditResult.canonicalHash || auditResult.txHash}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(auditResult.canonicalHash || auditResult.txHash, false)}
                  className="hover:text-[#ac2e00]"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedHash ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Block & Tx */}
            <div className="flex items-center justify-between p-2 rounded bg-[#f2f4f6]">
              <span className="text-[#5b4139]">{lang === 'EN' ? 'Block Number:' : 'ब्लॉक संख्या:'}</span>
              <span className="text-[#191c1e] font-bold">#64,128,912 (Polygon PoS)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#f2f4f6]">
              <span className="text-[#5b4139]">{lang === 'EN' ? 'Anchor Tx Hash:' : 'एंकर लेन-देन हैश:'}</span>
              <div className="flex items-center gap-1 text-[#ac2e00] font-bold">
                <span className="truncate max-w-[180px]">{auditResult.txHash}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(auditResult.txHash, true)}
                  className="hover:text-[#191c1e]"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedTx ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Timestamp */}
            <div className="flex items-center justify-between p-2 rounded bg-[#f2f4f6]">
              <span className="text-[#5b4139]">{lang === 'EN' ? 'Timestamp (IST):' : 'समय (भारतीय मानक समय):'}</span>
              <span className="text-[#191c1e] font-bold">2026-09-22 18:20:11 IST</span>
            </div>

            {/* Signers count */}
            <div className="flex items-center justify-between p-2 rounded bg-[#f2f4f6]">
              <span className="text-[#5b4139]">{lang === 'EN' ? 'Valid DSC Signers:' : 'वैध डीएससी हस्ताक्षरकर्ता:'}</span>
              <span className="text-emerald-700 font-bold">
                {lang === 'EN' ? '3 of 3 Multi-Sig Attested' : '३ में से ३ बहु-हस्ताक्षर प्रमाणित'}
              </span>
            </div>
          </div>

          {/* Statutory Section 65B IT Act Certificate Banner */}
          <div className="bg-[#ffdbd1]/30 p-3 rounded-lg border border-[#ffdbd1] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#ac2e00] text-[20px] shrink-0">gavel</span>
              <div className="min-w-0">
                <span className="text-[12px] font-bold text-[#191c1e] block truncate">
                  {lang === 'EN'
                    ? 'Section 65B Indian Evidence Act Certificate Ready'
                    : 'धारा ६५ख भारतीय साक्ष्य अधिनियम प्रमाणपत्र तैयार'}
                </span>
                <span className="text-[11px] text-[#5b4139] truncate block">
                  {lang === 'EN'
                    ? 'Admissible electronic evidence for high courts and arbitration'
                    : 'उच्च न्यायालयों एवं मध्यस्थता हेतु ग्राह्य इलेक्ट्रॉनिक साक्ष्य'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                alert(
                  lang === 'EN'
                    ? 'Generated Section 65B Electronic Evidence Certificate: CERT-IN-2026-9812.pdf'
                    : 'धारा ६५ख इलेक्ट्रॉनिक साक्ष्य प्रमाणपत्र तैयार: CERT-IN-2026-9812.pdf'
                )
              }
              className="shrink-0 px-2.5 py-1.5 bg-[#191c1e] text-white rounded-lg font-bold text-[11px] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
              <span>PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
