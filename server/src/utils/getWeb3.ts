import Web3 from 'web3';

const GANACHE_LOCALHOST = 'http://127.0.0.1:8545';

export const getWeb3 = () => {
  const provider = new Web3.providers.HttpProvider(GANACHE_LOCALHOST);
  const web3Instance = new Web3(provider);
  return web3Instance;
}
