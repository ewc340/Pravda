import Web3 from 'web3';

const FALLBACK_WEB3_PROVIDER = process.env.REACT_APP_NETWORK || 'http://0.0.0.0:8545';

/**
 * @returns a Promise that resolves if web3 instance 
 * is successfully made, otherwise rejects with error
 */
export const getWeb3 = async () =>
  new Promise(async (resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Acccounts now exposed
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      // Use Mist/MetaMask's provider.
      const web3 = window.web3;
      console.log('Injected web3 detected.');
      resolve(web3);
    }
    // Fallback to localhost; use dev console port by default...
    else {
      const provider = new Web3.providers.HttpProvider(FALLBACK_WEB3_PROVIDER);
      const web3 = new Web3(provider);
      console.log('No web3 instance injected, using Infura/Local web3.');
      resolve(web3);
    }
  });

export const getGanacheWeb3 = () => {
  const provider = new Web3.providers.HttpProvider('http://0.0.0.0:8545');
  const web3 = new Web3(provider);
  return web3;
};
