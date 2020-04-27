import axios from 'axios';

const URL = 'http://localhost:8000/auction/end'

export const endAuction = async (contractAddress: string) => {
  const data = {
    contract_address: contractAddress
  }
  const response = await axios.post(URL, data);
  
  if (response.data.ok) {
    return response.data.data;
  } else {
    return null;
  }
}