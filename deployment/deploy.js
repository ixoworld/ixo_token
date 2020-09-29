// Allows for deployment variables to be pulled from {.env}
require('dotenv').config();
// Tool used for deployment
const etherlime = require('etherlime-lib');
const ethers = require("ethers");
var BigNumber = require('big-number');
// Contract to be deployed
const IXOTokenABI = require('../build/IXO_Token.json');
// Configurations for deployment
var defaultConfigs = {
	gasLimit: 4700000,
	gasPrice: 25000000000,
	chainId: 1,
	etherscanApiKey: "3DQYBPZZS77YDR15NKJHURVTV9WI2KH6UY"
};
// RPC provider for deployment (network dependent)
var RPC = null;
// Deployer EOA wallet for deployment
var deployer = null;
// Deployer ethers wallet for gas benchmarks 
var deployerWallet = null;
// ethers provider
let provider = ethers.getDefaultProvider();
// Oracles for the current gas prices
const url = "https://www.etherchain.org/api/gasPriceOracle";
const backupUrl = "https://api.etherscan.io/api?module=gastracker&action=gasoracle";


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
			// Setting up provider for network
			provider = new ethers.providers.JsonRpcProvider();
			// Setting up deployer ethers wallet
			deployerWallet = new ethers.Wallet(
				process.env.DEPLOYER_PRIVATE_KEY_LOCAL,
				provider
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
			// Setting up provider for network
			provider = new ethers.providers.InfuraProvider(
				network, 
				process.env.INFURA_API_KEY
			);
			// Setting up deployer ethers wallet
			deployerWallet = new ethers.Wallet(
				process.env.DEPLOYER_PRIVATE_KEY_RINKEBY,
				provider
			);
			break;
		case "mainnet":
			// Overriding default config for rinkeby test net
			defaultConfigs.chainId = 1;
			// Setting private key for this network
			secret = process.env.DEPLOYER_PRIVATE_KEY_MAINNET;
			// Setting the RPC
			RPC = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
			// Setting the gas price for fast
			defaultConfigs.gasPrice = _getGasPrice(url, backupUrl);
			// Setting up the deployer for rinkeby
			deployer = new etherlime.InfuraPrivateKeyDeployer(
				secret, 
				network, 
				process.env.INFURA_API_KEY, 
				defaultConfigs
			);
			// Setting up provider for network
			provider = new ethers.providers.InfuraProvider(
				network,
				process.env.INFURA_API_KEY
			);
			// Setting up deployer ethers wallet
			deployerWallet = new ethers.Wallet(
				process.env.DEPLOYER_PRIVATE_KEY_MAINNET,
				provider
			);
			break;
		default:
			throw new Error("invalid network provided");
	}

	let balance = await deployerWallet.getBalance();

	const deploy = (...args) => deployer.deploy(...args);

	const deployedToken = await deploy(
		IXOTokenABI,
		false,
		process.env.TOKEN_NAME,
		process.env.TOKEN_SYMBOL
	);

	let ownerAddressBefore = await deployedToken.owner();

	await (await deployedToken.transferOwnership(
		process.env.ADMIN_ADDRESS_PUBLIC
	)).wait();

	let ownerAddress = await deployedToken.owner();

	if(
		ethers.utils.getAddress(ownerAddress) !=
		ethers.utils.getAddress(process.env.ADMIN_ADDRESS_PUBLIC)
	) {
		throw new Error ("Fatal: Transferring ownership failed");
	}

	let balanceAfter = await deployerWallet.getBalance();

	let weiUsed = _ethUsed(
		balance.toString(), 
		balanceAfter.toString()
	);

	var token = { Contract: "IXO Deployed Token", Address: deployedToken.contract.address};

	console.table([token]);

	console.log("Wei used in deployment:\n" + weiUsed);
};

const _getGasPrice = async (url, backupUrl) => {
	try {
	  const response = await fetch(url);
	  const json = await response.json();
	  if (json.fast) {
		let price = json.fast;
		return price;
	  } else {
		console.error("First URL failed (invalid response)\nTrying back up...");
	  }
	} catch (error) {
	  // Try backup API.
	  try {
		const responseBackup = await fetch(backupUrl);
		const jsonBackup = await responseBackup.json();
		if (jsonBackup.result && jsonBackup.result.SafeGasPrice) {
		  return jsonBackup.result.SafeGasPrice;
		} else {
		  throw new Error("Etherscan API: bad json response");
		}
	  } catch (errorBackup) {
		throw new Error("Error receiving Gas price - back up failed");
	  }
	}
};

const _ethUsed = (balanceBefore, balanceAfter) => {
	let balanceNBN = new BigNumber(balanceBefore.toString())
	let balanceAfterNBN = new BigNumber(balanceAfter.toString())
	return balanceNBN.minus(balanceAfterNBN);
};

module.exports = {
	deploy
};

