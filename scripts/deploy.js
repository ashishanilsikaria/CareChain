// scripts/deploy.js
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying MedicalRecord contract to network:", hre.network.name);

  // Get the contract factory
  const MedicalRecord = await hre.ethers.getContractFactory("MedicalRecord");

  // Deploy the contract
  const medicalRecord = await MedicalRecord.deploy();
  await medicalRecord.waitForDeployment();

  const contractAddress = await medicalRecord.getAddress();
  console.log("✅ MedicalRecord contract successfully deployed to:", contractAddress);

  // Read Artifact
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/MedicalRecord.sol/MedicalRecord.json"
  );

  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const contractData = {
      address: contractAddress,
      network: hre.network.name,
      abi: artifact.abi,
      deployedAt: new Date().toISOString(),
    };

    // Save to frontend contracts folder
    const frontendDir = path.join(__dirname, "../frontend/src/contracts");
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(frontendDir, "MedicalRecord.json"),
      JSON.stringify(contractData, null, 2)
    );
    console.log("📁 Exported contract ABI and address to frontend/src/contracts/MedicalRecord.json");

    // Save to backend contracts folder
    const backendDir = path.join(__dirname, "../backend/contracts");
    if (!fs.existsSync(backendDir)) {
      fs.mkdirSync(backendDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(backendDir, "MedicalRecord.json"),
      JSON.stringify(contractData, null, 2)
    );
    console.log("📁 Exported contract ABI and address to backend/contracts/MedicalRecord.json");
  }
}

// Run the deployment
main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
