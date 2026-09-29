import { ethers } from 'ethers';

export const SEPOLIA_CHAIN_ID_DECIMAL = 11155111;
export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';
export const SEPOLIA_EXPLORER = 'https://sepolia.etherscan.io';
export const SEPOLIA_DEFAULT_RPC = 'https://rpc.sepolia.org';

// Default / fallback deployed contract or configured address
export const DEFAULT_SEPOLIA_CONTRACT_ADDRESS = 
  import.meta.env.VITE_SEPOLIA_CONTRACT_ADDRESS || 
  '0x41f3CdB4dEB4A5fCe5B20Af71c0D0108A74A03e8';

export const PAKT_SEPOLIA_REGISTRY_ABI = [
  'function anchorAgreement(bytes32 _docHash, string calldata _paktId, string calldata _title, address[] calldata _signers, string calldata _metadataURI) external',
  'function signAgreement(bytes32 _docHash, string calldata _signerName, string calldata _role, string calldata _sigMetadata) external',
  'function verifyAgreement(bytes32 _docHash) external view returns (bool exists, string memory paktId, string memory title, address creator, uint256 createdAt, uint256 signersCount, bool isFullyExecuted, string memory metadataURI)',
  'function hasSigned(bytes32 _docHash, address _signer) external view returns (bool hasSigned, uint256 signedAt, string memory signerName)',
  'function totalAgreements() external view returns (uint256)',
  'event AgreementAnchored(bytes32 indexed docHash, string paktId, string title, address indexed creator, uint256 timestamp, uint256 signersCount)',
  'event AgreementSigned(bytes32 indexed docHash, address indexed signer, string signerName, uint256 timestamp, string signatureMetadata)',
  'event AgreementFullyExecuted(bytes32 indexed docHash, string paktId, uint256 timestamp)'
];

export interface SepoliaWalletState {
  isConnected: boolean;
  address: string | null;
  chainId: string | null;
  isSepolia: boolean;
  balanceETH: string;
  errorMessage?: string;
}

/**
 * Checks if MetaMask or injected Web3 is available in window
 */
export function isMetaMaskInjected(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).ethereum);
}

/**
 * Requests switching the MetaMask network to Ethereum Sepolia.
 * Adds the network to MetaMask if not already present.
 */
export async function switchToSepoliaNetwork(): Promise<boolean> {
  if (!isMetaMaskInjected()) return false;
  const ethereum = (window as any).ethereum;

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
    return true;
  } catch (switchError: any) {
    // Error code 4902 means the chain has not been added to MetaMask
    if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID_HEX,
              chainName: 'Ethereum Sepolia Testnet',
              nativeCurrency: {
                name: 'Sepolia Ether',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: [
                'https://rpc.sepolia.org',
                'https://ethereum-sepolia-rpc.publicnode.com',
                'https://sepolia.drpc.org'
              ],
              blockExplorerUrls: [SEPOLIA_EXPLORER],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Sepolia network to MetaMask:', addError);
        return false;
      }
    }
    console.error('Failed to switch to Sepolia network:', switchError);
    return false;
  }
}

/**
 * Connect to MetaMask, verify Sepolia network, and return wallet state
 */
export async function connectMetaMaskSepolia(): Promise<SepoliaWalletState> {
  if (!isMetaMaskInjected()) {
    return {
      isConnected: false,
      address: null,
      chainId: null,
      isSepolia: false,
      balanceETH: '0.00',
      errorMessage: 'MetaMask extension not found in this browser.',
    };
  }

  const ethereum = (window as any).ethereum;

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      return {
        isConnected: false,
        address: null,
        chainId: null,
        isSepolia: false,
        balanceETH: '0.00',
        errorMessage: 'No accounts granted in MetaMask.',
      };
    }

    const address = accounts[0];
    let currentChainId = await ethereum.request({ method: 'eth_chainId' });
    let isSepolia = (
      currentChainId === SEPOLIA_CHAIN_ID_HEX || 
      parseInt(currentChainId, 16) === SEPOLIA_CHAIN_ID_DECIMAL
    );

    if (!isSepolia) {
      const switched = await switchToSepoliaNetwork();
      if (switched) {
        currentChainId = await ethereum.request({ method: 'eth_chainId' });
        isSepolia = true;
      }
    }

    let balanceETH = '0.00';
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const balanceBigInt = await provider.getBalance(address);
      balanceETH = parseFloat(ethers.formatEther(balanceBigInt)).toFixed(4);
    } catch (balErr) {
      console.warn('Could not read Sepolia ETH balance:', balErr);
    }

    return {
      isConnected: true,
      address,
      chainId: currentChainId,
      isSepolia,
      balanceETH,
    };
  } catch (error: any) {
    return {
      isConnected: false,
      address: null,
      chainId: null,
      isSepolia: false,
      balanceETH: '0.00',
      errorMessage: error?.message || 'User rejected MetaMask connection.',
    };
  }
}

/**
 * Converts a SHA-256 hex string to bytes32 format for smart contract
 */
export function formatBytes32Hash(sha256Hex: string): string {
  const cleanHex = sha256Hex.replace(/^0x/, '');
  if (cleanHex.length === 64) {
    return `0x${cleanHex}`;
  }
  return ethers.keccak256(ethers.toUtf8Bytes(sha256Hex));
}

/**
 * Anchor agreement directly on Ethereum Sepolia.
 * If contract address is valid, calls anchorAgreement on smart contract.
 * Also provides direct on-chain transaction fallback using transaction calldata.
 */
export async function anchorAgreementOnSepolia(params: {
  contractAddress?: string;
  sha256Hash: string;
  paktId: string;
  title: string;
  signers?: string[];
  metadataURI?: string;
}): Promise<{
  success: boolean;
  txHash: string;
  blockNumber?: number;
  explorerUrl: string;
  method: 'smart_contract' | 'calldata_anchor';
  errorMessage?: string;
}> {
  if (!isMetaMaskInjected()) {
    throw new Error('MetaMask is not available.');
  }

  const ethereum = (window as any).ethereum;
  await switchToSepoliaNetwork();

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const signerAddress = await signer.getAddress();
  const bytes32Hash = formatBytes32Hash(params.sha256Hash);
  const targetContract = params.contractAddress || DEFAULT_SEPOLIA_CONTRACT_ADDRESS;

  // Try smart contract execution first
  try {
    const contract = new ethers.Contract(targetContract, PAKT_SEPOLIA_REGISTRY_ABI, signer);
    const signersList = params.signers && params.signers.length > 0 ? params.signers : [signerAddress];
    const metadata = params.metadataURI || `supabase:agreements/${params.paktId}`;

    const tx = await contract.anchorAgreement(
      bytes32Hash,
      params.paktId,
      params.title,
      signersList,
      metadata
    );

    const receipt = await tx.wait(1);

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt?.blockNumber,
      explorerUrl: `${SEPOLIA_EXPLORER}/tx/${tx.hash}`,
      method: 'smart_contract',
    };
  } catch (contractErr: any) {
    console.warn('Smart contract anchor attempt error (falling back to direct Sepolia transaction calldata):', contractErr);
    
    // Direct zero-value anchor transaction on Sepolia with data payload:
    // Ensures real on-chain transaction receipt even if contract is not deployed yet
    try {
      const payloadData = ethers.hexlify(ethers.toUtf8Bytes(`PAKT:${params.paktId}:${bytes32Hash}`));
      const tx = await signer.sendTransaction({
        to: signerAddress, // self-transaction to record hash in Sepolia ledger
        value: 0,
        data: payloadData,
      });

      const receipt = await tx.wait(1);

      return {
        success: true,
        txHash: tx.hash,
        blockNumber: receipt?.blockNumber,
        explorerUrl: `${SEPOLIA_EXPLORER}/tx/${tx.hash}`,
        method: 'calldata_anchor',
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        txHash: '',
        explorerUrl: '',
        method: 'calldata_anchor',
        errorMessage: fallbackErr?.message || contractErr?.message || 'Transaction rejected on Sepolia.',
      };
    }
  }
}

/**
 * Sign an agreement using MetaMask with EIP-712 on Sepolia
 */
export async function signAgreementWithMetaMask(params: {
  sha256Hash: string;
  paktId: string;
  title: string;
  signerName: string;
  role: string;
  contractAddress?: string;
}): Promise<{
  success: boolean;
  signature: string;
  signerAddress: string;
  timestamp: string;
  txHash?: string;
  explorerUrl?: string;
  errorMessage?: string;
}> {
  if (!isMetaMaskInjected()) {
    throw new Error('MetaMask is not available');
  }

  const ethereum = (window as any).ethereum;
  await switchToSepoliaNetwork();

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const signerAddress = await signer.getAddress();
  const timestamp = new Date().toISOString();

  try {
    // EIP-712 Structured Data definition for Sepolia
    const domain = {
      name: 'PAKT Sovereign Protocol',
      version: '1.0',
      chainId: SEPOLIA_CHAIN_ID_DECIMAL,
      verifyingContract: params.contractAddress || DEFAULT_SEPOLIA_CONTRACT_ADDRESS,
    };

    const types = {
      LegalAgreementExecution: [
        { name: 'paktId', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'documentSha256', type: 'string' },
        { name: 'signerName', type: 'string' },
        { name: 'signerRole', type: 'string' },
        { name: 'timestamp', type: 'string' },
      ],
    };

    const value = {
      paktId: params.paktId,
      title: params.title,
      documentSha256: params.sha256Hash,
      signerName: params.signerName,
      role: params.role,
      timestamp,
    };

    const signature = await signer.signTypedData(domain, types, value);

    // Optional on-chain registration if user wants on-chain receipt
    let txHash: string | undefined;
    let explorerUrl: string | undefined;

    try {
      const targetContract = params.contractAddress || DEFAULT_SEPOLIA_CONTRACT_ADDRESS;
      const contract = new ethers.Contract(targetContract, PAKT_SEPOLIA_REGISTRY_ABI, signer);
      const bytes32Hash = formatBytes32Hash(params.sha256Hash);

      const tx = await contract.signAgreement(
        bytes32Hash,
        params.signerName,
        params.role,
        signature.slice(0, 66)
      );
      txHash = tx.hash;
      explorerUrl = `${SEPOLIA_EXPLORER}/tx/${tx.hash}`;
    } catch {
      // Contract call is optional if user only requested cryptographic signature
    }

    return {
      success: true,
      signature,
      signerAddress,
      timestamp,
      txHash,
      explorerUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      signature: '',
      signerAddress,
      timestamp,
      errorMessage: error?.message || 'MetaMask signature request was cancelled.',
    };
  }
}
