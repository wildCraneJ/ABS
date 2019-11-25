
pragma solidity^0.4.24;
import "./SmartLoan.sol";
import "./AssetLedger.sol";
import "./WaterFall.sol";
import "./Bond.sol";

contract BondA is Bond
{
/*
See the Bond.sol file for details
*/

/*
Constructor
*/
constructor (uint256 initialSupply, address owner) public
{
balanceOfBondTokens[msg.sender] = initialSupply;
InitialSupply = initialSupply;
Owner = owner;
}

//lets someone withdraw funds from the waterfall into this contract
//将资金流从资金流合约取出到债券A
function PayIn () public payable
{
	if (msg.sender != Owner) revert();
WaterFallIntPrin = WaterFall(WaterfallAddress).SendFundsA();
UpdateBalances(WaterFallIntPrin[0] ,WaterFallIntPrin[1]);
}
}
