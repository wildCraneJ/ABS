pragma solidity^0.4.24;

import "./TimeSim.sol";
contract SmartLoan
{
/*
未竟事宜：
1.封装合约状态变量到struct
2.检查溢出
TO DO:
move the state variables into a struct
check for overflows
*/

/*
The SmartLoan contract represents the loan which the originator grants to the
borrowers. The originator sends the loan balance to the borrower and deploys the
contract code on the blockchain. The code allows to track the loan, to make
payments to the loan and to withdraw funds from it.
  .SmartLoan合约代表发起人向借款人授予的贷款。
  .发起人将贷款余额发送给借款人并在区块链上部署合同代码。
  .该代码允许跟踪贷款，支付贷款并从中提取资金。
*/

/*
Variables  待封装到贷款struct
-------------------------------------------------------------------------------
*/
uint public OriginalBalance;        // 贷款总余额
uint public CurrentBalance;        // 当前余额
uint public IntPaidIn;              // 利息还款金额
uint public PrinPaidIn;              // 本金还款金额
uint public MonthlyInstallment;     //月分期金额
uint public InterestRateBasisPoints; //利率基点
uint public OriginalTermMonths;  //总分期月数
uint public RemainingTermMonths; //剩余还款月
uint public NextPaymentDate;     //下次付款日期
uint public PaymentsMade;        //已还金额
uint public OverdueDays;         //逾期天数
uint public MonthlyInstallment1;  //贷款分期
uint public MonthlyInstallment2; // 贷款分期

uint public Now;
uint [120] public PaymentDates;   // 支付日期


bool public ContractCurrent = true;  //合约是否违约

address public LenderAddress;      //贷款人地址
address public TimeAddress;       //时间合约的地址

TimeSim Time;


/*
Modifiers
-------------------------------------------------------------------------------
*/
modifier OnlyLender {if (msg.sender == LenderAddress) _;}
modifier monthlyInstallment {if (msg.value == MonthlyInstallment)_;}



/*
Constructor 计算分期
-------------------------------------------------------------------------------
•	lenderAddress: 这是区块链上的账户地址。 该账户可以被人或另外的智能合约控制。
  控制账户的合约/人，可以从Smartloan合约提取汇入的资金
•	balance: 贷款的本金余额。就是借款人要还款的金额。
•	interestRateBasisPoints: 该笔贷款要付的利息的利率，以基点为单位。例如， 利率5% 输入500
•	termMonths: 该笔贷款的按月期限. 这里固定12个月。

•	lenderAddress: This is the address of an account on the blockchain. The account
 can be controlled by a human or another contract. Whoever controls this account
 is allowed to withdraw paidin funds from the Smartloan contract.
•	balance: The principal balance of the loan which must be repaid by the
  borrower
•	interestRateBasisPoints: The interstRate charged on the loan. It is given in
  basispoints i.e. the input for 5% interest would be 500
•	termMonths: The term of the loan in moths. In this implementation fixed to 12.
*/
constructor    (address lenderAddress, uint balance,
                uint interestRateBasisPoints, uint termMonths
              , address timeAddress) public
{
 LenderAddress = lenderAddress; // 账户可以由人或其他合约控制。 控制此帐户的人或合约，都有权从Smartloan合约中提取汇入的贷款
 TimeAddress=timeAddress;    //时间合约地址
 OriginalBalance = balance; //总余额
 CurrentBalance = balance; //当期余额
 InterestRateBasisPoints = interestRateBasisPoints; //例如，5％利息的输入为500
 OriginalTermMonths = termMonths; //总分期
 RemainingTermMonths =termMonths; //剩余期限
 Time = TimeSim(timeAddress);   //贷款时间

/*
计算月分期  10000=最大基点
本期积数=10000*OriginalTermMonths+InterestRateBasisPoints)**periods
总积数MonthlyInstallment2 =(10000*termMonths+interestRateBasisPoints)**termMonths)
((10000*termMonths+interestRateBasisPoints)**termMonths*10000*termMonths-10000**(termMonths+1)*termMonths**(termMonths+1))/1000000
the calculation of the monhtly installment needs divions. Since floats are not
availabe, we make the calc in a way to reduce rounding error:
*/
 MonthlyInstallment1 = (interestRateBasisPoints*
                           (10000* termMonths+interestRateBasisPoints)
                           **termMonths)/1000000; //利息积数
 MonthlyInstallment2 = ((10000*termMonths+interestRateBasisPoints)
                          **termMonths*10000*termMonths-10000
                          **(termMonths+1)*termMonths**(termMonths+1))/1000000;//

 if (MonthlyInstallment2!=0)
    MonthlyInstallment = balance * (MonthlyInstallment1) / (MonthlyInstallment2+1);


	if (MonthlyInstallment2!=0)

      MonthlyInstallment = balance *  MonthlyInstallment1 / (MonthlyInstallment2+1);

  for (uint k =0; k< termMonths; k++){PaymentDates [k] = now + (k+1) * 30 days;}

       NextPaymentDate = PaymentDates[0];

}

/*
获取贷款状态变量
Function to read the state
*/
function Read () public view  returns (uint[11])
{
  return [OverdueDays,
          OriginalBalance,
          CurrentBalance,
          NextPaymentDate,
          IntPaidIn,
          PrinPaidIn,
          MonthlyInstallment,
          InterestRateBasisPoints,
          OriginalTermMonths,
          RemainingTermMonths,
          address(this).balance];
	}

/*
贷款周期解析 self explanatory
*/
function ReadTime() public view returns(address) {return TimeAddress;}

/*
分期付款还款后，状态更新
Updates the state after installment is paid in
*/
function ContractCurrentUpdate() private returns(uint)
{
  PaymentsMade = OriginalTermMonths - RemainingTermMonths;
  NextPaymentDate=PaymentDates[PaymentsMade];

  if (Time.Now()> NextPaymentDate && RemainingTermMonths !=0)
  {
    ContractCurrent = false;
    OverdueDays = (Time.Now() - NextPaymentDate)/(60*60*24);
    return OverdueDays;
  } //计算逾期，设置贷款合约状态为逾期

  OverdueDays = 0;
  ContractCurrent = true;  //贷款合约正常
  return OverdueDays;
}


/*
这是基本的贷款转卖功能。本应用中，lenderAddress是另一个合约，发起人“卖出”此贷款资产


债转交易：lenderAddress向另一个合约发起人“出售”贷款。

This function is essential for transfer of ownership. The lenderAddress owner
has the option to grant its rights to withdraw funds from the loan to another
party. In our case this will be another contract on the blockchain to which the
originator "sells " the loan.
*/
function Transfer(address NewLender) public OnlyLender()
{LenderAddress = NewLender;}


/*
计算借款人分期付款金额。
  -分期付款取决于利率、总贷款余额和贷款期限。分期包括利息、本金。
  -本功能不许多还或少还。还款后更新合约状态
Allows the borrower to pay an installment. The installments are of equal size
depending on the interest rate, original balance and loanterm. The installment
has an interest and a principal portion, it is not possible to pay more or less
than one installment by using this function. Upon payment of the installment,
the contract updates its status information (see below).
*/
function PayIn() public payable
{
  uint Principal;
  uint Interest;

  if (msg.value != MonthlyInstallment) revert();
  if (RemainingTermMonths == 0) revert();

  RemainingTermMonths --;
  Principal = CalculatePVOfInstallment (OriginalTermMonths-RemainingTermMonths);
  Interest = MonthlyInstallment - Principal;
  CurrentBalance -=Principal;
  IntPaidIn += Interest;
  PrinPaidIn +=Principal;

  ContractCurrentUpdate();
}

/*
允许lenderAddress所有者从SmartLoan合约中提取资金。 此功能还传递贷款状态

Allows the lenderAddress owner to withdraw funds from the contract. This
function also passes along the status of the loan.
*/
function WithdrawIntPrin() public OnlyLender returns (uint[10])
{
  uint intPaidIn = IntPaidIn;
  uint prinPaidIn = PrinPaidIn;

  OverdueDays = ContractCurrentUpdate();

  if(LenderAddress.send(IntPaidIn + PrinPaidIn)==false) revert();

  IntPaidIn = 0;
  PrinPaidIn = 0;

  return [OverdueDays,
          OriginalBalance,
          CurrentBalance,
          NextPaymentDate,
          intPaidIn,
          prinPaidIn,
          MonthlyInstallment,
          InterestRateBasisPoints,
          OriginalTermMonths,
          RemainingTermMonths];
}

/*
计算本金部分
Function used for Present Vaule calc in the Principal portion calculation
本金积数(10000*OriginalTermMonths)**periods
每月分期贷款（本金+利息）积数=(10000*OriginalTermMonths+InterestRateBasisPoints)**periods
*/
function CalculatePVOfInstallment (uint periods) public view returns (uint)
{
uint PV = MonthlyInstallment * (10000*OriginalTermMonths)**periods/
          (10000*OriginalTermMonths+InterestRateBasisPoints)**periods;

return PV;
}

}
