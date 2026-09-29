import { createClient } from '@supabase/supabase-js';

// Supabase project credentials (provided by user, with fallback to env)
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://hplrpgzixwndxjoodlsl.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'sb_publishable_Ilk9LbGQUUavXRaNEcCNfA_lsWxWp48';

// Initialize Supabase Client for frontend operations
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * SQL Schema migration script for the user's Supabase database.
 * The user can copy and run this in Supabase SQL Editor.
 */
export const SUPABASE_SQL_SCHEMA = `
-- =========================================================
-- PAKT Sovereign Legal Protocol: Supabase Schema Definition
-- Run this in your Supabase SQL Editor: Dashboard -> SQL Editor
-- =========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Real User Profiles & Verified Entity Details Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    entity_type TEXT DEFAULT 'Individual', -- Individual, Pvt Ltd, LLP, Freelancer, Enterprise
    id_type TEXT DEFAULT 'PAN',           -- PAN, Aadhaar, Passport, GSTIN, National ID
    id_number TEXT,
    role TEXT DEFAULT 'Signatory',        -- Director, Signatory, Legal Counsel, Founder
    digital_signature_data TEXT,         -- Base64 signature image or canvas SVG
    is_verified BOOLEAN DEFAULT TRUE,
    sepolia_address TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Legal Agreements Table
CREATE TABLE IF NOT EXISTS public.agreements (
    id TEXT PRIMARY KEY,                  -- e.g. PAKT-2026-MSA-049
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,               -- saas, employment, shareholder, nda
    status TEXT DEFAULT 'pending_signature', -- pending_signature, executed, in_review
    parties JSONB NOT NULL DEFAULT '[]'::jsonb,
    jurisdiction TEXT DEFAULT 'Mumbai, Republic of India',
    stamp_duty TEXT,
    summary TEXT,
    sha256 TEXT NOT NULL,                 -- Canonical cryptographic hash
    eth_tx_hash TEXT,                     -- Ethereum Sepolia transaction hash
    eth_block_number TEXT,                -- Sepolia block number
    sepolia_contract_address TEXT,        -- Deployed PaktSepoliaRegistry address
    full_draft_text TEXT,
    clauses JSONB DEFAULT '[]'::jsonb,
    signers JSONB DEFAULT '[]'::jsonb,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Cryptographic Signatures Table
CREATE TABLE IF NOT EXISTS public.signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id TEXT REFERENCES public.agreements(id) ON DELETE CASCADE,
    signer_address TEXT NOT NULL,
    signer_name TEXT NOT NULL,
    signer_role TEXT,
    signature_hash TEXT NOT NULL,          -- EIP-712 / personal_sign hex
    eth_tx_hash TEXT,                     -- Sepolia tx hash if recorded on-chain
    network TEXT DEFAULT 'Ethereum Sepolia (11155111)',
    signed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Audit Trail & Legal History Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id TEXT,
    event_type TEXT NOT NULL,             -- creation, signature, hash_anchor, verification
    title TEXT NOT NULL,
    description TEXT,
    actor TEXT,
    actor_address TEXT,
    tx_hash TEXT,
    block_number TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS) & Allow Read/Write
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous / Authenticated public policies for app access
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public access user_profiles" ON public.user_profiles;
    CREATE POLICY "Public access user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public access agreements" ON public.agreements;
    CREATE POLICY "Public access agreements" ON public.agreements FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public access signatures" ON public.signatures;
    CREATE POLICY "Public access signatures" ON public.signatures FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public access audit_logs" ON public.audit_logs;
    CREATE POLICY "Public access audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
END $$;
`;

/**
 * Health check to verify if Supabase API is reachable
 */
export async function checkSupabaseHealth(): Promise<{
  connected: boolean;
  message: string;
  hasTables: boolean;
}> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true });

    if (error) {
      // 404 / 42P01 means reachable, but schema table not yet created
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          connected: true,
          message: 'Supabase connected! Tables pending SQL schema execution.',
          hasTables: false,
        };
      }
      return {
        connected: true,
        message: `Supabase reachable: ${error.message}`,
        hasTables: false,
      };
    }

    return {
      connected: true,
      message: 'Supabase fully connected with active database tables!',
      hasTables: true,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err?.message || 'Failed to connect to Supabase endpoint',
      hasTables: false,
    };
  }
}
