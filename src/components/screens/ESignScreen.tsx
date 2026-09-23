import React, { useState, useRef, useEffect } from 'react';
import { ScreenType, Language, ContractLanguage, ContractItem, ContractClause } from '../../types';
import { ASSETS } from '../../data/mockData';
import { getLocalizedContract, getLocalizedClause } from '../../data/translations';
import { signContractHashEIP712 } from '../../utils/web3Wallet';
import { useLoading } from '../../context/LoadingContext';
import { ClauseManagerModal } from '../modals/ClauseManagerModal';

interface ESignScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
  contractLanguage?: ContractLanguage;
  onSelectContractLanguage?: (cl: ContractLanguage) => void;
  contract?: ContractItem | null;
  onAddClause?: (contractId: string, clause: ContractClause) => void;
  onEditClause?: (contractId: string, clauseNumber: string, updatedClause: Partial<ContractClause>) => void;
  onDiscardClause?: (contractId: string, clauseNumber: string, reason?: string) => void;
  onRestoreClause?: (contractId: string, clauseNumber: string) => void;
  onDeleteClause?: (contractId: string, clauseNumber: string) => void;
}

export const ESignScreen: React.FC<ESignScreenProps> = ({
  onNavigate,
  lang,
  contractLanguage = 'en',
  onSelectContractLanguage,
  contract,
  onAddClause,
  onEditClause,
  onDiscardClause,
  onRestoreClause,
  onDeleteClause,
}) => {
  const [activeTab, setActiveTab] = useState<'type' | 'draw' | 'aadhaar'>('type');
  const [dscSealEnabled, setDscSealEnabled] = useState(true);
  const [complianceChecked, setComplianceChecked] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [activeDocLang, setActiveDocLang] = useState<ContractLanguage>(contractLanguage);
  const [showClauseModal, setShowClauseModal] = useState(false);
  const [showDiscardInlineModal, setShowDiscardInlineModal] = useState<ContractClause | null>(null);
  const [inlineDiscardReason, setInlineDiscardReason] = useState('Mutually agreed waiver under Indian Contract Act 1872 Section 62');
  const [filterDiscarded, setFilterDiscarded] = useState(false);

  // Sync with prop when prop changes
  useEffect(() => {
    setActiveDocLang(contractLanguage);
  }, [contractLanguage]);

  const handleDocLangChange = (cl: ContractLanguage) => {
    setActiveDocLang(cl);
    if (onSelectContractLanguage) {
      onSelectContractLanguage(cl);
    }
  };

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = '#ac2e00';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Adjust canvas resolution on mount
  useEffect(() => {
    if (activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement?.clientWidth || 340;
      canvas.height = 120;
    }
  }, [activeTab]);

  const { showLoading } = useLoading();

  const handleExecution = async () => {
    if (!complianceChecked) {
      alert(
        lang === 'EN'
          ? 'Please accept the IT Act 2000 & DPDP compliance checkbox to continue.'
          : 'कृपया आगे बढ़ने से पहले आईटी अधिनियम २००० एवं डीपीडीपी विधिक सहमति दें।'
      );
      return;
    }

    setIsExecuting(true);

    showLoading({
      titleEn: 'Executing Sovereign Digital Seal & Attestation',
      titleHi: 'संप्रभु डिजिटल मुहर एवं विधिक प्रमाणीकरण जारी',
      subtitleEn: 'Anchoring cryptographic signature under Indian IT Act 2000 Section 10A to Polygon PoS blockchain.',
      subtitleHi: 'भारतीय आईटी अधिनियम २००० धारा १०क के तहत क्रिप्टोग्राफ़िक हस्ताक्षर पॉलीगॉन ब्लॉकचेन पर अंकित।',
      duration: 1800,
      customSteps: [
        'Generating FIDO2 / Class 3 DSC token signature...',
        'Constructing EIP-712 structured typed data hash...',
        'Anchoring transaction receipt to Polygon PoS...',
        'Depositing certificate copy to DigiLocker (§ 6A)...',
        'Contract legally sealed and executed!',
      ],
      customStepsHi: [
        'FIDO2 / क्लास ३ डीएससी टोकन हस्ताक्षर निर्माण...',
        'EIP-712 संरचित डेटा हैश का संयोजन...',
        'पॉलीगॉन पीओएस ब्लॉक पर लेनदेन रसीद का अंकन...',
        'डिजिलॉकर (धारा ६क) में प्रति का स्वतः निक्षेप...',
        'अनुबंध विधिक रूप से मुहरबंद एवं निष्पादित!',
      ],
      onComplete: async () => {
        try {
          if (dscSealEnabled) {
            await signContractHashEIP712(
              localizedContract?.title || 'Contract Execution',
              contract?.code || 'DOC-IN-84920-V2',
              contract?.sha256 || '0x7f8a9291bb4021e41c469b83b320147668616c133279524365b6d21fafb2b0c1b1'
            );
          }
        } catch (err) {
          console.warn('[ESign Attestation] Handled Web3 signing gracefully:', err);
        }

        setIsExecuting(false);
        setIsSealed(true);
        setShowToast(true);
      },
    });
  };

  const localizedContract = contract ? getLocalizedContract(contract, activeDocLang) : null;

  return (
    <div className="flex flex-col w-full pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* Sub-badge statutory indicator */}
      <div className="flex items-center gap-1.5 py-1 mb-2">
        <span className="material-symbols-outlined text-[14px] text-[#954500]">shield</span>
        <span className="font-mono text-[10px] text-[#5b4139] font-medium">
          {lang === 'EN'
            ? 'IT Act 2000 & Aadhaar / DSC Validated (Mumbai Jurisdiction)'
            : 'आईटी अधिनियम २००० एवं आधार / डीएससी सत्यापित (मुंबई क्षेत्राधिकार)'}
        </span>
      </div>

      {/* Top Document Identity & Anchor Badge */}
      <div className="bg-white rounded-xl p-4 shadow-xs mb-3 border border-[#e4beb4]/30">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ac2e00]">
                {lang === 'EN' ? 'EXECUTION ROOM' : 'निष्पादन कक्ष'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ac2e00] animate-pulse"></span>
              <span className="font-mono text-[10px] text-[#5b4139]">{contract?.code || 'DOC-IN-84920-V2'}</span>
            </div>
            <h2 className="text-[16px] font-bold text-[#191c1e] tracking-tight leading-snug">
              {localizedContract?.title || (lang === 'EN' ? 'Master Cloud & SaaS Agreement' : 'क्लाउड एवं सास मास्टर अनुबंध')}
            </h2>
          </div>
          <span className="font-mono text-[10px] bg-[#ffdbc8] text-[#321200] px-2 py-1 rounded font-semibold whitespace-nowrap shrink-0">
            {lang === 'EN' ? 'Live Verification' : 'लाइव सत्यापन'}
          </span>
        </div>

        {/* Signing Progress Indicator */}
        <div className="mt-3 pt-1 border-t border-[#e4beb4]/20">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[12px] font-semibold text-[#191c1e]">
              {lang === 'EN'
                ? `Signatures: ${isSealed ? '3 of 3 Completed' : '2 of 3 Completed'}`
                : `हस्ताक्षर: ${isSealed ? '३ में से ३ पूर्ण' : '३ में से २ पूर्ण'}`}
            </span>
            <span className="font-mono text-[12px] font-bold text-[#ac2e00]">
              {isSealed ? '100%' : '66.6%'}
            </span>
          </div>
          <div className="w-full bg-[#eceef0] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#d53e07] h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: isSealed ? '100%' : '66.6%' }}
            ></div>
          </div>
        </div>

        {/* Signers Status Ledger */}
        <div className="mt-3 flex flex-col gap-2">
          {/* Signer 1: Rajesh Malhotra (Completed) */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f4f6]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#e0e3e5] flex items-center justify-center text-[#191c1e] text-[12px] font-bold shrink-0">
                RM
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[#191c1e] truncate">
                  {lang === 'EN' ? 'Rajesh Malhotra' : 'राजेश मल्होत्रा'}
                </p>
                <p className="font-mono text-[10px] text-[#5b4139] truncate">Tata Digital Ltd • C-Suite</p>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded shadow-xs">
                <span className="material-symbols-outlined text-[15px] text-[#954500] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="font-mono text-[10px] text-[#191c1e] font-semibold">Sep 16, 2026</span>
              </div>
              <span className="font-mono text-[9px] text-[#954500] mt-0.5">Class 3 DSC</span>
            </div>
          </div>

          {/* Signer 2: Priya Sharma (Active User) */}
          <div className={`flex items-center justify-between p-2.5 rounded-lg transition-all ${
            isSealed ? 'bg-emerald-50 border border-emerald-300' : 'bg-[#ffdbd1]/30 border border-[#ffdbd1]'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  alt="Priya Sharma"
                  className="w-7 h-7 rounded-full object-cover"
                  src={ASSETS.avatar}
                />
                <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-1 ring-white ${
                  isSealed ? 'bg-emerald-600' : 'bg-[#ac2e00]'
                }`}></span>
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#191c1e] truncate">
                  {lang === 'EN' ? 'Priya Sharma (You)' : 'प्रिया शर्मा (आप)'}
                </p>
                <p className="font-mono text-[10px] text-[#ac2e00] truncate font-medium">
                  {isSealed
                    ? (lang === 'EN' ? 'Executed & Sealed On-Chain' : 'ऑन-चेन निष्पादित एवं मुद्रित')
                    : (lang === 'EN' ? 'PAKT India Labs • Awaiting Signature' : 'पाक्ट लैब्स • हस्ताक्षर प्रतीक्षारत')}
                </p>
              </div>
            </div>
            {isSealed ? (
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold">
                {lang === 'EN' ? 'SEALED' : 'मुद्रित'}
              </span>
            ) : (
              <span className="text-[10px] px-2 py-1 rounded bg-[#ac2e00] text-white whitespace-nowrap shrink-0 font-bold">
                {lang === 'EN' ? 'ACTION DUE' : 'हस्ताक्षर देय'}
              </span>
            )}
          </div>

          {/* Signer 3: Vikramaditya Sen (In Queue) */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f4f6] opacity-85">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#e0e3e5] flex items-center justify-center text-[#5b4139] text-[12px] font-bold shrink-0">
                VS
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-[#191c1e] truncate">
                  {lang === 'EN' ? 'Vikramaditya Sen' : 'विक्रमादित्य सेन'}
                </p>
                <p className="font-mono text-[10px] text-[#5b4139] truncate">Legal Counsel (Nishith Desai & Co.)</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#5b4139] font-mono text-[10px] shrink-0">
              <span className="material-symbols-outlined text-[15px]">schedule</span>
              <span>{lang === 'EN' ? 'In Queue' : 'पंक्ति में'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Frame with CONTRACT LANGUAGE SELECTOR & CLAUSE MANAGEMENT */}
      <div className="bg-white rounded-xl p-4 shadow-xs mb-3 border border-[#e4beb4]/30">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e4beb4]/20 flex-wrap gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#ac2e00] text-[20px] shrink-0">description</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[14px] text-[#191c1e] font-bold">
                  {lang === 'EN' ? 'Stipulation Manifest' : 'अनुबंध शर्तें एवं घोषणापत्र'}
                </span>
                {contract?.clauses && (
                  <span className="px-2 py-0.5 rounded-full bg-[#f2f4f6] text-[#5b4139] font-mono text-[10px] font-bold">
                    {contract.clauses.filter((c) => !c.discarded).length} {lang === 'EN' ? 'Active' : 'सक्रिय'}
                    {contract.clauses.some((c) => c.discarded) && (
                      <span className="text-red-700 ml-1">
                        • {contract.clauses.filter((c) => c.discarded).length} {lang === 'EN' ? 'Waived' : 'निरस्त'}
                      </span>
                    )}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#5b4139]">
                {lang === 'EN'
                  ? 'Add, edit, or discard stipulations under Indian Contract Act 1872 & IT Act 2000'
                  : 'भारतीय अनुबंध अधिनियम १८७२ एवं आईटी अधिनियम के अंतर्गत धाराएं जोड़ें, संशोधित करें या निरस्त करें'}
              </p>
            </div>
          </div>

          {/* Right Toolbar: Manage Clauses Button + Language Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            {contract && (
              <button
                type="button"
                onClick={() => setShowClauseModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ac2e00] hover:bg-[#d53e07] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all"
                title={lang === 'EN' ? 'Open Clause Management Terminal' : 'अनुबंध धारा प्रबंधन टर्मिनल खोलें'}
              >
                <span className="material-symbols-outlined text-[15px]">gavel</span>
                <span>{lang === 'EN' ? 'Manage Clauses' : 'धारा प्रबंधन'}</span>
              </button>
            )}

            {/* Independent Contract Language Selector for this Document */}
            <div className="flex items-center gap-1 bg-[#eceef0] p-0.5 rounded-lg font-mono text-[10px]">
              <span className="text-[#5b4139] px-1 text-[10px] font-sans font-semibold hidden xs:inline">
                {lang === 'EN' ? 'Doc:' : 'भाषा:'}
              </span>
              <button
                type="button"
                onClick={() => handleDocLangChange('en')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  activeDocLang === 'en'
                    ? 'bg-[#191c1e] text-white shadow-xs'
                    : 'text-[#5b4139] hover:text-[#191c1e]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleDocLangChange('hi')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  activeDocLang === 'hi'
                    ? 'bg-[#191c1e] text-white shadow-xs'
                    : 'text-[#5b4139] hover:text-[#191c1e]'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => handleDocLangChange('hinglish')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  activeDocLang === 'hinglish'
                    ? 'bg-[#191c1e] text-white shadow-xs'
                    : 'text-[#5b4139] hover:text-[#191c1e]'
                }`}
              >
                Hinglish
              </button>
            </div>
          </div>
        </div>

        {/* Contract Scroll Window with Inline Clause Editing & Discard */}
        <div className="max-h-72 overflow-y-auto pr-1 flex flex-col gap-2.5 bg-[#f2f4f6] p-3 rounded-lg text-[#191c1e]">
          {contract?.clauses && contract.clauses.length > 0 ? (
            contract.clauses.map((cl: ContractClause, idx: number) => {
              const localizedCl = getLocalizedClause(cl, activeDocLang);
              const isDiscarded = !!cl.discarded;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-md shadow-xs border transition-all ${
                    isDiscarded
                      ? 'bg-red-50/70 border-red-200 opacity-80'
                      : cl.isCustom
                      ? 'bg-white border-[#ac2e00]/40'
                      : 'bg-white border-[#e4beb4]/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          isDiscarded
                            ? 'bg-red-200 text-red-900 line-through'
                            : 'bg-[#ffdbd1] text-[#3b0a00]'
                        }`}
                      >
                        {lang === 'EN' ? 'Clause' : 'धारा'} {cl.clauseNumber || `${idx + 1}.0`}
                      </span>
                      <span className="font-mono text-[10px] text-[#5b4139] bg-[#f2f4f6] px-1.5 py-0.5 rounded">
                        {localizedCl.statusText || (lang === 'EN' ? 'Validated' : 'प्रमाणित')}
                      </span>
                      {cl.isCustom && !isDiscarded && (
                        <span className="font-mono text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                          {lang === 'EN' ? 'EDITED' : 'संशोधित'}
                        </span>
                      )}
                      {isDiscarded && (
                        <span className="font-mono text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded font-bold">
                          {lang === 'EN' ? 'DISCARDED / WAIVED' : 'निरस्त / विधिक छूट'}
                        </span>
                      )}
                    </div>

                    {/* Inline Actions: Edit / Discard / Restore */}
                    <div className="flex items-center gap-1">
                      {!isDiscarded ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowClauseModal(true)}
                            className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-semibold text-[#191c1e] hover:bg-[#eceef0] transition-colors border border-[#e4beb4]/30"
                            title={lang === 'EN' ? 'Edit Clause' : 'धारा संशोधित करें'}
                          >
                            <span className="material-symbols-outlined text-[13px] text-amber-700">edit</span>
                            <span>{lang === 'EN' ? 'Edit' : 'संपादित'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowDiscardInlineModal(cl);
                              setInlineDiscardReason(
                                'Mutually agreed waiver under Indian Contract Act 1872 Section 62'
                              );
                            }}
                            className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-semibold text-red-700 hover:bg-red-50 transition-colors border border-red-200"
                            title={lang === 'EN' ? 'Discard Clause' : 'धारा निरस्त करें'}
                          >
                            <span className="material-symbols-outlined text-[13px]">cancel</span>
                            <span>{lang === 'EN' ? 'Discard' : 'निरस्त'}</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (onRestoreClause && contract) {
                              onRestoreClause(contract.id, cl.clauseNumber);
                            }
                          }}
                          className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors border border-emerald-300"
                          title={lang === 'EN' ? 'Restore Clause' : 'धारा पुनः बहाल करें'}
                        >
                          <span className="material-symbols-outlined text-[13px]">undo</span>
                          <span>{lang === 'EN' ? 'Restore' : 'बहाल करें'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-[12px] leading-snug ${
                      isDiscarded ? 'text-gray-500 line-through' : 'text-[#191c1e]'
                    }`}
                  >
                    <strong>{localizedCl.title}:</strong> {localizedCl.text}
                  </p>

                  {/* Discard Reason Stamped Notice */}
                  {isDiscarded && cl.discardReason && (
                    <div className="mt-2 p-1.5 bg-red-100/80 rounded border border-red-200 text-[11px] text-red-900 flex items-start gap-1">
                      <span className="material-symbols-outlined text-[13px] text-red-700 shrink-0 mt-0.5">
                        gavel
                      </span>
                      <span>
                        <strong>{lang === 'EN' ? 'Waiver Stamped:' : 'निरस्तीकरण मुहर:'}</strong> {cl.discardReason}
                      </span>
                    </div>
                  )}

                  {cl.updatedAt && !isDiscarded && (
                    <div className="mt-1 text-[9px] font-mono text-[#5b4139] flex justify-between">
                      <span>{lang === 'EN' ? 'Modified:' : 'संशोधित:'} {cl.updatedAt}</span>
                      <span>IT Act § 10A</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-[12px] text-[#5b4139]">
              {lang === 'EN' ? 'No clauses present in manifest.' : 'घोषणापत्र में कोई धारा उपलब्ध नहीं है।'}
            </div>
          )}

          {/* Dynamic Anchor Marker */}
          <div className="p-3 rounded-md bg-[#ffdbd1] text-[#3b0a00] border border-[#ffb5a0]">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-[18px] text-[#ac2e00]">draw</span>
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#ac2e00]">
                {lang === 'EN' ? 'Signature Target 02' : 'हस्ताक्षर लक्ष्य ०२'}
              </span>
            </div>
            <p className="text-[12px] font-medium text-[#191c1e]">
              {lang === 'EN'
                ? 'SIGNATURE REQUIRED: Priya Sharma, Chief Product Officer & Authorized Representative.'
                : 'हस्ताक्षर आवश्यक: प्रिया शर्मा, मुख्य उत्पाद अधिकारी एवं अधिकृत प्रतिनिधि।'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Signature Capture Suite */}
      <div className="bg-white rounded-xl p-4 shadow-xs mb-3 border border-[#e4beb4]/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-bold text-[#191c1e]">
            {lang === 'EN' ? 'Legal Signature Endorsement' : 'विधिक हस्ताक्षर समर्थन'}
          </span>
          <span className="font-mono text-[11px] text-[#ac2e00] bg-[#ffdbd1] px-2 py-0.5 rounded font-bold shrink-0">
            {lang === 'EN' ? 'Required' : 'अनिवार्य'}
          </span>
        </div>

        {/* Toggle Selector: 3 Tabs (Type | Draw | Aadhaar eSign) */}
        <div className="grid grid-cols-3 gap-1 bg-[#eceef0] p-1 rounded-lg mb-3">
          <button
            type="button"
            onClick={() => setActiveTab('type')}
            className={`py-2 px-1 text-center transition-all text-[11px] rounded truncate ${
              activeTab === 'type'
                ? 'bg-white text-[#191c1e] font-bold shadow-xs'
                : 'text-[#5b4139] font-semibold hover:text-[#191c1e]'
            }`}
          >
            {lang === 'EN' ? 'Type Legal Name' : 'नाम टाइप करें'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`py-2 px-1 text-center transition-all text-[11px] rounded truncate ${
              activeTab === 'draw'
                ? 'bg-white text-[#191c1e] font-bold shadow-xs'
                : 'text-[#5b4139] font-semibold hover:text-[#191c1e]'
            }`}
          >
            {lang === 'EN' ? 'Draw Signature' : 'हस्ताक्षर बनाएं'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('aadhaar')}
            className={`py-2 px-1 text-center transition-all text-[11px] rounded truncate ${
              activeTab === 'aadhaar'
                ? 'bg-white text-[#191c1e] font-bold shadow-xs'
                : 'text-[#5b4139] font-semibold hover:text-[#191c1e]'
            }`}
          >
            {lang === 'EN' ? 'Aadhaar eSign' : 'आधार ई-साइन'}
          </button>
        </div>

        {/* Type View Mode */}
        {activeTab === 'type' && (
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-wider text-[#5b4139] font-bold">
              {lang === 'EN' ? 'Authorized Full Name' : 'अधिकृत पूरा नाम'}
            </label>
            <div className="relative bg-[#f2f4f6] rounded-lg p-4 flex flex-col items-center justify-center border border-[#e4beb4]/30">
              <div
                className="text-center text-[26px] text-[#191c1e] italic tracking-normal select-none pointer-events-none transform -rotate-1 py-1"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Priya Sharma
              </div>
              <div className="w-full flex items-center justify-between pt-2 mt-2 bg-white/70 px-2.5 py-1 rounded flex-wrap gap-1">
                <span className="font-mono text-[10px] text-[#5b4139]">Font: PAKT Script Standard v3</span>
                <span className="font-mono text-[10px] text-[#954500] flex items-center gap-0.5 font-bold">
                  <span className="material-symbols-outlined text-[12px]">verified</span> Vector Lock
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Draw View Mode */}
        {activeTab === 'draw' && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-wider text-[#5b4139] font-bold">
                {lang === 'EN' ? 'Touch Canvas' : 'स्पर्श कैनवास'}
              </label>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-[#ac2e00] font-mono text-[11px] font-bold hover:underline"
              >
                {lang === 'EN' ? 'Clear Canvas' : 'कैनवास साफ़ करें'}
              </button>
            </div>
            <div className="h-28 bg-[#f2f4f6] rounded-lg relative overflow-hidden flex items-center justify-center border border-[#e4beb4]/40">
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasDrawn && (
                <span className="absolute pointer-events-none text-[#5b4139] text-[12px] opacity-60 text-center px-4">
                  {lang === 'EN'
                    ? 'Sign inside this area with finger or stylus'
                    : 'उंगली या स्टाइलस से इस क्षेत्र में हस्ताक्षर करें'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Aadhaar eSign Mode */}
        {activeTab === 'aadhaar' && (
          <div className="flex flex-col gap-2.5 p-3 bg-[#f2f4f6] rounded-lg border border-[#e4beb4]/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ac2e00] text-[20px]">fingerprint</span>
              <span className="text-[13px] font-bold text-[#191c1e]">
                {lang === 'EN' ? 'UIDAI Aadhaar OTP / Biometric eSign Gateway' : 'यूआईडीएआई आधार ओटीपी / बायोमेट्रिक ई-साइन गेटवे'}
              </span>
            </div>
            <p className="text-[11px] text-[#5b4139]">
              {lang === 'EN'
                ? 'Secure authentication via UIDAI licensed ESP (eMudhra / NSDL / CDSL e-Sign).'
                : 'यूआईडीएआई अधिकृत ईएसपी (eMudhra / NSDL / CDSL) के माध्यम से सुरक्षित प्रमाणीकरण।'}
            </p>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={aadhaarInput}
                onChange={(e) => setAadhaarInput(e.target.value)}
                placeholder={lang === 'EN' ? 'Enter 12-digit Aadhaar / VID' : '१२ अंकों का आधार / वीआईडी दर्ज करें'}
                className="flex-1 bg-white border border-[#e4beb4] rounded-lg px-3 py-1.5 text-[12px] font-mono text-[#191c1e] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setAadhaarOtpSent(true);
                  alert(
                    lang === 'EN'
                      ? 'OTP sent to UIDAI registered mobile number.'
                      : 'यूआईडीएआई पंजीकृत मोबाइल नंबर पर ओटीपी भेजा गया।'
                  );
                }}
                className="bg-[#ac2e00] hover:bg-[#d53e07] text-white px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold"
              >
                {aadhaarOtpSent ? (lang === 'EN' ? 'OTP Sent' : 'ओटीपी भेजा गया') : (lang === 'EN' ? 'Get OTP' : 'ओटीपी प्राप्त करें')}
              </button>
            </div>
          </div>
        )}

        {/* Class 3 DSC / Web3 EIP-712 Attestation Mode Card */}
        <div className="mt-3 p-3 bg-[#f2f4f6] rounded-lg border border-[#e4beb4]/20">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#e0e3e5] flex items-center justify-center text-[#ac2e00] shrink-0">
                <span className="material-symbols-outlined text-[20px]">token</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[12px] font-bold text-[#191c1e] truncate">
                    {lang === 'EN' ? 'Class 3 DSC / EIP-712 Dual Seal' : 'क्लास ३ डीएससी / ईआईपी-७१२ दोहरा मुहर'}
                  </span>
                  <span className="font-mono text-[9px] bg-[#ffdbc8] text-[#321200] px-1.5 py-0.5 rounded font-bold">
                    INDIA PKI
                  </span>
                </div>
                <p className="font-mono text-[10px] text-[#5b4139] truncate">
                  Polygon PoS & Certifying Authority (CCA / eMudhra)
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={dscSealEnabled}
                onChange={(e) => setDscSealEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ac2e00]"></div>
            </label>
          </div>
        </div>

        {/* Indian Statutory Compliance Checkbox Card */}
        <div
          onClick={() => setComplianceChecked(!complianceChecked)}
          className="mt-3 p-3 rounded-lg bg-[#f2f4f6] border border-[#e4beb4]/30 cursor-pointer select-none"
        >
          <div className="flex items-start gap-3">
            <div className="pt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={complianceChecked}
                onChange={() => {}}
                className="w-4 h-4 text-[#ac2e00] rounded accent-[#ac2e00] cursor-pointer"
              />
            </div>
            <div className="min-w-0 text-[#191c1e] flex flex-col gap-1">
              <p className="text-[12px] leading-relaxed">
                {lang === 'EN' ? (
                  <>
                    I agree that my electronic execution constitutes a legally enforceable contract under India{' '}
                    <strong>Information Technology Act (IT Act 2000 Section 10A / 3A)</strong>,{' '}
                    <strong>Indian Contract Act 1872</strong>, and <strong>DPDP Act 2023</strong>, anchored to SHA-256 state seal.
                  </>
                ) : (
                  <>
                    मैं पुष्टि करता/करती हूँ कि मेरा यह इलेक्ट्रॉनिक निष्पादन भारतीय{' '}
                    <strong>सूचना प्रौद्योगिकी अधिनियम (आईटी एक्ट २००० धारा १०क / ३क)</strong>,{' '}
                    <strong>भारतीय संविदा अधिनियम १८७२</strong> एवं <strong>डीपीडीपी अधिनियम २०२३</strong> के तहत विधिक रूप से बाध्यकारी है।
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Audit Telemetry Stamp Card (Localized Mumbai) */}
      <div className="bg-white rounded-xl p-4 shadow-xs mb-3 border border-[#e4beb4]/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="material-symbols-outlined text-[#191c1e] text-[17px] shrink-0">fingerprint</span>
            <span className="text-[12px] font-bold text-[#191c1e] truncate">
              {lang === 'EN' ? 'Immutable Cryptographic Audit Stamp' : 'अपरिवर्तनीय क्रिप्टोग्राफ़िक ऑडिट स्टाम्प'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#954500] font-bold shrink-0">
            {lang === 'EN' ? 'READY' : 'तैयार'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[#5b4139]">
          <div className="bg-[#f2f4f6] p-2 rounded">
            <span className="block text-[9px] uppercase tracking-wider text-[#5b4139] font-bold">
              {lang === 'EN' ? 'Origin IPv4' : 'उत्पत्ति आईपी'}
            </span>
            <span className="font-mono text-[11px] font-bold text-[#191c1e] truncate block">
              49.37.142.88 (Mumbai, MH)
            </span>
          </div>

          <div className="bg-[#f2f4f6] p-2 rounded">
            <span className="block text-[9px] uppercase tracking-wider text-[#5b4139] font-bold">
              {lang === 'EN' ? 'Timestamp (IST)' : 'समय (भारतीय मानक समय)'}
            </span>
            <span className="font-mono text-[11px] font-bold text-[#191c1e] truncate block">
              2026-09-22 18:20:11 IST
            </span>
          </div>

          <div className="bg-[#f2f4f6] p-2 rounded col-span-2">
            <span className="block text-[9px] uppercase tracking-wider text-[#5b4139] font-bold">
              {lang === 'EN' ? 'Client Runtime' : 'क्लाइंट रनटाइम'}
            </span>
            <span className="font-mono text-[11px] text-[#191c1e] truncate block">
              Chrome 132.0 (macOS / Apple Silicon Safe Attestation)
            </span>
          </div>

          <div className="bg-[#f2f4f6] p-2 rounded col-span-2">
            <span className="block text-[9px] uppercase tracking-wider text-[#5b4139] font-bold">
              {lang === 'EN' ? 'Proposed SHA-256 Digest Preview' : 'प्रस्तावित SHA-256 डाइजेस्ट पूर्वावलोकन'}
            </span>
            <span className="font-mono text-[11px] text-[#ac2e00] truncate block font-bold">
              0x8a9cf29e71b2d04a6e81258673a55cd91307b972...
            </span>
          </div>
        </div>
      </div>

      {/* Execution & Action Dock */}
      <div className="flex flex-col gap-2.5 mt-1">
        <button
          type="button"
          onClick={handleExecution}
          disabled={isExecuting || isSealed}
          className={`w-full py-4 px-4 rounded-xl text-white font-bold text-[14px] shadow-lg flex items-center justify-center gap-2.5 transition-all ${
            isSealed
              ? 'bg-emerald-700 shadow-emerald-700/20'
              : 'bg-[#ac2e00] hover:bg-[#d53e07] active:scale-[0.99] shadow-[#ac2e00]/20'
          }`}
        >
          {isExecuting ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
              <span>{lang === 'EN' ? 'Mining Cryptographic Proof on Polygon...' : 'पॉलीगॉन पर क्रिप्टोग्राफ़िक प्रमाण माइनिंग...'}</span>
            </>
          ) : isSealed ? (
            <>
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{lang === 'EN' ? 'PAKT Notarized & Anchored' : 'पाक्ट नोटरीकृत एवं एंकर प्रमाणित'}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">lock</span>
              <span>{lang === 'EN' ? 'Execute & Seal PAKT' : 'पाक्ट निष्पादित एवं मुद्रित करें'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            const reason = prompt(
              lang === 'EN'
                ? 'Please specify clause revision notes or reasoning for decline:'
                : 'कृपया धारा संशोधन टिप्पणी या अस्वीकृति का कारण दर्ज करें:'
            );
            if (reason) {
              alert(
                lang === 'EN'
                  ? 'Revision ticket dispatched to counterparty for consensus update.'
                  : 'संशोधन अनुरोध प्रतिपक्ष को प्रेषित किया गया।'
              );
            }
          }}
          className="w-full py-3 px-4 rounded-xl bg-[#f2f4f6] text-[#191c1e] text-[13px] font-semibold hover:bg-[#eceef0] transition-colors flex items-center justify-center gap-1.5 border border-[#e4beb4]/30"
        >
          <span className="material-symbols-outlined text-[16px] text-[#5b4139]">cancel</span>
          <span>{lang === 'EN' ? 'Decline / Request Revision' : 'अस्वीकार करें / संशोधन का अनुरोध करें'}</span>
        </button>
      </div>

      {/* Sealed Success Modal / Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="bg-[#2d3133] text-[#eff1f3] p-4 rounded-xl shadow-2xl flex items-center justify-between gap-3 border border-[#ac2e00]/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#ac2e00] flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-[22px]">verified</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-[13px] truncate">
                  {lang === 'EN' ? 'PAKT Sealed Successfully' : 'पाक्ट सफलतापूर्वक मुद्रित हुआ'}
                </h4>
                <p className="font-mono text-[11px] text-[#e0e3e5] truncate">
                  Block Proof #IN-84920 Commencing on Polygon
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('verify')}
                className="text-[#ffb5a0] text-[11px] font-mono font-bold underline"
              >
                {lang === 'EN' ? 'Audit View' : 'ऑडिट देखें'}
              </button>
              <button
                type="button"
                onClick={() => setShowToast(false)}
                className="text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Inline Discard Confirmation Dialog */}
      {showDiscardInlineModal && contract && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 shadow-2xl border border-red-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-red-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                </span>
                <div>
                  <h3 className="text-[14px] font-bold text-red-950">
                    {lang === 'EN'
                      ? `Discard Clause ${showDiscardInlineModal.clauseNumber}`
                      : `धारा ${showDiscardInlineModal.clauseNumber} निरस्त करें`}
                  </h3>
                  <p className="text-[11px] text-[#5b4139] truncate max-w-xs font-mono">
                    {showDiscardInlineModal.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDiscardInlineModal(null)}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <p className="text-[12px] text-[#191c1e] leading-relaxed">
              {lang === 'EN'
                ? 'Under Section 62 of the Indian Contract Act 1872, counterparties may mutually dispense with or waive any contractual stipulation. Discarding will strike-through the clause in the manifest and record your statutory reason in the audit ledger.'
                : 'भारतीय अनुबंध अधिनियम १८७२ की धारा ६२ के तहत पक्षकार आपसी सहमति से किसी भी शर्त को निरस्त कर सकते हैं। निरस्तीकरण का कारण ऑडिट लेजर में साक्ष्य के रूप में दर्ज होगा।'}
            </p>

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1.5">
                {lang === 'EN' ? 'Statutory Waiver Reason:' : 'सांविधिक निरस्तीकरण कारण:'}
              </label>
              <div className="space-y-1.5 mb-2">
                {[
                  'Mutually agreed waiver under Indian Contract Act 1872 Section 62',
                  'Statutorily exempted under Digital Personal Data Protection Act 2023',
                  'Superceded by supplementary SLA addendum',
                ].map((reason, rIdx) => (
                  <label
                    key={rIdx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#f8f9fa] border border-[#e4beb4]/30 hover:bg-red-50 text-[11px] cursor-pointer text-[#191c1e]"
                  >
                    <input
                      type="radio"
                      name="inlineReason"
                      checked={inlineDiscardReason === reason}
                      onChange={() => setInlineDiscardReason(reason)}
                      className="text-red-700 focus:ring-red-600"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
              <input
                type="text"
                value={inlineDiscardReason}
                onChange={(e) => setInlineDiscardReason(e.target.value)}
                placeholder="Or specify custom reason..."
                className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg px-3 py-2 text-[12px] text-[#191c1e] focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowDiscardInlineModal(null)}
                className="px-4 py-2 rounded-lg bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] text-[12px] font-semibold"
              >
                {lang === 'EN' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDiscardClause && contract && showDiscardInlineModal) {
                    onDiscardClause(
                      contract.id,
                      showDiscardInlineModal.clauseNumber,
                      inlineDiscardReason
                    );
                  }
                  setShowDiscardInlineModal(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-[12px] font-bold shadow-xs transition-all active:scale-95"
              >
                {lang === 'EN' ? 'Confirm Discard' : 'निरस्तीकरण पुष्टि'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clause Manager Terminal Modal */}
      {showClauseModal && contract && (
        <ClauseManagerModal
          isOpen={showClauseModal}
          onClose={() => setShowClauseModal(false)}
          contract={contract}
          lang={lang}
          contractLanguage={activeDocLang}
          onAddClause={(cId, clause) => {
            if (onAddClause) onAddClause(cId, clause);
          }}
          onEditClause={(cId, cNum, updated) => {
            if (onEditClause) onEditClause(cId, cNum, updated);
          }}
          onDiscardClause={(cId, cNum, reason) => {
            if (onDiscardClause) onDiscardClause(cId, cNum, reason);
          }}
          onRestoreClause={(cId, cNum) => {
            if (onRestoreClause) onRestoreClause(cId, cNum);
          }}
          onDeleteClause={(cId, cNum) => {
            if (onDeleteClause) onDeleteClause(cId, cNum);
          }}
        />
      )}
    </div>
  );
};
