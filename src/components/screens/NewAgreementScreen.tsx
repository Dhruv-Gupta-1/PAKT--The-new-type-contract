import React, { useState } from 'react';
import { ScreenType, Language, ContractLanguage, ContractItem, ContractClause, Signer, AuditHistoryEvent } from '../../types';
import { useLoading } from '../../context/LoadingContext';

interface NewAgreementScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
  contractLanguage?: ContractLanguage;
  onSelectContractLanguage?: (cl: ContractLanguage) => void;
  onCreateContract: (newContract: ContractItem, openInESign: boolean) => void;
}

interface TemplateOption {
  id: 'saas' | 'employment' | 'nda' | 'msa' | 'sha' | 'custom';
  titleEn: string;
  titleHi: string;
  category: 'saas' | 'employment' | 'shareholder' | 'nda';
  defaultTitleEn: string;
  defaultTitleHi: string;
  defaultTitleHinglish: string;
  defaultCounterparty: string;
  defaultConsideration: string;
  tagEn: string;
  tagHi: string;
  descriptionEn: string;
  descriptionHi: string;
  icon: string;
  color: string;
  clauses: ContractClause[];
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'saas',
    titleEn: 'SaaS & Cloud Services Agreement',
    titleHi: 'क्लाउड एवं सास (SaaS) सेवा अनुबंध',
    category: 'saas',
    defaultTitleEn: 'Master Cloud & SaaS Services Agreement (2026)',
    defaultTitleHi: 'मास्टर क्लाउड एवं साफ़्टवेयर सेवा अनुबंध (२०२६)',
    defaultTitleHinglish: 'Master Cloud aur SaaS Services Agreement (2026)',
    defaultCounterparty: 'Tata Digital Ltd',
    defaultConsideration: '₹24,00,000 / year',
    tagEn: 'Most Popular',
    tagHi: 'सर्वाधिक प्रयुक्त',
    descriptionEn: 'Industry standard for cloud platforms, API services, and enterprise software under IT Act 2000.',
    descriptionHi: 'आईटी अधिनियम २००० के अंतर्गत क्लाउड सेवाओं, एपीआई एवं एंटरप्राइज सॉफ़्टवेयर हेतु उपयुक्त।',
    icon: 'cloud_done',
    color: 'emerald',
    clauses: [
      {
        clauseNumber: '1.1',
        title: 'Scope of SaaS Platform & Subscription License',
        titleHindi: 'क्लाउड प्लेटफ़ॉर्म व सदस्यता लाइसेंस का दायरा',
        titleHinglish: 'SaaS Platform aur Subscription License ka Scope',
        statusText: 'Active',
        text: 'Provider grants Customer a non-exclusive, non-transferable right to access and utilize the cloud services during the Term in accordance with service level agreements (SLAs).',
        textHindi: 'सेवा प्रदाता ग्राहक को अनुबंध अवधि के दौरान सेवा स्तर समझौते (SLA) के अनुसार क्लाउड सेवाओं का उपयोग करने का गैर-अनन्य अधिकार प्रदान करता है।',
        textHinglish: 'Provider Customer ko contract term ke dauran SLAs ke anusaar cloud services access aur use karne ka right deta hai.'
      },
      {
        clauseNumber: '4.2',
        title: 'Fees, Invoicing & GST Compliance',
        titleHindi: 'शुल्क, चालान एवं जीएसटी अनुपालन',
        titleHinglish: 'Fees, Invoicing aur GST Compliance',
        statusText: 'Active',
        text: 'All recurring subscription fees shall be paid within 30 days of receiving an official GST electronic invoice. Applicable SGST and CGST shall be charged as per prevailing tax regulations.',
        textHindi: 'सभी आवर्ती सदस्यता शुल्क आधिकारिक जीएसटी इलेक्ट्रॉनिक चालान प्राप्त होने के ३० दिनों के भीतर देय होंगे। प्रचलित कर नियमों के अनुसार सीजीएसटी और एसजीएसटी लागू होंगे।',
        textHinglish: 'Customer official GST invoice milne ke 30 dinon ke bheetar subscription fees pay karega. Applicable taxes prevailing rules ke mutabik charge honge.'
      },
      {
        clauseNumber: '8.3',
        title: 'Fair Limitation of Liability',
        titleHindi: 'देयता एवं हर्जाना की संतुलित सीमा',
        titleHinglish: 'Fair Limitation of Liability',
        statusText: 'Active',
        text: 'Neither party shall be liable for indirect or consequential damages. Aggregate liability shall not exceed the total fees paid by Customer in the preceding 12 months, compliant with Section 73/74 of Indian Contract Act 1872.',
        textHindi: 'कोई भी पक्ष अप्रत्यक्ष या परिणामी नुकसान के लिए उत्तरदायी नहीं होगा। कुल देयता पिछले १२ महीनों में चुकाई गई कुल राशि से अधिक नहीं होगी (भारतीय संविदा अधिनियम धारा ७३/७४)।',
        textHinglish: 'Kissi bhi party ki aggregate liability preceding 12 months me paid total fees se zyada nahi hogi, Indian Contract Act ke mutabik.'
      },
      {
        clauseNumber: '12.1',
        title: 'Data Privacy & DPDP Act 2023 Reporting',
        titleHindi: 'डेटा गोपनीयता एवं डीपीडीपी अधिनियम २०२३ रिपोर्टिंग',
        titleHinglish: 'Data Privacy aur DPDP Act 2023 Reporting',
        statusText: 'Active',
        text: 'Both parties agree to treat personal data as a Data Fiduciary in strict compliance with the Digital Personal Data Protection Act 2023. In case of a breach, CERT-In and affected individuals shall be informed within 6 hours.',
        textHindi: 'दोनों पक्ष डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम २०२३ के अनुसार डेटा की सुरक्षा सुनिश्चित करेंगे और किसी घटना की स्थिति में ६ घंटे के भीतर रिपोर्ट करेंगे।',
        textHinglish: 'Dono parties DPDP Act 2023 ke rules follow karenge aur security incident par CERT-In ko 6 ghante me report karenge.'
      },
      {
        clauseNumber: '15.2',
        title: 'Arbitration & Governing Law (Mumbai Seat)',
        titleHindi: 'मध्यस्थता एवं लागू कानून (मुंबई सीट)',
        titleHinglish: 'Arbitration aur Governing Law (Mumbai Seat)',
        statusText: 'Active',
        text: 'This agreement is governed by the laws of India. Any disputes shall be referred to arbitration under the Arbitration and Conciliation Act 1996 seated in Mumbai, Maharashtra.',
        textHindi: 'यह अनुबंध भारत के कानूनों द्वारा शासित होगा। किसी भी विवाद का निपटारा मध्यस्थता एवं सुलह अधिनियम १९९६ के तहत मुंबई में किया जाएगा।',
        textHinglish: 'Yeh contract Indian laws ke mutabik govern hoga aur disputes Mumbai me arbitration ke zariye settle honge.'
      }
    ]
  },
  {
    id: 'employment',
    titleEn: 'Employment & Advisory Agreement',
    titleHi: 'रोजगार एवं वरिष्ठ सलाहकार अनुबंध',
    category: 'employment',
    defaultTitleEn: 'Lead Software Architect Employment & Advisory Agreement',
    defaultTitleHi: 'वरिष्ठ सॉफ़्टवेयर वास्तुकार रोज़गार एवं सलाहकार अनुबंध',
    defaultTitleHinglish: 'Lead Software Architect Employment aur Advisory Agreement',
    defaultCounterparty: 'Priya Sharma',
    defaultConsideration: '₹48,00,000 CTC + ESOPs',
    tagEn: 'Talent & HR',
    tagHi: 'मानव संसाधन',
    descriptionEn: 'Full employment terms, IP assignment, confidentiality, vesting schedules, and statutory PF/gratuity benefits.',
    descriptionHi: 'बौद्धिक संपदा हस्तांतरण, ईसॉप्स, पीएफ एवं विधिक लाभों सहित संपूर्ण नियुक्ति अनुबंध।',
    icon: 'badge',
    color: 'blue',
    clauses: [
      {
        clauseNumber: '1.1',
        title: 'Position, Scope of Duties & Reporting',
        titleHindi: 'पद, कर्तव्यों का दायरा एवं रिपोर्टिंग',
        titleHinglish: 'Position aur Duties ka Scope',
        statusText: 'Active',
        text: 'Employee is appointed to the role of Lead Software Architect and shall perform all duties diligently in accordance with company policies and Indian labor regulations.',
        textHindi: 'कर्मचारी को लीड सॉफ़्टवेयर वास्तुकार के पद पर नियुक्त किया जाता है और वे कंपनी की नीतियों के अनुसार कर्तव्यों का निष्ठापूर्वक पालन करेंगे।',
        textHinglish: 'Employee ko Lead Software Architect appoint kiya jata hai aur woh company policies ke mutabik work karenge.'
      },
      {
        clauseNumber: '3.1',
        title: 'Intellectual Property Assignment',
        titleHindi: 'बौद्धिक संपदा का पूर्ण हस्तांतरण',
        titleHinglish: 'Intellectual Property ka Assignment',
        statusText: 'Active',
        text: 'All works, patents, source code, designs, and innovations developed during employment shall exclusively belong to the Employer under the Indian Copyright Act 1957.',
        textHindi: 'रोजगार के दौरान विकसित सभी कार्य, पेटेंट, सोर्स कोड एवं नवाचार विशेष रूप से नियोक्ता की संपत्ति होंगे (भारतीय कॉपीराइट अधिनियम १९५७)।',
        textHinglish: 'Employment ke dauran banaya gaya sabhi code aur IP exclusively employer ki property hogi.'
      },
      {
        clauseNumber: '5.2',
        title: 'Compensation, ESOP Grant & Benefits',
        titleHindi: 'पारिश्रमिक, ईसॉप अनुदान एवं लाभ',
        titleHinglish: 'Compensation, ESOP Grant aur Benefits',
        statusText: 'Active',
        text: 'Employee shall receive annual CTC payable monthly, subject to statutory tax deductions (TDS), Provident Fund contributions, and standard ESOP vesting schedules.',
        textHindi: 'कर्मचारी को वैधानिक कर कटौती (TDS) और भविष्य निधि (PF) के अधीन मासिक वेतन एवं ईसॉप वेस्टिंग अनुसूची प्राप्त होगी।',
        textHinglish: 'Employee ko monthly salary milegi with standard TDS deductions, PF contributions aur ESOP grant.'
      },
      {
        clauseNumber: '9.1',
        title: 'Non-Solicitation & Confidentiality',
        titleHindi: 'गैर-प्रलोभन एवं गोपनीयता दायित्व',
        titleHinglish: 'Non-Solicitation aur Confidentiality',
        statusText: 'Active',
        text: 'For a period of 12 months following termination, employee agrees not to solicit company clients or entice colleagues away, in compliance with Section 27 of Indian Contract Act.',
        textHindi: 'कार्यमुक्ति के बाद १२ महीने की अवधि तक कर्मचारी कंपनी के ग्राहकों या कर्मचारियों को लुभाने का प्रयास नहीं करेगा।',
        textHinglish: 'Termination ke baad 12 months tak employee company clients ya colleagues ko solicit nahi karega.'
      }
    ]
  },
  {
    id: 'nda',
    titleEn: 'Mutual Non-Disclosure Agreement (NDA)',
    titleHi: 'द्विपक्षीय गैर-प्रकटीकरण अनुबंध (NDA)',
    category: 'nda',
    defaultTitleEn: 'Mutual Confidentiality & Non-Disclosure Agreement',
    defaultTitleHi: 'आपसी गोपनीयता एवं गैर-प्रकटीकरण अनुबंध',
    defaultTitleHinglish: 'Mutual Confidentiality aur NDA Agreement',
    defaultCounterparty: 'Infosys BPM Ltd',
    defaultConsideration: 'Mutual Covenant',
    tagEn: 'Essential',
    tagHi: 'आवश्यक सुरक्षा',
    descriptionEn: 'Safeguards proprietary information, business metrics, and code before commercial discussions.',
    descriptionHi: 'व्यावसायिक वार्ता से पूर्व व्यापारिक रहस्यों एवं गोपनीय डेटा की पूर्ण सुरक्षा।',
    icon: 'shield',
    color: 'amber',
    clauses: [
      {
        clauseNumber: '1.1',
        title: 'Definition of Confidential Information',
        titleHindi: 'गोपनीय जानकारी की परिभाषा',
        titleHinglish: 'Confidential Information ki Definition',
        statusText: 'Active',
        text: 'Includes all technical, financial, customer, trade secrets, software code, and business data marked or reasonably understood to be confidential.',
        textHindi: 'इसमें सभी तकनीकी, वित्तीय, ग्राहक, व्यापारिक रहस्य एवं सॉफ़्टवेयर कोड शामिल हैं जो गोपनीय माने जाते हैं।',
        textHinglish: 'Sabhi technical, financial aur business code details jo confidential hain isme shamil hain.'
      },
      {
        clauseNumber: '2.3',
        title: 'Non-Disclosure & Permitted Use',
        titleHindi: 'गैर-प्रकटीकरण एवं अनुमत उपयोग',
        titleHinglish: 'Non-Disclosure aur Permitted Use',
        statusText: 'Active',
        text: 'The recipient party shall use confidential information solely for evaluating mutual collaboration and shall protect it with reasonable industry care.',
        textHindi: 'प्राप्तकर्ता पक्ष गोपनीय जानकारी का उपयोग केवल आपसी सहयोग के मूल्यांकन हेतु करेगा और इसे पूर्णतः सुरक्षित रखेगा।',
        textHinglish: 'Recipient party confidential info ka use sirf mutual collaboration evaluate karne ke liye karegi.'
      },
      {
        clauseNumber: '4.1',
        title: 'Term of Confidentiality (2 Years)',
        titleHindi: 'गोपनीयता की अवधि (२ वर्ष)',
        titleHinglish: 'Confidentiality ka Term (2 Years)',
        statusText: 'Active',
        text: 'The obligations of confidentiality shall remain in effect for two (2) years from the date of disclosure, except for trade secrets which remain perpetual.',
        textHindi: 'गोपनीयता के दायित्व प्रकटीकरण की तिथि से दो (२) वर्षों तक प्रभावी रहेंगे, जबकि व्यापार रहस्य अनिश्चित काल तक सुरक्षित रहेंगे।',
        textHinglish: 'Confidentiality obligations 2 saal tak valid rahenge, aur trade secrets perpetually protected rahenge.'
      }
    ]
  },
  {
    id: 'msa',
    titleEn: 'Master Services Agreement (MSA)',
    titleHi: 'मास्टर सेवा एवं विक्रेता अनुबंध (MSA)',
    category: 'saas',
    defaultTitleEn: 'Master Professional Services Agreement 2026',
    defaultTitleHi: 'मास्टर व्यावसायिक सेवा अनुबंध २०२६',
    defaultTitleHinglish: 'Master Professional Services Agreement 2026',
    defaultCounterparty: 'Reliance Jio Infocomm Ltd',
    defaultConsideration: '₹75,00,000 Milestone Based',
    tagEn: 'Enterprise',
    tagHi: 'एंटरप्राइज',
    descriptionEn: 'Umbrella agreement for multi-phase deliverables, Statements of Work (SOW), and vendor milestones.',
    descriptionHi: 'बहु-चरणीय परियोजना वितरण, कार्य विवरण (SOW) एवं विक्रेता मील के पत्थरों हेतु व्यापक अनुबंध।',
    icon: 'handshake',
    color: 'purple',
    clauses: [
      {
        clauseNumber: '1.0',
        title: 'Statements of Work & Execution Order',
        titleHindi: 'कार्य विवरण (SOW) एवं कार्यान्वयन क्रम',
        titleHinglish: 'Statements of Work aur Execution Order',
        statusText: 'Active',
        text: 'Specific project deliverables, milestones, timelines, and payment terms shall be defined in separately executed Statements of Work (SOWs).',
        textHindi: 'विशिष्ट परियोजना कार्य, मील के पत्थर, समय सीमा एवं भुगतान शर्तें अलग से निष्पादित कार्य विवरण (SOW) में तय होंगी।',
        textHinglish: 'Specific project milestones aur deliverables alag se execute hone wale SOW documents me define honge.'
      },
      {
        clauseNumber: '4.1',
        title: 'Acceptance Criteria & Quality Warranty',
        titleHindi: 'स्वीकृति मानदंड एवं गुणवत्ता वारंटी',
        titleHinglish: 'Acceptance Criteria aur Quality Warranty',
        statusText: 'Active',
        text: 'Customer shall have 10 business days to test and accept deliverables. Provider shall promptly remedy any material discrepancies free of charge.',
        textHindi: 'ग्राहक के पास कार्य की जांच और स्वीकृति के लिए १० व्यावसायिक दिन होंगे। प्रदाता किसी भी कमी को निःशुल्क तुरंत ठीक करेगा।',
        textHinglish: 'Customer ke paas deliverables test karne ke liye 10 business days honge. Provider defects ko promptly fix karega.'
      },
      {
        clauseNumber: '7.2',
        title: 'Indemnity & Intellectual Property Warranty',
        titleHindi: 'क्षतिपूर्ति एवं बौद्धिक संपदा वारंटी',
        titleHinglish: 'Indemnity aur IP Warranty',
        statusText: 'Active',
        text: 'Provider warrants that deliverables do not infringe any third-party intellectual property rights and indemnifies Customer against valid claims.',
        textHindi: 'प्रदाता यह आश्वासन देता है कि प्रदान किए गए कार्य किसी तीसरे पक्ष के अधिकारों का उल्लंघन नहीं करते हैं।',
        textHinglish: 'Provider warrant karta hai ki deliverables kisi third party ke IP rights ka infringement nahi karte.'
      }
    ]
  },
  {
    id: 'sha',
    titleEn: 'Shareholders & Advisory Agreement',
    titleHi: 'शेयरधारक एवं सलाहकार अनुबंध',
    category: 'shareholder',
    defaultTitleEn: 'Shareholders & Advisory Equity Agreement (2026)',
    defaultTitleHi: 'शेयरधारक एवं इक्विटी सलाहकार अनुबंध (२०२६)',
    defaultTitleHinglish: 'Shareholders aur Advisory Equity Agreement (2026)',
    defaultCounterparty: 'Sequoia India Growth Fund / Elevation',
    defaultConsideration: '₹1,50,00,000 Equity Investment',
    tagEn: 'Corporate',
    tagHi: 'कॉर्पोरेट',
    descriptionEn: 'Founder rights, board composition, pre-emption, drag-along, and tag-along rights under the Companies Act 2013.',
    descriptionHi: 'कंपनी अधिनियम २०१३ के अंतर्गत निदेशक मंडल संरचना, प्री-एम्पशन एवं टैग-अलॉन्ग अधिकार।',
    icon: 'account_balance',
    color: 'indigo',
    clauses: [
      {
        clauseNumber: '2.1',
        title: 'Board Representation & Affirmative Voting Matters',
        titleHindi: 'निदेशक मंडल प्रतिनिधित्व एवं महत्वपूर्ण मतदान मामले',
        titleHinglish: 'Board Representation aur Voting Matters',
        statusText: 'Active',
        text: 'Key corporate decisions, including fundraising, major mergers, and share buybacks, require the affirmative consent of the designated advisory director.',
        textHindi: 'फंड जुटाने, बड़े विलय एवं शेयर पुनर्खरीद जैसे महत्वपूर्ण निर्णयों के लिए नामित सलाहकार निदेशक की सहमति आवश्यक होगी।',
        textHinglish: 'Fundraising aur mergers jaise key decisions ke liye designated director ki affirmative consent zaroori hogi.'
      },
      {
        clauseNumber: '5.3',
        title: 'Pre-Emptive Rights & Anti-Dilution',
        titleHindi: 'पूर्वाधिकार अधिकार एवं डाइल्यूशन से सुरक्षा',
        titleHinglish: 'Pre-Emptive Rights aur Anti-Dilution',
        statusText: 'Active',
        text: 'Existing shareholders shall have the right of first refusal to participate pro-rata in any future equity issuance to maintain their shareholding percentage.',
        textHindi: 'मौजूदा शेयरधारकों के पास अपनी हिस्सेदारी बनाए रखने के लिए भविष्य के शेयर निर्गम में आनुपातिक रूप से भाग लेने का पहला अधिकार होगा।',
        textHinglish: 'Existing shareholders ke paas future equity rounds me pro-rata participate karne ka right of first refusal hoga.'
      }
    ]
  },
  {
    id: 'custom',
    titleEn: 'Custom / Commercial Agreement',
    titleHi: 'कस्टम / व्यावसायिक अनुबंध',
    category: 'saas',
    defaultTitleEn: 'Strategic Commercial Collaboration Agreement 2026',
    defaultTitleHi: 'रणनीतिक व्यावसायिक सहयोग अनुबंध २०२६',
    defaultTitleHinglish: 'Strategic Commercial Collaboration Agreement 2026',
    defaultCounterparty: 'Business Partner / Vendor',
    defaultConsideration: 'As Agreed',
    tagEn: 'Customizable',
    tagHi: 'कस्टमाइज़ेबल',
    descriptionEn: 'Start with essential standard legal clauses and append your own custom terms and conditions.',
    descriptionHi: 'बुनियादी विधिक शर्तों से शुरुआत करें और अपनी आवश्यक विशेष शर्तें जोड़ें।',
    icon: 'edit_document',
    color: 'teal',
    clauses: [
      {
        clauseNumber: '1.1',
        title: 'Purpose & Mutual Obligations',
        titleHindi: 'उद्देश्य एवं आपसी दायित्व',
        titleHinglish: 'Purpose aur Mutual Obligations',
        statusText: 'Active',
        text: 'The parties agree to collaborate in good faith according to the agreed terms, timelines, and deliverables outlined herein.',
        textHindi: 'दोनों पक्ष सद्भावपूर्वक सहमत शर्तों एवं समय-सीमा के अनुसार सहयोग करने के लिए सहमत हैं।',
        textHinglish: 'Dono parties mutually agreed terms aur timelines ke mutabik work karne ke liye agree karte hain.'
      },
      {
        clauseNumber: '4.1',
        title: 'Confidentiality & Code of Conduct',
        titleHindi: 'गोपनीयता एवं आचार संहिता',
        titleHinglish: 'Confidentiality aur Code of Conduct',
        statusText: 'Active',
        text: 'All exchange of proprietary business information shall be strictly confidential and used solely for the intended partnership.',
        textHindi: 'व्यापारिक जानकारी का आदान-प्रदान पूर्णतः गोपनीय रहेगा और इसका उपयोग केवल तय उद्देश्य हेतु किया जाएगा।',
        textHinglish: 'Sabhi proprietary information strictly confidential rahegi aur sirf partnership ke liye use hogi.'
      },
      {
        clauseNumber: '7.1',
        title: 'Governing Law & Dispute Settlement',
        titleHindi: 'लागू कानून एवं विवाद निपटारा',
        titleHinglish: 'Governing Law aur Dispute Settlement',
        statusText: 'Active',
        text: 'Governed by the laws of India. Any controversy shall be resolved through amicable consultation or binding arbitration.',
        textHindi: 'भारतीय कानूनों द्वारा शासित। किसी भी विवाद का समाधान आपसी बातचीत या मध्यस्थता द्वारा किया जाएगा।',
        textHinglish: 'Indian laws ke mutabik govern hoga aur disputes arbitration ke zariye solve honge.'
      }
    ]
  }
];

export const NewAgreementScreen: React.FC<NewAgreementScreenProps> = ({
  onNavigate,
  lang,
  contractLanguage: initialContractLang = 'en',
  onSelectContractLanguage,
  onCreateContract,
}) => {
  const { showLoading } = useLoading();

  // Selected Template
  const [selectedTemplateId, setSelectedTemplateId] = useState<'saas' | 'employment' | 'nda' | 'msa' | 'sha' | 'custom'>('saas');
  const selectedTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];

  // Agreement Form Fields
  const [title, setTitle] = useState(selectedTemplate.defaultTitleEn);
  const [counterparty, setCounterparty] = useState(selectedTemplate.defaultCounterparty);
  const [counterpartyEmail, setCounterpartyEmail] = useState('signatory@partner-org.in');
  const [remuneration, setRemuneration] = useState(selectedTemplate.defaultConsideration);
  const [jurisdiction, setJurisdiction] = useState('Mumbai Seat • Bombay High Court & MCIA');
  const [stampDutyChoice, setStampDutyChoice] = useState('Maharashtra e-Challan (GRAS) - ₹500');
  const [contractLang, setContractLang] = useState<ContractLanguage>(initialContractLang);

  // Clauses list
  const [clauses, setClauses] = useState<ContractClause[]>(selectedTemplate.clauses);
  const [expandedClauseIndex, setExpandedClauseIndex] = useState<number | null>(null);

  // Add custom clause modal / inline form
  const [showAddClauseForm, setShowAddClauseForm] = useState(false);
  const [newClauseNumber, setNewClauseNumber] = useState('');
  const [newClauseTitle, setNewClauseTitle] = useState('');
  const [newClauseText, setNewClauseText] = useState('');

  // Toggles
  const [aiAuditEnabled, setAiAuditEnabled] = useState(true);
  const [sec65BEnabled, setSec65BEnabled] = useState(true);
  const [polygonAnchorEnabled, setPolygonAnchorEnabled] = useState(true);

  // When changing template, optionally update title & clauses
  const handleSelectTemplate = (templateId: typeof selectedTemplateId) => {
    setSelectedTemplateId(templateId);
    const tmpl = TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      setTitle(
        contractLang === 'hi' ? tmpl.defaultTitleHi : contractLang === 'hinglish' ? tmpl.defaultTitleHinglish : tmpl.defaultTitleEn
      );
      setCounterparty(tmpl.defaultCounterparty);
      setRemuneration(tmpl.defaultConsideration);
      setClauses(tmpl.clauses);
      setExpandedClauseIndex(null);
    }
  };

  const handleContractLangChange = (cl: ContractLanguage) => {
    setContractLang(cl);
    if (onSelectContractLanguage) {
      onSelectContractLanguage(cl);
    }
    // Update title placeholder if untouched
    if (cl === 'hi') {
      setTitle(selectedTemplate.defaultTitleHi);
    } else if (cl === 'hinglish') {
      setTitle(selectedTemplate.defaultTitleHinglish);
    } else {
      setTitle(selectedTemplate.defaultTitleEn);
    }
  };

  const handleAddCustomClause = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClauseTitle.trim() || !newClauseText.trim()) return;

    const num = newClauseNumber.trim() || `${clauses.length + 1}.0`;
    const newClause: ContractClause = {
      clauseNumber: num,
      title: newClauseTitle.trim(),
      titleHindi: newClauseTitle.trim(),
      titleHinglish: newClauseTitle.trim(),
      statusText: 'Custom Added',
      text: newClauseText.trim(),
      textHindi: newClauseText.trim(),
      textHinglish: newClauseText.trim(),
      isCustom: true,
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setClauses(prev => [...prev, newClause]);
    setNewClauseNumber('');
    setNewClauseTitle('');
    setNewClauseText('');
    setShowAddClauseForm(false);
  };

  const handleRemoveClause = (idx: number) => {
    setClauses(prev => prev.filter((_, i) => i !== idx));
  };

  const generateContractItem = (isDraft: boolean): ContractItem => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST';
    const uniqueId = `contract-${Date.now()}`;
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const code = `IN-${selectedTemplate.category.toUpperCase().slice(0, 3)}-${codeNumber}`;
    const simulatedSha = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const signers: Signer[] = [
      {
        id: `s-${Date.now()}-1`,
        name: 'Priya Sharma (You)',
        nameHindi: 'प्रिया शर्मा (आप)',
        role: 'Authorized Signatory',
        company: 'PAKT India Tech Labs LLP',
        status: isDraft ? 'active_due' : 'active_due',
        initials: 'PS',
        dscType: 'Aadhaar e-Sign OTP (UIDAI)',
      },
      {
        id: `s-${Date.now()}-2`,
        name: counterparty || 'Counterparty Signatory',
        nameHindi: counterparty || 'प्रतिपक्ष हस्ताक्षरकर्ता',
        role: 'Counterparty Signatory',
        company: counterparty || 'Partner Organization',
        status: 'in_queue',
        initials: (counterparty || 'CP').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        dscType: 'Class 3 DSC (eMudhra CA)',
      }
    ];

    const history: AuditHistoryEvent[] = [
      {
        id: `h-init-${Date.now()}`,
        timestamp,
        titleEn: 'Agreement Created & Clauses Drafted',
        titleHi: 'अनुबंध सृजित एवं धाराएं प्रारूपित',
        descriptionEn: `Draft created using ${selectedTemplate.titleEn} template under Indian Contract Act 1872.`,
        descriptionHi: `भारतीय अनुबंध अधिनियम १८७२ के तहत ${selectedTemplate.titleHi} प्रारूप का उपयोग करके अनुबंध तैयार किया गया।`,
        actor: 'Priya Sharma (Author)',
        eventType: 'creation',
      }
    ];

    if (stampDutyChoice) {
      history.push({
        id: `h-stamp-${Date.now() + 1}`,
        timestamp,
        titleEn: 'e-Stamp Duty Framework Configured',
        titleHi: 'ई-स्टाम्प शुल्क ढांचा निर्धारित',
        descriptionEn: `${stampDutyChoice} configured for legal stamping compliance.`,
        descriptionHi: `विधिक अनुपालन हेतु ${stampDutyChoice} निर्धारित किया गया।`,
        actor: 'Statutory Stamp Gateway',
        eventType: 'stamp_duty',
      });
    }

    return {
      id: uniqueId,
      code,
      title: title || selectedTemplate.defaultTitleEn,
      titleHindi: title || selectedTemplate.defaultTitleHi,
      titleHinglish: title || selectedTemplate.defaultTitleHinglish,
      category: selectedTemplate.category,
      status: isDraft ? 'in_review' : 'pending_signature',
      statusLabelEn: isDraft ? 'DRAFT IN REVIEW' : 'WAITING FOR SIGNATURE',
      statusLabelHi: isDraft ? 'प्रारूप समीक्षाधीन' : 'हस्ताक्षर की प्रतीक्षा',
      statusLabelHinglish: isDraft ? 'DRAFT IN REVIEW' : 'WAITING FOR SIGNATURE',
      parties: ['PAKT India Tech Labs LLP', counterparty || 'Partner Org'],
      partiesHindi: `पाक्त इंडिया टेक लैब्स एलएलपी एवं ${counterparty || 'साझेदार'}`,
      partiesHinglish: `PAKT India Tech Labs LLP aur ${counterparty || 'Partner Org'}`,
      sha256: simulatedSha,
      polygonTx: polygonAnchorEnabled ? 'Polygon PoS Testnet: Pending Anchor' : undefined,
      blockNumber: polygonAnchorEnabled ? '#64,129,000 (Queued)' : undefined,
      stampDuty: stampDutyChoice,
      remuneration: remuneration || 'Consideration as per terms',
      updatedTime: 'Just now',
      signers,
      clauses,
      jurisdiction,
      contractLanguage: contractLang,
      summary: `Legally compliant ${selectedTemplate.titleEn} with ${clauses.length} standard clauses under Indian jurisdiction.`,
      summaryHindi: `भारतीय क्षेत्राधिकार के तहत ${clauses.length} मानक धाराओं सहित विधिक रूप से मान्य ${selectedTemplate.titleHi}।`,
      history,
      storedInVault: false,
    };
  };

  const handleCreateAndOpenESign = (e: React.FormEvent) => {
    e.preventDefault();

    const newContract = generateContractItem(false);

    showLoading({
      titleEn: `Synthesizing Agreement: ${newContract.code}`,
      titleHi: `अनुबंध का निर्माण: ${newContract.code}`,
      subtitleEn: 'Compiling clauses, verifying statutory guidelines, and preparing digital e-sign room...',
      subtitleHi: 'धाराओं का संकलन, विधिक दिशानिर्देशों की जांच एवं डिजिटल ई-साइन कक्ष की तैयारी...',
      duration: 1800,
      customSteps: [
        'Formatting bilingual clauses under Indian Contract Act 1872...',
        aiAuditEnabled ? 'Running automated DPDP Act & liability risk audit...' : 'Checking formatting compliance...',
        'Computing SHA-256 digital fingerprint & Merkle manifest...',
        sec65BEnabled ? 'Attaching Section 65B Electronic Evidence metadata...' : 'Preparing contract envelope...',
        'Agreement successfully created! Opening sign room...',
      ],
      customStepsHi: [
        'भारतीय अनुबंध अधिनियम १८७२ के अंतर्गत धाराओं का प्रारूपण...',
        aiAuditEnabled ? 'डीपीडीपी अधिनियम एवं देयता जोखिम का स्वचालित परीक्षण...' : 'प्रारूप विनिर्देशों की जांच...',
        'SHA-256 डिजिटल फ़िंगरप्रिंट एवं घोषणापत्र की गणना...',
        sec65BEnabled ? 'धारा ६५ख इलेक्ट्रॉनिक साक्ष्य मेटाडेटा संलग्न किया गया...' : 'अनुबंध एनवेलप तैयार किया जा रहा है...',
        'अनुबंध सफलतापूर्वक तैयार! ई-साइन कक्ष खुल रहा है...',
      ],
      onComplete: () => {
        onCreateContract(newContract, true);
      },
    });
  };

  const handleSaveAsDraft = () => {
    const newContract = generateContractItem(true);

    showLoading({
      titleEn: 'Saving Agreement Draft',
      titleHi: 'अनुबंध प्रारूप सहेजा जा रहा है',
      subtitleEn: 'Saving to your contracts list for review and editing...',
      subtitleHi: 'समीक्षा एवं संपादन के लिए अनुबंध सूची में सहेजा जा रहा है...',
      duration: 1200,
      onComplete: () => {
        onCreateContract(newContract, false);
      },
    });
  };

  return (
    <div className="w-full pb-24 animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Breadcrumb & Header Bar */}
        <section className="w-full mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <button
                  type="button"
                  onClick={() => onNavigate('contracts')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>{lang === 'EN' ? 'Contracts' : 'अनुबंध सूची'}</span>
                </button>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-semibold text-[#ac2e00]">
                  {lang === 'EN' ? 'New Agreement' : 'नया अनुबंध'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {lang === 'EN' ? 'Draft New Agreement' : 'नया अनुबंध तैयार करें'}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                {lang === 'EN'
                  ? 'Configure, customize clauses, and execute a legally binding agreement under Indian law.'
                  : 'भारतीय कानूनों के तहत विधिक रूप से मान्य अनुबंध तैयार करें, धाराएं अनुकूलित करें और हस्ताक्षर करें।'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
              >
                {lang === 'EN' ? 'Save as Draft' : 'प्रारूप सहेजें'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contracts')}
                className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold transition-all"
              >
                {lang === 'EN' ? 'Cancel' : 'रद्द करें'}
              </button>
            </div>
          </div>
        </section>

        {/* STEP 1: Select Framework / Template */}
        <section className="w-full mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-mono flex items-center justify-center font-bold">1</span>
                <span>{lang === 'EN' ? 'Select Agreement Framework' : 'अनुबंध प्रारूप चुनें'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'EN' ? 'Choose a pre-vetted legal framework with standard statutory clauses.' : 'मानक विधिक धाराओं से युक्त पूर्व-सत्यापित प्रारूप चुनें।'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all border text-left flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-orange-50/40 border-[#ac2e00] ring-1 ring-[#ac2e00] shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#ac2e00] text-white flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </span>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#ac2e00] text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <span className="material-symbols-outlined text-[18px]">{tmpl.icon}</span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {lang === 'EN' ? tmpl.tagEn : tmpl.tagHi}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                      {lang === 'EN' ? tmpl.titleEn : tmpl.titleHi}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {lang === 'EN' ? tmpl.descriptionEn : tmpl.descriptionHi}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{tmpl.clauses.length} {lang === 'EN' ? 'clauses included' : 'शर्तें शामिल'}</span>
                    <span className="text-[#ac2e00] font-semibold">{isSelected ? (lang === 'EN' ? 'Selected' : 'चयनित') : (lang === 'EN' ? 'Select' : 'चुनें')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Form Container */}
        <form onSubmit={handleCreateAndOpenESign} className="space-y-8">
          {/* STEP 2: Agreement Language, Jurisdiction & Stamp Duty */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-mono flex items-center justify-center font-bold">2</span>
              <span>{lang === 'EN' ? 'Drafting Language & Legal Jurisdiction' : 'प्रारूपण भाषा एवं विधिक क्षेत्राधिकार'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {/* Drafting Language Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'EN' ? 'Agreement Language' : 'अनुबंध की भाषा'}
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => handleContractLangChange('en')}
                    className={`py-1.5 text-center text-xs font-semibold rounded-lg transition-all ${
                      contractLang === 'en'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => handleContractLangChange('hi')}
                    className={`py-1.5 text-center text-xs font-semibold rounded-lg transition-all ${
                      contractLang === 'hi'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    हिन्दी
                  </button>
                  <button
                    type="button"
                    onClick={() => handleContractLangChange('hinglish')}
                    className={`py-1.5 text-center text-xs font-semibold rounded-lg transition-all ${
                      contractLang === 'hinglish'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Hinglish
                  </button>
                </div>
                <span className="block text-[11px] text-slate-500 mt-1">
                  {lang === 'EN' ? 'Generates the text in this language' : 'अनुबंध का मूल पाठ इसी भाषा में बनेगा'}
                </span>
              </div>

              {/* Legal Jurisdiction Seat */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'EN' ? 'Legal Seat & Courts' : 'विधिक सीट व न्यायालय'}
                </label>
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 font-medium focus:outline-none focus:border-[#ac2e00] focus:bg-white"
                >
                  <option value="Mumbai Seat • Bombay High Court & MCIA">Mumbai (Bombay High Court & MCIA)</option>
                  <option value="New Delhi Seat • Delhi High Court & DIAC">New Delhi (Delhi High Court & DIAC)</option>
                  <option value="Bengaluru Seat • Karnataka High Court">Bengaluru (Karnataka High Court)</option>
                  <option value="Hyderabad Seat • Telangana High Court">Hyderabad (Telangana High Court)</option>
                </select>
                <span className="block text-[11px] text-slate-500 mt-1">
                  {lang === 'EN' ? 'Arbitration Seat under Act of 1996' : '१९९६ अधिनियम के तहत मध्यस्थता सीट'}
                </span>
              </div>

              {/* e-Stamp Duty Provider */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'EN' ? 'e-Stamp Duty Challan' : 'ई-स्टाम्प शुल्क व्यवस्था'}
                </label>
                <select
                  value={stampDutyChoice}
                  onChange={(e) => setStampDutyChoice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 font-medium focus:outline-none focus:border-[#ac2e00] focus:bg-white"
                >
                  <option value="Maharashtra e-Challan (GRAS) - ₹500">Maharashtra GRAS e-Challan (₹500)</option>
                  <option value="NCT Delhi e-Stamping (StockHolding) - ₹100">NCT Delhi e-Stamping (₹100)</option>
                  <option value="Karnataka Digital Stamping - ₹200">Karnataka Digital Stamping (₹200)</option>
                  <option value="Pre-stamped / Statutory Exemption">Pre-stamped / Statutory Exemption</option>
                </select>
                <span className="block text-[11px] text-slate-500 mt-1">
                  {lang === 'EN' ? 'Compliant with State Stamp Act' : 'राज्य स्टाम्प अधिनियम के अनुरूप'}
                </span>
              </div>
            </div>
          </section>

          {/* STEP 3: Agreement Details & Counterparty */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-mono flex items-center justify-center font-bold">3</span>
              <span>{lang === 'EN' ? 'Agreement Details & Counterparty' : 'अनुबंध विवरण एवं प्रतिपक्ष'}</span>
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'EN' ? 'Agreement Title' : 'अनुबंध का शीर्षक'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Cloud Services Agreement 2026"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:border-[#ac2e00] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Party (Pre-filled) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {lang === 'EN' ? 'First Party (Your Organization)' : 'प्रथम पक्षकार (आपकी संस्था)'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value="PAKT India Tech Labs LLP"
                    className="w-full bg-slate-100 border border-slate-200 text-slate-600 text-xs rounded-xl px-3.5 py-2.5 font-medium cursor-not-allowed"
                  />
                  <span className="block text-[11px] text-slate-500 mt-1">
                    {lang === 'EN' ? 'Signed via your Aadhaar OTP / DSC' : 'आपके आधार ओटीपी अथवा डीएससी से हस्ताक्षरित'}
                  </span>
                </div>

                {/* Second Party Counterparty */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {lang === 'EN' ? 'Second Party (Counterparty Name/Org)' : 'द्वितीय पक्षकार (प्रतिपक्ष का नाम/संस्था)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={counterparty}
                    onChange={(e) => setCounterparty(e.target.value)}
                    placeholder="e.g. Tata Digital Ltd"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:border-[#ac2e00] focus:bg-white"
                  />
                  <span className="block text-[11px] text-slate-500 mt-1">
                    {lang === 'EN' ? 'Organization or individual name' : 'संस्था अथवा व्यक्ति का नाम'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Counterparty Signatory Contact */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {lang === 'EN' ? 'Counterparty Signatory Email / Phone' : 'प्रतिपक्ष हस्ताक्षरकर्ता का ईमेल/फ़ोन'}
                  </label>
                  <input
                    type="text"
                    required
                    value={counterpartyEmail}
                    onChange={(e) => setCounterpartyEmail(e.target.value)}
                    placeholder="e.g. signatory@partner.com or +91 98200XXXXX"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:border-[#ac2e00] focus:bg-white"
                  />
                  <span className="block text-[11px] text-slate-500 mt-1">
                    {lang === 'EN' ? 'Will receive Aadhaar OTP / DSC invite link' : 'आधार ओटीपी अथवा डीएससी निमंत्रण लिंक भेजा जाएगा'}
                  </span>
                </div>

                {/* Contract Consideration / Value */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {lang === 'EN' ? 'Contract Value / Consideration (INR)' : 'अनुबंध प्रतिफल / मूल्य (रुपये)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={remuneration}
                    onChange={(e) => setRemuneration(e.target.value)}
                    placeholder="e.g. ₹24,00,000 / year"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-[#ac2e00] focus:bg-white"
                  />
                  <span className="block text-[11px] text-slate-500 mt-1">
                    {lang === 'EN' ? 'Section 2(d) Indian Contract Act requirement' : 'भारतीय संविदा अधिनियम धारा २(घ) के तहत प्रतिफल'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* STEP 4: Clauses Review & Customization */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-mono flex items-center justify-center font-bold">4</span>
                  <span>{lang === 'EN' ? 'Review & Customize Clauses' : 'शर्तों की समीक्षा एवं अनुकूलन'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'EN'
                    ? `Pre-populated with ${clauses.length} standard covenants. You can review, remove, or append special terms.`
                    : `${clauses.length} मानक शर्तें शामिल हैं। आप इनकी समीक्षा कर सकते हैं या विशेष शर्तें जोड़ सकते हैं।`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddClauseForm(!showAddClauseForm)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shrink-0 self-start sm:self-auto shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-[#ac2e00]">add</span>
                <span>{lang === 'EN' ? 'Add Custom Clause' : 'विशेष शर्त जोड़ें'}</span>
              </button>
            </div>

            {/* Inline Add Custom Clause Form */}
            {showAddClauseForm && (
              <div className="mb-4 p-4 rounded-xl bg-orange-50/50 border border-orange-200/80 animate-in fade-in duration-150">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#ac2e00]">edit_note</span>
                  <span>{lang === 'EN' ? 'New Custom Covenant' : 'नई विशेष शर्त'}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {lang === 'EN' ? 'Clause #' : 'धारा संख्या'}
                    </label>
                    <input
                      type="text"
                      value={newClauseNumber}
                      onChange={(e) => setNewClauseNumber(e.target.value)}
                      placeholder="e.g. 16.1"
                      className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#ac2e00]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {lang === 'EN' ? 'Clause Title' : 'धारा का शीर्षक'}
                    </label>
                    <input
                      type="text"
                      value={newClauseTitle}
                      onChange={(e) => setNewClauseTitle(e.target.value)}
                      placeholder="e.g. Special SLA Credit & Dedicated Technical Support"
                      className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#ac2e00]"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {lang === 'EN' ? 'Clause Text / Terms' : 'धारा का विवरण / शर्तें'}
                  </label>
                  <textarea
                    rows={2}
                    value={newClauseText}
                    onChange={(e) => setNewClauseText(e.target.value)}
                    placeholder="Enter the full legal wording of this custom clause..."
                    className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#ac2e00]"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddCustomClause}
                    className="px-3.5 py-1.5 rounded-lg bg-[#ac2e00] hover:bg-[#d53e07] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    {lang === 'EN' ? 'Save & Append Clause' : 'सहेजें व जोड़ें'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddClauseForm(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-semibold"
                  >
                    {lang === 'EN' ? 'Cancel' : 'रद्द करें'}
                  </button>
                </div>
              </div>
            )}

            {/* Clauses List Accordion */}
            <div className="space-y-2">
              {clauses.map((clause, idx) => {
                const isExpanded = expandedClauseIndex === idx;
                const displayTitle = contractLang === 'hi' && clause.titleHindi
                  ? clause.titleHindi
                  : contractLang === 'hinglish' && clause.titleHinglish
                  ? clause.titleHinglish
                  : clause.title;
                const displayText = contractLang === 'hi' && clause.textHindi
                  ? clause.textHindi
                  : contractLang === 'hinglish' && clause.textHinglish
                  ? clause.textHinglish
                  : clause.text;

                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div
                      onClick={() => setExpandedClauseIndex(isExpanded ? null : idx)}
                      className="p-3 sm:px-4 cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shrink-0">
                          {clause.clauseNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {displayTitle}
                        </span>
                        {clause.isCustom && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 shrink-0">
                            Custom
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveClause(idx);
                          }}
                          title={lang === 'EN' ? 'Remove clause' : 'शर्त हटाएं'}
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-3.5 pt-1 border-t border-slate-200/60 bg-white">
                        <p className="text-xs text-slate-700 leading-relaxed font-sans">
                          {displayText}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* STEP 5: Verification & Protection Options */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-mono flex items-center justify-center font-bold">5</span>
              <span>{lang === 'EN' ? 'Security & Enforceability Features' : 'सुरक्षा एवं विधिक वैधता विशेषताएं'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: AI Risk Scan */}
              <div
                onClick={() => setAiAuditEnabled(!aiAuditEnabled)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  aiAuditEnabled ? 'bg-orange-50/40 border-[#ac2e00]/50' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="mt-0.5">
                  <input
                    type="checkbox"
                    checked={aiAuditEnabled}
                    onChange={(e) => setAiAuditEnabled(e.target.checked)}
                    className="accent-[#ac2e00] rounded"
                  />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900">
                    {lang === 'EN' ? 'Automated AI Risk Check' : 'स्वचालित एआई जोखिम जांच'}
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5 leading-tight">
                    {lang === 'EN' ? 'Scans for DPDP Act compliance and liability cap issues.' : 'डीपीडीपी अधिनियम एवं देयता सीमाओं की जांच।'}
                  </span>
                </div>
              </div>

              {/* Option 2: Section 65B Certificate */}
              <div
                onClick={() => setSec65BEnabled(!sec65BEnabled)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  sec65BEnabled ? 'bg-emerald-50/40 border-emerald-500/50' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="mt-0.5">
                  <input
                    type="checkbox"
                    checked={sec65BEnabled}
                    onChange={(e) => setSec65BEnabled(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900">
                    {lang === 'EN' ? 'Section 65B IT Act Certificate' : 'धारा ६५ख साक्ष्य प्रमाणपत्र'}
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5 leading-tight">
                    {lang === 'EN' ? 'Ensures court admissibility under the Indian Evidence Act.' : 'भारतीय साक्ष्य अधिनियम के तहत अदालत में स्वीकार्यता।'}
                  </span>
                </div>
              </div>

              {/* Option 3: Polygon Network Record */}
              <div
                onClick={() => setPolygonAnchorEnabled(!polygonAnchorEnabled)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  polygonAnchorEnabled ? 'bg-indigo-50/40 border-indigo-500/50' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="mt-0.5">
                  <input
                    type="checkbox"
                    checked={polygonAnchorEnabled}
                    onChange={(e) => setPolygonAnchorEnabled(e.target.checked)}
                    className="accent-indigo-600 rounded"
                  />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900">
                    {lang === 'EN' ? 'Polygon Network Anchor' : 'पॉलीगॉन नेटवर्क अंकन'}
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5 leading-tight">
                    {lang === 'EN' ? 'Permanent cryptographic tamper-proof timestamp.' : 'अपरिवर्तनीय डिजिटल समय-मुहर सुरक्षा।'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ACTION BUTTONS */}
          <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
              <span>
                {lang === 'EN'
                  ? 'Agreement will be ready for immediate Aadhaar OTP or DSC e-signature'
                  : 'अनुबंध तत्काल आधार ओटीपी अथवा डीएससी हस्ताक्षर हेतु तैयार होगा'}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
              >
                {lang === 'EN' ? 'Save Draft' : 'प्रारूप सहेजें'}
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#ac2e00] hover:bg-[#d53e07] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">draw</span>
                <span>{lang === 'EN' ? 'Create Agreement & Open E-Sign' : 'अनुबंध बनाएं व ई-साइन खोलें'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
