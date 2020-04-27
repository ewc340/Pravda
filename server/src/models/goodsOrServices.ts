import * as mongoose from 'mongoose';

const GoodsOrServicesSchema = new mongoose.Schema({
  name: String,
  bidTime: Number,
  beneficiary: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  id: String,
  winner: String,
  bidders: {
    type: Map,
    of: String
  },
  auctionContractAddress: String,
  expiresAt: Number,
  numBids: Number
})

export const GoodsOrServicesModel = mongoose.model('GoodsOrService', GoodsOrServicesSchema);
