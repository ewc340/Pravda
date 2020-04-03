pragma solidity >=0.4.22 <0.7.0;

contract Auction {
    address payable public beneficiary;
    uint public endTime;
    bool ended;

    address payable public lowestBidder;
    uint public lowestBid = 2**256 - 1;

    event newLowestBid(address bidder, uint amount);
    event auctionEnded(address winner, uint amount);

    constructor(uint _biddingTime, address payable _beneficiary) public payable{
        beneficiary = _beneficiary;
        endTime = now + _biddingTime;
    }

    function bid() public payable {
        require(now <= endTime, "Auction already ended.");
        require(msg.value < lowestBid, "Your bid is not the lowest one.");

        if (lowestBid != 2**256 - 1) {
            lowestBidder.transfer(lowestBid);
        }
        lowestBidder = msg.sender;
        lowestBid = msg.value;
        emit newLowestBid(msg.sender, msg.value);
    }

    function auctionEnd() public {
        require(now >= endTime, "Not time yet.");
        require(!ended, "Auction is already ended.");

        ended = true;
        emit auctionEnded(lowestBidder, lowestBid);

        beneficiary.transfer(lowestBid);
    }
}
