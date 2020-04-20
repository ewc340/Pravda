import { Request, Response } from 'express';
import * as utils from '../utils';

export const createNewAuction = async (req: Request, res: Response) => {
  const bidTime = req.body.bid_time;
  const beneficiary = req.body.beneficiary;
  const contractInstance = await utils.auctions.createAuctionContractInstance(bidTime, beneficiary);
  return res.send({ ok: true, data: { contractAddress: contractInstance.options.address } } );
}

export const makeBid = async (req: Request, res: Response) => {
  const contractAddress = req.body.contract_address;
  const senderAddress = req.body.sender_address;
  const bidAmount = req.body.bid_amount;
  const contractInstance = await utils.auctions.getAuctionContractInstance(contractAddress);
  
  const options = {
    from: senderAddress,
    value: bidAmount
  }
  await contractInstance.methods.bid().send(options, (err: any, _transactionHash: any) => {})
  .catch((err: any) => {
    res.status(404);
    return res.send({ ok: false, data: err});
  })
  return res.send({ ok: true });
}

export const endAuction = async (req: Request, res: Response) => {
  const contractAddress = req.body.contract_address;
  const contractInstance = await utils.auctions.getAuctionContractInstance(contractAddress);
  const auctionEndParameters = {
    from: utils.auctions.getAuctionInformation.contractDeployerAddress()
  };
  
  await contractInstance.methods.auctionEnd().send(auctionEndParameters, (_err: any, _transactionHash: any) => {})
    .catch((err: any) => {
      res.status(404);
      return res.send({ ok: false, data: err});
    })
  return res.send({ ok: true});
}