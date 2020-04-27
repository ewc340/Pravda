import axios from 'axios';

const URL = 'http://localhost:8000/auction/all'

export const getAllBids = async () => {
  const response = await axios.get(URL);
  console.log('response', response);
  
  if (response.data.ok) {
    return response.data.data;
  } else {
    return null;
  }
}