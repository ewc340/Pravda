import { Request, Response } from 'express';
import mongoose  = require('mongoose');
import * as models from '../models';
import * as utils from '../utils';

export const createNewAuction = async (req: Request, res: Response) => {
  console.log("accepted connection in createNewAuction");
  const bidTime = req.body.bid_time;
  const beneficiary = req.body.beneficiary;
  const itemName = req.body.item_name;
  const itemDescription = req.body.description;
  const auctionId = new mongoose.Types.ObjectId().toHexString();

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
    expiresAt: Date.now() + bidTime * 1000,
    bidders: {},
    numBids: 0
  }

  console.log('saved description', itemDescription);

  const auctionItemAsModel = new models.GoodsOrServicesModel(auctionItem);
  await auctionItemAsModel.save().then(() => console.log('success')).catch((err: any) => console.log('error when saving', err));

  return res.send({ ok: true, data: { contractAddress, auctionId } } );
}

/**
 * makeBid will only be called with a lower bid on each call
 * @param req 
 * @param res 
 */
export const makeBid = async (req: Request, res: Response) => {
  console.log("accepted new connection in makeBid");
  const auctionId = req.body.auction_id;
  const senderAddress = req.body.sender_address;
  const bidAmount = req.body.bid_amount;
  
  const filter = { id: auctionId };
  const update = { bidders: { [senderAddress]: bidAmount }, $inc: { numBids: 1 } }
  await models.GoodsOrServicesModel.findOneAndUpdate(filter, update, { new: true, upsert: true })
                              .then((auction: any) => console.log('new auction logic', auction))
                              .catch((_err: any) => res.send({ ok: false }));
  console.log('returned response');
  return res.send({ ok: true });
}

export const endAuction = async (req: Request, res: Response) => {
  const contractAddress = req.body.contract_address;
  const contractInstance = await utils.auctions.getAuctionContractInstance(contractAddress);
  const auctionEndParameters = {
    from: utils.auctions.getAuctionInformation.contractDeployerAddress()
  };
  console.log('ending auction for', contractAddress);
  await contractInstance.methods.auctionEnd().send(auctionEndParameters, (err: any, transactionHash: any) => {
    if (err) {
      console.log('error occurred', err)
    }
    console.log('transaction hash is for auction end is', transactionHash)
  }).catch((err: any) => {
      res.status(404);
      return res.send({ ok: false, data: err});
    })
  let winner = '';
  await contractInstance.methods.lowestBidder().call((_err: any, address: any) => { 
    winner = address;
  });
  const filter = { auctionContractAddress: contractAddress };
  const update = { winner }
  const auction: any = await models.GoodsOrServicesModel.findOneAndUpdate(filter, update, { new: true, upsert: true });
  if (auction == null) {
    return res.send({ ok: false })
  } else {
    console.log('new auction logic', auction);
  }
  return res.send({ ok: true, data: winner });
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
      bidAmount,
      numBids: auctionInformationASJSON.numBids
    }
    return res.send({ ok: true, data: payload });
  }
  return res.send({ ok: false })

}

export const getAllBids = async (_req: Request, res: Response) => {
  console.log('getting all');
  const auction: any = await models.GoodsOrServicesModel.find();
  if (auction == null) {
    return res.send({ ok: false, data: null })
  } 
  return res.send({ ok: true, data: auction });
}