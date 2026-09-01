// scripts/deploy-and-verify.js
// Deploys MedicalRecord contract and verifies on Etherscan
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  console.log("🚀 Deploying MedicalRecord contract to network:", network);

  // Get the contract factory
  const MedicalRecord = await hre.ethers.getContractFactory("MedicalRecord");

  // Deploy the contract
  const medicalRecord = await MedicalRecord.deploy();
  await medicalRecord.waitForDeployment();

  const contractAddress = await medicalRecord.getAddress();
  console.log("✅ MedicalRecord contract deployed to:", contractAddress);

  // Save deployment info
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/MedicalRecord.sol/MedicalRecord.json"
  );

  let contractData = {
    address: contractAddress,
    network: network,
    abi: [],
    deployedAt: new Date().toISOString(),
  };

  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    contractData.abi = artifact.abi;

    // Save to frontend contracts folder
    const frontendDir = path.join(__dirname, "../frontend/src/contracts");
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(frontendDir, "MedicalRecord.json"),
      JSON.stringify(contractData, null, 2)
    );
    console.log("📁 Saved to frontend/src/contracts/MedicalRecord.json");

    // Save to backend contracts folder
    const backendDir = path.join(__dirname, "../backend/contracts");
    if (!fs.existsSync(backendDir)) {
      fs.mkdirSync(backendDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(backendDir, "MedicalRecord.json"),
      JSON.stringify(contractData, null, 2)
    );
    console.log("📁 Saved to backend/contracts/MedicalRecord.json");
  }

  // Attempt verification if on a live network and API key is available
  if (network !== "hardhat" && network !== "localhost") {
    try {
      console.log("\n🔍 Attempting contract verification on Etherscan...");
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.warn("⚠️  Verification skipped or failed:", error.message);
      console.log("   You can manually verify later with:");
      console.log(
        `   npx hardhat verify --network ${network} ${contractAddress} "MedicalRecord"`
      );
    }
  }

  console.log("\n📋 Deployment Summary:");
  console.log("   Network:", network);
  console.log("   Contract Address:", contractAddress);
  console.log("   Explorer URL:");

  if (network === "sepolia") {
    console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
  } else if (network === "polygonAmoy") {
    console.log(`   https://amoy.polygonscan.com/address/${contractAddress}`);
  } else {
    console.log(`   (Local network - no explorer)`);
  }
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
