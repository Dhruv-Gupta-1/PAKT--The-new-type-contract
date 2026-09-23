import React, { useState } from 'react';
import { ScreenType, Language, ContractLanguage, ContractItem, ContractClause } from '../../types';
import { getLocalizedContract } from '../../data/translations';
import { ClauseManagerModal } from '../modals/ClauseManagerModal';
import { CompletedContractsVault } from '../dashboard/CompletedContractsVault';

interface ContractsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
  contractLanguage?: ContractLanguage;
  onSelectContractLanguage?: (cl: ContractLanguage) => void;
  contracts: ContractItem[];
  onSelectContractForESign?: (contract: ContractItem) => void;
  onOpenSupportBot?: () => void;
  onOpenNewPakt?: () => void;
  onAddClause?: (contractId: string, clause: ContractClause) => void;
  onEditClause?: (contractId: string, clauseNumber: string, updatedClause: Partial<ContractClause>) => void;
  onDiscardClause?: (contractId: string, clauseNumber: string, reason?: string) => void;
  onRestoreClause?: (contractId: string, clauseNumber: string) => void;
  onDeleteClause?: (contractId: string, clauseNumber: string) => void;
  onStoreContractInVault?: (contractId: string) => void;
  onAddHistoryNote?: (contractId: string, noteText: string, actor?: string) => void;
}

export const ContractsScreen: React.FC<ContractsScreenProps> = ({
  onNavigate,
  lang,
  contractLanguage = 'en',
  onSelectContractLanguage,
  contracts,
  onSelectContractForESign,
  onOpenSupportBot,
  onOpenNewPakt,
  onAddClause,
  onEditClause,
  onDiscardClause,
  onRestoreClause,
  onDeleteClause,
  onStoreContractInVault,
  onAddHistoryNote,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'action' | 'review' | 'executed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Tab mode: 'pipeline' (standard active contracts) vs 'vault' (stored contracts & historical audit)
  const [activeDashboardTab, setActiveDashboardTab] = useState<'pipeline' | 'vault'>('pipeline');

  // Per-card independent language override
  const [cardLangOverride, setCardLangOverride] = useState<Record<string, ContractLanguage>>({});

  // Modals state
  const [selectedCertificateContract, setSelectedCertificateContract] = useState<ContractItem | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedClauseContract, setSelectedClauseContract] = useState<ContractItem | null>(null);
  const [showClauseModal, setShowClauseModal] = useState(false);

  const handleCopyHash = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Filter pipeline contracts
  const filteredContracts = contracts.filter((c) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'action'
        ? c.status === 'pending_signature'
        : activeFilter === 'review'
        ? c.status === 'in_review'
        : c.status === 'executed';

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;

    const matchesQuery =
      c.title.toLowerCase().includes(q) ||
      c.titleHindi.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.parties.some((p) => p.toLowerCase().includes(q)) ||
      c.category.toLowerCase().includes(q);

    return matchesFilter && matchesQuery;
  });

  const storedContracts = contracts.filter((c) => c.status === 'executed' || c.storedInVault);
  const pendingCount = contracts.filter((c) => c.status === 'pending_signature').length;
  const reviewCount = contracts.filter((c) => c.status === 'in_review').length;
  const executedCount = contracts.filter((c) => c.status === 'executed').length;

  const getContractLang = (id: string): ContractLanguage => {
    return cardLangOverride[id] || contractLanguage;
  };

  const setCardLang = (id: string, cl: ContractLanguage) => {
    setCardLangOverride((prev) => ({ ...prev, [id]: cl }));
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* EXECUTIVE HEADER BAR */}
      <section className="w-full mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs uppercase tracking-wider font-semibold text-slate-500">
                {lang === 'EN' ? 'Digital Legal Workspace' : 'डिजिटल विधिक कार्यक्षेत्र'}
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-xs text-emerald-700 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {lang === 'EN' ? 'Mumbai Node IN-MUM-1 Live' : 'मुंबई नोड IN-MUM-1 सक्रिय'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {lang === 'EN' ? 'Contracts & Agreements' : 'अनुबंध एवं विधिक समझौते'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {lang === 'EN'
                ? 'Sovereign digital execution under Indian IT Act 2000 § 10A, Aadhaar/DSC seals, and permanent cold-storage archive.'
                : 'भारतीय आईटी अधिनियम २००० धारा १०क के तहत संप्रभु डिजिटल निष्पादन, आधार/डीएससी मुहर एवं स्थायी विधिक संग्रह।'}
            </p>
          </div>

          {/* Primary View Switcher & Action Button */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveDashboardTab('pipeline')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeDashboardTab === 'pipeline'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#ac2e00]">assignment</span>
                <span>{lang === 'EN' ? 'Active Pipeline' : 'सक्रिय पाइपलाइन'}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                  {contracts.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDashboardTab('vault')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeDashboardTab === 'vault'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-amber-400">inventory_2</span>
                <span>{lang === 'EN' ? 'Legal Vault' : 'विधिक वॉल्ट'}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-white">
                  {storedContracts.length}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenNewPakt}
              className="flex items-center gap-2 bg-[#ac2e00] hover:bg-[#d53e07] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>{lang === 'EN' ? 'New Agreement' : 'नया अनुबंध'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* RENDER COMPLETED CONTRACTS VAULT VIEW */}
      {activeDashboardTab === 'vault' ? (
        <CompletedContractsVault
          contracts={contracts}
          lang={lang}
          contractLanguage={contractLanguage}
          onClose={() => setActiveDashboardTab('pipeline')}
          onStoreContractInVault={onStoreContractInVault}
          onAddHistoryNote={onAddHistoryNote}
          onSelectContractForESign={onSelectContractForESign}
        />
      ) : (
        <>
          {/* EXECUTIVE KPI STRIP (4 Data Points) */}
          <section className="w-full mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {/* Card 1: Active Contracts */}
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {lang === 'EN' ? 'Total Agreements' : 'कुल अनुबंध'}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-400">folder_open</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
                    {contracts.length}
                  </span>
                  <span className="text-xs text-slate-500">
                    {lang === 'EN' ? 'under management' : 'प्रबंधित'}
                  </span>
                </div>
              </div>

              {/* Card 2: Pending Signatures */}
              <div className="bg-white rounded-xl p-4 border border-amber-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                    {lang === 'EN' ? 'Action Required' : 'कार्रवाई आवश्यक'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-amber-700 font-mono tabular-nums">
                    {pendingCount}
                  </span>
                  <span className="text-xs text-amber-800">
                    {lang === 'EN' ? 'awaiting your e-Sign' : 'ई-साइन प्रतीक्षित'}
                  </span>
                </div>
              </div>

              {/* Card 3: Under Review */}
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {lang === 'EN' ? 'In Negotiation' : 'समीक्षाधीन'}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-indigo-400">rate_review</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
                    {reviewCount}
                  </span>
                  <span className="text-xs text-slate-500">
                    {lang === 'EN' ? 'clause revisions' : 'धारा संशोधन'}
                  </span>
                </div>
              </div>

              {/* Card 4: Stored in Vault */}
              <div className="bg-white rounded-xl p-4 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                    {lang === 'EN' ? 'Vault Archived' : 'वॉल्ट में सुरक्षित'}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">lock</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-emerald-700 font-mono tabular-nums">
                    {storedContracts.length}
                  </span>
                  <span className="text-xs text-emerald-800">
                    {lang === 'EN' ? '§ 65B certified' : 'धारा ६५ख प्रमाणित'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* UNIFIED SEARCH, FILTER & LANGUAGE CONTROLS */}
          <section className="w-full mb-6">
            <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search Field */}
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
                      ? 'Search agreements by title, code, party, or category...'
                      : 'शीर्षक, कोड, पक्षकार या श्रेणी द्वारा अनुबंध खोजें...'
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

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {lang === 'EN' ? `All (${contracts.length})` : `सभी (${contracts.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('action')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeFilter === 'action'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {lang === 'EN' ? `Needs Action (${pendingCount})` : `कार्रवाई आवश्यक (${pendingCount})`}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('review')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeFilter === 'review'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {lang === 'EN' ? `In Review (${reviewCount})` : `समीक्षाधीन (${reviewCount})`}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('executed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeFilter === 'executed'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {lang === 'EN' ? `Executed (${executedCount})` : `निष्पादित (${executedCount})`}
                </button>
              </div>

              {/* Compact Contract Language Selector */}
              <div className="flex items-center gap-1.5 pl-0 lg:pl-3 lg:border-l lg:border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap hidden xl:inline">
                  {lang === 'EN' ? 'Doc Language:' : 'दस्तावेज़ भाषा:'}
                </span>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => onSelectContractLanguage && onSelectContractLanguage('en')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                      contractLanguage === 'en'
                        ? 'bg-white text-[#ac2e00] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectContractLanguage && onSelectContractLanguage('hi')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                      contractLanguage === 'hi'
                        ? 'bg-white text-[#ac2e00] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    हिन्दी
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectContractLanguage && onSelectContractLanguage('hinglish')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                      contractLanguage === 'hinglish'
                        ? 'bg-white text-[#ac2e00] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Hinglish
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* RESPONSIVE CONTRACTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            {filteredContracts.map((contract) => {
              const currentContractLang = getContractLang(contract.id);
              const localized = getLocalizedContract(contract, currentContractLang);
              const isPending = contract.status === 'pending_signature';
              const isExecuted = contract.status === 'executed';
              const isInReview = contract.status === 'in_review';

              return (
                <article
                  key={contract.id}
                  className={`bg-white rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                    isPending
                      ? 'border-amber-300/80 ring-1 ring-amber-100'
                      : isExecuted
                      ? 'border-slate-200/90'
                      : 'border-slate-200/90'
                  }`}
                >
                  {/* Top Row: Category, Code & Status */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                        <span className="uppercase font-semibold tracking-wider text-slate-700">
                          {contract.category}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-500 font-medium">{contract.code}</span>
                        {contract.storedInVault && (
                          <>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[13px]">lock</span>
                              <span>Vault Sealed</span>
                            </span>
                          </>
                        )}
                      </div>

                      {/* Clean Status Indicator */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            isPending
                              ? 'bg-amber-500 animate-pulse'
                              : isExecuted
                              ? 'bg-emerald-500'
                              : 'bg-indigo-500'
                          }`}
                        ></span>
                        <span
                          className={`text-xs font-semibold ${
                            isPending
                              ? 'text-amber-800'
                              : isExecuted
                              ? 'text-emerald-800'
                              : 'text-indigo-800'
                          }`}
                        >
                          {lang === 'EN' ? contract.statusLabelEn : contract.statusLabelHi}
                        </span>
                      </div>
                    </div>

                    {/* Contract Title */}
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight mb-2">
                      {localized.title}
                    </h2>

                    {/* Parties Line */}
                    <div className="text-xs text-slate-600 mb-3 flex items-start gap-1.5">
                      <span className="font-semibold text-slate-500 shrink-0">
                        {lang === 'EN' ? 'Parties:' : 'पक्षकार:'}
                      </span>
                      <span className="text-slate-800 font-medium leading-relaxed">
                        {localized.parties}
                      </span>
                    </div>

                    {/* Commercial Terms Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-3 font-mono">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-sans">
                          {lang === 'EN' ? 'Contract Value' : 'अनुबंध मूल्य'}
                        </span>
                        <span className="font-bold text-slate-900 tabular-nums">
                          {contract.remuneration || '₹24,00,000'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-sans">
                          {lang === 'EN' ? 'Stamp Duty' : 'स्टाम्प शुल्क'}
                        </span>
                        <span className="font-semibold text-slate-700">
                          {contract.stampDuty || '₹500 (e-SBTR)'}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-sans">
                          {lang === 'EN' ? 'Signatures' : 'हस्ताक्षर'}
                        </span>
                        <span className="font-semibold text-slate-700">
                          {isExecuted ? '3/3 Sealed' : isPending ? '2/3 Complete' : '1/3 Initiated'}
                        </span>
                      </div>
                    </div>

                    {/* Summary Context */}
                    {localized.summary && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                        {localized.summary}
                      </p>
                    )}

                    {/* Language Switcher per card */}
                    <div className="flex items-center justify-between text-xs py-1.5 border-t border-slate-100 text-slate-500 mb-3">
                      <span className="text-[11px]">
                        {lang === 'EN' ? 'Draft language:' : 'प्रारूप भाषा:'}
                      </span>
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <button
                          type="button"
                          onClick={() => setCardLang(contract.id, 'en')}
                          className={`px-2 py-0.5 rounded font-semibold transition-all ${
                            currentContractLang === 'en'
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          EN
                        </button>
                        <button
                          type="button"
                          onClick={() => setCardLang(contract.id, 'hi')}
                          className={`px-2 py-0.5 rounded font-semibold transition-all ${
                            currentContractLang === 'hi'
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          हिन्दी
                        </button>
                        <button
                          type="button"
                          onClick={() => setCardLang(contract.id, 'hinglish')}
                          className={`px-2 py-0.5 rounded font-semibold transition-all ${
                            currentContractLang === 'hinglish'
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          Hinglish
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Toolbar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    {/* Primary Action Button */}
                    <div className="flex-1 min-w-[140px]">
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectContractForESign) {
                              onSelectContractForESign(contract);
                            }
                            onNavigate('esign');
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-[#ac2e00] hover:bg-[#d53e07] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">draw</span>
                          <span>{lang === 'EN' ? 'Review & e-Sign' : 'समीक्षा व ई-साइन'}</span>
                        </button>
                      )}

                      {isExecuted && (
                        <button
                          type="button"
                          onClick={() => setActiveDashboardTab('vault')}
                          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px] text-amber-400">inventory_2</span>
                          <span>{lang === 'EN' ? 'Vault Dossier & History' : 'वॉल्ट डोजियर व इतिहास'}</span>
                        </button>
                      )}

                      {isInReview && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedClauseContract(contract);
                            setShowClauseModal(true);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">gavel</span>
                          <span>{lang === 'EN' ? 'Manage Clauses' : 'धाराएं प्रबंधित करें'}</span>
                        </button>
                      )}
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedClauseContract(contract);
                          setShowClauseModal(true);
                        }}
                        className="py-2 px-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all flex items-center gap-1"
                        title={lang === 'EN' ? 'Manage, Add, Edit or Discard Clauses' : 'धाराएं प्रबंधित करें'}
                      >
                        <span className="material-symbols-outlined text-[15px] text-[#ac2e00]">gavel</span>
                        <span>{(contract.clauses || []).length}</span>
                      </button>

                      {isExecuted && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCertificateContract(contract);
                            setShowCertificateModal(true);
                          }}
                          className="py-2 px-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all flex items-center gap-1"
                          title="Section 65B Certificate"
                        >
                          <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                          <span>§ 65B</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onNavigate('copilot')}
                        className="py-2 px-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all flex items-center gap-1"
                        title={lang === 'EN' ? 'AI Legal Copilot Review' : 'एआई विधिक समीक्षा'}
                      >
                        <span className="material-symbols-outlined text-[15px] text-amber-500">auto_awesome</span>
                        <span>AI</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleCopyHash(contract.sha256, e)}
                        className="py-2 px-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Copy SHA-256 Digest"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {copiedHash === contract.sha256 ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* VERIFY HELPER CALLOUT */}
          <section className="w-full mb-6">
            <div className="bg-slate-100/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-slate-900 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[20px] text-[#ac2e00]">qr_code_scanner</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {lang === 'EN' ? 'Need independent cryptographic proof verification?' : 'स्वतंत्र क्रिप्टोग्राफ़िक साक्ष्य सत्यापन की आवश्यकता है?'}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {lang === 'EN'
                      ? 'Drop any agreement SHA-256 hash or PDF to verify against the Polygon PoS Merkle tree.'
                      : 'पॉलीगॉन पीओएस मर्कल ट्री के विरुद्ध पुष्टि करने के लिए कोई भी SHA-256 हैश या पीडीएफ दर्ज करें।'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('verify')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
              >
                {lang === 'EN' ? 'Open Verify Terminal' : 'सत्यापन टर्मिनल खोलें'}
              </button>
            </div>
          </section>
        </>
      )}

      {/* Support Bot Floating Trigger */}
      {onOpenSupportBot && (
        <div className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40">
          <button
            type="button"
            onClick={onOpenSupportBot}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white pl-2.5 pr-4 py-2 rounded-full shadow-lg active:scale-95 transition-all duration-150 border border-slate-700"
          >
            <div className="w-6 h-6 rounded-full bg-[#ac2e00] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[14px]">smart_toy</span>
            </div>
            <span className="font-semibold text-xs tracking-tight">
              {lang === 'EN' ? 'PAKT AI Assistant' : 'पाक्ट एआई सहायक'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </button>
        </div>
      )}

      {/* Section 65B Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ac2e00] text-[22px]">verified</span>
                <h3 className="font-bold text-base text-slate-900">
                  {lang === 'EN' ? 'Certificate of Execution (§ 65B)' : 'निष्पादन प्रमाण पत्र (धारा ६५ख)'}
                </h3>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 flex flex-col gap-2.5 font-mono border border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[10px] font-sans uppercase">Agreement Title</span>
                <span className="font-bold text-slate-900 font-sans">
                  {selectedCertificateContract
                    ? getLocalizedContract(selectedCertificateContract, contractLanguage).title
                    : 'Master Software & IP Agreement'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-sans uppercase">Polygon Block Anchor</span>
                <span className="text-slate-800">Block #63,912,410 · Tx 0x8a9f4c91...3b12</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-sans uppercase">Stamp Duty Challan</span>
                <span className="text-slate-800">e-SBTR Challan: MH-2026-9812-PAKT</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-sans uppercase">Statutory Admissibility</span>
                <span className="text-emerald-700 font-bold font-sans">
                  {lang === 'EN'
                    ? 'ADMISSIBLE EVIDENCE UNDER INDIAN EVIDENCE ACT § 65B'
                    : 'भारतीय साक्ष्य अधिनियम धारा ६५ख के तहत वैध साक्ष्य'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowCertificateModal(false)}
              className="mt-5 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
            >
              {lang === 'EN' ? 'Dismiss' : 'बंद करें'}
            </button>
          </div>
        </div>
      )}

      {/* Clause Manager Modal */}
      {showClauseModal && selectedClauseContract && (
        <ClauseManagerModal
          isOpen={showClauseModal}
          onClose={() => {
            setShowClauseModal(false);
            setSelectedClauseContract(null);
          }}
          contract={
            contracts.find((c) => c.id === selectedClauseContract.id) || selectedClauseContract
          }
          lang={lang}
          contractLanguage={contractLanguage}
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
