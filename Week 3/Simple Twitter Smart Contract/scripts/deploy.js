const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with ", deployer.address);

    const Twitter = await ethers.getContractFactory("Twitter");
    const twitter = await Twitter.deploy();

    await twitter.waitForDeployment();
    console.log("Twitter contract deployed at:", twitter.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
