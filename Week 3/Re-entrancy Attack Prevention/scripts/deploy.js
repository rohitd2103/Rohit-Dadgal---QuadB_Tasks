const hre = require("hardhat");

async function main() {
    // Get contract factory
    const SecureContract = await hre.ethers.getContractFactory("SecureContract");

    // Deploy contract
    const secureContract = await SecureContract.deploy(); // REMOVE `.deployed()`

    // Wait for deployment to complete
    await secureContract.waitForDeployment(); // NEW FIX

    // Get contract address
    console.log(`SecureContract deployed to: ${secureContract.target}`);
}

// Run the deploy script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
