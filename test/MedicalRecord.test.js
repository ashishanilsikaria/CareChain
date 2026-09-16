import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("MedicalRecord Smart Contract", function () {
  let MedicalRecord;
  let medicalRecord;
  let owner, patient1, patient2, doctor1, doctor2, stranger;

  beforeEach(async function () {
    [owner, patient1, patient2, doctor1, doctor2, stranger] = await ethers.getSigners();

    MedicalRecord = await ethers.getContractFactory("MedicalRecord");
    medicalRecord = await MedicalRecord.deploy();
    await medicalRecord.waitForDeployment();
  });

  describe("Deployment & Initialization", function () {
    it("Should set the deployer as the owner", async function () {
      expect(await medicalRecord.owner()).to.equal(owner.address);
    });
  });

  describe("Doctor Registration & Verification", function () {
    it("Should allow a doctor to register a profile", async function () {
      await expect(
        medicalRecord.connect(doctor1).registerDoctor("Dr. Alice Smith", "Cardiology", "City General Hospital")
      )
        .to.emit(medicalRecord, "DoctorRegistered")
        .withArgs(doctor1.address, "Dr. Alice Smith", "Cardiology");

      const doc = await medicalRecord.doctors(doctor1.address);
      expect(doc.isRegistered).to.be.true;
      expect(doc.isVerified).to.be.false;
      expect(doc.name).to.equal("Dr. Alice Smith");
    });

    it("Should allow owner to verify a registered doctor", async function () {
      await medicalRecord.connect(doctor1).registerDoctor("Dr. Alice Smith", "Cardiology", "City Hospital");

      await expect(medicalRecord.connect(owner).setDoctorVerification(doctor1.address, true))
        .to.emit(medicalRecord, "DoctorVerificationUpdated")
        .withArgs(doctor1.address, true);

      const doc = await medicalRecord.doctors(doctor1.address);
      expect(doc.isVerified).to.be.true;
    });

    it("Should reject verification by non-owner", async function () {
      await medicalRecord.connect(doctor1).registerDoctor("Dr. Alice Smith", "Cardiology", "City Hospital");

      await expect(
        medicalRecord.connect(patient1).setDoctorVerification(doctor1.address, true)
      ).to.be.revertedWith("Only contract owner can execute this");
    });
  });

  describe("Patient Access Control & Authorization", function () {
    it("Should allow a patient to grant and revoke doctor access", async function () {
      // Check initial state
      expect(await medicalRecord.isDoctorAuthorized(patient1.address, doctor1.address)).to.be.false;

      // Grant access
      await expect(medicalRecord.connect(patient1).grantDoctorAccess(doctor1.address))
        .to.emit(medicalRecord, "AccessGranted")
        .withArgs(patient1.address, doctor1.address, (await ethers.provider.getBlock("latest")).timestamp + 1);

      expect(await medicalRecord.isDoctorAuthorized(patient1.address, doctor1.address)).to.be.true;

      // Revoke access
      await expect(medicalRecord.connect(patient1).revokeDoctorAccess(doctor1.address))
        .to.emit(medicalRecord, "AccessRevoked")
        .withArgs(patient1.address, doctor1.address, (await ethers.provider.getBlock("latest")).timestamp + 1);

      expect(await medicalRecord.isDoctorAuthorized(patient1.address, doctor1.address)).to.be.false;
    });

    it("Should prevent patient from authorizing self", async function () {
      await expect(
        medicalRecord.connect(patient1).grantDoctorAccess(patient1.address)
      ).to.be.revertedWith("Cannot authorize self");
    });
  });

  describe("Medical Record Management", function () {
    it("Should allow patient to upload their own record", async function () {
      const ipfsHash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
      const title = "Blood Test Report";
      const recordType = "LabReport";
      const desc = "Comprehensive metabolic panel";

      await expect(
        medicalRecord.connect(patient1).addRecord(patient1.address, ipfsHash, title, recordType, desc)
      )
        .to.emit(medicalRecord, "RecordAdded")
        .withArgs(1, patient1.address, patient1.address, ipfsHash, title, recordType, (await ethers.provider.getBlock("latest")).timestamp + 1);

      const records = await medicalRecord.connect(patient1).getPatientRecords(patient1.address);
      expect(records.length).to.equal(1);
      expect(records[0].title).to.equal(title);
      expect(records[0].ipfsHash).to.equal(ipfsHash);
      expect(records[0].uploadedBy).to.equal(patient1.address);
    });

    it("Should allow authorized doctor to upload and view patient records", async function () {
      // Patient grants access to doctor1
      await medicalRecord.connect(patient1).grantDoctorAccess(doctor1.address);

      const ipfsHash = "QmZtmD2qtQgFDBSGaBidNocnhNaTiazDXJ6962Y28AG5V6";
      const title = "ECG Report";
      const recordType = "Diagnostic";
      const desc = "Normal sinus rhythm";

      // Doctor uploads record for patient
      await expect(
        medicalRecord.connect(doctor1).addRecord(patient1.address, ipfsHash, title, recordType, desc)
      ).to.emit(medicalRecord, "RecordAdded");

      // Doctor retrieves records
      const records = await medicalRecord.connect(doctor1).getPatientRecords(patient1.address);
      expect(records.length).to.equal(1);
      expect(records[0].uploadedBy).to.equal(doctor1.address);

      // Patient also sees the record uploaded by doctor
      const patientView = await medicalRecord.connect(patient1).getPatientRecords(patient1.address);
      expect(patientView.length).to.equal(1);
    });

    it("Should prevent unauthorized doctor from adding or viewing records", async function () {
      // Patient uploads a record
      await medicalRecord.connect(patient1).addRecord(
        patient1.address,
        "QmTestHash123",
        "X-Ray Chest",
        "Radiology",
        "Clear lungs"
      );

      // Unauthorized doctor2 tries to view patient1's records
      await expect(
        medicalRecord.connect(doctor2).getPatientRecords(patient1.address)
      ).to.be.revertedWith("Access denied: Not patient or authorized doctor");

      // Unauthorized doctor2 tries to add record for patient1
      await expect(
        medicalRecord.connect(doctor2).addRecord(
          patient1.address,
          "QmTestHash456",
          "Malicious report",
          "Diagnostic",
          "Fake diagnosis"
        )
      ).to.be.revertedWith("Access denied: Not patient or authorized doctor");
    });

    it("Should isolate records between different patients", async function () {
      await medicalRecord.connect(patient1).addRecord(patient1.address, "Hash1", "P1 Record", "General", "Desc 1");
      await medicalRecord.connect(patient2).addRecord(patient2.address, "Hash2", "P2 Record", "General", "Desc 2");

      const p1Records = await medicalRecord.connect(patient1).getPatientRecords(patient1.address);
      const p2Records = await medicalRecord.connect(patient2).getPatientRecords(patient2.address);

      expect(p1Records.length).to.equal(1);
      expect(p1Records[0].title).to.equal("P1 Record");

      expect(p2Records.length).to.equal(1);
      expect(p2Records[0].title).to.equal("P2 Record");

      // Patient 1 cannot read Patient 2 records
      await expect(
        medicalRecord.connect(patient1).getPatientRecords(patient2.address)
      ).to.be.revertedWith("Access denied: Not patient or authorized doctor");
    });
  });

  describe("Ownership Transfer", function () {
    it("Should allow owner to transfer ownership", async function () {
      await expect(medicalRecord.connect(owner).transferOwnership(stranger.address))
        .to.emit(medicalRecord, "OwnershipTransferred")
        .withArgs(owner.address, stranger.address);

      expect(await medicalRecord.owner()).to.equal(stranger.address);
    });
  });
});
