import { Contract } from 'web3-eth-contract';
import { getWeb3 } from '../getWeb3';
import { contractABI } from './getAuctionInformation';

export async function getAuctionContractInstance(contractAddress: string): Promise<Contract> {
  const web3 = await getWeb3();
  const auctionContractABI = contractABI();
  let contractInstance = new web3.eth.Contract(JSON.parse(auctionContractABI), contractAddress);
  return contractInstance;
}