pragma solidity^0.4.4;

/*
This is for simulation of passing time. Only necessary for testing
*/
contract TimeSim
{
     uint public Now;
     constructor () public {Now = now; }
     function Step() public{Now += 30 days;}
}
