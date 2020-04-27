import axios from 'axios';

const URL = 'http://localhost:8000/auction/create'

export const postNewAuction = async (itemName: string, itemDescription: string, bidTime: number, beneficiary: string) => {
  const data = {
    bid_time: bidTime,
    beneficiary,
    item_name: itemName,
    description: itemDescription
  }
  console.log('posting new auction...', data);
  const response = await axios.post(URL, data);
  console.log('posting new auction response...');
  
  if (response.data.ok) {
    return response.data.data;
  } else {
    return null;
  }
}