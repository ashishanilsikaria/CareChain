// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MedicalRecord
 * @notice Decentralized, Patient-Centric Electronic Health Record (EHR) Access Management System.
 * @dev Manages encrypted IPFS record pointers, granular doctor authorizations, and immutable audit trails.
 */
contract MedicalRecord {
    // Contract Owner (Admin/Hospital Authority)
    address public owner;

    enum RecordType {
        General,
        Diagnostic,
        Prescription,
        LabReport,
        Radiology,
        Surgery
    }

    struct Record {
        uint256 id;
        string ipfsHash;
        string title;
        string recordType;
        string description;
        address patient;
        address uploadedBy;
        uint256 timestamp;
    }

    struct DoctorProfile {
        bool isRegistered;
        bool isVerified;
        string name;
        string specialization;
        string hospital;
    }

    // Patient => Records array
    mapping(address => Record[]) private patientRecords;

    // Patient => (Doctor => isAuthorized)
    mapping(address => mapping(address => bool)) private doctorPermissions;

    // Doctor address => Doctor profile details
    mapping(address => DoctorProfile) public doctors;

    // Total record count counter
    uint256 private recordIdCounter;

    // Events for real-time indexing & audit trails
    event RecordAdded(
        uint256 indexed recordId,
        address indexed patient,
        address indexed uploadedBy,
        string ipfsHash,
        string title,
        string recordType,
        uint256 timestamp
    );

    event AccessGranted(address indexed patient, address indexed doctor, uint256 timestamp);
    event AccessRevoked(address indexed patient, address indexed doctor, uint256 timestamp);
    event DoctorRegistered(address indexed doctor, string name, string specialization);
    event DoctorVerificationUpdated(address indexed doctor, bool isVerified);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can execute this");
        _;
    }

    modifier onlyPatientOrAuthorizedDoctor(address _patient) {
        require(
            msg.sender == _patient ||
            doctorPermissions[_patient][msg.sender] ||
            msg.sender == owner,
            "Access denied: Not patient or authorized doctor"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    /**
     * @notice Register doctor profile details
     */
    function registerDoctor(
        string memory _name,
        string memory _specialization,
        string memory _hospital
    ) external {
        require(bytes(_name).length > 0, "Name is required");
        doctors[msg.sender] = DoctorProfile({
            isRegistered: true,
            isVerified: false,
            name: _name,
            specialization: _specialization,
            hospital: _hospital
        });
        emit DoctorRegistered(msg.sender, _name, _specialization);
    }

    /**
     * @notice Admin verifies or de-verifies a doctor's license
     */
    function setDoctorVerification(address _doctor, bool _isVerified) external onlyOwner {
        require(doctors[_doctor].isRegistered, "Doctor is not registered");
        doctors[_doctor].isVerified = _isVerified;
        emit DoctorVerificationUpdated(_doctor, _isVerified);
    }

    /**
     * @notice Patient grants access to a doctor
     */
    function grantDoctorAccess(address _doctor) external {
        require(_doctor != address(0), "Invalid doctor address");
        require(_doctor != msg.sender, "Cannot authorize self");
        doctorPermissions[msg.sender][_doctor] = true;
        emit AccessGranted(msg.sender, _doctor, block.timestamp);
    }

    /**
     * @notice Patient revokes access from a doctor
     */
    function revokeDoctorAccess(address _doctor) external {
        require(_doctor != address(0), "Invalid doctor address");
        doctorPermissions[msg.sender][_doctor] = false;
        emit AccessRevoked(msg.sender, _doctor, block.timestamp);
    }

    /**
     * @notice Check if a doctor is authorized by a patient
     */
    function isDoctorAuthorized(address _patient, address _doctor) external view returns (bool) {
        return doctorPermissions[_patient][_doctor];
    }

    /**
     * @notice Add a new encrypted medical record to a patient's vault
     * @dev Callable by the patient themselves or by an authorized doctor
     */
    function addRecord(
        address _patient,
        string memory _ipfsHash,
        string memory _title,
        string memory _recordType,
        string memory _description
    ) external onlyPatientOrAuthorizedDoctor(_patient) returns (uint256) {
        require(_patient != address(0), "Invalid patient address");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        require(bytes(_title).length > 0, "Title required");

        recordIdCounter++;
        uint256 newId = recordIdCounter;

        Record memory newRecord = Record({
            id: newId,
            ipfsHash: _ipfsHash,
            title: _title,
            recordType: _recordType,
            description: _description,
            patient: _patient,
            uploadedBy: msg.sender,
            timestamp: block.timestamp
        });

        patientRecords[_patient].push(newRecord);

        emit RecordAdded(
            newId,
            _patient,
            msg.sender,
            _ipfsHash,
            _title,
            _recordType,
            block.timestamp
        );

        return newId;
    }

    /**
     * @notice Retrieve all medical records for a given patient
     * @dev Enforces access control (only patient, authorized doctor, or owner)
     */
    function getPatientRecords(address _patient)
        external
        view
        onlyPatientOrAuthorizedDoctor(_patient)
        returns (Record[] memory)
    {
        return patientRecords[_patient];
    }

    /**
     * @notice Get count of records for a given patient
     */
    function getRecordCount(address _patient)
        external
        view
        onlyPatientOrAuthorizedDoctor(_patient)
        returns (uint256)
    {
        return patientRecords[_patient].length;
    }

    /**
     * @notice Transfer contract ownership
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner is zero address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }
}
