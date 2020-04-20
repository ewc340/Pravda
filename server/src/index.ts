import bodyParser from 'body-parser';
import express from 'express';
import * as handlers from './handlers';

const app = express();
const port = process.env.PORT || '8000';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', handlers.rootHandler.root);
app.get('/hello/:name', handlers.helloHandler.sayHelloWithName);
app.post('/auction_create', handlers.auctionHandler.createNewAuction);
app.post('/make_bid', handlers.auctionHandler.makeBid);
app.post('/auction_end', handlers.auctionHandler.endAuction);

app.listen(port, err => {
  if (err) return console.error(err);
  return console.log(`Server is listening on ${port}`);
});