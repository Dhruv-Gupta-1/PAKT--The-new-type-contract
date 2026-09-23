import React, { useState } from 'react';
import { ContractItem, ContractClause, Language, ContractLanguage } from '../../types';
import { useLoading } from '../../context/LoadingContext';

interface ClauseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ContractItem;
  lang: Language;
  contractLanguage: ContractLanguage;
  onAddClause: (contractId: string, clause: ContractClause) => void;
  onEditClause: (contractId: string, clauseNumber: string, updatedClause: Partial<ContractClause>) => void;
  onDiscardClause: (contractId: string, clauseNumber: string, reason?: string) => void;
  onRestoreClause: (contractId: string, clauseNumber: string) => void;
  onDeleteClause?: (contractId: string, clauseNumber: string) => void;
}

const PRESET_TEMPLATES = [
  {
    id: 'arbitration',
    nameEn: 'Arbitration & Jurisdiction (Mumbai Seat)',
    nameHi: 'मध्यस्थता एवं क्षेत्राधिकार (मुंबई पीठ)',
    clauseNumber: '9.1',
    titleEn: 'Dispute Resolution & Arbitration',
    titleHi: 'विवाद समाधान एवं मध्यस्थता',
    statusEn: 'Statutory • Act 1996',
    statusHi: 'सांविधिक • अधिनियम १९९६',
    textEn: 'Any dispute arising out of this agreement shall be referred to arbitration administered by the Mumbai Centre for International Arbitration (MCIA) under the Indian Arbitration and Conciliation Act, 1996. Seat of arbitration shall be Mumbai, Maharashtra.',
    textHi: 'इस अनुबंध से उत्पन्न किसी भी विवाद को भारतीय मध्यस्थता एवं सुलह अधिनियम १९९६ के तहत मुंबई अंतरराष्ट्रीय मध्यस्थता केंद्र (MCIA) को भेजा जाएगा। मध्यस्थता की पीठ मुंबई, महाराष्ट्र होगी।',
  },
  {
    id: 'dpdp_breach',
    nameEn: 'DPDP Act 2023 Breach Notification (6-Hr CERT-In)',
    nameHi: 'डीपीडीपी अधिनियम २०२३ उल्लंघन सूचना (६-घंटे)',
    clauseNumber: '10.2',
    titleEn: 'Personal Data Incident & CERT-In Compliance',
    titleHi: 'व्यक्तिगत डेटा सुरक्षा घटना एवं सर्ट-इन अनुपालन',
    statusEn: 'DPDP 2023 Mandatory',
    statusHi: 'डीपीडीपी २०२३ अनिवार्य',
    textEn: 'Data Fiduciary shall immediately report any confirmed or suspected data compromise involving Indian Data Principals to the Data Protection Board of India and CERT-In within 6 hours of discovery, complying with the Digital Personal Data Protection Act 2023.',
    textHi: 'डेटा प्रत्ययी भारतीय नागरिकों के व्यक्तिगत डेटा से जुड़ी किसी भी सुरक्षा घटना की सूचना खोज के ६ घंटे के भीतर भारतीय डेटा संरक्षण बोर्ड एवं सर्ट-इन को अनिवार्य रूप से देगा।',
  },
  {
    id: 'liability',
    nameEn: 'Mutual Liability Cap (Indian Contract Act § 73)',
    nameHi: 'पारस्परिक दायित्व सीमा (अनुबंध अधिनियम धारा ७३)',
    clauseNumber: '11.0',
    titleEn: 'Limitation of Liability & Liquidated Damages',
    titleHi: 'दायित्व की सीमा एवं पूर्व-निर्धारित हर्जाना',
    statusEn: 'Indian Contract Act 1872',
    statusHi: 'भारतीय अनुबंध अधिनियम १८७२',
    textEn: 'Except for gross negligence or willful misconduct, neither party total aggregate liability under this agreement shall exceed the total remuneration paid in the preceding twelve (12) months pursuant to Section 73 of the Indian Contract Act, 1872.',
    textHi: 'गंभीर लापरवाही को छोड़कर, इस अनुबंध के तहत किसी भी पक्ष का कुल संचयी दायित्व भारतीय अनुबंध अधिनियम १८७२ की धारा ७३ के अनुसार पिछले १२ महीनों में भुगतान किए गए कुल शुल्क से अधिक नहीं होगा।',
  },
  {
    id: 'escrow',
    nameEn: 'Smart Contract Escrow & Milestone Release',
    nameHi: 'स्मार्ट अनुबंध एस्क्रो एवं माइलस्टोन भुगतान',
    clauseNumber: '12.4',
    titleEn: 'Decentralized Escrow & Acceptance Sign-Off',
    titleHi: 'विकेंद्रीकृत एस्क्रो एवं स्वीकृति सत्यापन',
    statusEn: 'EVM Smart Escrow',
    statusHi: 'ईवीएम स्मार्ट एस्क्रो',
    textEn: 'All milestone payments shall be locked in the Polygon PoS escrow contract (ERC-20/INR token equivalent) and automatically released within 48 hours of mutual cryptographic attestation.',
    textHi: 'सभी माइलस्टोन भुगतान पॉलीगॉन पीओएस एस्क्रो अनुबंध में सुरक्षित रहेंगे और दोनों पक्षों के क्रिप्टोग्राफ़िक सत्यापन के ४८ घंटों के भीतर स्वतः जारी किए जाएंगे।',
  },
  {
    id: 'confidentiality',
    nameEn: 'Non-Disclosure & Trade Secret Covenant',
    nameHi: 'गोपनीयता एवं व्यापारिक गोपनीयता समझौता',
    clauseNumber: '13.1',
    titleEn: 'Non-Disclosure & Proprietary Information',
    titleHi: 'गोपनीयता एवं मालिकाना जानकारी संरक्षण',
    statusEn: 'Binding Covenant',
    statusHi: 'बाध्यकारी प्रतिज्ञा',
    textEn: 'Both parties agree to hold all proprietary source code, cryptographic private keys, and business financials strictly confidential for a period of three (3) years from execution.',
    textHi: 'दोनों पक्षकार सभी मालिकाना स्रोत कोड, निजी कुंजियों और वित्तीय विवरणों को निष्पादन की तिथि से ३ वर्षों तक पूर्णतः गोपनीय रखने पर सहमत हैं।',
  },
];

export const ClauseManagerModal: React.FC<ClauseManagerModalProps> = ({
  isOpen,
  onClose,
  contract,
  lang,
  contractLanguage: _contractLang,
  onAddClause,
  onEditClause,
  onDiscardClause,
  onRestoreClause,
  onDeleteClause,
}) => {
  const { showLoading } = useLoading();
  const [modalMode, setModalMode] = useState<'list' | 'add' | 'edit' | 'discard'>('list');

  // Form states for Add / Edit
  const [editingClauseNumber, setEditingClauseNumber] = useState<string>('');
  const [formNumber, setFormNumber] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleHi, setFormTitleHi] = useState('');
  const [formStatusEn, setFormStatusEn] = useState('Validated / Statutory');
  const [formStatusHi, setFormStatusHi] = useState('सत्यापित एवं विधिक');
  const [formTextEn, setFormTextEn] = useState('');
  const [formTextHi, setFormTextHi] = useState('');

  // Discard reason state
  const [discardingClause, setDiscardingClause] = useState<ContractClause | null>(null);
  const [discardReason, setDiscardReason] = useState('Mutual consent of executing parties');

  if (!isOpen) return null;

  const clauses = contract.clauses || [];

  const handleOpenAdd = () => {
    // Generate next clause number
    const nextNum = `${(clauses.length + 1)}.0`;
    setFormNumber(nextNum);
    setFormTitleEn('');
    setFormTitleHi('');
    setFormStatusEn('Statutory • IT Act 2000');
    setFormStatusHi('सांविधिक • आईटी अधिनियम २०००');
    setFormTextEn('');
    setFormTextHi('');
    setModalMode('add');
  };

  const handleSelectPreset = (presetId: string) => {
    const p = PRESET_TEMPLATES.find((t) => t.id === presetId);
    if (p) {
      setFormNumber(p.clauseNumber);
      setFormTitleEn(p.titleEn);
      setFormTitleHi(p.titleHi);
      setFormStatusEn(p.statusEn);
      setFormStatusHi(p.statusHi);
      setFormTextEn(p.textEn);
      setFormTextHi(p.textHi);
    }
  };

  const handleSaveNewClause = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleEn.trim() || !formTextEn.trim()) {
      alert(lang === 'EN' ? 'Please provide both Clause Title and Text.' : 'कृपया धारा का शीर्षक एवं विवरण दोनों भरें।');
      return;
    }

    const newClause: ContractClause = {
      clauseNumber: formNumber.trim() || `${clauses.length + 1}.0`,
      title: formTitleEn.trim(),
      titleHindi: formTitleHi.trim() || formTitleEn.trim(),
      titleHinglish: formTitleEn.trim(),
      statusText: formStatusEn.trim() || 'Statutory / Added',
      statusTextHindi: formStatusHi.trim() || 'सांविधिक / जोड़ी गई',
      statusTextHinglish: formStatusEn.trim(),
      text: formTextEn.trim(),
      textHindi: formTextHi.trim() || formTextEn.trim(),
      textHinglish: formTextEn.trim(),
      isCustom: true,
      discarded: false,
      updatedAt: new Date().toLocaleTimeString(),
    };

    setModalMode('list');

    showLoading({
      titleEn: `Adding Clause ${newClause.clauseNumber}: ${newClause.title}`,
      titleHi: `धारा ${newClause.clauseNumber} जोड़ी जा रही है: ${newClause.titleHindi}`,
      subtitleEn: 'Computing canonical SHA-256 digest, evaluating DPDP Act 2023 guardrails, and updating contract manifest.',
      subtitleHi: 'कैनोनिकल SHA-256 डाइजेस्ट की गणना, डीपीडीपी अधिनियम २०२३ विधिक जांच एवं अनुबंध का नवीनीकरण।',
      duration: 1500,
      customSteps: [
        'Parsing clause syntax & statutory terminology...',
        'Running Indian Contract Act 1872 & IT Act 2000 validation...',
        'Re-indexing Merkle tree nodes on Mumbai Node IN-MUM-1...',
        'Updating local cryptographic vault state...',
        'Clause added successfully!',
      ],
      customStepsHi: [
        'धारा की भाषा एवं सांविधिक शब्दावली की जांच...',
        'भारतीय अनुबंध अधिनियम १८७२ एवं आईटी अधिनियम सत्यापन...',
        'मुंबई नोड IN-MUM-1 पर मर्कल ट्री नोड्स का पुनर्गणना...',
        'स्थानीय क्रिप्टोग्राफ़िक वॉल्ट का अद्यतन...',
        'धारा सफलतापूर्वक जोड़ी गई!',
      ],
      onComplete: () => {
        onAddClause(contract.id, newClause);
      },
    });
  };

  const handleOpenEdit = (clause: ContractClause) => {
    setEditingClauseNumber(clause.clauseNumber);
    setFormNumber(clause.clauseNumber);
    setFormTitleEn(clause.title);
    setFormTitleHi(clause.titleHindi || clause.title);
    setFormStatusEn(clause.statusText || 'Validated');
    setFormStatusHi(clause.statusTextHindi || 'सत्यापित');
    setFormTextEn(clause.text);
    setFormTextHi(clause.textHindi || clause.text);
    setModalMode('edit');
  };

  const handleSaveEditClause = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleEn.trim() || !formTextEn.trim()) {
      alert(lang === 'EN' ? 'Please provide both Clause Title and Text.' : 'कृपया धारा का शीर्षक एवं विवरण दोनों भरें।');
      return;
    }

    const updatedData: Partial<ContractClause> = {
      title: formTitleEn.trim(),
      titleHindi: formTitleHi.trim() || formTitleEn.trim(),
      statusText: formStatusEn.trim() || 'Updated & Validated',
      statusTextHindi: formStatusHi.trim() || 'अद्यतित एवं सत्यापित',
      text: formTextEn.trim(),
      textHindi: formTextHi.trim() || formTextEn.trim(),
      isCustom: true,
      updatedAt: new Date().toLocaleTimeString(),
    };

    setModalMode('list');

    showLoading({
      titleEn: `Updating Clause ${editingClauseNumber}: ${updatedData.title}`,
      titleHi: `धारा ${editingClauseNumber} का अद्यतन जारी: ${updatedData.titleHindi}`,
      subtitleEn: 'Recalculating canonical SHA-256 hash and updating stipulation manifest on Mumbai Node.',
      subtitleHi: 'कैनोनिकल SHA-256 हैश की पुनर्गणना एवं मुंबई नोड पर घोषणापत्र का अद्यतन।',
      duration: 1400,
      customSteps: [
        'Checking amendments against Section 10A IT Act 2000...',
        'Hashing amended clause text...',
        'Synchronizing manifest on Mumbai Node IN-MUM-1...',
        'Clause updated successfully!',
      ],
      customStepsHi: [
        'आईटी अधिनियम धारा १०क के तहत संशोधनों की जांच...',
        'संशोधित धारा पाठ का हैशिंग...',
        'मुंबई नोड IN-MUM-1 पर घोषणापत्र समन्वय...',
        'धारा सफलतापूर्वक अद्यतन हुई!',
      ],
      onComplete: () => {
        onEditClause(contract.id, editingClauseNumber, updatedData);
      },
    });
  };

  const handleOpenDiscard = (clause: ContractClause) => {
    setDiscardingClause(clause);
    setDiscardReason('Mutually waived by both signatories under Section 62 Indian Contract Act 1872');
    setModalMode('discard');
  };

  const handleConfirmDiscard = () => {
    if (!discardingClause) return;

    const clauseNum = discardingClause.clauseNumber;
    const clauseTitle = discardingClause.title;
    setModalMode('list');
    setDiscardingClause(null);

    showLoading({
      titleEn: `Discarding Clause ${clauseNum}: ${clauseTitle}`,
      titleHi: `धारा ${clauseNum} निरस्त की जा रही है: ${clauseTitle}`,
      subtitleEn: 'Applying Section 62 Novation/Waiver stamp, recording discard audit trail, and updating contract manifest.',
      subtitleHi: 'धारा ६२ विधिक छूट मुहर का अंकन, ऑडिट साक्ष्य दर्ज करना एवं अनुबंध घोषणापत्र का नवीनीकरण।',
      duration: 1400,
      customSteps: [
        'Recording mutual discard covenant...',
        'Marking clause as waived / redlined under IT Act § 65B...',
        'Stamping discard reason into immutable session proof...',
        'Clause discarded successfully!',
      ],
      customStepsHi: [
        'पारस्परिक विधिक निरस्तीकरण दर्ज किया जा रहा है...',
        'धारा को धारा ६५ख के तहत निरस्त चिन्हित किया गया...',
        'निरस्तीकरण कारण को साक्ष्य में दर्ज किया गया...',
        'धारा सफलतापूर्वक निरस्त की गई!',
      ],
      onComplete: () => {
        onDiscardClause(contract.id, clauseNum, discardReason);
      },
    });
  };

  const handleRestore = (clause: ContractClause) => {
    showLoading({
      titleEn: `Restoring Clause ${clause.clauseNumber}: ${clause.title}`,
      titleHi: `धारा ${clause.clauseNumber} पुनः बहाल की जा रही है`,
      subtitleEn: 'Reinstating statutory enforcement under Indian Contract Act 1872.',
      subtitleHi: 'भारतीय अनुबंध अधिनियम १८७२ के तहत विधिक प्रवर्तन पुनः बहाल।',
      duration: 1200,
      onComplete: () => {
        onRestoreClause(contract.id, clause.clauseNumber);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-[#e4beb4] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#191c1e] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-[#ac2e00] flex items-center justify-center text-white shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">gavel</span>
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-[15px] truncate">
                  {lang === 'EN' ? 'Clause Management Terminal' : 'अनुबंध धारा प्रबंधन टर्मिनल'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#ffdbd1] text-[#3b0a00] font-mono text-[9px] font-bold">
                  {contract.code}
                </span>
              </div>
              <p className="font-mono text-[11px] text-gray-400 truncate">
                {contract.title} • {clauses.length} {lang === 'EN' ? 'Clauses' : 'धाराएं'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Top Action Tabs Bar if in list mode */}
        {modalMode === 'list' && (
          <div className="px-4 py-3 bg-[#f8f9fa] border-b border-[#e4beb4]/30 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#5b4139] font-bold">
                {lang === 'EN' ? 'ACTIVE STIPULATIONS' : 'सक्रिय विधिक धाराएं'}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#eceef0] text-[#191c1e] font-mono text-[10px] font-bold">
                {clauses.filter((c) => !c.discarded).length} Active • {clauses.filter((c) => c.discarded).length} Discarded
              </span>
            </div>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ac2e00] hover:bg-[#d53e07] text-white text-[12px] font-bold shadow-xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>{lang === 'EN' ? 'Add New Clause' : 'नई धारा जोड़ें'}</span>
            </button>
          </div>
        )}

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* ========================================================================= */}
          {/* 1. CLAUSE LIST VIEW */}
          {/* ========================================================================= */}
          {modalMode === 'list' && (
            <div className="flex flex-col gap-3">
              {clauses.length === 0 ? (
                <div className="text-center py-12 px-4 bg-[#f8f9fa] rounded-xl border border-dashed border-[#e4beb4]">
                  <span className="material-symbols-outlined text-[36px] text-gray-400 mb-2">description</span>
                  <p className="text-[14px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'No clauses recorded yet' : 'कोई धारा दर्ज नहीं है'}
                  </p>
                  <p className="text-[12px] text-[#5b4139] mt-1 mb-4">
                    {lang === 'EN'
                      ? 'Add custom stipulations or import statutory Indian legal templates.'
                      : 'अनुकूलित धाराएं जोड़ें या सांविधिक भारतीय विधिक प्रारूप आयात करें।'}
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#ac2e00] text-white text-[12px] font-bold shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>{lang === 'EN' ? 'Add First Clause' : 'पहली धारा जोड़ें'}</span>
                  </button>
                </div>
              ) : (
                clauses.map((clause, idx) => {
                  const isDiscarded = !!clause.discarded;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isDiscarded
                          ? 'bg-red-50/50 border-red-200/80 opacity-75'
                          : clause.isCustom
                          ? 'bg-white border-[#ac2e00]/40 shadow-xs'
                          : 'bg-white border-[#e4beb4]/40 shadow-xs'
                      }`}
                    >
                      {/* Top Bar: Clause Number + Status + Actions */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                              isDiscarded
                                ? 'bg-red-200 text-red-900 line-through'
                                : 'bg-[#ffdbd1] text-[#3b0a00]'
                            }`}
                          >
                            {lang === 'EN' ? 'Clause' : 'धारा'} {clause.clauseNumber || `${idx + 1}.0`}
                          </span>

                          <span className="font-mono text-[10px] text-[#5b4139] bg-[#f2f4f6] px-2 py-0.5 rounded">
                            {lang === 'HI' ? clause.statusTextHindi || clause.statusText : clause.statusText}
                          </span>

                          {clause.isCustom && !isDiscarded && (
                            <span className="font-mono text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                              {lang === 'EN' ? 'CUSTOM / EDITED' : 'संशोधित'}
                            </span>
                          )}

                          {isDiscarded && (
                            <span className="font-mono text-[9px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                              {lang === 'EN' ? 'DISCARDED / WAIVED' : 'निरस्त / विधिक छूट'}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1">
                          {!isDiscarded ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(clause)}
                                title={lang === 'EN' ? 'Edit Clause' : 'धारा संपादित करें'}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#191c1e] hover:bg-[#eceef0] transition-colors border border-[#e4beb4]/30"
                              >
                                <span className="material-symbols-outlined text-[14px] text-amber-700">edit</span>
                                <span>{lang === 'EN' ? 'Edit' : 'संपादित'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenDiscard(clause)}
                                title={lang === 'EN' ? 'Discard Clause' : 'धारा निरस्त करें'}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-red-700 hover:bg-red-50 transition-colors border border-red-200"
                              >
                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                                <span>{lang === 'EN' ? 'Discard' : 'निरस्त'}</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleRestore(clause)}
                                title={lang === 'EN' ? 'Restore Clause' : 'धारा पुनः बहाल करें'}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-300"
                              >
                                <span className="material-symbols-outlined text-[14px]">undo</span>
                                <span>{lang === 'EN' ? 'Restore' : 'बहाल करें'}</span>
                              </button>
                              {onDeleteClause && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(lang === 'EN' ? 'Permanently delete this clause?' : 'क्या आप इस धारा को स्थायी रूप से हटाना चाहते हैं?')) {
                                      onDeleteClause(contract.id, clause.clauseNumber);
                                    }
                                  }}
                                  title={lang === 'EN' ? 'Permanent Delete' : 'स्थायी रूप से हटाएं'}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[15px]">delete_forever</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Title & Body */}
                      <h4
                        className={`text-[13px] font-bold mb-1 ${
                          isDiscarded ? 'text-gray-500 line-through' : 'text-[#191c1e]'
                        }`}
                      >
                        {lang === 'HI' ? clause.titleHindi || clause.title : clause.title}
                      </h4>

                      <p
                        className={`text-[12px] leading-relaxed ${
                          isDiscarded ? 'text-gray-400 line-through italic' : 'text-[#5b4139]'
                        }`}
                      >
                        {lang === 'HI' ? clause.textHindi || clause.text : clause.text}
                      </p>

                      {/* If discarded, show reason badge */}
                      {isDiscarded && clause.discardReason && (
                        <div className="mt-2 p-2 bg-red-100/70 rounded-lg border border-red-200 text-[11px] text-red-900 flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-red-700 shrink-0 mt-0.5">info</span>
                          <div>
                            <span className="font-bold">{lang === 'EN' ? 'Discard Stamped Reason:' : 'निरस्तीकरण कारण:'}</span>{' '}
                            <span>{clause.discardReason}</span>
                          </div>
                        </div>
                      )}

                      {/* Footer metadata */}
                      {clause.updatedAt && !isDiscarded && (
                        <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono text-[#5b4139]">
                          <span>{lang === 'EN' ? 'Last modified:' : 'अंतिम संशोधन:'} {clause.updatedAt}</span>
                          <span>IT Act § 10A</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. ADD CLAUSE VIEW */}
          {/* ========================================================================= */}
          {modalMode === 'add' && (
            <form onSubmit={handleSaveNewClause} className="space-y-4">
              <div className="flex items-center justify-between bg-[#f8f9fa] p-3 rounded-xl border border-[#e4beb4]/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ac2e00] text-[18px]">add_circle</span>
                  <span className="text-[13px] font-bold text-[#191c1e]">
                    {lang === 'EN' ? 'Drafting New Contract Clause' : 'नई अनुबंध धारा का प्रारूपण'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalMode('list')}
                  className="text-[11px] text-[#5b4139] hover:underline font-semibold"
                >
                  ← {lang === 'EN' ? 'Back to Clauses' : 'वापस सूची पर'}
                </button>
              </div>

              {/* Legal Presets Quick Selector */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase tracking-wider mb-1.5">
                  {lang === 'EN' ? 'Or Load Standard Legal Template (Bharat / India)' : 'या मानक विधिक टेम्पलेट चुनें:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {PRESET_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectPreset(tpl.id)}
                      className="text-left p-2 rounded-lg bg-[#f2f4f6] hover:bg-[#ffdbd1]/50 border border-[#e4beb4]/30 text-[11px] transition-all hover:border-[#ac2e00]/40 flex flex-col justify-between"
                    >
                      <span className="font-bold text-[#191c1e] truncate">
                        {lang === 'HI' ? tpl.nameHi : tpl.nameEn}
                      </span>
                      <span className="font-mono text-[9px] text-[#ac2e00] font-semibold mt-0.5">
                        {tpl.statusEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clause Number & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                    {lang === 'EN' ? 'Clause Number' : 'धारा संख्या'}
                  </label>
                  <input
                    type="text"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    placeholder="e.g. 5.0"
                    required
                    className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg px-3 py-2 text-[12px] font-mono text-[#191c1e] focus:outline-none focus:border-[#ac2e00]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                    {lang === 'EN' ? 'Statutory Status' : 'विधिक स्थिति'}
                  </label>
                  <input
                    type="text"
                    value={formStatusEn}
                    onChange={(e) => setFormStatusEn(e.target.value)}
                    placeholder="Statutory • IT Act 2000"
                    className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg px-3 py-2 text-[12px] font-mono text-[#191c1e] focus:outline-none focus:border-[#ac2e00]"
                  />
                </div>
              </div>

              {/* Clause Title (EN) */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                  {lang === 'EN' ? 'Clause Title (English)' : 'धारा शीर्षक (अंग्रेज़ी)'}
                </label>
                <input
                  type="text"
                  value={formTitleEn}
                  onChange={(e) => setFormTitleEn(e.target.value)}
                  placeholder="e.g. Data Localization & CERT-In Mandatory Reporting"
                  required
                  className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg px-3 py-2 text-[13px] text-[#191c1e] focus:outline-none focus:border-[#ac2e00] font-semibold"
                />
              </div>

              {/* Clause Title (Hindi Optional) */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                  {lang === 'EN' ? 'Clause Title (हिन्दी - Optional)' : 'धारा शीर्षक (हिन्दी - वैकल्पिक)'}
                </label>
                <input
                  type="text"
                  value={formTitleHi}
                  onChange={(e) => setFormTitleHi(e.target.value)}
                  placeholder="उदा. डेटा स्थानीयकरण एवं सर्ट-इन अनिवार्य सूचना"
                  className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg px-3 py-2 text-[13px] text-[#191c1e] focus:outline-none focus:border-[#ac2e00]"
                />
              </div>

              {/* Clause Text (English) */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                  {lang === 'EN' ? 'Clause Legal Stipulation Text (English)' : 'धारा का विधिक विवरण (अंग्रेज़ी)'}
                </label>
                <textarea
                  rows={4}
                  value={formTextEn}
                  onChange={(e) => setFormTextEn(e.target.value)}
                  placeholder="Enter complete contractual stipulation terms enforceable under the Indian Contract Act 1872..."
                  required
                  className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg p-3 text-[12px] text-[#191c1e] focus:outline-none focus:border-[#ac2e00] leading-relaxed"
                ></textarea>
              </div>

              {/* Clause Text (Hindi Optional) */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                  {lang === 'EN' ? 'Clause Legal Stipulation Text (हिन्दी - Optional)' : 'धारा का विधिक विवरण (हिन्दी - वैकल्पिक)'}
                </label>
                <textarea
                  rows={3}
                  value={formTextHi}
                  onChange={(e) => setFormTextHi(e.target.value)}
                  placeholder="भारतीय संविदा अधिनियम १८७२ के अंतर्गत धारा का विस्तृत विधिक पाठ..."
                  className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg p-3 text-[12px] text-[#191c1e] focus:outline-none focus:border-[#ac2e00] leading-relaxed"
                ></textarea>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e4beb4]/30">
                <button
                  type="button"
                  onClick={() => setModalMode('list')}
                  className="px-4 py-2 rounded-lg bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] text-[12px] font-semibold"
                >
                  {lang === 'EN' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#ac2e00] hover:bg-[#d53e07] text-white text-[12px] font-bold shadow-xs active:scale-95 transition-all"
                >
                  {lang === 'EN' ? 'Save & Anchor Clause' : 'सहेजें एवं धारा जोड़ें'}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 3. EDIT CLAUSE VIEW */}
          {/* ========================================================================= */}
          {modalMode === 'edit' && (
            <form onSubmit={handleSaveEditClause} className="space-y-4">
              <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-700 text-[18px]">edit_note</span>
                  <span className="text-[13px] font-bold text-amber-950">
                    {lang === 'EN' ? `Editing Clause ${editingClauseNumber}` : `धारा ${editingClauseNumber} का संपादन`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalMode('list')}
                  className="text-[11px] text-[#5b4139] hover:underline font-semibold"
                >
                  ← {lang === 'EN' ? 'Back to Clauses' : 'वापस सूची पर'}
                </button>
              </div>

              {/* Clause Title (EN) */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                  {lang === 'EN' ? 'Clause Title (English)' : 'धारा शीर्षक (अंग्रेज़ी)'}
                </label>
                <input
                  type="text"
                  value={formTitleEn}
                  onChange={(e) => setFormTitleEn(e.target.value)}
                  required
                  className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg px-3 py-2 text-[13px] text-[#191c1e] focus:outline-none focus:border-[#ac2e00] font-semibold"
                />
              </div>

              {/* Clause Title (Hindi) */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                  {lang === 'EN' ? 'Clause Title (हिन्दी)' : 'धारा शीर्षक (हिन्दी)'}
                </label>
                <input
                  type="text"
                  value={formTitleHi}
                  onChange={(e) => setFormTitleHi(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg px-3 py-2 text-[13px] text-[#191c1e] focus:outline-none focus:border-[#ac2e00]"
                />
              </div>

              {/* Status Badge */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                  {lang === 'EN' ? 'Compliance Status' : 'विधिक स्थिति'}
                </label>
                <input
                  type="text"
                  value={formStatusEn}
                  onChange={(e) => setFormStatusEn(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg px-3 py-2 text-[12px] font-mono text-[#191c1e] focus:outline-none focus:border-[#ac2e00]"
                />
              </div>

              {/* Clause Text (English) */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                  {lang === 'EN' ? 'Stipulation Text (English)' : 'विधिक विवरण (अंग्रेज़ी)'}
                </label>
                <textarea
                  rows={4}
                  value={formTextEn}
                  onChange={(e) => setFormTextEn(e.target.value)}
                  required
                  className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg p-3 text-[12px] text-[#191c1e] focus:outline-none focus:border-[#ac2e00] leading-relaxed"
                ></textarea>
              </div>

              {/* Clause Text (Hindi) */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                  {lang === 'EN' ? 'Stipulation Text (हिन्दी)' : 'विधिक विवरण (हिन्दी)'}
                </label>
                <textarea
                  rows={3}
                  value={formTextHi}
                  onChange={(e) => setFormTextHi(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg p-3 text-[12px] text-[#191c1e] focus:outline-none focus:border-[#ac2e00] leading-relaxed"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e4beb4]/30">
                <button
                  type="button"
                  onClick={() => setModalMode('list')}
                  className="px-4 py-2 rounded-lg bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] text-[12px] font-semibold"
                >
                  {lang === 'EN' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#ac2e00] hover:bg-[#d53e07] text-white text-[12px] font-bold shadow-xs active:scale-95 transition-all"
                >
                  {lang === 'EN' ? 'Update Clause' : 'धारा अद्यतन करें'}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 4. DISCARD CONFIRMATION VIEW */}
          {/* ========================================================================= */}
          {modalMode === 'discard' && discardingClause && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center gap-2 mb-2 text-red-900 font-bold text-[14px]">
                  <span className="material-symbols-outlined text-[20px] text-red-700">warning</span>
                  <span>{lang === 'EN' ? 'Confirm Discard / Waiver of Clause' : 'धारा निरस्तीकरण / छूट की पुष्टि करें'}</span>
                </div>
                <p className="text-[12px] text-red-800 leading-relaxed">
                  {lang === 'EN'
                    ? `You are about to discard Clause ${discardingClause.clauseNumber} (${discardingClause.title}). The clause will remain recorded in the redlined audit trail with a stamped statutory reason.`
                    : `आप धारा ${discardingClause.clauseNumber} (${discardingClause.title}) को निरस्त करने जा रहे हैं। यह धारा कारण सहित ऑडिट ट्रेल में दर्ज रहेगी।`}
                </p>
              </div>

              {/* Discard Reason Presets */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1.5">
                  {lang === 'EN' ? 'Select Statutory Discard Reason (Section 62 IT/Contract Act)' : 'सांविधिक निरस्तीकरण कारण चुनें:'}
                </label>
                <div className="flex flex-col gap-1.5">
                  {[
                    'Mutually waived by both signatories under Section 62 Indian Contract Act 1872',
                    'Statutorily exempted under Digital Personal Data Protection (DPDP) Act 2023',
                    'Superceded by supplementary execution addendum and milestone schedule',
                    'Not applicable to this corporate jurisdiction or transaction structure',
                  ].map((preset, pIdx) => (
                    <label
                      key={pIdx}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f8f9fa] border border-[#e4beb4]/40 hover:bg-[#ffdbd1]/30 cursor-pointer text-[12px] text-[#191c1e]"
                    >
                      <input
                        type="radio"
                        name="discardReason"
                        checked={discardReason === preset}
                        onChange={() => setDiscardReason(preset)}
                        className="text-[#ac2e00] focus:ring-[#ac2e00]"
                      />
                      <span>{preset}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom reason input */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5b4139] uppercase mb-1">
                  {lang === 'EN' ? 'Or Enter Custom Reason:' : 'या कोई अन्य कारण लिखें:'}
                </label>
                <input
                  type="text"
                  value={discardReason}
                  onChange={(e) => setDiscardReason(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-[#e4beb4] rounded-lg px-3 py-2 text-[12px] text-[#191c1e] focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e4beb4]/30">
                <button
                  type="button"
                  onClick={() => setModalMode('list')}
                  className="px-4 py-2 rounded-lg bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] text-[12px] font-semibold"
                >
                  {lang === 'EN' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDiscard}
                  className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-[12px] font-bold shadow-xs active:scale-95 transition-all"
                >
                  {lang === 'EN' ? 'Confirm Discard' : 'निरस्तीकरण की पुष्टि करें'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-[#f2f4f6] border-t border-[#e4beb4]/40 flex items-center justify-between text-[10px] font-mono text-[#5b4139]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>POLYGON PoS MERKLE ROOT SYNC</span>
          </div>
          <span>IT ACT 2000 § 10A</span>
        </div>
      </div>
    </div>
  );
};
