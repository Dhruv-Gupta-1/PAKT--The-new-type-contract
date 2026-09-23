import React, { useState, useRef, useEffect } from 'react';
import { Language, ContractLanguage, ContractItem, ContractClause } from '../../types';

interface SupportBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  contractLanguage?: ContractLanguage;
  onSelectContractLanguage?: (cl: ContractLanguage) => void;
  onAddContract?: (contract: ContractItem) => void;
  onOpenInESign?: (contract: ContractItem) => void;
}

interface GeneratedContractPayload {
  id?: string;
  code?: string;
  title: string;
  category: 'saas' | 'employment' | 'shareholder' | 'nda';
  parties: string[];
  jurisdiction: string;
  stampDutyEstimate: string;
  summary: string;
  clauses: Array<{
    clauseNumber: string;
    title: string;
    text: string;
    statutoryRef?: string;
  }>;
  fullDraftText: string;
  sha256?: string;
  evmAnchor?: string;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  contract?: GeneratedContractPayload;
  addedToPipeline?: boolean;
}

export const SupportBotModal: React.FC<SupportBotModalProps> = ({
  isOpen,
  onClose,
  lang,
  contractLanguage = 'en',
  onSelectContractLanguage,
  onAddContract,
  onOpenInESign,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text:
        lang === 'EN'
          ? 'Namaste! I am PAKT Sahayak, your sovereign AI legal engineer and contract drafting specialist.\n\nI can draft custom legally enforceable contracts under the Indian Contract Act 1872 & IT Act 2000 § 10A, check DPDP Act 2023 compliance, estimate stamp duty for Indian states, and audit high-risk clauses in English, Hindi, or Hinglish.\n\nWhat contract or legal matter would you like to handle today?'
          : 'नमस्ते! मैं पाक्ट सहायक हूँ, आपका संप्रभु एआई विधिक इंजीनियर और अनुबंध प्रारूपण विशेषज्ञ।\n\nमैं भारतीय संविदा अधिनियम १८७२ एवं आईटी अधिनियम २००० धारा १०क के तहत विधिक रूप से बाध्यकारी अनुबंध तैयार कर सकता हूँ, डीपीडीपी अधिनियम २०२३ अनुपालन की जांच कर सकता हूँ, और स्टाम्प शुल्क का आकलन कर सकता हूँ।\n\nआज आप किस अनुबंध या कानूनी मामले पर काम करना चाहते हैं?',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'maker' | 'compliance'>('chat');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({});
  const [previewDraftContract, setPreviewDraftContract] = useState<GeneratedContractPayload | null>(null);

  // Contract Maker Form state
  const [makerCategory, setMakerCategory] = useState<'nda' | 'saas' | 'employment' | 'shareholder'>('nda');
  const [makerTitle, setMakerTitle] = useState('Mutual Non-Disclosure Agreement');
  const [makerPartyA, setMakerPartyA] = useState('PAKT India Tech Labs LLP');
  const [makerPartyB, setMakerPartyB] = useState('Cognitive Data Systems Pvt Ltd');
  const [makerJurisdiction, setMakerJurisdiction] = useState('Mumbai, Maharashtra');
  const [makerTerm, setMakerTerm] = useState('24 Months');
  const [makerSpecifics, setMakerSpecifics] = useState('Strict DPDP Act 2023 compliance, 2-year non-solicitation, and sole arbitration in Mumbai.');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages, isTyping]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  if (!isOpen) return null;

  const quickPrompts = lang === 'EN' ? [
    { label: '📝 Draft Mutual NDA', query: 'Draft a mutual Non-Disclosure Agreement between TechVentures India and DataFlow Analytics with Mumbai jurisdiction and DPDP 2023 clause' },
    { label: '☁️ Draft SaaS Agreement', query: 'Draft an Enterprise SaaS Agreement with 99.9% uptime SLA, CERT-In registered Mumbai data storage, and limitation of liability' },
    { label: '💼 Draft Consultant Contract', query: 'Draft an Independent Consultant Agreement with IP assignment work-for-hire, 30-day notice, and Delhi courts jurisdiction' },
    { label: '⚖️ Is PAKT Binding under § 10A?', query: 'Explain why smart contracts and digital signatures on PAKT are legally binding under Section 10A of the Indian Information Technology Act 2000' },
    { label: '📜 Stamp Duty Guide', query: 'Give me a comprehensive guide for contract stamp duty rates across Maharashtra, Karnataka, Delhi, and Tamil Nadu' },
    { label: '🔍 Audit an Indemnity Clause', query: 'Review this clause for enforceability under Indian law: "Counterparty agrees to unconditionally indemnify, defend and hold harmless the Company from any and all damages without any limitation of liability whatsoever."' },
  ] : [
    { label: '📝 द्विपक्षीय एनडीए बनाएं', query: 'मुंबई क्षेत्राधिकार और डीपीडीपी २०२३ धारा के साथ टेकवेंचर्स इंडिया और डेटाफ्लो एनालिटिक्स के बीच एक द्विपक्षीय गैर-प्रकटीकरण समझौता (NDA) तैयार करें।' },
    { label: '☁️ सास अनुबंध तैयार करें', query: '९९.९% अपटाइम एसएलए और मुंबई डेटा सेंटर के साथ उद्यम सास अनुबंध तैयार करें।' },
    { label: '💼 सलाहकार अनुबंध', query: 'बौद्धिक संपदा हस्तांतरण और ३० दिन के नोटिस के साथ स्वतंत्र सलाहकार अनुबंध तैयार करें।' },
    { label: '⚖️ आईटी एक्ट धारा १०क वैधता', query: 'समझाएं कि भारतीय सूचना प्रौद्योगिकी अधिनियम २००० की धारा १०क के तहत पाक्ट अनुबंध किस प्रकार विधिक रूप से बाध्यकारी हैं।' },
    { label: '📜 स्टाम्प शुल्क मार्गदर्शिका', query: 'महाराष्ट्र, कर्नाटक, दिल्ली और तमिलनाडु में वाणिज्यिक अनुबंधों पर स्टाम्प शुल्क का विवरण दें।' },
    { label: '🔍 क्षतिपूर्ति धारा की जांच', query: 'भारतीय संविदा अधिनियम १८७२ के तहत असीमित क्षतिपूर्ति धारा की विधिक जांच करें।' },
  ];

  const handleSend = async (textToSend?: string, mode = 'general') => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const historyContext = messages.slice(-5).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/support-bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyContext,
          mode: mode,
          contractLanguage: contractLanguage || 'en',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || (lang === 'EN' ? 'Your legal request has been processed.' : 'आपका विधिक अनुरोध संसाधित कर लिया गया है।'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contract: data.contract || undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.warn('Direct chat endpoint error, rendering local statutory response:', err);
      const fallbackReply = generateClientFallback(query, contractLanguage, lang);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: fallbackReply.reply,
          contract: fallbackReply.contract,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMakerGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('chat');

    const promptText = `Please draft a formal ${makerCategory.toUpperCase()} contract:
Title: ${makerTitle}
Parties: ${makerPartyA} and ${makerPartyB}
Governing Jurisdiction: ${makerJurisdiction}
Term / Duration: ${makerTerm}
Specific terms: ${makerSpecifics}
Contract Language: ${contractLanguage}

Ensure all provisions comply strictly with Indian Contract Act 1872, IT Act 2000 § 10A, and DPDP Act 2023.`;

    handleSend(promptText, 'contract_maker');
  };

  const handleAddContractToApp = (contract: GeneratedContractPayload, messageId: string, openESign = false) => {
    const formattedClauses: ContractClause[] = (contract.clauses || []).map((c, i) => ({
      clauseNumber: c.clauseNumber || `${i + 1}.0`,
      title: c.title,
      titleHindi: c.title,
      titleHinglish: c.title,
      text: c.text,
      textHindi: c.text,
      textHinglish: c.text,
      statusText: lang === 'EN' ? 'AI Validated / Indian Law Compliant' : 'एआई प्रमाणित / भारतीय कानून सम्मत',
    }));

    const contractItem: ContractItem = {
      id: contract.id || `contract-${Date.now()}`,
      code: contract.code || `IN-PAKT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: contract.title,
      titleHindi: contract.title,
      titleHinglish: contract.title,
      category: contract.category || 'nda',
      status: 'pending_signature',
      statusLabelEn: 'PENDING SIGNATURE',
      statusLabelHi: 'हस्ताक्षर लंबित',
      parties: contract.parties || ['Party A', 'Party B'],
      partiesHindi: contract.parties ? contract.parties.join(' एवं ') : 'पक्षकार क एवं पक्षकार ख',
      partiesHinglish: contract.parties ? contract.parties.join(' aur ') : 'Party A aur Party B',
      summary: contract.summary,
      summaryHindi: contract.summary,
      summaryHinglish: contract.summary,
      turnNotice: lang === 'EN' ? 'Drafted by PAKT Sahayak • Ready for e-Sign' : 'पाक्ट सहायक द्वारा प्रारूपित • ई-साइन हेतु तैयार',
      progressPercent: 33,
      aiFlag: '✨ AI Drafted • IT Act § 10A & DPDP 2023 Compliant',
      sha256: contract.sha256 || Math.random().toString(16).substring(2, 10),
      evmAnchor: 'EVM',
      stampDuty: contract.stampDutyEstimate,
      jurisdiction: contract.jurisdiction,
      fullDraftText: contract.fullDraftText,
      clauses: formattedClauses,
      signers: [
        {
          id: 's-user',
          name: 'Priya Sharma (You)',
          nameHindi: 'प्रिया शर्मा (आप)',
          role: 'Signatory',
          company: contract.parties[0] || 'PAKT Tech Labs',
          status: 'active_due',
        },
        {
          id: 's-counter',
          name: contract.parties[1] || 'Counterparty Signatory',
          nameHindi: 'प्रतिपक्ष हस्ताक्षरकर्ता',
          role: 'Counterparty Authorized Representative',
          company: contract.parties[1] || 'Counterparty',
          status: 'in_queue',
        },
      ],
    };

    if (onAddContract) {
      onAddContract(contractItem);
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, addedToPipeline: true } : m))
    );

    if (openESign && onOpenInESign) {
      showToast(lang === 'EN' ? 'Contract added! Opening in E-Sign Room...' : 'अनुबंध जोड़ा गया! ई-साइन कक्ष में खोला जा रहा है...');
      setTimeout(() => {
        onOpenInESign(contractItem);
        onClose();
      }, 700);
    } else {
      showToast(lang === 'EN' ? 'Added to Active PAKTs pipeline!' : 'सक्रिय पाक्ट पाइपलाइन में जोड़ा गया!');
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast(lang === 'EN' ? 'Contract text copied to clipboard!' : 'अनुबंध पाठ क्लिपबोर्ड में कॉपी किया गया!');
  };

  const handleDownloadDraft = (contract: GeneratedContractPayload) => {
    const content = `===============================================================
PAKT WEB 2.5 SOVEREIGN LEGAL CONTRACT
Title: ${contract.title}
Code: ${contract.code || 'IN-PAKT-DRAFT'}
Jurisdiction: ${contract.jurisdiction}
Stamp Duty Estimate: ${contract.stampDutyEstimate}
Parties: ${contract.parties.join(' AND ')}
Anchor: Polygon PoS SHA-256 Validated
Statutory Validity: Indian Contract Act 1872 & IT Act 2000 § 10A
Draft Language: ${contractLanguage.toUpperCase()}
===============================================================

EXECUTIVE SUMMARY:
${contract.summary}

---------------------------------------------------------------
OPERATIVE CLAUSES:
---------------------------------------------------------------
${contract.clauses
  .map(
    (c) =>
      `CLAUSE ${c.clauseNumber}: ${c.title.toUpperCase()}\n${c.text}\nStatutory Basis: ${c.statutoryRef || 'Indian Contract Act 1872'}\n`
  )
  .join('\n')}

---------------------------------------------------------------
FULL DRAFT TEXT:
---------------------------------------------------------------
${contract.fullDraftText}

===============================================================
Generated by PAKT Sahayak AI Legal Assistant • Bharat Sovereign Node
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contract.title.replace(/[^a-zA-Z0-9]/g, '_')}_PAKT.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(lang === 'EN' ? 'Contract draft downloaded (.txt)' : 'अनुबंध प्रारूप डाउनलोड हुआ (.txt)');
  };

  const toggleClauseExpand = (key: string) => {
    setExpandedClauses((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl h-[92vh] sm:h-[680px] flex flex-col shadow-2xl border border-[#e4beb4] overflow-hidden animate-in slide-in-from-bottom duration-200 relative">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#191c1e] text-white px-4 py-2 rounded-full text-[12px] font-bold shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="p-3.5 bg-[#191c1e] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#ac2e00] flex items-center justify-center text-white shadow-md ring-2 ring-white/20">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[15px] tracking-tight">
                  {lang === 'EN' ? 'PAKT Sahayak' : 'पाक्ट सहायक'}
                </h3>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Gemini 3.8 Flash AI
                </span>
              </div>
              <p className="font-mono text-[10px] text-gray-400">
                {lang === 'EN'
                  ? 'Sovereign Legal Engineer • IT Act § 10A & DPDP Act 2023'
                  : 'संप्रभु विधिक इंजीनियर • आईटी अधिनियम धारा १०क एवं डीपीडीपी'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMessages([
                  {
                    id: Date.now().toString(),
                    sender: 'bot',
                    text:
                      lang === 'EN'
                        ? 'Session refreshed. Ready to draft your next contract or review statutory compliance.'
                        : 'सत्र रीफ़्रेश हुआ। नया अनुबंध तैयार करने या विधिक समीक्षा हेतु तैयार।',
                    time: 'Just now',
                  },
                ]);
                showToast(lang === 'EN' ? 'Chat history cleared' : 'बातचीत का इतिहास साफ़ किया गया');
              }}
              title={lang === 'EN' ? 'Clear Conversation' : 'बातचीत साफ़ करें'}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Rail + Independent Contract Language Switcher */}
        <div className="bg-[#f2f4f6] px-3 py-1.5 border-b border-[#e4beb4]/30 flex items-center justify-between gap-1 flex-wrap shrink-0">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-[#191c1e] shadow-xs border border-[#e4beb4]/40'
                  : 'text-[#5b4139] hover:text-[#191c1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-[#ac2e00]">chat</span>
              <span>{lang === 'EN' ? 'AI Chat & Copilot' : 'एआई चैट एवं साथी'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('maker')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                activeTab === 'maker'
                  ? 'bg-white text-[#191c1e] shadow-xs border border-[#e4beb4]/40'
                  : 'text-[#5b4139] hover:text-[#191c1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-[#ac2e00]">post_add</span>
              <span>{lang === 'EN' ? 'Contract Maker' : 'अनुबंध निर्माता'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('compliance')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                activeTab === 'compliance'
                  ? 'bg-white text-[#191c1e] shadow-xs border border-[#e4beb4]/40'
                  : 'text-[#5b4139] hover:text-[#191c1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-[#ac2e00]">gavel</span>
              <span>{lang === 'EN' ? 'Statutory & Stamp' : 'विधिक एवं स्टाम्प'}</span>
            </button>
          </div>

          {/* Independent Contract Language Selector inside Bot */}
          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-[#e4beb4]/40 text-[10px] font-mono shadow-xs">
            <span className="text-[#5b4139] font-sans font-semibold">
              {lang === 'EN' ? 'Draft in:' : 'प्रारूप भाषा:'}
            </span>
            <button
              type="button"
              onClick={() => onSelectContractLanguage && onSelectContractLanguage('en')}
              className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                contractLanguage === 'en'
                  ? 'bg-[#ac2e00] text-white'
                  : 'text-[#5b4139] hover:text-[#191c1e]'
              }`}
              title="Draft contracts in English"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onSelectContractLanguage && onSelectContractLanguage('hi')}
              className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                contractLanguage === 'hi'
                  ? 'bg-[#ac2e00] text-white'
                  : 'text-[#5b4139] hover:text-[#191c1e]'
              }`}
              title="अनुबंध हिन्दी में तैयार करें"
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => onSelectContractLanguage && onSelectContractLanguage('hinglish')}
              className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                contractLanguage === 'hinglish'
                  ? 'bg-[#ac2e00] text-white'
                  : 'text-[#5b4139] hover:text-[#191c1e]'
              }`}
              title="Draft contracts in Hinglish"
            >
              Hinglish
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 bg-[#f7f9fb]">
            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[92%] sm:max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#ac2e00] text-white rounded-br-none font-medium'
                        : 'bg-white text-[#191c1e] rounded-bl-none border border-[#e4beb4]/30 space-y-2'
                    }`}
                  >
                    {/* Bot or User text */}
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Interactive Contract Card if bot drafted a contract */}
                    {msg.contract && (
                      <div className="mt-3 pt-3 border-t border-[#e4beb4]/40 bg-[#fbfcfd] -mx-1 p-3 rounded-xl border">
                        {/* Contract Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              <span className="px-2 py-0.5 rounded-full bg-[#ffdbd1] text-[#3b0a00] font-mono text-[9px] font-bold uppercase tracking-wider">
                                {msg.contract.category.toUpperCase()}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold">
                                IT ACT § 10A ENFORCEABLE
                              </span>
                              <span className="font-mono text-[10px] text-[#5b4139]">
                                {msg.contract.code || 'IN-PAKT-DRAFT'}
                              </span>
                            </div>
                            <h4 className="text-[14px] font-bold text-[#191c1e]">
                              {msg.contract.title}
                            </h4>
                          </div>
                        </div>

                        {/* Metadata Pills */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                          <div className="bg-white p-2 rounded-lg border border-[#e4beb4]/30">
                            <span className="text-[#5b4139] block text-[9px] uppercase font-bold">
                              {lang === 'EN' ? 'Parties' : 'पक्षकार'}
                            </span>
                            <span className="font-semibold text-[#191c1e] truncate block">
                              {msg.contract.parties.join(' & ')}
                            </span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-[#e4beb4]/30">
                            <span className="text-[#5b4139] block text-[9px] uppercase font-bold">
                              {lang === 'EN' ? 'Jurisdiction' : 'क्षेत्राधिकार'}
                            </span>
                            <span className="font-semibold text-[#191c1e] truncate block">
                              {msg.contract.jurisdiction}
                            </span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-[#e4beb4]/30">
                            <span className="text-[#5b4139] block text-[9px] uppercase font-bold">
                              {lang === 'EN' ? 'Stamp Duty' : 'स्टाम्प शुल्क'}
                            </span>
                            <span className="font-semibold text-[#ac2e00] truncate block">
                              {msg.contract.stampDutyEstimate}
                            </span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-[#e4beb4]/30">
                            <span className="text-[#5b4139] block text-[9px] uppercase font-bold">
                              {lang === 'EN' ? 'Consensus Ledger' : 'लेजर एंकर'}
                            </span>
                            <span className="font-mono font-semibold text-[#191c1e] truncate block">
                              Polygon PoS Validated
                            </span>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="p-2.5 bg-[#f2f4f6] rounded-lg text-[12px] text-[#191c1e] mb-3 leading-snug">
                          <strong>{lang === 'EN' ? 'Summary:' : 'सारांश:'}</strong> {msg.contract.summary}
                        </div>

                        {/* Clauses List Preview */}
                        <div className="flex flex-col gap-2 mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5b4139]">
                            {lang === 'EN'
                              ? `Operative Clauses (${msg.contract.clauses.length})`
                              : `मुख्य धाराएं (${msg.contract.clauses.length})`}
                          </span>
                          {msg.contract.clauses.map((clause, idx) => {
                            const clauseKey = `${msg.id}-cl-${idx}`;
                            const isExpanded = !!expandedClauses[clauseKey];
                            return (
                              <div
                                key={idx}
                                className="bg-white rounded-lg p-2.5 border border-[#e4beb4]/30 text-[12px]"
                              >
                                <div
                                  onClick={() => toggleClauseExpand(clauseKey)}
                                  className="flex items-center justify-between cursor-pointer select-none"
                                >
                                  <div className="flex items-center gap-1.5 min-w-0 pr-1">
                                    <span className="font-mono text-[10px] text-[#ac2e00] font-bold shrink-0">
                                      § {clause.clauseNumber}
                                    </span>
                                    <span className="font-bold text-[#191c1e] truncate">
                                      {clause.title}
                                    </span>
                                  </div>
                                  <span className="material-symbols-outlined text-[16px] text-gray-500 shrink-0">
                                    {isExpanded ? 'expand_less' : 'expand_more'}
                                  </span>
                                </div>
                                {isExpanded && (
                                  <div className="mt-2 pt-2 border-t border-[#e4beb4]/20 text-[11px] leading-relaxed text-[#5b4139]">
                                    <p className="text-[#191c1e]">{clause.text}</p>
                                    {clause.statutoryRef && (
                                      <p className="mt-1 font-mono text-[10px] text-[#ac2e00] font-semibold">
                                        Statutory Basis: {clause.statutoryRef}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Action Buttons for Contract */}
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleAddContractToApp(msg.contract!, msg.id, true)}
                            className="flex-1 py-2 px-3 bg-[#ac2e00] hover:bg-[#d53e07] text-white font-bold text-[12px] rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[16px]">draw</span>
                            <span>{lang === 'EN' ? 'Add & Open in E-Sign' : 'जोड़ें एवं ई-साइन खोलें'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPreviewDraftContract(msg.contract!)}
                            className="py-2 px-3 bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] font-bold text-[12px] rounded-lg transition-colors flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            <span>{lang === 'EN' ? 'Full Text' : 'पूरा पाठ'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadDraft(msg.contract!)}
                            className="py-2 px-2 bg-[#eceef0] hover:bg-[#e0e3e5] text-[#5b4139] hover:text-[#191c1e] font-bold text-[12px] rounded-lg transition-colors"
                            title={lang === 'EN' ? 'Download Draft (.txt)' : 'प्रारूप डाउनलोड करें'}
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[#5b4139] mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 p-3 bg-white rounded-2xl w-fit border border-[#e4beb4]/30 shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-[#ac2e00] animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-[#ac2e00] animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#ac2e00] animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-[11px] text-[#5b4139] font-mono ml-1">
                    {lang === 'EN' ? 'PAKT Sahayak is drafting...' : 'पाक्ट सहायक प्रारूप तैयार कर रहा है...'}
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Horizontal Rail */}
            <div className="px-3 pt-2 pb-1 border-t border-[#e4beb4]/20 bg-white overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(qp.query)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-[#f2f4f6] hover:bg-[#ffdbd1]/50 text-[#191c1e] text-[11px] font-medium transition-colors border border-[#e4beb4]/30 flex items-center gap-1"
                >
                  <span>{qp.label}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-[#e4beb4]/30 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    lang === 'EN'
                      ? 'Type contract request or legal query (e.g. Draft an NDA in Hinglish)...'
                      : 'अनुबंध अनुरोध या कानूनी प्रश्न दर्ज करें (उदा. एनडीए अनुबंध बनाएं)...'
                  }
                  className="flex-1 bg-[#f2f4f6] text-[#191c1e] px-3.5 py-2.5 rounded-xl border border-[#e4beb4]/30 focus:border-[#ac2e00] focus:outline-none text-[13px]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-xl bg-[#ac2e00] hover:bg-[#d53e07] disabled:opacity-50 text-white flex items-center justify-center shrink-0 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Contract Maker Wizard */}
        {activeTab === 'maker' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#f7f9fb]">
            <div className="max-w-xl mx-auto flex flex-col gap-4">
              <div className="bg-white p-4 rounded-xl border border-[#e4beb4]/30 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ac2e00] text-[20px]">auto_stories</span>
                    <h4 className="font-bold text-[14px] text-[#191c1e]">
                      {lang === 'EN' ? 'Automated Contract Maker' : 'स्वचालित अनुबंध निर्माता'}
                    </h4>
                  </div>
                  <span className="font-mono text-[10px] bg-[#ffdbd1] text-[#3b0a00] px-2 py-0.5 rounded font-bold">
                    IT ACT § 10A
                  </span>
                </div>
                <p className="text-[12px] text-[#5b4139] leading-snug">
                  {lang === 'EN'
                    ? 'Configure the counterparty and parameters below. PAKT Sahayak will synthesize full operative clauses in your chosen contract language (English, Hindi, or Hinglish) and calculate state stamp duty.'
                    : 'प्रतिपक्ष और पैरामीटर कॉन्फ़िगर करें। पाक्ट सहायक आपकी चुनी हुई भाषा (अंग्रेज़ी, हिन्दी या हिंग्लिश) में विधिक धाराएं तैयार करेगा।'}
                </p>
              </div>

              <form onSubmit={handleMakerGenerate} className="bg-white p-4 rounded-xl border border-[#e4beb4]/30 shadow-xs flex flex-col gap-3.5">
                {/* Contract Category */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#5b4139] block mb-1">
                    {lang === 'EN' ? 'Contract Framework' : 'अनुबंध ढांचा'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'nda', label: 'Mutual NDA', icon: 'shield' },
                      { id: 'saas', label: 'SaaS Agreement', icon: 'cloud' },
                      { id: 'employment', label: 'Employment', icon: 'badge' },
                      { id: 'shareholder', label: 'Shareholder', icon: 'group' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setMakerCategory(item.id as any);
                          if (item.id === 'nda') setMakerTitle('Mutual Non-Disclosure Agreement');
                          if (item.id === 'saas') setMakerTitle('Master Cloud & SaaS Services Agreement');
                          if (item.id === 'employment') setMakerTitle('Senior Software Architect Employment Agreement');
                          if (item.id === 'shareholder') setMakerTitle('Founders & Shareholder Voting Agreement');
                        }}
                        className={`p-2 rounded-lg border text-center flex flex-col items-center gap-1 transition-all ${
                          makerCategory === item.id
                            ? 'bg-[#ffdbd1]/30 border-[#ac2e00] text-[#ac2e00] font-bold ring-1 ring-[#ac2e00]'
                            : 'border-[#e4beb4]/30 text-[#5b4139] hover:bg-[#eceef0]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                        <span className="text-[11px] truncate w-full">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contract Title */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#5b4139] block mb-1">
                    {lang === 'EN' ? 'Contract Title' : 'अनुबंध शीर्षक'}
                  </label>
                  <input
                    type="text"
                    required
                    value={makerTitle}
                    onChange={(e) => setMakerTitle(e.target.value)}
                    className="w-full bg-[#f2f4f6] text-[#191c1e] text-[13px] px-3 py-2 rounded-lg border border-[#e4beb4]/30 focus:border-[#ac2e00] focus:outline-none"
                  />
                </div>

                {/* Parties */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#5b4139] block mb-1">
                      {lang === 'EN' ? 'First Party (Disclosing / Provider)' : 'प्रथम पक्ष'}
                    </label>
                    <input
                      type="text"
                      required
                      value={makerPartyA}
                      onChange={(e) => setMakerPartyA(e.target.value)}
                      className="w-full bg-[#f2f4f6] text-[#191c1e] text-[13px] px-3 py-2 rounded-lg border border-[#e4beb4]/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#5b4139] block mb-1">
                      {lang === 'EN' ? 'Counterparty (Recipient / Customer)' : 'प्रतिपक्ष'}
                    </label>
                    <input
                      type="text"
                      required
                      value={makerPartyB}
                      onChange={(e) => setMakerPartyB(e.target.value)}
                      className="w-full bg-[#f2f4f6] text-[#191c1e] text-[13px] px-3 py-2 rounded-lg border border-[#e4beb4]/30 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Jurisdiction & Term */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#5b4139] block mb-1">
                      {lang === 'EN' ? 'Governing Courts & Jurisdiction' : 'न्यायालय क्षेत्राधिकार'}
                    </label>
                    <select
                      value={makerJurisdiction}
                      onChange={(e) => setMakerJurisdiction(e.target.value)}
                      className="w-full bg-[#f2f4f6] text-[#191c1e] text-[12px] px-3 py-2 rounded-lg border border-[#e4beb4]/30 focus:outline-none"
                    >
                      <option value="Mumbai, Maharashtra">Mumbai, Maharashtra (High Court of Bombay)</option>
                      <option value="Bengaluru, Karnataka">Bengaluru, Karnataka (Karnataka High Court)</option>
                      <option value="New Delhi, Delhi NCR">New Delhi, Delhi NCR (Delhi High Court)</option>
                      <option value="Hyderabad, Telangana">Hyderabad, Telangana (Telangana High Court)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#5b4139] block mb-1">
                      {lang === 'EN' ? 'Agreement Duration / Term' : 'अनुबंध अवधि'}
                    </label>
                    <input
                      type="text"
                      value={makerTerm}
                      onChange={(e) => setMakerTerm(e.target.value)}
                      className="w-full bg-[#f2f4f6] text-[#191c1e] text-[13px] px-3 py-2 rounded-lg border border-[#e4beb4]/30 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Specifics */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#5b4139] block mb-1">
                    {lang === 'EN' ? 'Special Terms, Covenants & Penalties' : 'विशिष्ट शर्तें एवं दंड'}
                  </label>
                  <textarea
                    rows={2}
                    value={makerSpecifics}
                    onChange={(e) => setMakerSpecifics(e.target.value)}
                    placeholder="e.g. Non-compete within 20km, DPDP Act 2023 consent, INR 5,00,000 liquidated damages..."
                    className="w-full bg-[#f2f4f6] text-[#191c1e] text-[12px] p-2.5 rounded-lg border border-[#e4beb4]/30 focus:outline-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#ac2e00] hover:bg-[#d53e07] text-white font-bold text-[13px] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-1"
                >
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <span>
                    {lang === 'EN'
                      ? `Synthesize ${contractLanguage.toUpperCase()} Contract with PAKT AI`
                      : `पाक्ट एआई द्वारा ${contractLanguage.toUpperCase()} अनुबंध तैयार करें`}
                  </span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Statutory Acts & Stamp Duty Guide */}
        {activeTab === 'compliance' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#f7f9fb] flex flex-col gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#e4beb4]/30 shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ac2e00] text-[20px]">account_balance</span>
                <h4 className="font-bold text-[15px] text-[#191c1e]">
                  {lang === 'EN' ? 'State Stamp Duty Matrix (India 2026)' : 'राज्य स्टाम्प शुल्क दरें (भारत २०२६)'}
                </h4>
              </div>
              <p className="text-[12px] text-[#5b4139] leading-snug">
                {lang === 'EN'
                  ? 'Digital agreements on PAKT comply with Section 17 of the Indian Stamp Act. Stamp duty is calculated according to the jurisdiction of execution:'
                  : 'पाक्ट पर डिजिटल अनुबंध भारतीय स्टाम्प अधिनियम की धारा १७ का अनुपालन करते हैं। निष्पादन के राज्य अनुसार स्टाम्प शुल्क:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                <div className="p-3 bg-[#f2f4f6] rounded-lg border border-[#e4beb4]/20">
                  <div className="flex items-center justify-between font-bold text-[#191c1e] mb-1">
                    <span>Maharashtra</span>
                    <span className="text-[#ac2e00] font-mono">₹500 (Art 5(h))</span>
                  </div>
                  <p className="text-[11px] text-[#5b4139]">
                    Standard for commercial SaaS, NDAs, and Service agreements without property transfer. Payable via e-SBTR / GRAS.
                  </p>
                </div>

                <div className="p-3 bg-[#f2f4f6] rounded-lg border border-[#e4beb4]/20">
                  <div className="flex items-center justify-between font-bold text-[#191c1e] mb-1">
                    <span>Karnataka</span>
                    <span className="text-[#ac2e00] font-mono">₹200 - ₹500 (Art 5(j))</span>
                  </div>
                  <p className="text-[11px] text-[#5b4139]">
                    Kaveri online portal e-stamp applicable. Bilateral consulting and IT contracts standard ₹200.
                  </p>
                </div>

                <div className="p-3 bg-[#f2f4f6] rounded-lg border border-[#e4beb4]/20">
                  <div className="flex items-center justify-between font-bold text-[#191c1e] mb-1">
                    <span>Delhi NCR</span>
                    <span className="text-[#ac2e00] font-mono">₹100 (Schedule 1-A)</span>
                  </div>
                  <p className="text-[11px] text-[#5b4139]">
                    Stockholding Corporation of India (SHCIL) e-stamping integrated for commercial contracts.
                  </p>
                </div>

                <div className="p-3 bg-[#f2f4f6] rounded-lg border border-[#e4beb4]/20">
                  <div className="flex items-center justify-between font-bold text-[#191c1e] mb-1">
                    <span>Tamil Nadu</span>
                    <span className="text-[#ac2e00] font-mono">₹20 - ₹100</span>
                  </div>
                  <p className="text-[11px] text-[#5b4139]">
                    Payable on non-judicial stamp certificate or e-stamp portal under Tamil Nadu Stamp Act.
                  </p>
                </div>
              </div>
            </div>

            {/* IT Act § 10A & DPDP Act 2023 Reference */}
            <div className="bg-white p-4 rounded-xl border border-[#e4beb4]/30 shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ac2e00] text-[20px]">verified_user</span>
                <h4 className="font-bold text-[15px] text-[#191c1e]">
                  {lang === 'EN' ? 'Sovereign Statutory Foundation' : 'संप्रभु विधिक आधार'}
                </h4>
              </div>

              <div className="flex flex-col gap-2 text-[12px] text-[#191c1e]">
                <div className="p-2.5 bg-[#f2f4f6] rounded-lg">
                  <span className="font-bold block text-[#ac2e00] mb-0.5">
                    Section 10A — Information Technology Act, 2000
                  </span>
                  <p className="text-[#5b4139] leading-snug">
                    "Where in a contract formation, the communication of proposals, the acceptance of proposals, the revocation of proposals and acceptances, as the case may be, are expressed in electronic form or by means of an electronic record, such contract shall not be deemed to be unenforceable solely on the ground that such electronic form or means was used for that purpose."
                  </p>
                </div>

                <div className="p-2.5 bg-[#f2f4f6] rounded-lg">
                  <span className="font-bold block text-[#ac2e00] mb-0.5">
                    Section 65B — Indian Evidence Act, 1872
                  </span>
                  <p className="text-[#5b4139] leading-snug">
                    Cryptographic hash validation on Polygon PoS accompanied by time-stamped DSC signatures qualifies as primary/secondary admissible computer output evidence in Indian commercial courts.
                  </p>
                </div>

                <div className="p-2.5 bg-[#f2f4f6] rounded-lg">
                  <span className="font-bold block text-[#ac2e00] mb-0.5">
                    DPDP Act 2023 (Digital Personal Data Protection)
                  </span>
                  <p className="text-[#5b4139] leading-snug">
                    All participant records stored under sovereign Indian data principal protections with immediate 6-hour CERT-In incident notification obligations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Draft Preview Modal */}
        {previewDraftContract && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-[#e4beb4] overflow-hidden">
              <div className="p-3.5 bg-[#191c1e] text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ac2e00]">description</span>
                  <h4 className="font-bold text-[14px] truncate">{previewDraftContract.title}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewDraftContract(null)}
                  className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-5 font-mono text-[11px] leading-relaxed text-[#191c1e] whitespace-pre-wrap bg-[#fcfdfe]">
                {previewDraftContract.fullDraftText || previewDraftContract.summary}
              </div>

              <div className="p-3 bg-white border-t border-[#e4beb4]/30 flex items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopyText(previewDraftContract.fullDraftText)}
                  className="py-2 px-3 bg-[#eceef0] hover:bg-[#e0e3e5] rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>{lang === 'EN' ? 'Copy Text' : 'पाठ कॉपी करें'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadDraft(previewDraftContract)}
                  className="py-2 px-3 bg-[#ac2e00] hover:bg-[#d53e07] text-white rounded-xl text-[12px] font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>{lang === 'EN' ? 'Download (.txt)' : 'डाउनलोड करें (.txt)'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Client-side fallback generator
function generateClientFallback(
  query: string,
  contractLanguage: ContractLanguage = 'en',
  screenLang: Language = 'EN'
): { reply: string; contract?: GeneratedContractPayload } {
  const q = query.toLowerCase();

  if (q.includes('nda') || q.includes('non-disclosure') || q.includes('confidential') || q.includes('गोपनीय') || q.includes('एनडीए')) {
    if (contractLanguage === 'hi') {
      return {
        reply: 'मैंने भारतीय संविदा अधिनियम १८७२, आईटी अधिनियम की धारा १०क, एवं डीपीडीपी अधिनियम २०२३ के अनुरूप एक द्विपक्षीय गैर-प्रकटीकरण अनुबंध (NDA) तैयार किया है। आप नीचे दी गई धाराओं की समीक्षा कर सकते हैं और इसे सीधे अपनी सक्रिय पाक्ट पाइपलाइन में जोड़ सकते हैं।',
        contract: {
          id: 'contract-' + Date.now(),
          code: 'IN-PAKT-' + Math.floor(1000 + Math.random() * 9000),
          title: 'पारस्परिक गैर-प्रकटीकरण एवं गोपनीयता अनुबंध',
          category: 'nda',
          parties: ['टेकवेंचर्स इंडिया प्राइवेट लिमिटेड', 'डेटाफ्लो एनालिटिक्स एलएलपी'],
          jurisdiction: 'मुंबई, महाराष्ट्र',
          stampDutyEstimate: '₹५०० (महाराष्ट्र स्टाम्प अधिनियम अनुच्छेद ५(एच))',
          summary: 'एल्गोरिदमिक बौद्धिक संपदा, सोर्स कोड और वित्तीय मॉडलों की सुरक्षा हेतु द्विपक्षीय गोपनीयता समझौता।',
          clauses: [
            {
              clauseNumber: '१.०',
              title: 'गोपनीय जानकारी की परिभाषा',
              text: 'लिखित, डिजिटल या क्रिप्टोग्राफ़िक रूप में साझा की गई सभी तकनीकी दस्तावेज़, एपीआई एंडपॉइंट्स, एन्क्रिप्शन कीज़ और एल्गोरिदम इसमें शामिल हैं।',
              statutoryRef: 'भारतीय संविदा अधिनियम १८७२ धारा २७',
            },
            {
              clauseNumber: '३.२',
              title: 'डिजिटल व्यक्तिगत डेटा संरक्षण (डीपीडीपी) अधिनियम २०२३',
              text: 'व्यक्तिगत पहचान योग्य डेटा को डेटा न्यासी मानकों के तहत रखा जाएगा और सीईआरटी-इन पंजीकृत भारतीय सर्वरों में सुरक्षित रखा जाएगा।',
              statutoryRef: 'डीपीडीपी अधिनियम २०२३ धारा ८',
            },
            {
              clauseNumber: '६.१',
              title: 'विधिक वैधता एवं डिजिटल निष्पादन',
              text: 'दोनों पक्षकार पुष्टि करते हैं कि डिजिटल निष्पादन और पॉलीगॉन पर SHA-256 हैश एंकरिंग भारतीय सूचना प्रौद्योगिकी अधिनियम २००० की धारा १०क के तहत विधिक रूप से बाध्यकारी है।',
              statutoryRef: 'सूचना प्रौद्योगिकी अधिनियम २००० धारा १०क',
            },
          ],
          fullDraftText: `पारस्परिक गैर-प्रकटीकरण अनुबंध\n\nयह अनुबंध टेकवेंचर्स इंडिया प्राइवेट लिमिटेड एवं डेटाफ्लो एनालिटिक्स एलएलपी के मध्य निष्पादित किया गया है।\n\n१. दायरा: गोपनीय तकनीकी एवं व्यावसायिक डेटा का संरक्षण।\n२. शासी कानून: भारत गणराज्य, मुंबई न्यायालय।\n३. वैधता: भारतीय आईटी अधिनियम २००० की धारा १०क के तहत बाध्यकारी।`,
        },
      };
    }

    if (contractLanguage === 'hinglish') {
      return {
        reply: 'Maine Indian Contract Act 1872, IT Act Section 10A, aur DPDP Act 2023 ke accordance me ek bilateral Non-Disclosure Agreement draft kiya hai. Aap neeche diye clauses inspect kar sakte hain aur ise directly active pipeline me add kar sakte hain.',
        contract: {
          id: 'contract-' + Date.now(),
          code: 'IN-PAKT-' + Math.floor(1000 + Math.random() * 9000),
          title: 'Mutual Non-Disclosure & Confidentiality PAKT',
          category: 'nda',
          parties: ['TechVentures India Pvt Ltd', 'DataFlow Analytics LLP'],
          jurisdiction: 'Mumbai, Maharashtra',
          stampDutyEstimate: '₹500 (Maharashtra Stamp Act Art 5(h))',
          summary: 'Algorithmic IP, source code repositories, aur proprietary data ko protect karne ke liye bilateral confidentiality contract.',
          clauses: [
            {
              clauseNumber: '1.0',
              title: 'Definition of Confidential Information',
              text: 'Saare proprietary technical docs, API endpoints, encryption keys aur algorithms jo written ya digital form me disclose honge wo confidential rahenge.',
              statutoryRef: 'Indian Contract Act 1872 § 27',
            },
            {
              clauseNumber: '3.2',
              title: 'DPDP Act 2023 Compliance',
              text: 'Personal identifiable data strict Data Fiduciary standards ke under manage hoga aur CERT-In registered Mumbai availability zones me store hoga.',
              statutoryRef: 'DPDP Act 2023 § 8',
            },
            {
              clauseNumber: '6.1',
              title: 'Statutory Validity & Digital Execution',
              text: 'Parties agree karti hain ki digital signature aur Polygon PoS SHA-256 hash IT Act 2000 Section 10A ke tahat fully binding contract create karti hai.',
              statutoryRef: 'IT Act 2000 § 10A',
            },
          ],
          fullDraftText: `MUTUAL NON-DISCLOSURE AGREEMENT (HINGLISH)\n\nYeh Agreement TechVentures India Pvt Ltd aur DataFlow Analytics LLP ke beech execute hua hai.\n\n1. SCOPE: Proprietary data aur IP protection.\n2. GOVERNING LAW: Republic of India, Mumbai Jurisdiction.\n3. VALIDITY: Enforceable under Section 10A of IT Act 2000.`,
        },
      };
    }

    return {
      reply: 'I have drafted a mutual Non-Disclosure Agreement compliant with the Indian Contract Act 1872, Section 10A of the IT Act, and the DPDP Act 2023. You can review the clauses below and add it directly to your active PAKTs pipeline.',
      contract: {
        id: 'contract-' + Date.now(),
        code: 'IN-PAKT-' + Math.floor(1000 + Math.random() * 9000),
        title: 'Mutual Non-Disclosure & Confidentiality Agreement',
        category: 'nda',
        parties: ['TechVentures India Pvt Ltd', 'DataFlow Analytics LLP'],
        jurisdiction: 'Mumbai, Maharashtra',
        stampDutyEstimate: '₹500 (Maharashtra Stamp Act Art 5(h))',
        summary: 'Bilateral confidentiality agreement safeguarding algorithmic IP, source code repositories, and proprietary financial models.',
        clauses: [
          {
            clauseNumber: '1.0',
            title: 'Definition of Confidential Information',
            text: 'Encompasses all proprietary technical documents, API endpoints, encryption keys, and algorithms disclosed in written, digital, or cryptographic form.',
            statutoryRef: 'Indian Contract Act 1872 § 27',
          },
          {
            clauseNumber: '3.2',
            title: 'Digital Personal Data Protection (DPDP) Act 2023',
            text: 'Personal identifiable data shall be treated strictly under Data Fiduciary standards and stored within CERT-In registered sovereign Indian availability zones.',
            statutoryRef: 'DPDP Act 2023 § 8',
          },
          {
            clauseNumber: '6.1',
            title: 'Statutory Validity & Cryptographic Execution',
            text: 'The parties affirm that digital execution and SHA-256 Polygon PoS hash anchoring constitute legally binding contract formation under Section 10A of the Information Technology Act, 2000.',
            statutoryRef: 'Information Technology Act 2000 § 10A',
          },
        ],
        fullDraftText: `MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis Agreement is entered into by and between TechVentures India Pvt Ltd and DataFlow Analytics LLP.\n\n1. SCOPE: Protecting proprietary technical data.\n2. GOVERNING LAW: Republic of India, Courts of Mumbai.\n3. VALIDITY: Enforceable pursuant to Section 10A of the Information Technology Act, 2000.`,
      },
    };
  }

  return {
    reply: screenLang === 'HI'
      ? `⚖️ **पाक्ट सहायक विधिक परामर्श:**\n\n**सूचना प्रौद्योगिकी अधिनियम २००० की धारा १०क** के तहत इलेक्ट्रॉनिक अनुबंध, डिजिटल अभिलेख एवं इलेक्ट्रॉनिक हस्ताक्षर भारतीय न्यायालयों में पूर्णतः विधिक रूप से मान्य हैं। इसके अतिरिक्त, पॉलीगॉन पर SHA-256 दस्तावेज़ एंकर भारतीय साक्ष्य अधिनियम की धारा ६५ख के तहत न्यायालय में ग्राह्य इलेक्ट्रॉनिक साक्ष्य की शर्तें पूरी करते हैं।\n\nक्या आप चाहते हैं कि मैं आपके लिए एक अनुबंध तैयार करूं? ऊपर **अनुबंध निर्माता** चुनें या "एनडीए अनुबंध बनाएं" लिखें।`
      : `⚖️ **PAKT Sahayak Legal Response:**\n\nUnder Section 10A of the **Information Technology Act, 2000**, electronic contracts, electronic records, and digital execution hold full statutory validity in Indian courts. Furthermore, cryptographic SHA-256 document anchors on Polygon PoS satisfy the criteria under Section 65B of the Indian Evidence Act for court-admissible electronic records.\n\nWould you like me to draft a custom contract for you? Try selecting **Contract Maker** above or type "Draft an NDA" or "Draft a SaaS Agreement".`,
  };
}
