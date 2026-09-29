// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PaktSepoliaRegistry
 * @dev Sovereign Decentralized Legal Agreement Registry for Ethereum Sepolia Testnet.
 * Provides immutable SHA-256 document hashing, multi-party cryptographic e-signatures,
 * tamper-evident timestamps, and dispute verification.
 */
contract PaktSepoliaRegistry {
    // Contract owner / deployer
    address public owner;
    string public constant VERSION = "PAKT-Sepolia-v1.0";
    uint256 public constant CHAIN_ID = 11155111; // Ethereum Sepolia

    struct SignerStatus {
        address signerAddress;
        string signerName;
        string role;
        bool hasSigned;
        uint256 signedAt;
        string signatureMetadata; // EIP-712 or client sig hash
    }

    struct Agreement {
        bytes32 docHash;              // Canonical SHA-256 hash of legal draft
        string paktId;                // External PAKT ID (e.g. PAKT-2026-MSA-049)
        string title;                 // Legal document title
        address creator;              // Address that registered the agreement
        uint256 createdAt;            // Block timestamp
        string metadataURI;           // Supabase or IPFS reference URI
        bool isFullyExecuted;         // True when all signers have signed
        address[] signerList;         // List of required signer addresses
    }

    // Mapping from docHash (bytes32) to Agreement
    mapping(bytes32 => Agreement) private agreements;
    // Mapping from docHash to signer address to SignerStatus
    mapping(bytes32 => mapping(address => SignerStatus)) private agreementSigners;
    // List of all registered docHashes for discovery
    bytes32[] public registeredHashes;

    // Events
    event AgreementAnchored(
        bytes32 indexed docHash,
        string paktId,
        string title,
        address indexed creator,
        uint256 timestamp,
        uint256 signersCount
    );

    event AgreementSigned(
        bytes32 indexed docHash,
        address indexed signer,
        string signerName,
        uint256 timestamp,
        string signatureMetadata
    );

    event AgreementFullyExecuted(
        bytes32 indexed docHash,
        string paktId,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can execute");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Anchors a legal agreement hash on Ethereum Sepolia
     * @param _docHash SHA-256 hash of the canonical contract text
     * @param _paktId Human-readable identifier
     * @param _title Title of legal document
     * @param _signers Array of required signer wallet addresses
     * @param _metadataURI Supabase database reference or URI
     */
    function anchorAgreement(
        bytes32 _docHash,
        string calldata _paktId,
        string calldata _title,
        address[] calldata _signers,
        string calldata _metadataURI
    ) external {
        require(_docHash != bytes32(0), "Invalid document hash");
        require(agreements[_docHash].createdAt == 0, "Agreement already anchored");

        Agreement storage ag = agreements[_docHash];
        ag.docHash = _docHash;
        ag.paktId = _paktId;
        ag.title = _title;
        ag.creator = msg.sender;
        ag.createdAt = block.timestamp;
        ag.metadataURI = _metadataURI;
        ag.isFullyExecuted = (_signers.length == 0);

        for (uint256 i = 0; i < _signers.length; i++) {
            address s = _signers[i];
            ag.signerList.push(s);
            agreementSigners[_docHash][s] = SignerStatus({
                signerAddress: s,
                signerName: "",
                role: "",
                hasSigned: false,
                signedAt: 0,
                signatureMetadata: ""
            });
        }

        registeredHashes.push(_docHash);

        emit AgreementAnchored(
            _docHash,
            _paktId,
            _title,
            msg.sender,
            block.timestamp,
            _signers.length
        );
    }

    /**
     * @notice Records a cryptographic signature for an anchored agreement
     * @param _docHash The agreement hash
     * @param _signerName Legal name of signer
     * @param _role Signer's designated corporate/legal role
     * @param _sigMetadata Signature proof or metadata
     */
    function signAgreement(
        bytes32 _docHash,
        string calldata _signerName,
        string calldata _role,
        string calldata _sigMetadata
    ) external {
        Agreement storage ag = agreements[_docHash];
        require(ag.createdAt != 0, "Agreement does not exist");
        
        SignerStatus storage ss = agreementSigners[_docHash][msg.sender];
        require(!ss.hasSigned, "Signer has already signed");

        // If signer was not pre-registered, add them to signerList dynamically
        if (ss.signerAddress == address(0)) {
            ag.signerList.push(msg.sender);
        }

        ss.signerAddress = msg.sender;
        ss.signerName = _signerName;
        ss.role = _role;
        ss.hasSigned = true;
        ss.signedAt = block.timestamp;
        ss.signatureMetadata = _sigMetadata;

        emit AgreementSigned(
            _docHash,
            msg.sender,
            _signerName,
            block.timestamp,
            _sigMetadata
        );

        // Check if all designated signers have signed
        bool allSigned = true;
        for (uint256 i = 0; i < ag.signerList.length; i++) {
            if (!agreementSigners[_docHash][ag.signerList[i]].hasSigned) {
                allSigned = false;
                break;
            }
        }

        if (allSigned && !ag.isFullyExecuted) {
            ag.isFullyExecuted = true;
            emit AgreementFullyExecuted(_docHash, ag.paktId, block.timestamp);
        }
    }

    /**
     * @notice Verifies an agreement status and details
     */
    function verifyAgreement(bytes32 _docHash) external view returns (
        bool exists,
        string memory paktId,
        string memory title,
        address creator,
        uint256 createdAt,
        uint256 signersCount,
        bool isFullyExecuted,
        string memory metadataURI
    ) {
        Agreement storage ag = agreements[_docHash];
        if (ag.createdAt == 0) {
            return (false, "", "", address(0), 0, 0, false, "");
        }
        return (
            true,
            ag.paktId,
            ag.title,
            ag.creator,
            ag.createdAt,
            ag.signerList.length,
            ag.isFullyExecuted,
            ag.metadataURI
        );
    }

    /**
     * @notice Checks if a specific address has signed
     */
    function hasSigned(bytes32 _docHash, address _signer) external view returns (bool, uint256, string memory) {
        SignerStatus storage ss = agreementSigners[_docHash][_signer];
        return (ss.hasSigned, ss.signedAt, ss.signerName);
    }

    /**
     * @notice Returns total number of registered agreements
     */
    function totalAgreements() external view returns (uint256) {
        return registeredHashes.length;
    }
}
