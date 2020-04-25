import { ObjectId } from 'bson';
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
  id: ObjectId,
  winner: String,
  bidders: {
    type: Map,
    of: String
  },
  auctionContractAddress: String,
  expiresAt: Date
})

export const GoodsOrServicesModel = mongoose.model('GoodsOrService', GoodsOrServicesSchema);
