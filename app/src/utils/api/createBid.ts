import axios from 'axios';

const URL = 'http://localhost:8000/auction/bid'

export const createBid = async (auctionId: string, senderAddress: string, bidAmount: number) => {
  const data = {
    auction_id: auctionId,
    sender_address: senderAddress,
    bid_amount: bidAmount
  }
  const response = await axios.post(URL, data);
  
  if (response.data.ok) {
    return response.data.ok;
  } else {
    return null;
  }
}