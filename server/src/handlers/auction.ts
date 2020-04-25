import { Request, Response } from 'express';
import mongoose  = require('mongoose');
import * as models from '../models';
import * as utils from '../utils';

export const createNewAuction = async (req: Request, res: Response) => {
  const bidTime = req.body.bid_time;
  const beneficiary = req.body.beneficiary;
  const itemName = req.body.item_name;
  const itemDescription = req.body.description;
  const auctionId = mongoose.Types.ObjectId();

  if (beneficiary == undefined) {
    return res.status(400).send({ ok: false, error: 'beneficiary cannot be false' });
  }

  const contractInstance = await utils.auctions.createAuctionContractInstance(bidTime, beneficiary);
  let contractAddress;
  if (contractInstance.ok) {
    contractAddress = contractInstance.data.contractInstance.options.address;
  } else {
    console.log('enter here');
    return res.status(400).send({ ok: false, err: 'contract creation failed' })
  }

  const auctionItem = {
    name: itemName,
    bidTime,
    beneficiary,
    description: itemDescription,
    id: auctionId,
    winner: '',
    auctionContractAddress: contractAddress,
    expiresAt: Date.now() + bidTime,
    bidders: {}
  }

  const auctionItemAsModel = new models.GoodsOrServicesModel(auctionItem);
  await auctionItemAsModel.save();

  return res.send({ ok: true, data: { contractAddress, auctionId } } );
}

/**
 * makeBid will only be called with a lower bid on each call
 * @param req 
 * @param res 
 */
export const makeBid = async (req: Request, res: Response) => {
  const auctionId = req.body.auction_id;
  const senderAddress = req.body.sender_address;
  const bidAmount = req.body.bid_amount;
  
  const filter = { id: auctionId};
  const update = { bidders: { [senderAddress]: bidAmount } }
  const auction: any = await models.GoodsOrServicesModel.findOneAndUpdate(filter, update, { new: true, upsert: true });
  if (auction == null) {
    return res.send({ ok: false })
  } else {
    console.log('new auction logic', auction);
  }
  // console.log('new bidders', auction.bidders);
  // await auction.save((err: any, auctionItem: any) => {
  //   if (err) {
  //     return res.send({ ok: false });
  //   }
  //   console.log('successfully updated', auctionItem);
  // });
  
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

export const getContractInstance = async (req: Request, res: Response) => {
  const contractAddress = req.params.contractAddress;
  const contractInstance = await utils.auctions.getAuctionContractInstance(contractAddress);
  console.log(contractInstance);
  res.send({ ok: true, contractInstance: contractInstance });
}

export const getAuctionInformation = async (req: Request, res: Response) => {
  const auctionId = req.params.auctionId;
  const bidder = req.params.bidder;
  const auctionInformation = await models.GoodsOrServicesModel.findOne({ id: auctionId });
  
  if (auctionInformation) {
    const auctionInformationASJSON = auctionInformation.toJSON();
    let bidAmount = -1;
    if (auctionInformationASJSON.bidders && bidder in auctionInformationASJSON.bidders) {
      bidAmount = auctionInformationASJSON.bidders[bidder];
    }
    const payload = {
      name: auctionInformationASJSON.name,
      beneficiary: auctionInformationASJSON.beneficiary,
      description: auctionInformationASJSON.description,
      winner: auctionInformationASJSON.winner,
      expiresAt: auctionInformationASJSON.expiresAt,
      contractAddress: auctionInformationASJSON.auctionContractAddress,
      bidAmount
    }
    return res.send({ ok: true, data: payload });
  }
  return res.send({ ok: false })

}