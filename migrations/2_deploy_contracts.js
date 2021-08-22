var HealthChain= artifacts.require("./HealthChain.sol");

module.exports = function(deployer) {
  deployer.deploy(HealthChain);
};
