var SBLToken = artifacts.require("./SecureBlocksTokenFaucet.sol");

module.exports = function(deployer) {
  return deployer.deploy(SBLToken).then(() => {
    console.log(`SecureBlocks dummy token Address: ${SBLToken.address}`);
  });
};
