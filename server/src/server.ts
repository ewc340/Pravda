import bodyParser from 'body-parser';
import express from 'express';
import mongoose = require('mongoose');
import * as handlers from './handlers';

const cors = require('cors');
const MONGO_URI = 'mongodb://localhost:27017';

const app = express();
const port = process.env.PORT || '8000';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', handlers.rootHandler.root);

app.get('/auction/all', handlers.auctionHandler.getAllBids);
app.post('/auction/create', handlers.auctionHandler.createNewAuction);
app.post('/auction/end', handlers.auctionHandler.endAuction);
app.post('/auction/bid', handlers.auctionHandler.makeBid);
app.get('/auction/contractInstance/:contractAddress', handlers.auctionHandler.getContractInstance);
app.get('/auction/:auctionId/:bidder?', handlers.auctionHandler.getAuctionInformation);

app.listen(port, err => {
  if (err) return console.error(err);
  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection.once('open', () => {
    console.info('Connected to Mongo via Mongoose');
  })
  mongoose.connection.on('error', (err: any) => {
    console.error('Unable to connect to Mongo via Mongoose', err);
  })
  return console.log(`Server is listening on ${port}`);
});