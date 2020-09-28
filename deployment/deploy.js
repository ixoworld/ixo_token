// Allows for deployment variables to be pulled from {.env}
require('dotenv').config();
// Tool used for deployment
const etherlime = require('etherlime-lib');
// Contract to be deployed
const IXOTokenJson = require('../build/IXO_Token.json');
// Configurations for deployment
var defaultConfigs = {
	gasLimit: 4700000,
	gasPrice: 25000000000,
	chainId: 1
};
// RPC provider for deployment (network dependent)
var RPC = null;
// Deployer EOA wallet for deployment
var deployer = null;

const deploy = async (network, secret) => {
	switch (network) {
		case "local":
			// Overriding default config for local test net
			defaultConfigs.chainId = 1337;
			// Setting private key for this network
			secret = process.env.DEPLOYER_PRIVATE_KEY_LOCAL;
			// Setting the RPC
			RPC = 'http://localhost:8545/';
			// Setting up the deployer for local
			deployer = new etherlime.JSONRPCPrivateKeyDeployer(
				secret, 
				RPC, 
				defaultConfigs
			);
			break;
		case "rinkeby":
			// Overriding default config for rinkeby test net
			defaultConfigs.chainId = 4;
			// Setting private key for this network
			secret = process.env.DEPLOYER_PRIVATE_KEY_RINKEBY;
			// Setting the RPC
			// RPC = 'https://rinkeby.infura.io'
			RPC = `https:/rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`;
			// Setting up the deployer for rinkeby
			deployer = new etherlime.InfuraPrivateKeyDeployer(
				secret, 
				network, 
				process.env.INFURA_API_KEY, 
				defaultConfigs
			);
			break;
		case "mainnet":
			// Overriding default config for rinkeby test net
			defaultConfigs.chainId = 1;
			// Setting private key for this network
			secret = process.env.DEPLOYER_PRIVATE_KEY_MAINNET;
			// Setting the RPC
			RPC = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
			// Setting up the deployer for rinkeby
			deployer = new etherlime.InfuraPrivateKeyDeployer(
				secret, 
				network, 
				process.env.INFURA_API_KEY, 
				defaultConfigs
			);
			break;
		default:
			console.error("invalid network provided");
			break;
	}

	const deploy = (...args) => deployer.deploy(...args);

	const deployedToken = await deploy(
		IXOTokenJson,
		false,
		process.env.TOKEN_NAME,
		process.env.TOKEN_SYMBOL
	);

	// TODO add admin address as admin + remove insecure deployer + test
	// TODO add {.env} + {.env.example}
	// TODO add smart gas checks + gas benchmark

	var token = { Contract: "IXO Deployed Token", Address: deployedToken.contract.address};

	console.table([token]);
};

module.exports = {
	deploy
};