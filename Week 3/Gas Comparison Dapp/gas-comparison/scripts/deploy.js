const hre = require("hardhat");

async function main() {
  console.log("Deploying GasComparison contract...");
  
  // Get the contract factory
  const GasComparison = await hre.ethers.getContractFactory("GasComparison");
  
  // Deploy the contract
  const gasComparison = await GasComparison.deploy();
  await gasComparison.waitForDeployment();

  console.log(`GasComparison contract deployed to: ${gasComparison.target}`);
  
  // Verify contract (optional - uncomment if you want automatic verification)
  /*
  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: gasComparison.target,
      constructorArguments: [],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Verification failed:", error.message);
  }
  */
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});