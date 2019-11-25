pragma solidity^0.4.4;
import "./SmartLoan.sol";
import "./AssetLedger.sol";
import "./WaterFall.sol";
import "./Bond.sol";

contract BondB is Bond
{
/*
See the Bond.sol file for details
*/

/*
Constructor
*/
constructor (uint256 initialSupply, address owner ) public
{
balanceOfBondTokens[msg.sender] = initialSupply;
InitialSupply = initialSupply;
Owner = owner;
}
//将资金流从资金流合约取出到债券A
function PayIn () public payable
{
if (msg.sender != Owner) revert();
WaterFallIntPrin = WaterFall(WaterfallAddress).SendFundsB();
UpdateBalances (WaterFallIntPrin[0] ,WaterFallIntPrin[1]);
}
}
