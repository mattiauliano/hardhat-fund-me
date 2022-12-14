// Parameter passed in this async function is 'hre' (hardhat)
// Destructuring 'hre' to get 'getNamedAccounts' and 'deployments' object
module.exports = async ({ getNamedAccounts, deployments }) => {
    // Destructuring deployments to get 'deploy' and 'log' functions
    const { deploy, log } = deployments;
    // getNamedAccounts function returns an object
    // Destructuring to get only the first name 'deployer'
    const { deployer } = await getNamedAccounts();
    // Taking chainId for flexible conditionals
    const chainId = network.config.chainId;

    
};