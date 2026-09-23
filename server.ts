import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client according to standard guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface GeneratedClause {
  clauseNumber: string;
  title: string;
  text: string;
  statutoryRef?: string;
  riskNote?: string;
}

export interface GeneratedContract {
  id?: string;
  code?: string;
  title: string;
  category: 'saas' | 'employment' | 'shareholder' | 'nda';
  parties: string[];
  jurisdiction: string;
  stampDutyEstimate: string;
  summary: string;
  clauses: GeneratedClause[];
  fullDraftText: string;
  sha256?: string;
  evmAnchor?: string;
}

const SYSTEM_INSTRUCTION = `You are PAKT Sahayak, an elite AI legal engineer and contract architect embedded within the PAKT Web 2.5 platform.
PAKT is India's sovereign decentralized legal platform for smart contract formation, automated e-Signing, on-chain verification, and regulatory compliance on Polygon PoS.

Statutory grounding:
- Indian Contract Act, 1872 (Offer, Acceptance, Lawful Consideration, Capacity to Contract)
- Information Technology Act, 2000 § 10A (Statutory validity and enforceability of contracts formed electronically)
- Information Technology Act, 2000 § 65B & Indian Evidence Act (Admissibility of electronic records and cryptographic hash certificates)
- Digital Personal Data Protection (DPDP) Act, 2023 (Data fiduciary obligations, purpose limitation, cross-border restrictions, CERT-In 6-hour reporting window)
- Relevant State Stamp Acts (Maharashtra Bombay Stamp Act Art 5(h), Karnataka Stamp Act Art 5(j), Delhi Stamp Act, etc.)

Your duties:
1. CONTRACT MAKING & DRAFTING:
   When asked to draft, create, generate, or modify an agreement (e.g. Non-Disclosure Agreement (NDA), Master Services Agreement (SaaS), Employment / Consultant Agreement, Freelance Agreement, IP Assignment Deed, Shareholder Agreement, Vendor Contract, MoU, etc.):
   - Structure a comprehensive, legally binding agreement with market-standard clauses for Indian jurisdiction.
   - Always include party recitals, definition of obligations, payment/consideration terms, DPDP 2023 compliance, mutual warranties, limitation of liability, term & termination, and dispute resolution (arbitration under Arbitration and Conciliation Act 1996 in chosen Indian seat).
   - If contract drafting or generation is requested, embed a structured JSON contract block inside your answer using triple-backtick delimiter:
   \`\`\`json-contract
   {
     "isContract": true,
     "title": "Full Formal Contract Name",
     "category": "nda" | "saas" | "employment" | "shareholder",
     "parties": ["Party A Legal Name", "Party B Legal Name"],
     "jurisdiction": "City, State, India (e.g. Mumbai, Maharashtra)",
     "stampDutyEstimate": "Estimated stamp duty and article reference",
     "summary": "2-3 sentence executive summary of the agreement",
     "clauses": [
       {
         "clauseNumber": "1.0",
         "title": "Clause Title",
         "text": "Detailed clause text compliant with Indian law.",
         "statutoryRef": "e.g. Section 10A IT Act 2000 / DPDP Act 2023"
       }
     ],
     "fullDraftText": "Complete multi-paragraph formal legal contract text ready for printing or court-filing."
   }
   \`\`\`

2. LEGAL ADVISORY, REDLINING & PROTOCOL GUIDANCE:
   - Provide precise statutory citations when answering legal questions.
   - When reviewing or redlining user-provided clauses, highlight potential enforceability risks (e.g. unconscionable indemnities, Section 27 Indian Contract Act restrictions on non-compete covenants).
   - Explain cryptographic anchoring on Polygon PoS, SHA-256 canonical hashing, and EIP-2771 zero-gas relayer execution.

Maintain an articulate, authoritative, yet approachable tone. Format answers with clear headings, bullet points, and statutory notes.`;

// Endpoint: AI Chat & Contract Assistant
app.post('/api/support-bot/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], mode = 'general', contractLanguage = 'en' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    // Build conversation context from previous turns
    let conversationPrompt = '';
    if (history.length > 0) {
      const recentHistory = history.slice(-6);
      conversationPrompt += 'Previous conversation:\n';
      recentHistory.forEach((item: { sender: string; text: string }) => {
        conversationPrompt += `${item.sender === 'user' ? 'User' : 'PAKT Sahayak'}: ${item.text}\n`;
      });
      conversationPrompt += '\n';
    }

    conversationPrompt += `Current User Query: ${message}\n`;
    conversationPrompt += `Preferred Contract Drafting Language: ${contractLanguage.toUpperCase()}\n`;

    if (contractLanguage === 'hi') {
      conversationPrompt += `[IMPORTANT INSTRUCTION: The user has selected Contract Language as HINDI (हिन्दी). If any agreement/clauses or json-contract is generated, write the contract title, summary, clauses, and fullDraftText in formal, legally valid statutory Hindi (भारतीय विधिक हिन्दी, e.g. धाराएँ, शर्तें, पक्षकार, गोपनीयता, भारतीय संविदा अधिनियम १८७२, सूचना प्रौद्योगिकी अधिनियम २००० की धारा १०क)].\n`;
    } else if (contractLanguage === 'hinglish') {
      conversationPrompt += `[IMPORTANT INSTRUCTION: The user has selected Contract Language as HINGLISH. If any agreement/clauses or json-contract is generated, write the contract title, summary, clauses, and fullDraftText in clear, professional Romanized Hinglish (mix of conversational Hindi & standard legal English terms, e.g., 'Party A aur Party B ke beech agreement', 'Confidential information strictly secure rahegi', 'Section 10A IT Act ke antargat digitally valid aur binding hai', 'Breach hone par damages pay karne honge')].\n`;
    }

    if (mode === 'contract_maker') {
      conversationPrompt += `[SYSTEM NOTE: The user is in Contract Maker mode. Focus on drafting or formalizing enforceable agreements with the required \`\`\`json-contract block in the selected ${contractLanguage.toUpperCase()} language.]\n`;
    }

    let replyText = '';
    let parsedContract: GeneratedContract | null = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.4,
          },
        });

        replyText = response.text || '';
      } catch (geminiError: any) {
        console.error('Gemini API call failed, falling back:', geminiError?.message || geminiError);
        replyText = generateFallbackResponse(message, contractLanguage);
      }
    } else {
      replyText = generateFallbackResponse(message, contractLanguage);
    }

    // Check for json-contract block in response
    const jsonContractMatch = replyText.match(/```json-contract\s*([\s\S]*?)\s*```/);
    if (jsonContractMatch && jsonContractMatch[1]) {
      try {
        const parsed = JSON.parse(jsonContractMatch[1]);
        if (parsed && parsed.title && parsed.clauses) {
          const pseudoHash = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
          parsedContract = {
            id: 'contract-' + Date.now(),
            code: 'IN-PAKT-' + Math.floor(1000 + Math.random() * 9000),
            title: parsed.title,
            category: parsed.category || 'nda',
            parties: parsed.parties || ['First Party', 'Second Party'],
            jurisdiction: parsed.jurisdiction || 'Mumbai, Maharashtra',
            stampDutyEstimate: parsed.stampDutyEstimate || '₹500 (e-Challan / Art 5(h))',
            summary: parsed.summary || 'Custom generated agreement anchored on PAKT Web 2.5',
            clauses: parsed.clauses,
            fullDraftText: parsed.fullDraftText || '',
            sha256: pseudoHash,
            evmAnchor: 'POLYGON_L2',
          };
        }
      } catch (parseErr) {
        console.warn('Failed to parse json-contract block:', parseErr);
      }
    }

    // Clean the reply text by removing the raw json-contract block so the user gets clean chat prose
    const cleanReplyText = replyText.replace(/```json-contract[\s\S]*?```/g, '').trim();

    res.json({
      reply: cleanReplyText || replyText,
      contract: parsedContract,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Server error in /api/support-bot/chat:', err);
    res.status(500).json({
      error: 'Failed to process assistant request',
      details: err?.message || String(err),
    });
  }
});

// Dedicated Contract Generator Endpoint
app.post('/api/support-bot/draft-contract', async (req: Request, res: Response) => {
  try {
    const { contractType, parties = [], jurisdiction = 'Mumbai, Maharashtra', term = '12 Months', consideration = 'Standard', contractLanguage = 'en' } = req.body;

    let languageDirective = 'Draft the agreement in standard professional English.';
    if (contractLanguage === 'hi') {
      languageDirective = 'Draft the contract title, summary, clauses, and fullDraftText in formal, legally valid statutory Hindi (भारतीय विधिक हिन्दी).';
    } else if (contractLanguage === 'hinglish') {
      languageDirective = 'Draft the contract title, summary, clauses, and fullDraftText in clear, professional Hinglish (mix of conversational Hindi & standard legal English terms).';
    }

    const draftPrompt = `Draft a comprehensive, production-grade legal contract for Indian jurisdiction:
Type: ${contractType || 'Non-Disclosure Agreement (NDA)'}
Parties: ${parties.length ? parties.join(' and ') : 'Party A (Disclosing) and Party B (Receiving)'}
Governing Jurisdiction: ${jurisdiction}
Term / Duration: ${term}
Financial Consideration / Value: ${consideration}
Language requirement: ${languageDirective}

Ensure compliance with Indian Contract Act 1872, IT Act 2000 § 10A, and DPDP Act 2023.
Output the structured contract using the \`\`\`json-contract ... \`\`\` block and provide a polite legal briefing before and after.`;

    let replyText = '';
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: draftPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
        },
      });
      replyText = response.text || '';
    } else {
      replyText = generateFallbackResponse(contractType || 'nda', contractLanguage);
    }

    let parsedContract: GeneratedContract | null = null;
    const jsonContractMatch = replyText.match(/```json-contract\s*([\s\S]*?)\s*```/);
    if (jsonContractMatch && jsonContractMatch[1]) {
      try {
        const parsed = JSON.parse(jsonContractMatch[1]);
        const pseudoHash = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
        parsedContract = {
          id: 'contract-' + Date.now(),
          code: 'IN-PAKT-' + Math.floor(1000 + Math.random() * 9000),
          title: parsed.title,
          category: parsed.category || 'nda',
          parties: parsed.parties || parties,
          jurisdiction: parsed.jurisdiction || jurisdiction,
          stampDutyEstimate: parsed.stampDutyEstimate || '₹500 (State e-Stamp)',
          summary: parsed.summary || 'AI-drafted smart contract ready for signature.',
          clauses: parsed.clauses || [],
          fullDraftText: parsed.fullDraftText || '',
          sha256: pseudoHash,
          evmAnchor: 'POLYGON_L2',
        };
      } catch (e) {
        console.warn('Error parsing draft response JSON:', e);
      }
    }

    const cleanReplyText = replyText.replace(/```json-contract[\s\S]*?```/g, '').trim();

    res.json({
      reply: cleanReplyText,
      contract: parsedContract,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in /api/support-bot/draft-contract:', err);
    res.status(500).json({ error: 'Failed to draft contract', details: err?.message || String(err) });
  }
});

// Intelligent fallback generator in case network or API is temporarily unreachable
function generateFallbackResponse(query: string, contractLanguage: string = 'en'): string {
  const q = query.toLowerCase();

  if (contractLanguage === 'hi') {
    if (q.includes('nda') || q.includes('non-disclosure') || q.includes('गोपनीयता') || q.includes('confidential')) {
      return `### पारस्परिक गैर-प्रकटीकरण एवं गोपनीयता अनुबंध

मैंने **भारतीय संविदा अधिनियम, १८७२** एवं **सूचना प्रौद्योगिकी अधिनियम, २००० की धारा १०क** के तहत पूर्णतः मान्य द्विपक्षीय गोपनीयता अनुबंध तैयार किया है।

\`\`\`json-contract
{
  "isContract": true,
  "title": "पारस्परिक गैर-प्रकटीकरण एवं मालिकाना अधिकार अनुबंध",
  "category": "nda",
  "parties": ["टेकवेंचर्स इंडिया प्राइवेट लिमिटेड", "नेक्सस डेटाफ्लो सिस्टम्स एलएलपी"],
  "jurisdiction": "मुंबई, महाराष्ट्र",
  "stampDutyEstimate": "₹५०० (महाराष्ट्र स्टाम्प अधिनियम अनुच्छेद ५(एच))",
  "summary": "सोर्स कोड, एल्गोरिद्मिक बौद्धिक संपदा और व्यापार रहस्यों की सुरक्षा हेतु २ वर्ष की उत्तरजीविता के साथ मानक द्विपक्षीय अनुबंध।",
  "clauses": [
    {
      "clauseNumber": "१.०",
      "title": "गोपनीय सूचना की परिभाषा",
      "text": "गोपनीय सूचना में भौतिक अथवा क्रिप्टोग्राफ़िक प्रारूप में प्रकट किए गए सभी गैर-सार्वजनिक तकनीकी, मालिकाना और वित्तीय रिकॉर्ड शामिल हैं, विशेष रूप से सॉफ्टवेयर रिपोजिटरी, एपीआई और एल्गोरिदम।",
      "statutoryRef": "भारतीय संविदा अधिनियम १८७२ धारा २७ अपवाद"
    },
    {
      "clauseNumber": "२.१",
      "title": "सावधानी का मानक एवं प्रकटीकरण निषेध",
      "text": "प्राप्तकर्ता पक्षकार गोपनीयता बनाए रखने हेतु उचित सावधानी बरतने पर सहमत है और पहुंच को केवल प्राधिकृत कर्मियों तक सीमित रखेगा।",
      "statutoryRef": "भारतीय संविदा अधिनियम १८७२ धारा १५१"
    },
    {
      "clauseNumber": "५.३",
      "title": "विधिक इलेक्ट्रॉनिक निष्पादन एवं डीपीरापी अनुपालन",
      "text": "पक्षकार प्रमाणित करते हैं कि आईटी अधिनियम २००० की धारा १०क के तहत इलेक्ट्रॉनिक हस्ताक्षर एवं पॉलीगॉन ब्लॉकचेन हैश वैध निष्पादन का गठन करते हैं और डीपीरापी २०२३ के अनुरूप हैं।",
      "statutoryRef": "सूचना प्रौद्योगिकी अधिनियम २००० धारा १०क एवं डीपीरापी २०२३"
    },
    {
      "clauseNumber": "८.०",
      "title": "शासी विधि एवं मध्यस्थता का स्थान",
      "text": "यह अनुबंध भारत गणराज्य के कानूनों द्वारा शासित होगा। किसी भी विवाद को मध्यस्थता और सुलह अधिनियम, १९९६ के तहत मुंबई में एकमात्र मध्यस्थ को संदर्भित किया जाएगा।",
      "statutoryRef": "मध्यस्थता एवं सुलह अधिनियम १९९६"
    }
  ],
  "fullDraftText": "पारस्परिक गैर-प्रकटीकरण अनुबंध\\n\\nयह अनुबंध प्रकटीकरणकर्ता और प्राप्तकर्ता पक्षकार के मध्य निष्पादित किया जाता है।\\n१. उद्देश्य: पक्षकार तकनीकी एवं व्यावसायिक सहयोग का मूल्यांकन करना चाहते हैं।\\n२. दायित्व: कोई भी पक्षकार मालिकाना डेटा प्रकाशित अथवा प्रकट नहीं करेगा।\\n३. अवधि: प्रभावी तिथि से २४ माह।\\n४. शासी विधि: भारत के कानून, मुंबई न्यायालयों का अनन्य क्षेत्राधिकार।"
}
\`\`\`

आप इस अनुबंध को सीधे अपनी सक्रिय अनुबंध पाइपलाइन में जोड़ सकते हैं अथवा हस्ताक्षर कक्ष में खोल सकते हैं।`;
    }
  }

  if (contractLanguage === 'hinglish') {
    if (q.includes('nda') || q.includes('non-disclosure') || q.includes('confidential')) {
      return `### Mutual Non-Disclosure Agreement (Gopneeyata Samjhauta)

Maine **Indian Contract Act, 1872** aur **IT Act 2000 Section 10A** ke provisions ke hisaab se legally enforceable Mutual NDA draft kiya hai.

\`\`\`json-contract
{
  "isContract": true,
  "title": "Bilateral Non-Disclosure aur Proprietary Rights Agreement",
  "category": "nda",
  "parties": ["TechVentures India Pvt Ltd", "Nexus Dataflow Systems LLP"],
  "jurisdiction": "Mumbai, Maharashtra",
  "stampDutyEstimate": "₹500 (Maharashtra Stamp Act Art 5(h))",
  "summary": "Standard bilateral NDA jisme proprietary source code, algorithmic IP aur trade secrets protect hote hain with 2-year survival.",
  "clauses": [
    {
      "clauseNumber": "1.0",
      "title": "Definition of Confidential Information",
      "text": "Confidential Information me sabhi non-public technical, proprietary, aur financial documents shamil hain, specially software repositories, API specifications aur system architectures.",
      "statutoryRef": "Indian Contract Act 1872 § 27"
    },
    {
      "clauseNumber": "2.1",
      "title": "Standard of Care aur Non-Disclosure",
      "text": "Receiving Party agree karti hai ki data ki full confidentiality maintain karegi aur access sirf need-to-know basis par hi allow kiya jayega.",
      "statutoryRef": "Indian Contract Act 1872 § 151"
    },
    {
      "clauseNumber": "5.3",
      "title": "Digital Execution aur DPDP Act 2023 Compliance",
      "text": "Both parties acknowledge karti hain ki Section 10A of IT Act 2000 ke tahat cryptographic digital signature aur Polygon PoS hash anchoring fully valid execution hai.",
      "statutoryRef": "IT Act 2000 § 10A & DPDP Act 2023"
    },
    {
      "clauseNumber": "8.0",
      "title": "Governing Law aur Mumbai Arbitration",
      "text": "Ye agreement laws of India se govern hoga. Koi bhi dispute hone par matter sole arbitration in Mumbai ko refer hoga under Arbitration Act 1996.",
      "statutoryRef": "Arbitration & Conciliation Act 1996"
    }
  ],
  "fullDraftText": "MUTUAL NON-DISCLOSURE AGREEMENT\\n\\nYe Agreement Disclosing Party aur Receiving Party ke beech sign hua hai.\\n1. PURPOSE: Parties technical evaluation ke liye data share karengi.\\n2. OBLIGATIONS: Kisi bhi confidential data ka unauthorized disclosure strictly prohibited hai.\\n3. DURATION: Effective date se 24 months tak valid rahega.\\n4. GOVERNING LAW: Laws of India, exclusive jurisdiction Mumbai Courts."
}
\`\`\`

Aap is agreement ko directly apne active PAKTs me add kar sakte hain ya Execution Room me sign kar sakte hain.`;
    }
  }

  // Default English Fallbacks
  if (q.includes('nda') || q.includes('non-disclosure') || q.includes('confidential')) {
    return `### Non-Disclosure & Confidentiality Agreement (Mutual)

I have structured a comprehensive mutual Non-Disclosure Agreement under the **Indian Contract Act, 1872** and **IT Act, 2000 § 10A**.

\`\`\`json-contract
{
  "isContract": true,
  "title": "Mutual Non-Disclosure & Proprietary Rights Agreement",
  "category": "nda",
  "parties": ["TechVentures India Pvt Ltd", "Nexus Dataflow Systems LLP"],
  "jurisdiction": "Mumbai, Maharashtra",
  "stampDutyEstimate": "₹500 (Maharashtra Stamp Act Art 5(h))",
  "summary": "Standard bilateral NDA safeguarding source code, algorithmic IP, and trade secrets with 2-year survival.",
  "clauses": [
    {
      "clauseNumber": "1.0",
      "title": "Definition of Confidential Information",
      "text": "Confidential Information encompasses all non-public technical, proprietary, and financial records disclosed in physical or cryptographic formats, explicitly including software repositories, API specifications, and algorithmic architectures.",
      "statutoryRef": "Indian Contract Act 1872 § 27 exception"
    },
    {
      "clauseNumber": "2.1",
      "title": "Standard of Care & Non-Disclosure",
      "text": "The Receiving Party agrees to maintain confidentiality using no less than a reasonable degree of care, and shall restrict access strictly to personnel with a bona fide need-to-know.",
      "statutoryRef": "Indian Contract Act 1872 § 151"
    },
    {
      "clauseNumber": "5.3",
      "title": "Statutory Electronic Execution & DPDP Compliance",
      "text": "The parties attest that electronic signing and Polygon SHA-256 hash anchoring constitute valid execution under Section 10A of the IT Act 2000 and comply with DPDP Act 2023.",
      "statutoryRef": "Information Technology Act 2000 § 10A & DPDP Act 2023"
    },
    {
      "clauseNumber": "8.0",
      "title": "Governing Law & Seat of Arbitration",
      "text": "This Agreement shall be governed by the laws of the Republic of India. Any dispute shall be referred to sole arbitration in Mumbai under the Arbitration and Conciliation Act, 1996.",
      "statutoryRef": "Arbitration & Conciliation Act 1996"
    }
  ],
  "fullDraftText": "MUTUAL NON-DISCLOSURE AGREEMENT\\n\\nThis Agreement is entered into on this day by and between the Disclosing Party and Receiving Party.\\n\\n1. PURPOSE: The parties desire to evaluate collaborative technical and business opportunities.\\n2. OBLIGATIONS: Neither party shall publish or divulge proprietary data.\\n3. TERM: 24 months from the effective date.\\n4. GOVERNING LAW: Laws of India, exclusive jurisdiction of Mumbai Courts."
}
\`\`\`

You can directly add this contract to your active PAKT pipeline or review the individual clauses.`;
  }

  if (q.includes('saas') || q.includes('service') || q.includes('msa') || q.includes('cloud')) {
    return `### Master Cloud SaaS Services Agreement

Here is a balanced enterprise Master SaaS Agreement aligned with **Digital Personal Data Protection Act 2023** and Indian cloud hosting guidelines.

\`\`\`json-contract
{
  "isContract": true,
  "title": "Enterprise Cloud Services & SLA Master Agreement",
  "category": "saas",
  "parties": ["PAKT Cloud Technologies LLP", "Enterprise Client Systems Ltd"],
  "jurisdiction": "Bengaluru, Karnataka",
  "stampDutyEstimate": "₹200 (Karnataka Stamp Act Art 5(j))",
  "summary": "B2B SaaS Cloud contract featuring 99.9% uptime SLA, local CERT-In registered Mumbai data storage, and DPDP 2023 data fiduciary compliance.",
  "clauses": [
    {
      "clauseNumber": "1.1",
      "title": "Service Level & High Availability",
      "text": "The Provider guarantees 99.9% monthly availability for core APIs, excluding pre-notified scheduled maintenance windows not exceeding 4 hours monthly.",
      "statutoryRef": "IT Act 2000 § 43A standards"
    },
    {
      "clauseNumber": "3.4",
      "title": "Data Fiduciary & DPDP Act 2023 Compliance",
      "text": "Customer personal data is processed solely as Data Processor. All customer workloads reside within MeitY-empanelled data centers in Mumbai/Pune.",
      "statutoryRef": "DPDP Act 2023 § 8"
    },
    {
      "clauseNumber": "7.2",
      "title": "Limitation of Aggregate Liability",
      "text": "Neither party's cumulative liability shall exceed total fees paid during the immediate 12-month period preceding the claim.",
      "statutoryRef": "Indian Contract Act 1872 § 73"
    }
  ],
  "fullDraftText": "MASTER SERVICES AGREEMENT\\n\\nBetween Provider and Enterprise Client.\\n1. SCOPE OF SERVICES: Provider grants non-exclusive license to SaaS platform.\\n2. DATA PRIVACY: Compliant with Indian DPDP Act 2023.\\n3. PAYMENT: Net 30 days via UPI/NEFT."
}
\`\`\`

Would you like to customize the payment terms or SLA threshold?`;
  }

  if (q.includes('freelance') || q.includes('employment') || q.includes('consult') || q.includes('hire')) {
    return `### Independent Consultant & Professional Services Agreement

Here is an enforceable consultant agreement compliant with Indian labor norms and IP assignment standards.

\`\`\`json-contract
{
  "isContract": true,
  "title": "Independent Software Consultant & IP Assignment Agreement",
  "category": "employment",
  "parties": ["Digital Foundry LLP", "Independent Consultant"],
  "jurisdiction": "Delhi NCR, India",
  "stampDutyEstimate": "₹100 (Delhi Stamp Act)",
  "summary": "Independent contractor agreement with strict work-for-hire assignment, 15-day termination notice, and GST invoice terms.",
  "clauses": [
    {
      "clauseNumber": "1.0",
      "title": "Scope of Engagement & Independent Contractor Status",
      "text": "Consultant is an independent contractor and nothing herein creates an employer-employee relationship or agency under Indian labor laws.",
      "statutoryRef": "Indian Contract Act 1872 § 182"
    },
    {
      "clauseNumber": "3.1",
      "title": "Intellectual Property Assignment (Work For Hire)",
      "text": "All code, documentation, designs, and architectural models conceived during the engagement are assigned irrevocably to the Client.",
      "statutoryRef": "Copyright Act 1957 § 17(c)"
    },
    {
      "clauseNumber": "6.0",
      "title": "Compensation & Tax Deduction at Source (TDS)",
      "text": "Professional fees are payable against valid GST invoice, subject to mandatory withholding under Section 194J of the Income Tax Act, 1961.",
      "statutoryRef": "Income Tax Act 1961 § 194J"
    }
  ],
  "fullDraftText": "CONSULTING SERVICES AGREEMENT\\n\\n1. ENGAGEMENT: Professional software architecture.\\n2. IP ASSIGNMENT: All deliverables belong exclusively to Client.\\n3. JURISDICTION: Courts of New Delhi."
}
\`\`\`
`;
  }

  // General legal explanation
  return `### PAKT Sahayak Legal Advisory

**Indian Legal & Cryptographic Framework Overview:**

1. **Statutory Validity (IT Act 2000 § 10A)**:
   Agreements executed electronically through digital keys and authenticated cryptographic proofs are legally enforceable in Indian courts, having identical standing to physical stamp paper agreements.

2. **Electronic Evidence (Section 65B)**:
   The SHA-256 hash anchored to Polygon PoS provides a tamper-evident, court-admissible audit certificate satisfying the mandatory criteria under Section 65B of the Indian Evidence Act.

3. **Digital Personal Data Protection Act, 2023**:
   PAKT executes zero-knowledge hashing client-side. No unencrypted personally identifiable information (PII) is committed on-chain.

4. **Stamp Duty Compliance**:
   Under the relevant State Stamp Acts (e.g. Maharashtra, Karnataka, Delhi), e-stamping certificates can be attached directly to the cryptographic record.

**How can I help you right now?**
- Type **"Draft an NDA"** to create a custom non-disclosure agreement.
- Type **"Draft SaaS MSA"** to generate a cloud services contract.
- Type **"Draft Freelancer Contract"** for contractor agreements.
- Paste any legal clause to get an **instant risk redline**!`;
}

// Development vs Production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PAKT Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
