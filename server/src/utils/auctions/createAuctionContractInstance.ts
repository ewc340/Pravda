import { Contract, DeployOptions} from 'web3-eth-contract';
import { getWeb3 } from '../getWeb3';
import { contractABI, contractBIN, contractDeployerAddress } from './getAuctionInformation';

export async function createAuctionContractInstance(bidTime: number, beneficiary: string): Promise<Contract> {
  const web3 = await getWeb3();
  const auctionContractABI = contractABI();
  let contractInstance = new web3.eth.Contract(JSON.parse(auctionContractABI));
  
  console.log('Created new contract instance');

  const auctionContractArguments = [bidTime, beneficiary];
  const auctionContractBIN = contractBIN();
  const deployOptions: DeployOptions = {
    data: '0x' + auctionContractBIN,
    arguments: auctionContractArguments
  }
  
  const contract_deployer_address = contractDeployerAddress();
  const parameter = {
    from: contract_deployer_address,
    gas: Number(web3.utils.toHex(800000))
  };

  await contractInstance.deploy(deployOptions).send(parameter, (_err, transactionHash) => {
    console.log('Contract deployment --- Transaction Hash :', transactionHash);
  }).on('confirmation', () => {}).then((newContractInstance) => {
      console.log('Deployed Contract Address : ', newContractInstance.options.address);
      contractInstance = newContractInstance;
  }).catch((err: any) => {
    return err;
  });

  return contractInstance;
}