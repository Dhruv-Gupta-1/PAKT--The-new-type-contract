import { Language, ContractLanguage, ContractClause, ContractItem } from '../types';

export const UI_STRINGS = {
  EN: {
    // Header
    mumbaiNode: 'Mumbai Server Online',
    notificationsTooltip: 'Notifications',
    supportBotTooltip: 'PAKT AI Assistant & Contract Maker',
    profileTooltip: 'Profile Settings',
    activeAlertsNotice: 'You have 3 items waiting for your attention.',

    // Bottom Navigation
    navContracts: 'Contracts',
    navCopilot: 'AI Assistant',
    navVerify: 'Verify',
    navSettings: 'Settings',

    // Quick Selector
    quickSelectorTitle: 'Quick Screen Switcher (Test 8 Views)',
    screenLanding: '1. Welcome Screen',
    screenLogin: '2. Sign In',
    screen2FA: '3. Two-Step Verification',
    screenContracts: '4. Contracts Dashboard',
    screenESign: '5. Sign Agreement',
    screenCopilot: '6. AI Review & Copilot',
    screenVerify: '7. Check Authenticity',
    screenSettings: '8. Account & Settings',

    // Landing Screen
    sovereignNode: 'Secure Server • Mumbai',
    shaLock: 'Encrypted',
    immutableBadge: 'Tamper-Proof',
    web25Badge: 'EASY & SECURE',
    landingTagline: 'Legally Binding Agreements, Made Simple and Secure.',
    itActCompliance: 'Compliant with Indian IT Act 2000 & DPDP Act 2023',
    evidenceActSub: 'Legally valid in court with Section 65B certificates',
    evmSmartClause: 'Automated Payment & Milestone Protection',
    polygonPoSSub: 'Tamper-proof digital timestamp on Polygon network',
    getStarted: 'Get Started',
    skipToContracts: 'Go to Contracts Dashboard →',
    statutoryFootnote: 'Digital signatures are legally valid and enforceable under Indian Law (IT Act 2000 Section 10A).',
    mainnetVersion: 'v2.5.4 Live',
    zeroGasTag: 'Free Blockchain Protection for India 🇮🇳',

    // Login Screen
    loginMumbaiNode: 'Secure Server • Mumbai',
    statutoryChip: 'Legally Binding',
    decentralizedProtocol: 'Secure Contracts Platform',
    welcomeBack: 'Welcome Back',
    loginSubtitle: 'Sign in to review, sign, and securely manage your contracts.',
    fullNameLabel: 'Full Legal Name',
    aadhaarPanMatch: 'Matches ID',
    namePlaceholder: 'e.g. Priya Sharma',
    contactLabel: 'Email or Mobile Number',
    contactPlaceholder: '98765 43210 or name@example.com',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot password?',
    passwordPlaceholder: 'Enter your password',
    rememberDevice: 'Remember this device for 30 days',
    rememberDeviceSub: 'Stay signed in securely on this browser',
    continueToAuth: 'Continue',
    orUseWebAuthn: 'or sign in with biometric passkey',
    aadhaarBiometric: 'Aadhaar Iris / Fingerprint',
    fidoPasskey: 'Face ID / Fingerprint / Passkey',
    termsAgreement: 'By signing in, you confirm that you agree to electronic contract signing under Indian Law (IT Act 2000).',
    sovereignInfrastructure: 'Protected by End-to-End Encryption • Mumbai Server',

    // 2FA Screen
    twoFactorTitle: 'Two-Step Verification',
    zeroKnowledgeGate: 'Secure Sign-In',
    uidaiLevel3: 'Identity Verified',
    twoFactorSubtitle: 'Verify your identity to protect your legal contracts',
    twoFactorPrompt: 'Enter the 6-digit verification code sent to your phone or authenticator app.',
    selectAuthMethod: 'Verification Method',
    totpApp: 'Authenticator App (TOTP)',
    aadhaarOtp: 'Aadhaar OTP (UIDAI)',
    hardwareFido: 'SMS Code (+91 98765)',
    didNotReceive: 'Didn’t get the code?',
    resendIn: 'Resend in',
    resendOtp: 'Resend Code',
    verifyingCode: 'Checking verification code...',
    confirmVerify: 'Verify & Sign In',
    statutorySealNote: 'Your sign-in is end-to-end encrypted. Security credentials never leave your device.',
    sec65BCertified: 'Section 65B Indian Evidence Act Compliant',
    polygonSecurityScore: 'Security Check: 100% Passed',

    // Contracts Screen
    contractsVaultTitle: 'Contracts & Agreements',
    contractsVaultSubtitle: 'Create, review, sign, and store your legal agreements securely',
    activePaktsStat: 'Active Agreements',
    signedMOUStat: 'Signed & Complete',
    auditAlertsStat: 'AI Suggestions',
    filterAll: 'All Agreements',
    filterPending: 'Waiting for Signature',
    filterExecuted: 'Signed & Completed',
    filterInReview: 'In Review',
    searchPlaceholder: 'Search agreements by title, code, party, or keyword...',
    newSmartPakt: 'New Agreement',
    sahayakBotBtn: 'PAKT AI Assistant',
    noContractsFound: 'No agreements match your search or filter.',
    viewCertificate: 'View Legal Certificate',
    signNowBtn: 'Review & Sign',
    viewDetailsBtn: 'View Details',
    evmTag: 'Polygon Verified',
    sha256Prefix: 'Doc Hash:',
    contractLangLabel: 'Document Language:',

    // E-Sign Screen
    executionRoomTitle: 'Review & Sign Agreement',
    liveVerification: 'Ready to Sign',
    signaturesLabel: 'Signatures:',
    ofCompleted: 'signed',
    contractPreviewTitle: 'Agreement Terms & Clauses',
    clausesCount: 'clauses',
    contractLangSwitchLabel: 'Document Language:',
    signingMethodTitle: 'Choose How You Want to Sign',
    methodAadhaar: 'Aadhaar OTP',
    methodDSC: 'Digital Certificate (DSC)',
    methodPasskey: 'Face ID / Fingerprint',
    aadhaarNumberLabel: '12-Digit Aadhaar Number',
    dscCertLabel: 'Select Digital Certificate',
    passkeyPromptLabel: 'Biometric / Passkey Verification',
    pinLabel: 'Enter 6-Digit Verification Code',
    agreeLegalAttestation: 'I confirm that I have read this agreement and agree that my digital signature is legally binding under Indian Law (IT Act 2000 Section 10A).',
    stampDutyAffixed: 'State e-Stamp Duty Verified (MH-2026-9812)',
    executingSignature: 'Signing and saving agreement securely...',
    signAndAnchorBtn: 'Sign & Complete Agreement',
    sealedSuccessTitle: 'Agreement Signed Successfully!',
    sealedSuccessSub: 'Verified and permanently recorded with Section 65B legal certificate.',
    viewOnExplorer: 'View Blockchain Record',
    backToVault: 'Back to Agreements',

    // AI Copilot Screen
    copilotScreenTitle: 'AI Legal Assistant',
    copilotScreenSubtitle: 'Clear clause explanations, risk detection, and suggestions in plain language',
    activeInterventionsCount: 'Suggested Improvements',
    overallRiskScore: 'Agreement Risk Level: Low',
    interventionHigh: 'IMPORTANT SUGGESTION',
    interventionMedium: 'RECOMMENDED CHECK',
    originalStipulation: 'Current Clause Wording',
    aiRecommendation: 'Suggested Clear Wording (Standard Terms)',
    statutoryRationale: 'Why This Matters',
    applyRemedyBtn: 'Apply Suggestion',
    dismissRiskBtn: 'Keep Original',
    remedyAppliedSuccess: 'Suggestion applied! Contract text has been updated.',
    remedyDismissed: 'Kept original clause wording.',
    newPaktAction: 'New Agreement',

    // Verify Screen
    verifyTitle: 'Verify Contract Authenticity',
    verifySubtitle: 'Check that an agreement is genuine, unaltered, and properly signed',
    searchTxHashPlaceholder: 'Enter contract code, document hash, or transaction ID...',
    verifyButton: 'Check Authenticity',
    verifiedStamp: 'GENUINE & UNALTERED',
    blockNumberLabel: 'Recorded Block:',
    merkleRootLabel: 'Signature Proof:',
    statutoryCertificateTitle: 'Section 65B Certificate of Authenticity',
    statutoryCertificateBody: 'This certificate confirms that this electronic document is genuine, legally signed, and has remained completely unchanged since execution.',
    downloadCertBtn: 'Download Legal Certificate (PDF)',
    copyAuditLinkBtn: 'Copy Verification Link',

    // Settings Screen
    settingsTitle: 'Settings & Preferences',
    settingsSubtitle: 'Manage your profile, security, and document preferences',
    kycLevel: 'IDENTITY VERIFIED',
    profileName: 'Priya Sharma',
    profileRole: 'Chief Product Officer • PAKT India',
    aadhaarLabel: 'Aadhaar:',
    panLabel: 'PAN:',
    blockchainConfigTitle: 'Security & Network Settings',
    zeroGasTitle: 'Free Blockchain Signing',
    zeroGasDesc: 'All network fees are automatically covered for your signed agreements.',
    passkeyTitle: 'Passkey & Biometric Sign-in',
    passkeyDesc: 'Use Face ID, fingerprint, or your device passkey for instant, secure sign-in.',
    digilockerTitle: 'DigiLocker Identity Verification',
    digilockerDesc: 'Quickly verify your legal identity using Government DigiLocker.',
    languagePreferenceTitle: 'Language Settings',
    screenLangLabel: 'App Display Language:',
    contractLangPrefLabel: 'Preferred Contract Drafting Language:',
    contractLangPrefDesc: 'Choose your preferred language for contracts without changing the app interface.',
    saveSettingsBtn: 'Save Changes',
    logoutBtn: 'Sign Out',

    // Support Bot & Contract Maker
    botModalTitle: 'PAKT AI Legal Assistant',
    botModalSubtitle: 'Draft contracts, clarify legal terms, and review agreements in plain language',
    tabChat: 'Ask AI',
    tabMaker: 'Draft Agreement',
    tabCompliance: 'Stamp Duty & Rules',
    contractLangChoice: 'Language:',
    botWelcomePrompt: 'Hello! Ask any question about contracts, clarify legal clauses, or create an agreement in simple English, Hindi, or Hinglish.',
    typeMessagePlaceholder: 'Ask a question or describe the contract you need...',
    sendBtn: 'Send',
    generatingContract: 'Drafting agreement in plain language...',
    addToPipelineBtn: 'Save to My Agreements',
    openInESignBtn: 'Review & Sign Now',
    copyDraftBtn: 'Copy Agreement Text',
    downloadDraftBtn: 'Download File',
    contractAddedNotice: 'Agreement successfully added to your contracts list!',
    makerCategoryLabel: 'Agreement Type',
    makerTitleLabel: 'Agreement Title',
    makerPartyALabel: 'First Party (e.g. Service Provider / Freelancer)',
    makerPartyBLabel: 'Second Party (e.g. Client / Company)',
    makerJurisdictionLabel: 'Governing City / Jurisdiction',
    makerTermLabel: 'Agreement Duration',
    makerSpecificsLabel: 'Key Terms & Details (e.g. payment, deliverables)',
    generateContractBtn: 'Create Agreement Draft',

    // New PAKT Modal
    newPaktModalTitle: 'Create New Agreement',
    newPaktModalSubtitle: 'Start a fresh agreement draft with smart legal protection',
    paktTitleLabel: 'Agreement Title',
    paktTitlePlaceholder: 'e.g. Software Development Agreement 2026',
    counterpartyLabel: 'Other Party Name / Company',
    counterpartyPlaceholder: 'e.g. Tata Consultancy Services / Ramesh Kumar',
    templateLabel: 'Agreement Template',
    contractLangSelectLabel: 'Agreement Language',
    jurisdictionLabel: 'City / Court Jurisdiction',
    autoRunCopilot: 'Run AI Review Automatically:',
    autoRunCopilotDesc: 'Checks the draft for unfair terms, liability caps, and plain language before signing.',
    cancelBtn: 'Cancel',
    initPaktBtn: 'Create Agreement',
    initializingPakt: 'Creating your agreement...',
  },

  HI: {
    // Header
    mumbaiNode: 'मुंबई सर्वर ऑनलाइन',
    notificationsTooltip: 'सूचनाएं',
    supportBotTooltip: 'पाक्त सहायक एआई - अनुबंध निर्माता एवं सलाहकार',
    profileTooltip: 'प्रोफ़ाइल सेटिंग्स',
    activeAlertsNotice: 'आपके 3 कार्य ध्यान देने हेतु प्रतीक्षारत हैं।',

    // Bottom Navigation
    navContracts: 'अनुबंध',
    navCopilot: 'एआई सहायक',
    navVerify: 'सत्यापन',
    navSettings: 'सेटिंग्स',

    // Quick Selector
    quickSelectorTitle: 'स्क्रीन चयनकर्ता (सभी 8 स्क्रीन का पूर्वावलोकन)',
    screenLanding: '१. स्वागत स्क्रीन',
    screenLogin: '२. साइन इन',
    screen2FA: '३. द्वि-चरणीय सुरक्षा',
    screenContracts: '४. अनुबंध डैशबोर्ड',
    screenESign: '५. हस्ताक्षर करें',
    screenCopilot: '६. एआई समीक्षा',
    screenVerify: '७. प्रामाणिकता जांच',
    screenSettings: '८. खाता सेटिंग्स',

    // Landing Screen
    sovereignNode: 'सुरक्षित सर्वर • मुंबई',
    shaLock: 'एन्क्रिप्टेड',
    immutableBadge: 'अपरिवर्तनीय',
    web25Badge: 'सरल एवं सुरक्षित',
    landingTagline: 'विधिक रूप से मान्य अनुबंध, अब आसान और पूरी तरह सुरक्षित।',
    itActCompliance: 'भारतीय आईटी अधिनियम २००० एवं डीपीरापी अधिनियम २०२३ के अनुरूप',
    evidenceActSub: 'धारा ६५ख प्रमाणपत्र के साथ न्यायालय में पूर्णतः मान्य',
    evmSmartClause: 'भुगतान एवं कार्य प्रगति की स्वचालित सुरक्षा',
    polygonPoSSub: 'पॉलीगॉन नेटवर्क पर सुरक्षित डिजिटल समय-मुहर',
    getStarted: 'शुरू करें',
    skipToContracts: 'सीधे अनुबंध डैशबोर्ड पर जाएं →',
    statutoryFootnote: 'डिजिटल हस्ताक्षर भारतीय कानून (आईटी अधिनियम २००० धारा १०क) के तहत कानूनी रूप से बाध्यकारी हैं।',
    mainnetVersion: 'v2.5.4 लाइव',
    zeroGasTag: 'भारत के लिए निःशुल्क ब्लॉकचेन सुरक्षा 🇮🇳',

    // Login Screen
    loginMumbaiNode: 'सुरक्षित सर्वर • मुंबई',
    statutoryChip: 'कानूनी रूप से मान्य',
    decentralizedProtocol: 'सुरक्षित अनुबंध मंच',
    welcomeBack: 'पुनः स्वागत है',
    loginSubtitle: 'अपने विधिक अनुबंधों की समीक्षा, हस्ताक्षर और सुरक्षित प्रबंधन के लिए साइन इन करें।',
    fullNameLabel: 'पूर्ण नाम (आईडी के अनुसार)',
    aadhaarPanMatch: 'आधार / पैन से मेल',
    namePlaceholder: 'उदा. प्रिया शर्मा',
    contactLabel: 'ईमेल अथवा मोबाइल नंबर',
    contactPlaceholder: '98765 43210 अथवा name@example.com',
    passwordLabel: 'पासवर्ड',
    forgotPassword: 'पासवर्ड भूल गए?',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    rememberDevice: 'इस उपकरण को ३० दिनों के लिए याद रखें',
    rememberDeviceSub: 'इस ब्राउज़र पर सुरक्षित रूप से साइन इन रहें',
    continueToAuth: 'आगे बढ़ें',
    orUseWebAuthn: 'अथवा बायोमेट्रिक पासकी से साइन इन करें',
    aadhaarBiometric: 'आधार आइरिस / फिंगरप्रिंट',
    fidoPasskey: 'फ़ेस आईडी / फिंगरप्रिंट / पासकी',
    termsAgreement: 'साइन इन करके, आप भारतीय कानून (आईटी एक्ट धारा १०क) के तहत डिजिटल अनुबंध हस्ताक्षर की सहमति देते हैं।',
    sovereignInfrastructure: 'एंड-टू-एंड एन्क्रिप्शन द्वारा सुरक्षित • मुंबई सर्वर',

    // 2FA Screen
    twoFactorTitle: 'द्वि-चरणीय सत्यापन (2FA)',
    zeroKnowledgeGate: 'सुरक्षित साइन इन',
    uidaiLevel3: 'पहचान सत्यापित',
    twoFactorSubtitle: 'अपने अनुबंधों की सुरक्षा के लिए अपनी पहचान सत्यापित करें',
    twoFactorPrompt: 'अपने फ़ोन अथवा ऑथेंटिकेटर ऐप पर प्राप्त ६-अंकों का कोड दर्ज करें।',
    selectAuthMethod: 'सत्यापन का माध्यम चुनें',
    totpApp: 'ऑथेंटिकेटर ऐप (TOTP)',
    aadhaarOtp: 'आधार ओटीपी (UIDAI)',
    hardwareFido: 'एसएमएस कोड (+91 98765)',
    didNotReceive: 'कोड नहीं मिला?',
    resendIn: 'पुनः भेजें:',
    resendOtp: 'कोड दोबारा भेजें',
    verifyingCode: 'सत्यापन कोड की जांच हो रही है...',
    confirmVerify: 'सत्यापित करें और साइन इन करें',
    statutorySealNote: 'आपका लॉगिन पूर्णतः एन्क्रिप्टेड है। आपकी सुरक्षा कुंजियाँ केवल आपके उपकरण में सुरक्षित रहती हैं।',
    sec65BCertified: 'भारतीय साक्ष्य अधिनियम धारा ६५ख के अनुरूप',
    polygonSecurityScore: 'सुरक्षा जांच: १००% सफल',

    // Contracts Screen
    contractsVaultTitle: 'अनुबंध एवं समझौते',
    contractsVaultSubtitle: 'अपने कानूनी समझौतों को आसानी से बनाएं, समीक्षा करें, हस्ताक्षर करें और सुरक्षित रखें',
    activePaktsStat: 'सक्रिय अनुबंध',
    signedMOUStat: 'पूर्ण हस्ताक्षरित',
    auditAlertsStat: 'एआई सुझाव',
    filterAll: 'सभी अनुबंध',
    filterPending: 'हस्ताक्षर प्रतीक्षित',
    filterExecuted: 'हस्ताक्षरित एवं पूर्ण',
    filterInReview: 'समीक्षाधीन',
    searchPlaceholder: 'अनुबंध का नाम, कोड, पक्षकार अथवा कीवर्ड खोजें...',
    newSmartPakt: 'नया अनुबंध',
    sahayakBotBtn: 'पाक्त एआई सहायक',
    noContractsFound: 'आपकी खोज या फ़िल्टर से कोई अनुबंध मेल नहीं खाता।',
    viewCertificate: 'कानूनी प्रमाणपत्र देखें',
    signNowBtn: 'समीक्षा करें व हस्ताक्षर करें',
    viewDetailsBtn: 'विवरण देखें',
    evmTag: 'पॉलीगॉन प्रमाणित',
    sha256Prefix: 'दस्तावेज़ हैश:',
    contractLangLabel: 'अनुबंध की भाषा:',

    // E-Sign Screen
    executionRoomTitle: 'अनुबंध समीक्षा एवं हस्ताक्षर',
    liveVerification: 'हस्ताक्षर के लिए तैयार',
    signaturesLabel: 'हस्ताक्षर प्रगति:',
    ofCompleted: 'हस्ताक्षरित',
    contractPreviewTitle: 'अनुबंध की शर्तें एवं धाराएं',
    clausesCount: 'धाराएं',
    contractLangSwitchLabel: 'अनुबंध भाषा:',
    signingMethodTitle: 'हस्ताक्षर करने का तरीका चुनें',
    methodAadhaar: 'आधार ओटीपी',
    methodDSC: 'डिजिटल प्रमाणपत्र (DSC)',
    methodPasskey: 'फ़ेस आईडी / फिंगरप्रिंट',
    aadhaarNumberLabel: '१२-अंकीय आधार संख्या',
    dscCertLabel: 'डिजिटल प्रमाणपत्र चुनें',
    passkeyPromptLabel: 'बायोमेट्रिक अथवा सुरक्षा पासकी',
    pinLabel: '६-अंकों का सत्यापन कोड दर्ज करें',
    agreeLegalAttestation: 'मैं पुष्टि करता/करती हूँ कि मैंने यह अनुबंध पढ़ लिया है और मेरा डिजिटल हस्ताक्षर भारतीय कानून (आईटी एक्ट धारा १०क) के तहत विधिक रूप से बाध्यकारी है।',
    stampDutyAffixed: 'ई-स्टाम्प शुल्क चालान सत्यापित (MH-2026-9812)',
    executingSignature: 'अनुबंध सुरक्षित रूप से हस्ताक्षरित हो रहा है...',
    signAndAnchorBtn: 'हस्ताक्षर करें और अनुबंध पूरा करें',
    sealedSuccessTitle: 'अनुबंध सफलतापूर्वक हस्ताक्षरित हुआ!',
    sealedSuccessSub: 'धारा ६५ख कानूनी प्रमाणपत्र के साथ स्थायी रूप से सुरक्षित।',
    viewOnExplorer: 'ब्लॉकचेन रिकॉर्ड देखें',
    backToVault: 'अनुबंध सूची पर वापस जाएं',

    // AI Copilot Screen
    copilotScreenTitle: 'एआई विधिक सहायक',
    copilotScreenSubtitle: 'कठिन शर्तों की सरल व्याख्या, जोखिम की पहचान और स्पष्ट सुझाव',
    activeInterventionsCount: 'सुझाए गए सुधार',
    overallRiskScore: 'अनुबंध जोखिम स्तर: कम',
    interventionHigh: 'महत्वपूर्ण सुझाव',
    interventionMedium: 'अनुशंसित जांच',
    originalStipulation: 'वर्तमान शर्त (जोखिमपूर्ण)',
    aiRecommendation: 'सुझाई गई निष्पक्ष शर्त (मानक भाषा)',
    statutoryRationale: 'यह क्यों महत्वपूर्ण है',
    applyRemedyBtn: 'सुझाव लागू करें',
    dismissRiskBtn: 'मूल शर्त बनाए रखें',
    remedyAppliedSuccess: 'सुझाव लागू हुआ! अनुबंध की भाषा अपडेट हो गई।',
    remedyDismissed: 'मूल शर्त रखी गई।',
    newPaktAction: 'नया अनुबंध',

    // Verify Screen
    verifyTitle: 'अनुबंध प्रामाणिकता सत्यापन',
    verifySubtitle: 'जांचें कि अनुबंध असली है, अपरिवर्तित है और सही ढंग से हस्ताक्षरित है',
    searchTxHashPlaceholder: 'अनुबंध कोड, दस्तावेज़ हैश अथवा आईडी दर्ज करें...',
    verifyButton: 'प्रामाणिकता जांचें',
    verifiedStamp: 'असली एवं अपरिवर्तित',
    blockNumberLabel: 'अंकित ब्लॉक:',
    merkleRootLabel: 'हस्ताक्षर प्रमाण:',
    statutoryCertificateTitle: 'धारा ६५ख प्रामाणिकता प्रमाणपत्र',
    statutoryCertificateBody: 'यह प्रमाणपत्र पुष्टि करता है कि यह इलेक्ट्रॉनिक दस्तावेज़ असली है, विधिक रूप से हस्ताक्षरित है और निष्पादन के बाद से इसमें कोई बदलाव नहीं हुआ है।',
    downloadCertBtn: 'कानूनी प्रमाणपत्र डाउनलोड करें (PDF)',
    copyAuditLinkBtn: 'सत्यापन लिंक कॉपी करें',

    // Settings Screen
    settingsTitle: 'सेटिंग्स एवं प्राथमिकताएं',
    settingsSubtitle: 'अपनी प्रोफ़ाइल, सुरक्षा और दस्तावेज़ प्राथमिकताओं का प्रबंधन करें',
    kycLevel: 'पहचान सत्यापित',
    profileName: 'प्रिया शर्मा',
    profileRole: 'मुख्य उत्पाद अधिकारी • पाक्त इंडिया',
    aadhaarLabel: 'आधार:',
    panLabel: 'पैन:',
    blockchainConfigTitle: 'सुरक्षा एवं नेटवर्क सेटिंग्स',
    zeroGasTitle: 'निःशुल्क ब्लॉकचेन हस्ताक्षर',
    zeroGasDesc: 'आपके हस्ताक्षरित अनुबंधों के लिए सभी नेटवर्क शुल्क स्वतः कवर किए जाते हैं।',
    passkeyTitle: 'पासकी एवं बायोमेट्रिक साइन इन',
    passkeyDesc: 'त्वरित और सुरक्षित साइन इन के लिए फ़ेस आईडी या फिंगरप्रिंट का उपयोग करें।',
    digilockerTitle: 'डिजिलॉकर पहचान सत्यापन',
    digilockerDesc: 'सरकारी डिजिलॉकर के माध्यम से अपनी कानूनी पहचान तुरंत सत्यापित करें।',
    languagePreferenceTitle: 'भाषा सेटिंग्स',
    screenLangLabel: 'ऐप इंटरफ़ेस भाषा:',
    contractLangPrefLabel: 'अनुबंध की पसंदीदा भाषा:',
    contractLangPrefDesc: 'ऐप की भाषा बदले बिना यह तय करें कि आपके अनुबंध किस भाषा में तैयार हों।',
    saveSettingsBtn: 'बदलाव सहेजें',
    logoutBtn: 'साइन आउट करें',

    // Support Bot & Contract Maker
    botModalTitle: 'पाक्त एआई सहायक',
    botModalSubtitle: 'अनुबंध तैयार करें, कानूनी शर्तें समझें और सरल भाषा में समीक्षा करें',
    tabChat: 'एआई से पूछें',
    tabMaker: 'अनुबंध बनाएं',
    tabCompliance: 'स्टाम्प शुल्क व नियम',
    contractLangChoice: 'भाषा:',
    botWelcomePrompt: 'नमस्ते! अनुबंधों से जुड़ा कोई भी सवाल पूछें, कठिन शर्तों को आसान भाषा में समझें, अथवा नया अनुबंध तैयार करवाएं।',
    typeMessagePlaceholder: 'कानूनी सवाल पूछें अथवा आवश्यक अनुबंध का विवरण लिखें...',
    sendBtn: 'भेजें',
    generatingContract: 'सरल भाषा में अनुबंध तैयार किया जा रहा है...',
    addToPipelineBtn: 'मेरी अनुबंध सूची में सहेजें',
    openInESignBtn: 'समीक्षा करें व हस्ताक्षर करें',
    copyDraftBtn: 'अनुबंध कॉपी करें',
    downloadDraftBtn: 'फ़ाइल डाउनलोड करें',
    contractAddedNotice: 'अनुबंध सफलतापूर्वक आपकी सूची में जुड़ गया है!',
    makerCategoryLabel: 'अनुबंध का प्रकार',
    makerTitleLabel: 'अनुबंध का शीर्षक',
    makerPartyALabel: 'प्रथम पक्षकार (उदा. सेवा प्रदाता / फ्रीलांसर)',
    makerPartyBLabel: 'द्वितीय पक्षकार (उदा. ग्राहक / कंपनी)',
    makerJurisdictionLabel: 'शहर / क्षेत्राधिकार',
    makerTermLabel: 'अनुबंध की अवधि',
    makerSpecificsLabel: 'मुख्य शर्तें व विवरण (उदा. भुगतान, देय कार्य)',
    generateContractBtn: 'अनुबंध का मसौदा बनाएं',

    // New PAKT Modal
    newPaktModalTitle: 'नया अनुबंध बनाएं',
    newPaktModalSubtitle: 'स्मार्ट सुरक्षा के साथ नया कानूनी अनुबंध तैयार करें',
    paktTitleLabel: 'अनुबंध का शीर्षक',
    paktTitlePlaceholder: 'उदा. सॉफ्टवेयर विकास अनुबंध २०२६',
    counterpartyLabel: 'अन्य पक्षकार / कंपनी का नाम',
    counterpartyPlaceholder: 'उदा. टाटा कंसल्टेंसी सर्विसेज / रमेश कुमार',
    templateLabel: 'अनुबंध प्रारूप (टेम्पलेट)',
    contractLangSelectLabel: 'अनुबंध की भाषा',
    jurisdictionLabel: 'शहर / न्यायालय क्षेत्राधिकार',
    autoRunCopilot: 'एआई समीक्षा स्वतः चलाएं:',
    autoRunCopilotDesc: 'हस्ताक्षर से पहले अनुचित शर्तों, देयता सीमाओं और भाषा की स्पष्टता की जांच करें।',
    cancelBtn: 'रद्द करें',
    initPaktBtn: 'अनुबंध बनाएं',
    initializingPakt: 'अनुबंध तैयार हो रहा है...',
  },
};

/**
 * Universal translation helper for UI strings.
 */
export function t(key: keyof typeof UI_STRINGS.EN, lang: Language): string {
  const dictionary = (UI_STRINGS[lang] || UI_STRINGS.EN) as Record<string, string>;
  return dictionary[key] || UI_STRINGS.EN[key] || '';
}

/**
 * Multi-language Clause Helper:
 * Renders clause title, operative text, and statutory status text
 * in the user's preferred ContractLanguage ('en', 'hi', or 'hinglish')
 * regardless of what screen language they are currently using!
 */
export function getLocalizedClause(
  clause: ContractClause,
  contractLang: ContractLanguage
): { title: string; text: string; statusText: string } {
  if (contractLang === 'hi') {
    return {
      title: clause.titleHindi || clause.title,
      text: clause.textHindi || clause.text,
      statusText: clause.statusTextHindi || 'सत्यापित एवं बाध्यकारी',
    };
  }

  if (contractLang === 'hinglish') {
    return {
      title: clause.titleHinglish || clause.title,
      text: clause.textHinglish || clause.text,
      statusText: clause.statusTextHinglish || 'Validated & Binding',
    };
  }

  // default English
  return {
    title: clause.title,
    text: clause.text,
    statusText: clause.statusText,
  };
}

/**
 * Localized Contract Display Helper:
 * Extracts contract title, parties, summary, and clauses based on contractLanguage.
 */
export function getLocalizedContract(
  contract: ContractItem,
  contractLang: ContractLanguage
): {
  title: string;
  parties: string;
  summary: string;
  fullDraftText: string;
} {
  if (contractLang === 'hi') {
    return {
      title: contract.titleHindi || contract.title,
      parties: contract.partiesHindi || contract.parties.join(' एवं '),
      summary:
        contract.summaryHindi ||
        contract.summary ||
        'भारतीय कानून के तहत मान्य और कानूनी रूप से बाध्यकारी डिजिटल अनुबंध।',
      fullDraftText: contract.fullDraftTextHindi || contract.fullDraftText || '',
    };
  }

  if (contractLang === 'hinglish') {
    return {
      title: contract.titleHinglish || contract.title,
      parties: contract.partiesHinglish || contract.parties.join(' aur '),
      summary:
        contract.summaryHinglish ||
        contract.summary ||
        'Indian Law ke tahat digitally binding aur legally valid smart contract.',
      fullDraftText: contract.fullDraftTextHinglish || contract.fullDraftText || '',
    };
  }

  // English
  return {
    title: contract.title,
    parties: contract.parties.join(' & '),
    summary:
      contract.summary ||
      'Legally binding digital agreement valid under Indian Law (IT Act 2000 Section 10A).',
    fullDraftText: contract.fullDraftText || '',
  };
}
