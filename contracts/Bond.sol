pragma solidity^0.4.24;
import "./SmartLoan.sol";
import "./AssetLedger.sol";
import "./WaterFall.sol";

contract Bond
{

/*
TO DO:
Make sure modifiers are applied correctly
check for overflows
*/

/*
债券合约允许其创建者存入（挖矿）任意固定的代币作为供应，并将标记分发给区块链上的地址所有者。
代币持有人有权直接从债券合约中提取资金关于代币，能取出的数量持有者拥有占全部供应的比例。
债券合约跟踪资金的流入和流出。 A债券和B债券是这个更普遍的债券合约衍生出来。
	The Bond Contract allows its creator to mint an arbitrary fixed supply of tokens
	and distribute the tokens to adress owners on the blockchain. The token holders
	have the right to withdraw funds directly from the Bonds contract depending
	on the fraction of overall supply the token holder possesses. The Bond Contract
	keeps track of inflows and outflows of funds. The A Bonds and B Bonds are
	beeing derived from this more general Bonds Contract.
*/

/*
Variables
-------------------------------------------------------------------------------
*/

/*
投资者账本的余额
Ledgers to keep track of investor balances
*/
mapping (address => uint) public balanceOfBondTokens; //债券代币的数量
mapping (address => uint) public ETHWithdrawnInt;     //提取利息的以太币余额
mapping (address => uint) public ETHWithdrawnPrin;    //提取本金的以太币余额

/*
汇总债券合约的余额状态
aggregate balance status variables of the contract
*/
uint public TotalETHPaidinInt;  //汇入债券合约利息的以太币总额
uint public TotalETHPaidinPrin; //汇入债券合约本金的以太币总额
uint public InitialSupply;      //初始债券供应量
uint [8] public StatusOutput;   //输出状态

/*
合约的地址
Addresses  of dependent contracts
*/
address public WaterfallAddress;  //资金流地址
address public Owner;            //所有者

/*
资金流合约收到的资金
Funds received from the Waterfall this period
*/
uint[2] WaterFallIntPrin;   //资金流合约的利息，本金

/*
合约变量
State variable
*/
bool public WaterFallSet =false; //资金流合约地址


/*
Modifiers
-------------------------------------------------------------------------------
*/
modifier OnlyOwner(){if (msg.sender == Owner)_;}



/*
Constructor
-------------------------------------------------------------------------------
NO Constructor needed, the derived ABonds and BBonds Contracts (see SFContract)
have Constructors
*/

/*
Functions
-------------------------------------------------------------------------------
*/


/*
ABS（部署债券合约）发行前必须要设定资金流合约地址
This contract is deployed before the Waterfall contract and therefore needs to
get the address of the WaterFall get passed by a function
*/
function SetWaterFall (address waterfallAddress) public
{
	if (WaterFallSet) revert();
	 WaterfallAddress= waterfallAddress;
}

/*
This function lets any tokenholder transfer all or part of his tokens to some
other address on the Blockchain if he chooses to do so. I.e. he can sell the
bonds with this functions.
债券持有者将持有的债券代币转给其它地址，例如他想卖掉债券
*/
function transfer(address _to, uint256 _value) public
{
/*
为防止透支检查转币者代币数量是否足够
Check if transferror has enough tokens and check for overflows
*/
  if (balanceOfBondTokens[msg.sender] < _value) revert();
  if (balanceOfBondTokens[_to] + _value < balanceOfBondTokens[_to]) revert();

/*
将剩余的以太币利息和本金余额给其它人
Assign remaining (not withdrawn) interest and principal balances to new owner
*/
  if(ETHWithdrawnInt[msg.sender]>=
    (ETHWithdrawnInt[msg.sender]* _value /(balanceOfBondTokens[msg.sender])))
  {
    ETHWithdrawnInt[_to] +=
    (ETHWithdrawnInt[msg.sender]* _value /(balanceOfBondTokens[msg.sender]));
    ETHWithdrawnInt[msg.sender] -=
    (ETHWithdrawnInt[msg.sender]* _value /(balanceOfBondTokens[msg.sender]));
  }

  if(ETHWithdrawnPrin[msg.sender]>=
    (ETHWithdrawnPrin[msg.sender]* _value /(balanceOfBondTokens[msg.sender])))
  {
    ETHWithdrawnPrin[_to] +=
    (ETHWithdrawnPrin[msg.sender]* _value /(balanceOfBondTokens[msg.sender]));
    ETHWithdrawnPrin[msg.sender] -=
    (ETHWithdrawnPrin[msg.sender]* _value /(balanceOfBondTokens[msg.sender]));
  }

  balanceOfBondTokens[msg.sender] -= _value;
  balanceOfBondTokens[_to] += _value;
}

/*
this function updates the balance variables  and is used in the derived
ABond and BBond Contracts when funds are paid in 资金支付
支付资金时更新债券A,B合约的（利息，本金）余额

*/
function UpdateBalances (uint interest , uint principal) internal
{
  TotalETHPaidinInt += interest;
  TotalETHPaidinPrin += principal;
}


/*
Allows tokenholders to draw their portion of interest and principal funds from the Bond Contract.
债券代币（从债券合约）的持有者取出部分利息和本金
*/
function Withdraw () public payable
{
  uint AvailableBalanceInt;
  uint AvailableBalancePrin;
  uint AvailableBalance;

/*
检查投资者是否已撤回其份额，并相应地设置可用余额
Check if investor has aleay withdrawn his share and set the AvailableBalance
accordingly
*/
  if (balanceOfBondTokens[msg.sender]*
     ((TotalETHPaidinInt + TotalETHPaidinPrin)/InitialSupply) >
     ETHWithdrawnInt[msg.sender]+ ETHWithdrawnPrin[msg.sender])

    {
      AvailableBalanceInt =
      (balanceOfBondTokens[msg.sender]* TotalETHPaidinInt -
      ETHWithdrawnInt[msg.sender]* InitialSupply)/ InitialSupply;

      AvailableBalancePrin =
      (balanceOfBondTokens[msg.sender]* (TotalETHPaidinPrin) -
      ETHWithdrawnPrin[msg.sender]* InitialSupply)/InitialSupply ;
    }

  else
    {
        AvailableBalanceInt =0;
        AvailableBalancePrin =0;
				AvailableBalance = 0;
    }


/*
Send AvailableBalance
*/
  if(msg.sender.send(AvailableBalanceInt + AvailableBalancePrin)==false) revert();
    ETHWithdrawnInt[msg.sender]+=AvailableBalanceInt;
    ETHWithdrawnPrin[msg.sender]+=AvailableBalancePrin;
}


/*
This function allows to check the status of the overall Bond Contract as well
as the status of individual token holders.
持币者的各种金额状态
*/
function CheckStatus (address BondAdress) public returns (uint[8])
{
    StatusOutput[0]=balanceOfBondTokens[BondAdress];
    StatusOutput[1]=ETHWithdrawnInt[BondAdress];
    StatusOutput[2]=ETHWithdrawnPrin[BondAdress];
    StatusOutput[3]=TotalETHPaidinInt;
    StatusOutput[4]=TotalETHPaidinPrin;
    //StatusOutput[5]=ETHPerBondInt;
    //StatusOutput[6]=ETHPerBondPrin;
    StatusOutput[7]=InitialSupply;
    return  StatusOutput;
  }

/*
Fallback function allows to send funds to this contract
*/
function () public payable{}
}
