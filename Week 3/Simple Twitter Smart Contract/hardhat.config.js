require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/Ntb4ylsktNXA1EgqscIsFOz_Woxa3i2T",
      accounts: ["409f41add6e4bd1062a4756075692d0ae36182a4455cc66b2f1e52ff5bc769eb"]
    },
  },
};
