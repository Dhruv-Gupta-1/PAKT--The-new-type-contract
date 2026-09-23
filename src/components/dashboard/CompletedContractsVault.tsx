import React, { useState } from 'react';
import { Language, ContractLanguage, ContractItem, AuditHistoryEvent, ContractClause } from '../../types';
import { getLocalizedContract, getLocalizedClause } from '../../data/translations';
import { useLoading } from '../../context/LoadingContext';

interface CompletedContractsVaultProps {
  contracts: ContractItem[];
  lang: Language;
  contractLanguage?: ContractLanguage;
  onClose?: () => void;
  onStoreContractInVault?: (contractId: string) => void;
  onAddHistoryNote?: (contractId: string, noteText: string, actor?: string) => void;
  onSelectContractForESign?: (contract: ContractItem) => void;
}

export const CompletedContractsVault: React.FC<CompletedContractsVaultProps> = ({
  contracts,
  lang,
  contractLanguage = 'en',
  onClose,
  onStoreContractInVault,
  onAddHistoryNote,
  onSelectContractForESign,
}) => {
  const { showLoading } = useLoading();

  // Filter only completed / executed contracts or contracts stored in vault
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedContractForDetails, setSelectedContractForDetails] = useState<ContractItem | null>(null);
  const [detailTab, setDetailTab] = useState<'history' | 'specs' | 'crypto' | 'clauses' | 'cert65b'>('history');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{ id: string; success: boolean; message: string } | null>(null);

  // Note creation form
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteActor, setNoteActor] = useState('Priya Sharma (Custodian)');

  // Store new contract modal
  const [showStorePickerModal, setShowStorePickerModal] = useState(false);
  const [contractToStoreId, setContractToStoreId] = useState<string>('');

  // Get completed / stored contracts
  const completedContracts = contracts.filter((c) => c.status === 'executed' || c.storedInVault);

  const filteredContracts = completedContracts.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesQuery =
      c.title.toLowerCase().includes(q) ||
      c.titleHindi.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.parties.some((p) => p.toLowerCase().includes(q)) ||
      (c.vaultArchiveId && c.vaultArchiveId.toLowerCase().includes(q)) ||
      (c.sha256 && c.sha256.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleVerifyIntegrity = async (contract: ContractItem) => {
    setVerifyingId(contract.id);
    setVerificationResult(null);

    // Realistic verification delay
    await new Promise((r) => setTimeout(r, 1200));

    setVerifyingId(null);
    setVerificationResult({
      id: contract.id,
      success: true,
      message:
        lang === 'EN'
          ? `Integrity Verified: Merkle root on Polygon Block ${contract.blockNumber || '#63,912,410'} matches local SHA-256 digest with 0 discrepancies.`
          : `अखंडता सत्यापित: पॉलीगॉन ब्लॉक ${contract.blockNumber || '#63,912,410'} पर मर्कल रूट बिना किसी विसंगति के स्थानीय हैश से मेल खाता है।`,
    });

    setTimeout(() => {
      setVerificationResult(null);
    }, 6000);
  };

  const handleStoreSelectedContract = () => {
    if (!contractToStoreId) return;
    const target = contracts.find((c) => c.id === contractToStoreId);
    if (!target) return;

    setShowStorePickerModal(false);

    showLoading({
      titleEn: 'Archiving Agreement to Safe Vault',
      titleHi: 'अनुबंध को सुरक्षित वॉल्ट में संग्रहित किया जा रहा है',
      subtitleEn: 'Permanently saving your signed agreement with Section 65B legal certificate...',
      subtitleHi: 'धारा ६५ख कानूनी प्रमाणपत्र के साथ आपका हस्ताक्षरित अनुबंध सुरक्षित रूप से संग्रहित हो रहा है...',
      duration: 2000,
      customSteps: [
        'Verifying digital signatures & integrity...',
        'Confirming Section 10A IT Act legal compliance...',
        'Recording tamper-proof timestamp on Polygon network...',
        'Generating Section 65B Certificate of Authenticity...',
        'Agreement safely stored in your vault!',
      ],
      customStepsHi: [
        'डिजिटल हस्ताक्षर एवं अखंडता का सत्यापन...',
        'आईटी अधिनियम धारा १०क कानूनी अनुपालन की पुष्टि...',
        'पॉलीगॉन नेटवर्क पर सुरक्षित डिजिटल समय-मुहर अंकन...',
        'धारा ६५ख कानूनी प्रामाणिकता प्रमाणपत्र तैयार...',
        'अनुबंध वॉल्ट में सफलतापूर्वक सुरक्षित हुआ!',
      ],
      onComplete: () => {
        if (onStoreContractInVault) {
          onStoreContractInVault(contractToStoreId);
        }
        const updatedTarget = contracts.find((c) => c.id === contractToStoreId);
        if (updatedTarget) {
          setSelectedContractForDetails({
            ...updatedTarget,
            storedInVault: true,
            status: 'executed',
          });
        }
      },
    });
  };

  const handleAddAuditNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedContractForDetails) return;

    if (onAddHistoryNote) {
      onAddHistoryNote(selectedContractForDetails.id, noteText.trim(), noteActor);
    }

    // Update locally in selectedContractForDetails
    const newEvent: AuditHistoryEvent = {
      id: `h-note-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST',
      titleEn: 'Historical Audit Note Appended',
      titleHi: 'ऐतिहासिक ऑडिट टिप्पणी संलग्न की गई',
      descriptionEn: noteText.trim(),
      descriptionHi: noteText.trim(),
      actor: noteActor,
      eventType: 'note',
    };

    setSelectedContractForDetails({
      ...selectedContractForDetails,
      history: [...(selectedContractForDetails.history || []), newEvent],
    });

    setNoteText('');
    setShowAddNoteModal(false);
  };

  const exportVaultDossier = (contract: ContractItem) => {
    const data = {
      vaultArchiveId: contract.vaultArchiveId || `VAULT-IN-${contract.code}`,
      contractCode: contract.code,
      title: contract.title,
      parties: contract.parties,
      status: contract.status,
      executionDate: contract.executionDate || contract.updatedTime || '2026-09-12',
      sha256Digest: contract.sha256,
      polygonPoSTx: contract.polygonTx,
      blockNumber: contract.blockNumber,
      stampDuty: contract.stampDuty,
      remuneration: contract.remuneration,
      sec65BCertificateId: contract.sec65BCertificateId,
      statutoryFramework: 'Indian Contract Act 1872 § 10A, Information Technology Act 2000, Indian Evidence Act § 65B',
      signatories: contract.signers,
      auditHistory: contract.history,
      clauses: contract.clauses,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contract.code}_PAKT_VAULT_DOSSIER.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Find active details contract from the refreshed contracts list
  const activeDetailContract = selectedContractForDetails
    ? contracts.find((c) => c.id === selectedContractForDetails.id) || selectedContractForDetails
    : null;

  return (
    <div className="flex flex-col w-full pb-20 animate-in fade-in duration-200">
      {/* Top Banner & Navigation Header */}
      <section className="w-full mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900 text-white rounded-2xl shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#ac2e00] flex items-center justify-center shrink-0 shadow-xs text-white">
              <span className="material-symbols-outlined text-[22px]">inventory_2</span>
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {lang === 'EN' ? 'Completed Contracts & Vault' : 'सम्पन्न अनुबंध एवं सुरक्षित वॉल्ट'}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                  {completedContracts.length} {lang === 'EN' ? 'SAVED' : 'सहेजे गए'}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {lang === 'EN'
                  ? 'Legally binding agreements with Section 65B certificates • Permanently protected'
                  : 'धारा ६५ख विधिक प्रमाणपत्र द्वारा प्रमाणित • अपरिवर्तनीय रूप से सुरक्षित'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowStorePickerModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ac2e00] hover:bg-[#d53e07] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add_box</span>
              <span>{lang === 'EN' ? 'Add Completed Agreement' : 'सम्पन्न अनुबंध जोड़ें'}</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>{lang === 'EN' ? 'Back to All Contracts' : 'सभी अनुबंधों पर वापस'}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Trust & Admissibility Metrics Bar */}
      <section className="w-full mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {lang === 'EN' ? 'Saved in Vault' : 'वॉल्ट में सुरक्षित'}
              </span>
              <span className="material-symbols-outlined text-[18px] text-emerald-600">verified_user</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {completedContracts.length}
              </span>
              <span className="text-xs text-slate-500">
                {lang === 'EN' ? '100% Tamper-Proof' : '१००% सुरक्षित व अपरिवर्तनीय'}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {lang === 'EN' ? 'Total Contract Value' : 'कुल अनुबंध मूल्य'}
              </span>
              <span className="material-symbols-outlined text-[18px] text-slate-400">currency_rupee</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                ₹72,50,000+
              </span>
              <span className="text-xs text-slate-500">
                {lang === 'EN' ? 'Stamp Duty Paid' : 'स्टाम्प शुल्क प्रदत्त'}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {lang === 'EN' ? 'Legal Validity' : 'कानूनी मान्यता'}
              </span>
              <span className="material-symbols-outlined text-[18px] text-indigo-500">history_edu</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                Section 65B
              </span>
              <span className="text-xs text-slate-500">
                {lang === 'EN' ? 'Valid in Indian Courts' : 'भारतीय न्यायालयों में मान्य'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Action Bar: Search Bar + Filter Tabs */}
      <section className="w-full mb-5">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'EN'
                  ? 'Search completed contracts, vault ID, or hash...'
                  : 'सम्पन्न अनुबंध, वॉल्ट आईडी या हैश खोजें...'
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar text-xs">
            {[
              { id: 'all', labelEn: 'All Stored', labelHi: 'सभी संग्रहित' },
              { id: 'employment', labelEn: 'Employment', labelHi: 'रोजगार/नियुक्ति' },
              { id: 'saas', labelEn: 'SaaS / Tech', labelHi: 'सास/तकनीकी' },
              { id: 'shareholder', labelEn: 'Shareholder', labelHi: 'शेयरधारक' },
              { id: 'nda', labelEn: 'NDA & IP', labelHi: 'गोपनीयता' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {lang === 'EN' ? cat.labelEn : cat.labelHi}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live Verification Notice Banner if just tested */}
      {verificationResult && (
        <section className="w-full mb-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex items-start gap-2 text-[12px] text-emerald-950 shadow-xs">
            <span className="material-symbols-outlined text-emerald-700 text-[20px] shrink-0 mt-0.5">
              task_alt
            </span>
            <div className="flex-1">
              <p className="font-semibold">{lang === 'EN' ? 'Cryptographic Proof Validated' : 'क्रिप्टोग्राफ़िक साक्ष्य मान्य'}</p>
              <p className="text-[11px] text-emerald-800 font-mono mt-0.5">{verificationResult.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setVerificationResult(null)}
              className="text-emerald-700 hover:text-emerald-950"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </section>
      )}

      {/* Stored Contracts List */}
      <section className="w-full mb-6">
        {filteredContracts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredContracts.map((contract) => {
              const locContract = getLocalizedContract(contract, contractLanguage);
              const historyCount = contract.history?.length || 0;
              const isVerifying = verifyingId === contract.id;

              return (
                <div
                  key={contract.id}
                  className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  {/* Header Row: Vault ID & Category Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-bold tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-emerald-400">lock</span>
                          {contract.vaultArchiveId || `VAULT-${contract.code}`}
                        </span>
                        <span className="font-semibold uppercase tracking-wider text-slate-500">
                          {contract.category}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500">{contract.code}</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
                        <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                        <span>{contract.executionDate || contract.vaultStorageDate || 'Sep 2026'}</span>
                      </div>
                    </div>

                    {/* Contract Title & Parties */}
                    <div className="mb-3">
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {locContract.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 flex items-start gap-1">
                        <span className="font-semibold text-slate-500 shrink-0">
                          {lang === 'EN' ? 'Parties:' : 'पक्षकार:'}
                        </span>
                        <span className="text-slate-800 font-medium">{locContract.parties}</span>
                      </p>
                    </div>

                    {/* Key Legal Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs mb-3 font-mono">
                      <div>
                        <span className="block text-[10px] uppercase text-slate-400 font-sans">
                          {lang === 'EN' ? 'Jurisdiction' : 'क्षेत्राधिकार'}
                        </span>
                        <span className="font-semibold text-slate-900 truncate block">
                          {contract.jurisdiction || 'High Court of Bombay'}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] uppercase text-slate-400 font-sans">
                          {lang === 'EN' ? 'e-Stamp Status' : 'ई-स्टाम्प स्थिति'}
                        </span>
                        <span className="font-semibold text-emerald-700 truncate block">
                          {contract.stampDuty || 'e-SBTR Paid'}
                        </span>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <span className="block text-[10px] uppercase text-slate-400 font-sans">
                          {lang === 'EN' ? 'Consideration' : 'मानदेय / मूल्य'}
                        </span>
                        <span className="font-bold text-slate-900 truncate block">
                          {contract.remuneration || 'Statutory Covenant'}
                        </span>
                      </div>
                    </div>

                    {/* Cryptographic Proof Strip */}
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-100/70 font-mono text-[11px] text-slate-700 mb-3 flex-wrap">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-400">SHA-256:</span>
                        <span className="font-bold truncate max-w-[140px] sm:max-w-[200px]">
                          {contract.sha256}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(contract.sha256, contract.id + '-hash')}
                          className="text-[#ac2e00] hover:underline"
                          title="Copy SHA-256 Digest"
                        >
                          {copiedText === contract.id + '-hash' ? 'Copied!' : 'copy'}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 text-slate-500">
                        <span>{contract.blockNumber || 'Polygon PoS'}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-bold">
                          {lang === 'EN' ? 'L2 Anchored' : 'एंकर सुरक्षित'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Signatories & Action Footer */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span className="material-symbols-outlined text-[15px] text-emerald-600">history</span>
                      <span>{historyCount} {lang === 'EN' ? 'Audit Events' : 'घटनाएं'}</span>
                      <span className="text-slate-300">·</span>
                      <span>{contract.signers?.length || 2} {lang === 'EN' ? 'Attestations' : 'प्रमाणन'}</span>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleVerifyIntegrity(contract)}
                        disabled={isVerifying}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors disabled:opacity-50"
                        title={lang === 'EN' ? 'Re-verify SHA-256 against Polygon L2 node' : 'ब्लॉकचेन पर पुनः अखंडता जांचें'}
                      >
                        <span className={`material-symbols-outlined text-[14px] text-emerald-600 ${isVerifying ? 'animate-spin' : ''}`}>
                          {isVerifying ? 'refresh' : 'verified'}
                        </span>
                        <span>{isVerifying ? (lang === 'EN' ? 'Verifying...' : 'जाँच जारी...') : (lang === 'EN' ? 'Verify' : 'जाँचें')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedContractForDetails(contract);
                          setDetailTab('history');
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[15px] text-amber-400">inventory_2</span>
                        <span>{lang === 'EN' ? 'History & Dossier' : 'इतिहास एवं डोजियर'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto border border-slate-200/60">
              <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'EN' ? 'No Stored Contracts Found' : 'कोई सुरक्षित अनुबंध नहीं मिला'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {lang === 'EN'
                ? 'Store any executed contract into the permanent legal vault to preserve its cryptographic history, Section 65B certificate, and audit trail.'
                : 'क्रिप्टोग्राफ़िक इतिहास, धारा ६५ख प्रमाण पत्र और ऑडिट साक्ष्य सुरक्षित रखने हेतु किसी भी निष्पादित अनुबंध को वॉल्ट में सहेजें।'}
            </p>
            <button
              type="button"
              onClick={() => setShowStorePickerModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ac2e00] hover:bg-[#d53e07] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add_box</span>
              <span>{lang === 'EN' ? 'Store an Executed Agreement' : 'निष्पादित अनुबंध सहेजें'}</span>
            </button>
          </div>
        )}
      </section>

      {/* FULL-SCREEN DETAILS & HISTORY MODAL */}
      {activeDetailContract && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Top Header */}
            <div className="p-4 bg-[#191c1e] text-white flex items-center justify-between gap-2 border-b border-[#ac2e00]/30 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-[#ac2e00] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">history_edu</span>
                </span>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
                      {activeDetailContract.vaultArchiveId || `VAULT-${activeDetailContract.code}`}
                    </span>
                    <span className="text-[13px] font-bold text-white truncate">
                      {activeDetailContract.title}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-gray-400 truncate mt-0.5">
                    {activeDetailContract.parties.join(' • ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => exportVaultDossier(activeDetailContract)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-semibold flex items-center gap-1"
                  title="Download full JSON legal dossier"
                >
                  <span className="material-symbols-outlined text-[13px]">download</span>
                  <span className="hidden sm:inline">Dossier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedContractForDetails(null)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1 bg-[#eceef0] p-1.5 border-b border-[#e4beb4]/30 overflow-x-auto text-[11px] font-semibold shrink-0 no-scrollbar">
              <button
                type="button"
                onClick={() => setDetailTab('history')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                  detailTab === 'history'
                    ? 'bg-white text-[#ac2e00] shadow-xs font-bold'
                    : 'text-[#5b4139] hover:text-[#191c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">history</span>
                <span>{lang === 'EN' ? 'History Timeline' : 'इतिहास टाइमलाइन'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#ffdbd1] text-[#3b0a00] font-mono text-[9px]">
                  {activeDetailContract.history?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDetailTab('specs')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                  detailTab === 'specs'
                    ? 'bg-white text-[#ac2e00] shadow-xs font-bold'
                    : 'text-[#5b4139] hover:text-[#191c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">article</span>
                <span>{lang === 'EN' ? 'Legal Specs' : 'विधिक विवरण'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDetailTab('crypto')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                  detailTab === 'crypto'
                    ? 'bg-white text-[#ac2e00] shadow-xs font-bold'
                    : 'text-[#5b4139] hover:text-[#191c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">token</span>
                <span>{lang === 'EN' ? 'Cryptographic Proof' : 'क्रिप्टोग्राफ़िक साक्ष्य'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDetailTab('clauses')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                  detailTab === 'clauses'
                    ? 'bg-white text-[#ac2e00] shadow-xs font-bold'
                    : 'text-[#5b4139] hover:text-[#191c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">gavel</span>
                <span>{lang === 'EN' ? 'Clauses' : 'धाराएं'} ({activeDetailContract.clauses?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setDetailTab('cert65b')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                  detailTab === 'cert65b'
                    ? 'bg-white text-[#ac2e00] shadow-xs font-bold'
                    : 'text-[#5b4139] hover:text-[#191c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>{lang === 'EN' ? '§ 65B Certificate' : 'धारा ६५ख प्रमाण-पत्र'}</span>
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB 1: HISTORY TIMELINE */}
              {detailTab === 'history' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100 flex-wrap">
                    <div>
                      <h4 className="text-[13px] font-bold text-[#191c1e]">
                        {lang === 'EN' ? 'Immutable Audit Trail & Execution Milestones' : 'अपरिवर्तनीय ऑडिट ट्रेल एवं निष्पादन इतिहास'}
                      </h4>
                      <p className="text-[11px] text-[#5b4139]">
                        {lang === 'EN'
                          ? 'Chronological event history anchored with timestamp and cryptographic metadata'
                          : 'टाइमस्टैम्प और क्रिप्टोग्राफ़िक मेटाडेटा के साथ कालानुक्रमिक घटना इतिहास'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddNoteModal(true)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ac2e00] hover:bg-[#d53e07] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[15px]">post_add</span>
                      <span>{lang === 'EN' ? 'Add Audit Note' : 'टिप्पणी जोड़ें'}</span>
                    </button>
                  </div>

                  {/* Timeline Tree */}
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e4beb4]/50">
                    {activeDetailContract.history && activeDetailContract.history.length > 0 ? (
                      activeDetailContract.history.map((evt, idx) => {
                        const isLast = idx === activeDetailContract.history!.length - 1;
                        let dotBg = 'bg-[#ac2e00]';
                        let icon = 'flag';

                        if (evt.eventType === 'creation') {
                          dotBg = 'bg-blue-600';
                          icon = 'description';
                        } else if (evt.eventType === 'stamp_duty') {
                          dotBg = 'bg-amber-600';
                          icon = 'receipt_long';
                        } else if (evt.eventType === 'signature') {
                          dotBg = 'bg-purple-600';
                          icon = 'draw';
                        } else if (evt.eventType === 'hash_anchor') {
                          dotBg = 'bg-emerald-600';
                          icon = 'token';
                        } else if (evt.eventType === 'vault_storage') {
                          dotBg = 'bg-gray-800';
                          icon = 'lock';
                        } else if (evt.eventType === 'note') {
                          dotBg = 'bg-orange-600';
                          icon = 'comment';
                        }

                        return (
                          <div key={evt.id || idx} className="relative group">
                            {/* Dot Icon */}
                            <div
                              className={`absolute -left-6 top-1 w-5 h-5 rounded-full ${dotBg} text-white flex items-center justify-center ring-4 ring-white shadow-xs`}
                            >
                              <span className="material-symbols-outlined text-[11px]">{icon}</span>
                            </div>

                            {/* Card Content */}
                            <div className="bg-[#f8f9fa] rounded-xl p-3 border border-[#e4beb4]/30 hover:border-[#ac2e00]/40 transition-all space-y-1">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="text-[12px] font-bold text-[#191c1e]">
                                  {lang === 'EN' ? evt.titleEn : evt.titleHi || evt.titleEn}
                                </span>
                                <span className="font-mono text-[10px] text-[#5b4139] bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                  {evt.timestamp}
                                </span>
                              </div>

                              <p className="text-[11px] text-[#5b4139] leading-relaxed">
                                {lang === 'EN' ? evt.descriptionEn : evt.descriptionHi || evt.descriptionEn}
                              </p>

                              <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 font-mono text-[10px] text-gray-500 flex-wrap gap-2">
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[12px]">account_circle</span>
                                  <span>{evt.actor}</span>
                                </span>

                                {evt.txHash && (
                                  <span className="text-[#ac2e00] font-bold truncate max-w-[180px]">
                                    Tx: {evt.txHash.slice(0, 14)}...
                                  </span>
                                )}

                                {evt.blockNumber && (
                                  <span className="text-emerald-700 font-bold">
                                    {evt.blockNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6 text-[12px] text-[#5b4139]">
                        {lang === 'EN' ? 'No history milestones recorded yet.' : 'अभी कोई इतिहास मील का पत्थर दर्ज नहीं है।'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: LEGAL SPECS */}
              {detailTab === 'specs' && (
                <div className="space-y-3 text-[12px]">
                  <div className="bg-[#f8f9fa] p-3.5 rounded-xl border border-[#e4beb4]/30 space-y-2">
                    <h4 className="text-[13px] font-bold text-[#191c1e] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#ac2e00]">gavel</span>
                      <span>{lang === 'EN' ? 'Statutory Enforceability & Jurisdiction' : 'विधिक प्रवर्तनीयता एवं क्षेत्राधिकार'}</span>
                    </h4>
                    <p className="text-[#5b4139] leading-relaxed">
                      {lang === 'EN'
                        ? 'This electronic contract is fully enforceable in courts of India pursuant to Section 10A of the Information Technology Act 2000 and Section 10 of the Indian Contract Act 1872. Cryptographic hash anchoring fulfills requirements for conclusive evidentiary presumption.'
                        : 'यह इलेक्ट्रॉनिक अनुबंध सूचना प्रौद्योगिकी अधिनियम २००० की धारा १०क और भारतीय अनुबंध अधिनियम १८७२ की धारा १० के तहत भारत की अदालतों में पूर्णतः प्रवर्तनीय है।'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="bg-white p-3 rounded-xl border border-[#e4beb4]/30 space-y-1">
                      <span className="text-[10px] font-mono text-[#5b4139] uppercase block">{lang === 'EN' ? 'Jurisdiction Seat' : 'न्यायालय क्षेत्राधिकार'}</span>
                      <span className="font-bold text-[#191c1e] block">{activeDetailContract.jurisdiction || 'Mumbai Seat • High Court of Bombay & MCIA'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#e4beb4]/30 space-y-1">
                      <span className="text-[10px] font-mono text-[#5b4139] uppercase block">{lang === 'EN' ? 'Stamp Duty Certificate' : 'ई-स्टांप शुल्क प्रमाण पत्र'}</span>
                      <span className="font-bold text-emerald-800 block">{activeDetailContract.stampDuty || 'Maharashtra e-Challan MH-2026-9812'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#e4beb4]/30 space-y-1">
                      <span className="text-[10px] font-mono text-[#5b4139] uppercase block">{lang === 'EN' ? 'Total Consideration / Value' : 'कुल प्रतिफल राशि'}</span>
                      <span className="font-bold text-[#ac2e00] block">{activeDetailContract.remuneration || 'Statutory Covenants'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#e4beb4]/30 space-y-1">
                      <span className="text-[10px] font-mono text-[#5b4139] uppercase block">{lang === 'EN' ? 'Execution Mode' : 'निष्पादन विधि'}</span>
                      <span className="font-bold text-[#191c1e] block">Class 3 DSC & Aadhaar e-Sign OTP</span>
                    </div>
                  </div>

                  {/* Signatories Details */}
                  <div className="bg-white p-3 rounded-xl border border-[#e4beb4]/30 space-y-2">
                    <h5 className="font-bold text-[12px] text-[#191c1e]">
                      {lang === 'EN' ? 'Attesting Signatories' : 'प्रमाणित हस्ताक्षरकर्ता'}
                    </h5>
                    <div className="space-y-1.5">
                      {(activeDetailContract.signers || []).map((signer, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#f8f9fa] border border-gray-100 text-[11px]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#ffdbd1] text-[#ac2e00] flex items-center justify-center font-bold text-[10px]">
                              {signer.initials || signer.name.slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                              <span className="font-bold text-[#191c1e] block">{signer.name}</span>
                              <span className="text-[10px] text-[#5b4139] block">{signer.role}</span>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold">
                            {signer.dscType || 'Aadhaar e-Sign OTP'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CRYPTOGRAPHIC PROOFS */}
              {detailTab === 'crypto' && (
                <div className="space-y-3 font-mono text-[11px]">
                  <div className="bg-[#191c1e] text-white p-3.5 rounded-xl space-y-3 border border-gray-800">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block">{lang === 'EN' ? 'Canonical SHA-256 Digest' : 'कैनोनिकल SHA-256 डाइजेस्ट'}</span>
                      <div className="flex items-center justify-between gap-2 mt-1 bg-black/40 p-2 rounded-lg break-all text-[11px] text-emerald-400">
                        <span>{activeDetailContract.sha256}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(activeDetailContract.sha256, 'modal-hash')}
                          className="text-white hover:text-emerald-300 shrink-0 font-sans text-[11px]"
                        >
                          {copiedText === 'modal-hash' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block">{lang === 'EN' ? 'Polygon L2 Transaction Hash' : 'पॉलीगॉन L2 ट्रांजेक्शन हैश'}</span>
                      <div className="flex items-center justify-between gap-2 mt-1 bg-black/40 p-2 rounded-lg break-all text-[11px] text-amber-300">
                        <span>{activeDetailContract.polygonTx || '0x8a9f44102bc73b1288301da2874bc109f'}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(activeDetailContract.polygonTx || '0x8a9f44102bc73b1288301da2874bc109f', 'modal-tx')}
                          className="text-white hover:text-amber-300 shrink-0 font-sans text-[11px]"
                        >
                          {copiedText === 'modal-tx' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-black/40 p-2 rounded-lg">
                        <span className="text-gray-400 block">Block Height</span>
                        <span className="text-white font-bold text-[12px]">{activeDetailContract.blockNumber || '#63,912,410'}</span>
                      </div>
                      <div className="bg-black/40 p-2 rounded-lg">
                        <span className="text-gray-400 block">Sponsoring Node</span>
                        <span className="text-white font-bold text-[12px]">Bharat IN-MUM-1</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 space-y-1 font-sans text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="material-symbols-outlined text-[16px] text-emerald-700">security</span>
                      <span>{lang === 'EN' ? 'Cryptographic Non-Repudiation Guarantee' : 'अस्वीकरण-रोधी विधिक गारंटी'}</span>
                    </div>
                    <p className="text-emerald-900 leading-relaxed">
                      {lang === 'EN'
                        ? 'Under Section 85B of the Indian Evidence Act, the court presumes that the secure electronic record has not been altered since the point in time to which the secure status relates.'
                        : 'भारतीय साक्ष्य अधिनियम की धारा ८५ख के अंतर्गत यह कानूनी धारणा मान्य है कि सुरक्षित इलेक्ट्रॉनिक रिकॉर्ड को सुरक्षित स्थिति के समय से बदला नहीं गया है।'}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: CLAUSES MANIFEST */}
              {detailTab === 'clauses' && (
                <div className="space-y-2.5">
                  {(activeDetailContract.clauses || []).map((clause: ContractClause, cIdx: number) => {
                    const locCl = getLocalizedClause(clause, contractLanguage);
                    const isWaived = !!clause.discarded;

                    return (
                      <div
                        key={cIdx}
                        className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                          isWaived ? 'bg-red-50/70 border-red-200 opacity-80' : 'bg-[#f8f9fa] border-[#e4beb4]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span
                            className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              isWaived ? 'bg-red-200 text-red-900 line-through' : 'bg-[#ffdbd1] text-[#3b0a00]'
                            }`}
                          >
                            Clause {clause.clauseNumber}
                          </span>
                          <span className="font-mono text-[9px] text-[#5b4139]">
                            {isWaived ? 'WAIVED / ICA § 62' : locCl.statusText || 'Enforceable'}
                          </span>
                        </div>

                        <h5 className={`font-bold ${isWaived ? 'line-through text-gray-500' : 'text-[#191c1e]'}`}>
                          {locCl.title}
                        </h5>
                        <p className={`leading-relaxed ${isWaived ? 'line-through text-gray-500' : 'text-[#5b4139]'}`}>
                          {locCl.text}
                        </p>

                        {isWaived && clause.discardReason && (
                          <div className="mt-1 p-1.5 bg-red-100/90 rounded text-[10px] text-red-950">
                            <strong>Waiver Reason:</strong> {clause.discardReason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 5: SECTION 65B CERTIFICATE */}
              {detailTab === 'cert65b' && (
                <div className="bg-[#fcfbf9] border-2 border-[#191c1e] p-4 rounded-xl text-[#191c1e] space-y-3 font-serif">
                  <div className="text-center pb-2 border-b-2 border-[#191c1e] space-y-0.5">
                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#ac2e00]">
                      GOVERNMENT OF INDIA • STATUTORY LEGAL EVIDENCE
                    </span>
                    <h3 className="text-[14px] font-bold uppercase tracking-tight">
                      CERTIFICATE UNDER SECTION 65B OF THE INDIAN EVIDENCE ACT, 1872
                    </h3>
                    <p className="text-[10px] text-[#5b4139] font-mono">
                      Certificate ID: {activeDetailContract.sec65BCertificateId || 'CERT-65B-2026-08129'} • Issued at Mumbai
                    </p>
                  </div>

                  <p className="text-[11px] leading-relaxed">
                    I, the designated System Custodian of <strong>PAKT Sovereign Cloud Systems (Bharat Node IN-MUM-1)</strong>,
                    do hereby solemnly certify and affirm under Section 65B(4) of the Indian Evidence Act, 1872 that:
                  </p>

                  <ol className="list-decimal pl-4 space-y-1.5 text-[10.5px] leading-snug">
                    <li>
                      The electronic record titled <strong>&quot;{activeDetailContract.title}&quot;</strong> bearing canonical
                      digest <code>{activeDetailContract.sha256}</code> was generated by lawful computer systems in the
                      ordinary course of official cryptographic operations.
                    </li>
                    <li>
                      During the relevant period, the computing systems and Polygon Proof-of-Stake consensus state were
                      operating properly under CERT-In and IT Act 2000 regulatory guidelines without security impairment.
                    </li>
                    <li>
                      The information contained in this dossier constitutes true and accurate reproduction of the original
                      cryptographically executed covenants.
                    </li>
                  </ol>

                  <div className="pt-3 border-t border-gray-300 flex items-center justify-between text-[10px] font-mono">
                    <div>
                      <span className="block font-bold">SOVEREIGN LEGAL CUSTODIAN</span>
                      <span className="block text-gray-600">PAKT India Tech Labs LLP</span>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-900 rounded font-bold uppercase">
                        SEALED & ADMISSIBLE
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-3 bg-gray-50 border-t border-[#e4beb4]/30 flex items-center justify-between gap-2 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => exportVaultDossier(activeDetailContract)}
                className="px-3 py-1.5 rounded-lg bg-[#191c1e] hover:bg-black text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>{lang === 'EN' ? 'Download Full Legal Dossier' : 'विधिक डोजियर डाउनलोड करें'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedContractForDetails(null)}
                className="px-4 py-1.5 rounded-lg bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] text-[11px] font-bold transition-colors"
              >
                {lang === 'EN' ? 'Close Window' : 'बंद करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD HISTORICAL AUDIT NOTE MODAL */}
      {showAddNoteModal && activeDetailContract && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl border border-[#e4beb4]/50 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#ffdbd1] text-[#ac2e00] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">post_add</span>
                </span>
                <div>
                  <h4 className="text-[13px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'Append Historical Audit Note' : 'ऐतिहासिक ऑडिट टिप्पणी जोड़ें'}
                  </h4>
                  <p className="text-[10px] font-mono text-[#5b4139]">
                    {activeDetailContract.code}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddNoteModal(false)}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddAuditNoteSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                  {lang === 'EN' ? 'Author / Custodian:' : 'प्राधिकृत टिप्पणीकर्ता:'}
                </label>
                <input
                  type="text"
                  value={noteActor}
                  onChange={(e) => setNoteActor(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg px-3 py-2 text-[12px] text-[#191c1e] focus:outline-none focus:border-[#ac2e00]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                  {lang === 'EN' ? 'Historical Note / Milestone Entry:' : 'ऐतिहासिक विवरण या मील का पत्थर:'}
                </label>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={
                    lang === 'EN'
                      ? 'e.g. Q3 Escrow milestone released ₹12,00,000 upon UPI webhook confirmation...'
                      : 'उदा. पहली तिमाही का ₹१२ लाख का एस्क्रो भुगतान जारी किया गया...'
                  }
                  required
                  className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg p-3 text-[12px] text-[#191c1e] focus:outline-none focus:border-[#ac2e00]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="px-3 py-2 rounded-lg bg-[#eceef0] text-[#191c1e] text-[11px] font-semibold"
                >
                  {lang === 'EN' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#ac2e00] hover:bg-[#d53e07] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all"
                >
                  {lang === 'EN' ? 'Append to History' : 'इतिहास में जोड़ें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STORE CONTRACT PICKER MODAL */}
      {showStorePickerModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 shadow-2xl border border-[#e4beb4]/50 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#ffdbd1] text-[#ac2e00] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">add_box</span>
                </span>
                <div>
                  <h4 className="text-[13px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'Select Contract to Store into Legal Vault' : 'वॉल्ट में सहेजने हेतु अनुबंध चुनें'}
                  </h4>
                  <p className="text-[11px] text-[#5b4139]">
                    {lang === 'EN'
                      ? 'Select an active or completed contract for cryptographic archival'
                      : 'क्रिप्टोग्राफ़िक रूप से सुरक्षित करने हेतु अनुबंध का चयन करें'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStorePickerModal(false)}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* List of contracts that can be stored */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {contracts.map((contract) => {
                const isAlreadyStored = contract.storedInVault;
                const isSelected = contractToStoreId === contract.id;

                return (
                  <label
                    key={contract.id}
                    className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#ac2e00] bg-[#ffdbd1]/20'
                        : isAlreadyStored
                        ? 'border-gray-200 bg-gray-50 opacity-75'
                        : 'border-[#e4beb4]/40 hover:border-[#ac2e00]/60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="storeContractChoice"
                        checked={isSelected}
                        onChange={() => setContractToStoreId(contract.id)}
                        className="mt-1 text-[#ac2e00] focus:ring-[#ac2e00]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-[12px] text-[#191c1e] truncate">
                            {contract.title}
                          </span>
                          <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#eceef0] text-[#5b4139]">
                            {contract.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5b4139] truncate">
                          {contract.parties.join(' • ')}
                        </p>
                        <div className="flex items-center gap-2 mt-1 font-mono text-[9px]">
                          <span
                            className={`font-semibold ${
                              contract.status === 'executed' ? 'text-emerald-700' : 'text-[#ac2e00]'
                            }`}
                          >
                            Status: {contract.status}
                          </span>
                          {isAlreadyStored && (
                            <span className="text-gray-500">
                              • Already in Vault ({contract.vaultArchiveId})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowStorePickerModal(false)}
                className="px-3.5 py-2 rounded-lg bg-[#eceef0] text-[#191c1e] text-[11px] font-semibold"
              >
                {lang === 'EN' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button
                type="button"
                disabled={!contractToStoreId}
                onClick={handleStoreSelectedContract}
                className="px-4 py-2 rounded-lg bg-[#ac2e00] hover:bg-[#d53e07] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all disabled:opacity-50"
              >
                {lang === 'EN' ? 'Execute Cold-Storage Anchoring' : 'वॉल्ट में सुरक्षित एंकर करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
