import { supabase } from '../utils/supabaseClient';
import { ContractItem, UserProfile } from '../types';

/**
 * Save / Upsert real user details and profile into Supabase
 */
export async function syncUserProfileToSupabase(profile: UserProfile): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  try {
    const payload = {
      wallet_address: profile.walletAddress || profile.sepoliaAddress || '0x71C857835B551339A471026027a48911C36b5A01',
      full_name: profile.name,
      email: profile.email,
      phone: profile.phone,
      entity_type: profile.entityType || 'Individual',
      id_type: profile.idType || 'PAN',
      id_number: profile.idNumber || profile.panMasked || profile.aadhaarMasked || '',
      role: profile.role,
      digital_signature_data: profile.digitalSignatureData || '',
      sepolia_address: profile.sepoliaAddress || profile.walletAddress || '',
      metadata: {
        organization: profile.organization,
        bio: profile.bio,
        location: profile.location,
        didIdentifier: profile.didIdentifier,
        kycLevel: profile.kycLevel,
        dinNumber: profile.dinNumber,
      },
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(payload, { onConflict: 'wallet_address' })
      .select();

    if (error) {
      console.warn('Supabase profile upsert warning (check if table exists):', error.message);
      // Cache locally in localStorage as reliable fallback
      localStorage.setItem('pakt_user_profile', JSON.stringify({ ...profile, syncedWithSupabase: false }));
      return { success: false, error: error.message };
    }

    // Cache locally with sync confirmation
    localStorage.setItem(
      'pakt_user_profile', 
      JSON.stringify({ ...profile, syncedWithSupabase: true, lastSyncedAt: new Date().toISOString() })
    );

    return { success: true, data };
  } catch (err: any) {
    console.error('Failed syncing user profile to Supabase:', err);
    return { success: false, error: err?.message || 'Network error syncing to Supabase' };
  }
}

/**
 * Fetch real user details from Supabase by wallet address or email
 */
export async function fetchUserProfileFromSupabase(
  identifier: string
): Promise<Partial<UserProfile> | null> {
  try {
    let query = supabase.from('user_profiles').select('*');

    if (identifier.startsWith('0x')) {
      query = query.eq('wallet_address', identifier);
    } else {
      query = query.eq('email', identifier);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      name: data.full_name,
      email: data.email,
      phone: data.phone,
      entityType: data.entity_type,
      idType: data.id_type,
      idNumber: data.id_number,
      role: data.role,
      digitalSignatureData: data.digital_signature_data,
      walletAddress: data.wallet_address,
      sepoliaAddress: data.sepolia_address,
      organization: data.metadata?.organization || '',
      bio: data.metadata?.bio || '',
      location: data.metadata?.location || '',
      didIdentifier: data.metadata?.didIdentifier || '',
      kycLevel: data.metadata?.kycLevel || 'Tier 3 (Government Aadhaar/PAN Verified)',
      syncedWithSupabase: true,
      lastSyncedAt: data.updated_at,
    };
  } catch (err) {
    console.warn('Could not fetch user profile from Supabase:', err);
    return null;
  }
}

/**
 * Save or update a contract/agreement in Supabase
 */
export async function syncAgreementToSupabase(agreement: ContractItem): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const payload = {
      id: agreement.id,
      code: agreement.code,
      title: agreement.title,
      category: agreement.category,
      status: agreement.status,
      parties: agreement.parties || [],
      jurisdiction: agreement.jurisdiction || 'Mumbai, Republic of India',
      stamp_duty: agreement.stampDuty || '₹500',
      summary: agreement.summary || '',
      sha256: agreement.sha256,
      eth_tx_hash: agreement.polygonTx || '', // On-chain Sepolia tx
      eth_block_number: agreement.blockNumber || '',
      full_draft_text: agreement.fullDraftText || '',
      clauses: agreement.clauses || [],
      signers: agreement.signers || [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('agreements')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase agreement save warning:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Fetch all agreements from Supabase
 */
export async function fetchAgreementsFromSupabase(): Promise<ContractItem[] | null> {
  try {
    const { data, error } = await supabase
      .from('agreements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data.map((item: any) => ({
      id: item.id,
      code: item.code || item.id,
      title: item.title,
      titleHindi: item.title,
      category: item.category,
      status: item.status,
      statusLabelEn: item.status === 'executed' ? 'Legally Executed' : 'Awaiting Signatures',
      statusLabelHi: item.status === 'executed' ? 'वैध रूप से निष्पादित' : 'हस्ताक्षर प्रतीक्षित',
      parties: Array.isArray(item.parties) ? item.parties : [],
      sha256: item.sha256,
      evmAnchor: item.eth_tx_hash ? 'Ethereum Sepolia Testnet' : 'Pending Sepolia Anchor',
      polygonTx: item.eth_tx_hash || '',
      blockNumber: item.eth_block_number || '',
      stampDuty: item.stamp_duty || '₹500',
      jurisdiction: item.jurisdiction || 'Mumbai, Republic of India',
      summary: item.summary || '',
      fullDraftText: item.full_draft_text || '',
      clauses: item.clauses || [],
      signers: item.signers || [],
    }));
  } catch (err) {
    console.warn('Error fetching agreements from Supabase:', err);
    return null;
  }
}

/**
 * Record a cryptographic signature in Supabase
 */
export async function recordSignatureToSupabase(params: {
  agreementId: string;
  signerAddress: string;
  signerName: string;
  signerRole: string;
  signatureHash: string;
  ethTxHash?: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase.from('signatures').insert({
      agreement_id: params.agreementId,
      signer_address: params.signerAddress,
      signer_name: params.signerName,
      signer_role: params.signerRole,
      signature_hash: params.signatureHash,
      eth_tx_hash: params.ethTxHash || null,
      network: 'Ethereum Sepolia (11155111)',
      signed_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Supabase signature record warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed recording signature in Supabase:', err);
    return false;
  }
}

/**
 * Record an audit log event in Supabase
 */
export async function recordAuditLogToSupabase(params: {
  agreementId?: string;
  eventType: string;
  title: string;
  description: string;
  actor: string;
  actorAddress?: string;
  txHash?: string;
  blockNumber?: string;
  metadata?: Record<string, any>;
}): Promise<boolean> {
  try {
    const { error } = await supabase.from('audit_logs').insert({
      agreement_id: params.agreementId || null,
      event_type: params.eventType,
      title: params.title,
      description: params.description,
      actor: params.actor,
      actor_address: params.actorAddress || null,
      tx_hash: params.txHash || null,
      block_number: params.blockNumber || null,
      metadata: params.metadata || {},
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Supabase audit log record warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed recording audit log in Supabase:', err);
    return false;
  }
}
