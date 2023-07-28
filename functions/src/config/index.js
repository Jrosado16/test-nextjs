const { ethers } = require('ethers');
const functions = require("firebase-functions")

const providerUrl = {
  80001: 'https://polygon-mumbai.g.alchemy.com/v2/',
  137: 'https://polygon-mainnet.g.alchemy.com/v2/'
}

exports.config = (data) => {
  const { chainId } = data;
  const provider = new ethers.providers.JsonRpcProvider(providerUrl[chainId]);
  return provider;
}