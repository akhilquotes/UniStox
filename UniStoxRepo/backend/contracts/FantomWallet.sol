pragma solidity >=0.8.2 <0.9.0;

//Smart contract built using solidity and deployed on Fantom testnet
contract FantomWallet {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    //add funds when a user buys stock
    function deposit() public payable{} 
    
    //send funds to user Fantom address when a user buys FTM 
    function withdraw(uint amount, address destAddr) public returns (bool){
        require(msg.sender == owner, "Only the owner can call this method");
        payable(destAddr).transfer(amount);
        return true;
    }

    //send funds to user Fantom address when a user buys FTM 
    function withdraw(uint amount, address destAddr) public returns (bool){
        require(msg.sender == owner, "Only the owner can call this method");
        payable(destAddr).transfer(amount);
        return true;
    }
  
    //retrieve FTM balance of any address
    function getBalance(address destAddr) public view returns (uint256) {
        return address(destAddr).balance;
    }

    //retrieve contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}