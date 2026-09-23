import React, { useState } from 'react';
import { ScreenType, Language, CopilotIntervention } from '../../types';
import { INITIAL_COPILOT_INTERVENTIONS } from '../../data/mockData';
import { useLoading } from '../../context/LoadingContext';

interface AICopilotScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
  onOpenNewPakt: () => void;
}

export const AICopilotScreen: React.FC<AICopilotScreenProps> = ({ onNavigate, lang, onOpenNewPakt }) => {
  const [interventions, setInterventions] = useState<CopilotIntervention[]>(INITIAL_COPILOT_INTERVENTIONS);
  const [queryInput, setQueryInput] = useState('');
  const [queryResponse, setQueryResponse] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [activeTarget, setActiveTarget] = useState(
    lang === 'EN' ? 'Cross-Border SaaS & Cloud Agreement' : 'सीमा-पार सास एवं क्लाउड अनुबंध'
  );
  const [activeTargetVer, setActiveTargetVer] = useState('v2.1');

  // Handle Accept
  const handleAccept = (id: number) => {
    setInterventions(prev =>
      prev.map(item => (item.id === id ? { ...item, applied: true, rejected: false } : item))
    );
  };

  // Handle Reject
  const handleReject = (id: number) => {
    setInterventions(prev =>
      prev.map(item => (item.id === id ? { ...item, rejected: true, applied: false } : item))
    );
  };

  // Handle Undo
  const handleUndo = (id: number) => {
    setInterventions(prev =>
      prev.map(item => (item.id === id ? { ...item, applied: false, rejected: false } : item))
    );
  };

  // Switch Contract Target
  const handleSwitchTarget = () => {
    if (activeTarget.includes('SaaS') || activeTarget.includes('सास')) {
      setActiveTarget(
        lang === 'EN'
          ? 'Master SaaS & Cloud Services Agreement'
          : 'मास्टर सास एवं क्लाउड सेवा अनुबंध'
      );
      setActiveTargetVer('v1.0');
    } else {
      setActiveTarget(
        lang === 'EN'
          ? 'Cross-Border SaaS & Cloud Agreement'
          : 'सीमा-पार सास एवं क्लाउड अनुबंध'
      );
      setActiveTargetVer('v2.1');
    }
  };

  const { showLoading } = useLoading();

  const handleApplyPrompt = (promptText: string) => {
    setQueryInput(promptText);
  };

  const handleSubmitQuery = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!queryInput.trim()) return;

    setIsQuerying(true);
    setQueryResponse(null);

    showLoading({
      titleEn: 'AI Copilot Processing Legal Analysis',
      titleHi: 'एआई कोपायलट विधिक विश्लेषण जारी',
      subtitleEn: `Analyzing query: "${queryInput.slice(0, 50)}${queryInput.length > 50 ? '...' : ''}" against Indian statutory jurisprudence.`,
      subtitleHi: `भारतीय सांविधिक विधिशास्त्र के संदर्भ में प्रश्न "${queryInput.slice(0, 50)}${queryInput.length > 50 ? '...' : ''}" का विश्लेषण।`,
      duration: 1500,
      customSteps: [
        'Parsing statutory query terms...',
        'Cross-referencing Indian Contract Act 1872 & DPDP Act 2023...',
        'Verifying Maharashtra Stamp Act & IT Act 2000 jurisprudence...',
        'Synthesizing sovereign AI recommendations...',
        'Legal analysis complete!',
      ],
      customStepsHi: [
        'सांविधिक प्रश्न के शब्दों का विश्लेषण...',
        'भारतीय अनुबंध अधिनियम १८७२ एवं डीपीडीपी अधिनियम २०२३ से तुलना...',
        'महाराष्ट्र स्टाम्प अधिनियम एवं आईटी अधिनियम २००० विधिशास्त्र सत्यापन...',
        'संप्रभु एआई अनुशंसाओं का संश्लेषण...',
        'विधिक विश्लेषण पूर्ण हुआ!',
      ],
      onComplete: () => {
        setIsQuerying(false);
        if (queryInput.toLowerCase().includes('stamp') || queryInput.toLowerCase().includes('शुल्क') || queryInput.toLowerCase().includes('स्टाम्प')) {
          setQueryResponse(
            lang === 'EN'
              ? '📜 Maharashtra Stamp Act (Schedule I, Art. 5(h)): For commercial SaaS & cloud contracts without immovable property transfer, standard stamp duty is ₹500 via e-SBTR / GRAS portal. In Karnataka, Article 5(j) prescribes ₹200-500 depending on consideration.'
              : '📜 महाराष्ट्र स्टाम्प अधिनियम (अनुसूची I, अनुच्छेद 5(h)): अचल संपत्ति हस्तांतरण के बिना वाणिज्यिक सास एवं क्लाउड अनुबंधों के लिए ई-एसबीटीआर / जीआरएएस पोर्टल के माध्यम से मानक स्टाम्प शुल्क ₹५०० है। कर्नाटक में ₹२००-५०० निर्धारित है।'
          );
        } else if (queryInput.toLowerCase().includes('jurisdiction') || queryInput.toLowerCase().includes('अधिकार') || queryInput.toLowerCase().includes('क्षेत्राधिकार')) {
          setQueryResponse(
            lang === 'EN'
              ? '⚖️ Jurisdiction Check: Commercial courts of Mumbai / Bombay High Court have supervisory jurisdiction over Indian IT Act disputes. Under CPC Section 20, counterparty cause of action arises where server endpoints or performance occurs.'
              : '⚖️ क्षेत्राधिकार समीक्षा: मुंबई की वाणिज्यिक अदालतों / बॉम्बे उच्च न्यायालय के पास भारतीय आईटी अधिनियम विवादों पर पर्यवेक्षी क्षेत्राधिकार है। सीपीसी धारा २० के तहत कार्रवाई का कारण वहाँ उत्पन्न होता है जहाँ सर्वर एंडपॉइंट स्थित हैं।'
          );
        } else if (queryInput.toLowerCase().includes('arbitration') || queryInput.toLowerCase().includes('1996') || queryInput.toLowerCase().includes('मध्यस्थता')) {
          setQueryResponse(
            lang === 'EN'
              ? '🏛️ Arbitration Review: Clause conforms to Indian Arbitration and Conciliation Act 1996 (as amended 2019/2021). Seat is designated as Mumbai, administered under MCIA (Mumbai Centre for International Arbitration) Rules.'
              : '🏛️ मध्यस्थता समीक्षा: धारा भारतीय मध्यस्थता एवं सुलह अधिनियम १९९६ (२०१९/२०२१ संशोधित) के पूर्णतः अनुरूप है। मध्यस्थता स्थल मुंबई (MCIA नियम) निर्धारित है।'
          );
        } else {
          setQueryResponse(
            lang === 'EN'
              ? `🤖 Copilot Analysis (${queryInput}): Clause reviewed against Indian Contract Act 1872 and DPDP Act 2023. Recommended inclusion of CERT-In 6-hour incident breach disclosure and mutual indemnity threshold.`
              : `🤖 एआई समीक्षा (${queryInput}): भारतीय संविदा अधिनियम १८७२ एवं डीपीडीपी अधिनियम २०२३ के तहत धारा की समीक्षा की गई। सीईआरटी-इन ६ घंटे की घटना प्रकटीकरण एवं पारस्परिक क्षतिपूर्ति सीमा शामिल करने की अनुशंसा है।`
          );
        }
      },
    });
  };

  const pendingCount = interventions.filter(i => !i.applied && !i.rejected).length;

  return (
    <div className="flex flex-col w-full pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* Advisory Disclaimer Banner */}
      <section className="mb-4">
        <div className="bg-[#ffdbc8] text-[#321200] rounded-xl p-4 shadow-xs relative overflow-hidden flex items-start gap-3 border border-[#ffb68b]">
          <span className="material-symbols-outlined text-[#954500] text-[22px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#321200]">
                {lang === 'EN' ? 'ADVISORY DISCLAIMER' : 'परामर्श अस्वीकरण'}
              </span>
              <span className="bg-[#954500] text-white px-1.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold">
                {lang === 'EN' ? 'HITL REQUIRED' : 'मानव समीक्षा आवश्यक'}
              </span>
            </div>
            <p className="text-[12px] text-[#321200] leading-snug">
              {lang === 'EN'
                ? 'AI insights are advisory suggestions and do not constitute formal legal counsel under the Bar Council of India (BCI) rules. All clause modifications require advocate/human-in-the-loop review.'
                : 'एआई इनसाइट्स परामर्श सुझाव हैं और बार काउंसिल ऑफ इंडिया (BCI) नियमों के तहत औपचारिक कानूनी सलाह नहीं हैं। सभी धारा संशोधनों के लिए मानवीय अधिवक्ता समीक्षा आवश्यक है।'}
            </p>
          </div>
        </div>
      </section>

      {/* Contract Target Selector & Health Telemetry Card */}
      <section className="mb-4">
        <div className="bg-white rounded-xl p-4 shadow-xs flex flex-col gap-3.5 border border-[#e4beb4]/30">
          {/* Target Selector Dropdown Style */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-[#5b4139] font-bold mb-0.5">
                {lang === 'EN' ? 'ACTIVE CONTRACT TARGET' : 'सक्रिय अनुबंध लक्ष्य'}
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-[16px] text-[#191c1e] truncate font-bold">{activeTarget}</h1>
                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#eceef0] text-[#5b4139] font-semibold">
                  {activeTargetVer}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSwitchTarget}
              title={lang === 'EN' ? 'Switch Target Agreement' : 'अनुबंध बदलें'}
              className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </button>
          </div>

          {/* State & Protocol Chips Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f2f4f6] text-[#191c1e] font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#ac2e00] animate-ping"></span>
              <span className="font-semibold text-[#ac2e00]">
                {lang === 'EN' ? 'STATUS: IN_REVIEW' : 'स्थिति: समीक्षाधीन'}
              </span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f2f4f6] text-[#5b4139] font-mono text-[11px]">
              <span className="material-symbols-outlined text-[14px]">history_edu</span>
              <span>Diff Engine 4.2</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f2f4f6] text-[#5b4139] font-mono text-[11px] ml-auto">
              <span>0x7f..e94c</span>
            </div>
          </div>

          {/* Interactive Risk Meter Banner */}
          <div className="bg-[#f2f4f6] rounded-xl p-3.5 flex items-center justify-between gap-3 border border-[#e4beb4]/20">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#5b4139] uppercase tracking-wider font-bold">
                {lang === 'EN' ? 'Aggregate Risk Score' : 'कुल जोखिम स्कोर'}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5 flex-wrap">
                <span className="text-[26px] font-extrabold text-[#191c1e] leading-none">38</span>
                <span className="font-mono text-[12px] text-[#5b4139]">/100</span>
                <span className="ml-1 px-2 py-0.5 rounded-full bg-[#dce2f7] text-[#141b2b] font-mono text-[10px] font-bold uppercase">
                  {lang === 'EN' ? 'MODERATE' : 'मध्यम'}
                </span>
              </div>
              <p className="text-[11px] text-[#5b4139] mt-1">
                {lang === 'EN' ? '2 critical clauses require mitigation' : '२ महत्वपूर्ण धाराओं में संशोधन आवश्यक है'}
              </p>
            </div>

            {/* Risk Dial Visualization */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 48 48">
                <circle
                  className="text-gray-300"
                  cx="24"
                  cy="24"
                  fill="transparent"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4.5"
                ></circle>
                <circle
                  className="text-[#ac2e00] transition-all duration-700 ease-out"
                  cx="24"
                  cy="24"
                  fill="transparent"
                  r="20"
                  stroke="currentColor"
                  strokeDasharray="125.6"
                  strokeDashoffset="77.8"
                  strokeLinecap="round"
                  strokeWidth="4.5"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[#ac2e00] text-[20px]">
                  security_update_warning
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suggestion Deck Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#ac2e00] text-[20px]">auto_awesome</span>
          <h2 className="text-[15px] text-[#191c1e] font-bold">
            {lang === 'EN' ? 'Actionable Interventions' : 'आवश्यक विधिक सुधार'}
          </h2>
        </div>
        <span className="font-mono text-[10px] text-[#5b4139] bg-[#eceef0] px-2.5 py-0.5 rounded-full font-bold">
          {pendingCount} {lang === 'EN' ? 'PENDING' : 'लंबित'}
        </span>
      </div>

      {/* Findings Deck */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Suggestion Card 1: High Severity Risk */}
        {interventions.map(card => {
          if (card.id === 1) {
            return (
              <article
                key={card.id}
                className={`bg-white rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col gap-3.5 border border-[#e4beb4]/30 transition-all ${
                  card.rejected ? 'opacity-40 scale-[0.98] pointer-events-none' : ''
                }`}
              >
                {/* High Severity Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ac2e00]"></div>

                {/* Card Header Metadata */}
                <div className="flex items-start justify-between gap-2 pl-1">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-mono text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                        {lang === 'EN' ? 'HIGH SEVERITY' : 'उच्च जोखिम'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#ffdbd1] text-[#3b0a00] font-mono text-[10px] font-semibold">
                        {lang === 'EN' ? 'UNFAVORABLE_CLAUSE' : 'प्रतिकूल धारा'}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-[#191c1e]">
                      {lang === 'EN' ? card.clauseTitle : 'धारा ८.३: असीमित क्षतिपूर्ति एवं उत्तरदायित्व सीमा'}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-[#5b4139] shrink-0 bg-[#eceef0] px-2 py-0.5 rounded">
                    {card.confidence}
                  </span>
                </div>

                {/* Diff Comparison Matrix */}
                <div className="flex flex-col gap-2.5 pl-1">
                  {/* Original Strikethrough Text */}
                  <div className="rounded-lg p-2.5 bg-[#ffdad6]/40 border border-[#ffdad6]">
                    <div className="flex items-center gap-1 text-[#ba1a1a] mb-1">
                      <span className="material-symbols-outlined text-[16px]">remove_circle_outline</span>
                      <span className="font-mono text-[10px] font-bold uppercase">
                        {lang === 'EN' ? 'Original Stipulation (Disadvantageous)' : 'मूल शर्त (प्रतिकूल)'}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#191c1e] line-through opacity-85 leading-relaxed pl-1">
                      {card.originalText}
                    </p>
                  </div>

                  {/* Synthesized AI Replacement */}
                  <div className="rounded-lg p-2.5 bg-[#f2f4f6] border border-[#e4beb4]/30">
                    <div className="flex items-center gap-1 text-[#ac2e00] mb-1">
                      <span className="material-symbols-outlined text-[16px]">add_circle</span>
                      <span className="font-mono text-[10px] font-bold uppercase">
                        {lang === 'EN' ? 'Recommended Synthesis (Indian Market Standard)' : 'अनुशंसित विधिक सुधार (भारतीय मानक)'}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#191c1e] font-medium leading-relaxed pl-1">
                      {lang === 'EN' ? (
                        <>
                          “In no event shall either party aggregate liability exceed the total fees paid by Customer in the
                          preceding 12 months, or{' '}
                          <strong className="text-[#ac2e00] font-bold">₹50,00,000 (Fifty Lakh Rupees)</strong>, whichever is
                          greater, compliant with{' '}
                          <strong className="text-[#191c1e] font-semibold">Section 73/74 of Indian Contract Act 1872</strong>
                          .”
                        </>
                      ) : (
                        <>
                          “किसी भी स्थिति में किसी भी पक्ष का कुल दायित्व पिछले १२ महीनों में ग्राहक द्वारा भुगतान किए गए कुल शुल्क, या{' '}
                          <strong className="text-[#ac2e00] font-bold">₹५०,००,००० (पचास लाख रुपये)</strong>, जो भी अधिक हो, से अधिक नहीं होगा, जो कि{' '}
                          <strong className="text-[#191c1e] font-semibold">भारतीय संविदा अधिनियम १८७२ की धारा ७३/७४</strong> के अनुरूप है।”
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* AI Legal Advisory Rationale */}
                <div className="bg-[#f2f4f6] rounded-lg p-2.5 flex items-start gap-2 pl-2 border border-[#e4beb4]/20">
                  <span className="material-symbols-outlined text-[#ac2e00] text-[18px] shrink-0 mt-0.5">
                    psychology
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#5b4139] uppercase tracking-wider font-bold">
                      {lang === 'EN' ? 'AI Legal Analysis' : 'एआई विधिक विश्लेषण'}
                    </span>
                    <p className="text-[12px] text-[#191c1e] leading-snug mt-0.5">
                      {lang === 'EN'
                        ? card.analysisText
                        : 'असीमित क्षतिपूर्ति भारतीय संविदा अधिनियम १८७२ की धारा ७३ एवं ७४ के तहत अत्यधिक जोखिम पैदा करती है। ५० लाख रुपये की पारस्परिक सीमा का सुझाव दिया जाता है।'}
                    </p>
                  </div>
                </div>

                {/* Action Button Group */}
                <div className="flex flex-col gap-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAccept(1)}
                      className="h-[46px] px-2 rounded-lg bg-[#ac2e00] hover:bg-[#d53e07] active:scale-[0.98] text-white font-bold text-[12px] flex items-center justify-center gap-1 shadow-xs transition-all text-center leading-tight"
                    >
                      <span className="material-symbols-outlined text-[16px] shrink-0">check_circle</span>
                      <span>{lang === 'EN' ? 'Accept & Apply' : 'स्वीकार करें एवं लागू करें'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(1)}
                      className="h-[46px] px-2 rounded-lg bg-[#eceef0] hover:bg-[#e0e3e5] active:scale-[0.98] text-[#191c1e] font-bold text-[12px] flex items-center justify-center gap-1 transition-all text-center leading-tight"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#5b4139] shrink-0">cancel</span>
                      <span>{lang === 'EN' ? 'Reject' : 'अस्वीकार करें'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('esign')}
                    className="w-full py-2 rounded-lg text-[#ac2e00] hover:bg-[#ffdbd1]/30 font-bold text-[12px] flex items-center justify-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_document</span>
                    <span>{lang === 'EN' ? 'Modify in Studio' : 'स्टूडियो में संपादित करें'}</span>
                  </button>
                </div>

                {/* Feedback State Overlay if applied */}
                {card.applied && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-xs p-4 flex flex-col items-center justify-center text-center z-10 animate-in fade-in">
                    <span className="w-12 h-12 rounded-full bg-[#ffdbd1] text-[#ac2e00] flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-[28px]">done_all</span>
                    </span>
                    <h4 className="text-[14px] font-bold text-[#191c1e]">
                      {lang === 'EN' ? 'Clause 8.3 Queued for Ledger Sync' : 'धारा ८.३ लेजर सिंक हेतु कतारबद्ध'}
                    </h4>
                    <p className="text-[11px] text-[#5b4139] mt-1 max-w-[240px]">
                      {lang === 'EN'
                        ? 'Smart contract ABI payload patched. Ready for dual multi-sig commit.'
                        : 'स्मार्ट अनुबंध संशोधित। मल्टी-सिग निष्पादन हेतु तैयार।'}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleUndo(1)}
                      className="mt-3 px-3 py-1 rounded-full bg-[#eceef0] text-[#191c1e] font-mono text-[11px] font-bold"
                    >
                      {lang === 'EN' ? 'Undo Change' : 'परिवर्तन पूर्ववत करें'}
                    </button>
                  </div>
                )}
              </article>
            );
          }

          // Suggestion Card 2: Medium Severity Missing Term
          if (card.id === 2) {
            return (
              <article
                key={card.id}
                className={`bg-white rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col gap-3.5 border border-[#e4beb4]/30 transition-all ${
                  card.rejected ? 'opacity-40 scale-[0.98] pointer-events-none' : ''
                }`}
              >
                {/* Amber Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#954500]"></div>

                {/* Card Header Metadata */}
                <div className="flex items-start justify-between gap-2 pl-1">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-[#ffdbc8] text-[#321200] font-mono text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#954500]"></span>
                        {lang === 'EN' ? 'MEDIUM SEVERITY' : 'मध्यम जोखिम'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#eceef0] text-[#5b4139] font-mono text-[10px] font-semibold">
                        {lang === 'EN' ? 'REGULATORY COMPLIANCE' : 'नियामक अनुपालन'}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-[#191c1e]">
                      {lang === 'EN' ? card.clauseTitle : 'धारा १२.१: डीपीडीपी अधिनियम २०२३ एवं सीईआरटी-इन अधिसूचना'}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-[#5b4139] shrink-0 bg-[#eceef0] px-2 py-0.5 rounded">
                    {card.confidence}
                  </span>
                </div>

                {/* Suggested Insertion Preview */}
                <div className="flex flex-col gap-1 pl-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#5b4139] font-bold">
                    {lang === 'EN' ? 'Recommended Insertion:' : 'अनुशंसित समावेशन:'}
                  </span>
                  <div className="rounded-lg p-2.5 bg-[#f2f4f6] border border-[#e4beb4]/30">
                    <p className="text-[12px] text-[#191c1e] leading-relaxed pl-1">
                      {lang === 'EN' ? (
                        <>
                          “In the event of a security incident involving Indian data principals, Data Fiduciary shall
                          notify the <strong className="text-[#191c1e] font-semibold">Data Protection Board of India (DPBI)</strong>{' '}
                          and affected data principals without undue delay and within mandatory statutory{' '}
                          <strong className="text-[#ac2e00] font-bold">CERT-In 6-hour reporting window</strong>.”
                        </>
                      ) : (
                        <>
                          “भारतीय डेटा नागरिकों से संबंधित किसी सुरक्षा घटना की स्थिति में, डेटा न्यासी{' '}
                          <strong className="text-[#191c1e] font-semibold">भारतीय डेटा संरक्षण बोर्ड (DPBI)</strong>{' '}
                          एवं प्रभावित नागरिकों को अनिवार्य वैधानिक{' '}
                          <strong className="text-[#ac2e00] font-bold">सीईआरटी-इन ६ घंटे की समय-सीमा</strong> के भीतर सूचित करेगा।”
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* AI Analysis Rationale */}
                <div className="bg-[#f2f4f6] rounded-lg p-2.5 flex items-start gap-2 pl-2 border border-[#e4beb4]/20">
                  <span className="material-symbols-outlined text-[#954500] text-[18px] shrink-0 mt-0.5">
                    verified_user
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#5b4139] uppercase tracking-wider font-bold">
                      {lang === 'EN' ? 'Regulatory Compliance Delta' : 'नियामक अनुपालन अंतर'}
                    </span>
                    <p className="text-[12px] text-[#191c1e] leading-snug mt-0.5">
                      {lang === 'EN'
                        ? card.analysisText
                        : 'डीपीडीपी अधिनियम २०२३ एवं सीईआरटी-इन निर्देशों के तहत डेटा उल्लंघन की अनिवार्य रिपोर्टिंग आवश्यक है।'}
                    </p>
                  </div>
                </div>

                {/* Action Button Group */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAccept(2)}
                    className="h-[46px] px-2 rounded-lg bg-[#ac2e00] hover:bg-[#d53e07] active:scale-[0.98] text-white font-bold text-[12px] flex items-center justify-center gap-1 shadow-xs transition-all text-center leading-tight"
                  >
                    <span className="material-symbols-outlined text-[16px] shrink-0">add_task</span>
                    <span>{lang === 'EN' ? 'Insert Clause' : 'धारा जोड़ें'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(2)}
                    className="h-[46px] px-2 rounded-lg bg-[#eceef0] hover:bg-[#e0e3e5] active:scale-[0.98] text-[#191c1e] font-bold text-[12px] flex items-center justify-center gap-1 transition-all text-center leading-tight"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#5b4139] shrink-0">close</span>
                    <span>{lang === 'EN' ? 'Dismiss' : 'खारिज करें'}</span>
                  </button>
                </div>

                {/* Feedback State Overlay if applied */}
                {card.applied && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-xs p-4 flex flex-col items-center justify-center text-center z-10 animate-in fade-in">
                    <span className="w-12 h-12 rounded-full bg-[#dce2f7] text-[#141b2b] flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-[28px]">lock_reset</span>
                    </span>
                    <h4 className="text-[14px] font-bold text-[#191c1e]">
                      {lang === 'EN' ? 'Clause 12.1 Added to Contract' : 'धारा १२.१ अनुबंध में जोड़ी गई'}
                    </h4>
                    <p className="text-[11px] text-[#5b4139] mt-1 max-w-[240px]">
                      {lang === 'EN'
                        ? 'DPBI & CERT-In triggers registered to Polygon verification node.'
                        : 'पॉलीगॉन नोड पर पंजीकृत नियामक ट्रिगर।'}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleUndo(2)}
                      className="mt-3 px-3 py-1 rounded-full bg-[#eceef0] text-[#191c1e] font-mono text-[11px] font-bold"
                    >
                      {lang === 'EN' ? 'Undo Change' : 'परिवर्तन पूर्ववत करें'}
                    </button>
                  </div>
                )}
              </article>
            );
          }
          return null;
        })}
      </div>

      {/* Copilot Quick Analysis Engine & Prompt Box */}
      <section className="mt-auto">
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2.5 border border-[#e4beb4]/30">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ac2e00] animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-wider text-[#191c1e] font-bold">
                {lang === 'EN' ? 'Copilot Query Station' : 'एआई साथी प्रश्न केंद्र'}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#5b4139] bg-[#eceef0] px-2 py-0.5 rounded">
              Llama-3-Legal-70B
            </span>
          </div>

          {/* Quick Suggested Prompts Horizontal Rail */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            <button
              type="button"
              onClick={() => handleApplyPrompt(lang === 'EN' ? 'Summarize Stamp Duty for Maharashtra/Karnataka' : 'महाराष्ट्र/कर्नाटक के लिए स्टाम्प शुल्क का सारांश')}
              className="shrink-0 px-3 py-1.5 rounded-full bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] text-[11px] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px] text-[#ac2e00]">account_balance</span>
              <span>{lang === 'EN' ? 'Summarize Stamp Duty' : 'स्टाम्प शुल्क सारांश'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyPrompt(lang === 'EN' ? 'Check Delhi/Mumbai Jurisdiction and governing courts' : 'दिल्ली/मुंबई क्षेत्राधिकार एवं न्यायालय समीक्षा')}
              className="shrink-0 px-3 py-1.5 rounded-full bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] text-[11px] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px] text-[#ac2e00]">gavel</span>
              <span>{lang === 'EN' ? 'Check Jurisdiction' : 'क्षेत्राधिकार जांच'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyPrompt(lang === 'EN' ? 'Evaluate arbitration clause under Arbitration Act 1996 and MCIA rules' : 'मध्यस्थता अधिनियम १९९६ एवं MCIA नियमों का मूल्यांकन')}
              className="shrink-0 px-3 py-1.5 rounded-full bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] text-[11px] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px] text-[#ac2e00]">balance</span>
              <span>{lang === 'EN' ? 'Arbitration Act 1996' : 'मध्यस्थता अधिनियम १९९६'}</span>
            </button>
          </div>

          {/* Query Response Box */}
          {queryResponse && (
            <div className="p-3 bg-[#ffdbd1]/30 rounded-lg border border-[#ffdbd1] text-[12px] text-[#191c1e] animate-in fade-in leading-relaxed">
              {queryResponse}
            </div>
          )}

          {/* Query Input Form */}
          <form onSubmit={handleSubmitQuery} className="flex items-center gap-2 bg-[#f2f4f6] rounded-xl p-1.5 border border-[#e4beb4]/30">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={lang === 'EN' ? 'Ask PAKT Copilot about Indian legal compliance...' : 'भारतीय विधिक अनुपालन के बारे में पाक्ट एआई से पूछें...'}
              className="flex-1 bg-transparent px-2.5 py-1.5 text-[13px] text-[#191c1e] placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isQuerying}
              aria-label="Send Query"
              className="w-10 h-10 rounded-lg bg-[#ac2e00] hover:bg-[#d53e07] text-white flex items-center justify-center shrink-0 shadow-xs active:scale-95 transition-all"
            >
              {isQuerying ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          type="button"
          onClick={onOpenNewPakt}
          className="flex items-center gap-1.5 bg-[#ac2e00] hover:bg-[#d53e07] text-white px-4 py-2.5 rounded-full shadow-lg shadow-[#ac2e00]/25 active:scale-95 transition-all duration-150 font-bold text-[13px]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>{lang === 'EN' ? 'New PAKT' : 'नया अनुबंध'}</span>
        </button>
      </div>
    </div>
  );
};
