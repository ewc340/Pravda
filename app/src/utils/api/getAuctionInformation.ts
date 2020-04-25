import axios from 'axios';

const URL = 'http://localhost:8000/auction/'

export const getAuctionInformation = async (auctionId: string) => {
  const response = await axios.get(URL + auctionId)
  
  if (response.data.ok) {
    return response.data.data;
  } else {
    return null;
  }
}