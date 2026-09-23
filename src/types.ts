export type ScreenType = 
  | 'landing' 
  | 'login' 
  | '2fa' 
  | 'contracts' 
  | 'esign' 
  | 'copilot' 
  | 'verify' 
  | 'settings'
  | 'notifications'
  | 'new-agreement';

export type Language = 'EN' | 'HI';

export type ContractLanguage = 'en' | 'hi' | 'hinglish';

export interface Signer {
  id: string;
  name: string;
  nameHindi: string;
  nameHinglish?: string;
  role: string;
  company: string;
  status: 'completed' | 'active_due' | 'in_queue';
  signedDate?: string;
  dscType?: string;
  avatar?: string;
  initials?: string;
}

export interface ContractClause {
  clauseNumber: string;
  title: string;
  titleHindi?: string;
  titleHinglish?: string;
  statusText: string;
  statusTextHindi?: string;
  statusTextHinglish?: string;
  text: string;
  textHindi?: string;
  textHinglish?: string;
  isTarget?: boolean;
  isCustom?: boolean;
  discarded?: boolean;
  discardReason?: string;
  updatedAt?: string;
}

export interface AuditHistoryEvent {
  id: string;
  timestamp: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  actor: string;
  eventType: 'creation' | 'signature' | 'hash_anchor' | 'stamp_duty' | 'clause_change' | 'vault_storage' | 'verification' | 'note';
  txHash?: string;
  blockNumber?: string;
  metadata?: Record<string, string>;
}

export interface ContractItem {
  id: string;
  code: string;
  title: string;
  titleHindi: string;
  titleHinglish?: string;
  category: 'saas' | 'employment' | 'shareholder' | 'nda';
  status: 'pending_signature' | 'executed' | 'in_review';
  statusLabelEn: string;
  statusLabelHi: string;
  statusLabelHinglish?: string;
  parties: string[];
  partiesHindi?: string;
  partiesHinglish?: string;
  turnNotice?: string;
  turnNoticeHindi?: string;
  turnNoticeHinglish?: string;
  progressPercent?: number;
  aiFlag?: string;
  aiFlagHindi?: string;
  aiFlagHinglish?: string;
  sha256: string;
  evmAnchor?: string;
  polygonTx?: string;
  blockNumber?: string;
  stampDuty?: string;
  remuneration?: string;
  tokenCap?: string;
  updatedTime?: string;
  avatarBadges?: string[];
  signers?: Signer[];
  clauses?: ContractClause[];
  jurisdiction?: string;
  summary?: string;
  summaryHindi?: string;
  summaryHinglish?: string;
  fullDraftText?: string;
  fullDraftTextHindi?: string;
  fullDraftTextHinglish?: string;
  contractLanguage?: ContractLanguage;
  history?: AuditHistoryEvent[];
  storedInVault?: boolean;
  vaultStorageDate?: string;
  vaultArchiveId?: string;
  sec65BCertificateId?: string;
  executionDate?: string;
  offlineStored?: boolean;
}

export interface CopilotIntervention {
  id: number;
  severity: 'high' | 'medium';
  severityLabelEn: string;
  severityLabelHi: string;
  tagEn: string;
  tagHi: string;
  clauseTitle: string;
  clauseTitleHindi: string;
  confidence: string;
  originalText?: string;
  originalLabel?: string;
  recommendedText: string;
  recommendedLabel: string;
  analysisText: string;
  analysisTextHindi?: string;
  applied?: boolean;
  rejected?: boolean;
}

export interface AuditVerificationSigner {
  name: string;
  org: string;
  method: string;
  status: string;
}

export interface AuditVerificationData {
  contractId: string;
  title: string;
  titleHindi?: string;
  parties: string;
  timestamp: string;
  blockNumber: string;
  txHash: string;
  uuid?: string;
  canonicalHash?: string;
  smartContractRegistry?: string;
  contractFileName?: string;
  stampDutyChallan?: string;
  txReceipt?: string;
  blockTimestamp?: string;
  signatoryMerkleRoot?: string;
  signatoryLabels?: string[];
  agreementTitle?: string;
  agreementTitleHindi?: string;
  paktRegId?: string;
  signers: AuditVerificationSigner[];
}

export interface AppNotification {
  id: string;
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  category: 'signature' | 'blockchain' | 'ai' | 'compliance' | 'stamp';
  timestampEn: string;
  timestampHi: string;
  isRead: boolean;
  priority?: 'urgent' | 'info' | 'success';
  actionTarget?: ScreenType;
  actionContractId?: string;
  actionLabelEn?: string;
  actionLabelHi?: string;
}

export interface UserProfile {
  name: string;
  nameHindi: string;
  role: string;
  roleHindi: string;
  organization: string;
  organizationHindi: string;
  bio: string;
  bioHindi: string;
  email: string;
  phone: string;
  location: string;
  locationHindi: string;
  twitterHandle: string;
  linkedinHandle: string;
  githubHandle: string;
  telegramHandle: string;
  web3Ens: string;
  didIdentifier: string;
  aadhaarMasked: string;
  panMasked: string;
  dinNumber: string;
  avatarUrl: string;
  kycLevel: string;
  jurisdiction: string;
}

