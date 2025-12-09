require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },

    cess: {
      url: process.env.CESS_RPC || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11330,
    },

    polygonAmoy: {
      url: process.env.POLYGON_AMOY_RPC || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002,
    },

    bscTestnet: {
      url: process.env.BSC_TESTNET_RPC || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 97,
    },
  },
};

