//var Issuer = artifacts.require("./Issuer.sol");
var account0;
var account;
var testrpcaccount;
var user = 9; //0= director; 1 = loantaker
var issuer = Issuer.deployed();
var loan;
var installment;
var htmlelement;
var teste;
var numberOfLoans;
var loantablevalue =0;

/*
first Transfer Ownership of Loans

Escrowfunctions:
SetLedger (address ledger)
PoolTransfer()
InvestorPayInA ()
InvestorPayInB ()
GetInvestorsBalanceA (address investorAddress)
GetInvestorsBalanceB (address investorAddress)
PayReserve ()
PoolValid ()
SendReserve (address waterFallAddress)
OriginatorWithdrawFunds ()


SFCFunctions
CheckEscrow ()
SendMeMyBonds ()
MoveFundsFromLedgerToWaterfall()
MoveFundsFromPoolIntoLedger ()
MoveFundsIntoBonds ()

*/
function ToggleIssuer()
{
var link = document.getElementById('issuersection');
//if (link.style.display == 'none') {link.style.display == 'inline';}
//else {
link.style.display == 'none';
var IssuerHeader = document.getElementById("IssuerHeader");
IssuerHeader.innerHTML = 0;

//}
}

function ReadEscrow ()
{

  var EscrowEscrowAddress = document.getElementById("EscrowEscrowAddress");
  var InvestorFundsReceivedA = document.getElementById("InvestorFundsReceivedA");
  var InvestorFundsReceivedB  = document.getElementById("InvestorFundsReceivedB");
  var PoolReceived  = document.getElementById("PoolReceived");
  var ReserveReceived  = document.getElementById("ReserveReceived");
  var ThirdPartyPoolValidation  = document.getElementById("ThirdPartyPoolValidation");
  var FundingPeriodOver  = document.getElementById("FundingPeriodOver");
  var EscrowSuccess  = document.getElementById("Escrow Success");
  var EscrowFail  = document.getElementById("Escrow Fail");
  var WaterFallSet  = document.getElementById("WaterFallSet");
  var LedgerSet  = document.getElementById("LedgerSet");
  var EscrowInvestmentPeriodEnd  = document.getElementById("EscrowInvestmentPeriodEnd");
  issuer.then(function(value){return value.Securitization.call();})
      .then(function(value){sfc = SFContract.at(value);
                            return sfc.EscrowAddress.call();})
      .then(function(value){escrow = Escrow.at(value);
                            EscrowEscrowAddress.innerHTML = value; return escrow.InvestmentPeriodEnd.call();})
      .then(function(value){EscrowInvestmentPeriodEnd.innerHTML = value;})
      .then(function(){return escrow.CheckState.call();})
      .then(function(value){
                            InvestorFundsReceivedA.innerHTML = value[0];
                            InvestorFundsReceivedB.innerHTML  = value[1];
                            PoolReceived.innerHTML = value[2];
                            ReserveReceived.innerHTML = value[3];
                            ThirdPartyPoolValidation.innerHTML = value[4];
                            FundingPeriodOver.innerHTML = value[5];
                            EscrowSuccess.innerHTML  = value[6];
                            EscrowFail.innerHTML = value[7];})
}

function ReadSFContract()
{
  var OriginalPoolBalanceSFC = document.getElementById("OriginalPoolBalanceSFC");
  var NumberOfLoansSFC  = document.getElementById("NumberOfLoansSFC");
  var ClassAInitialBalSFC  = document.getElementById("ClassAInitialBalSFC");
  var ClassAInterestRateBPSSFC  = document.getElementById("ClassAInterestRateBPSSFC");
  var ClassBInitialBalSFC  = document.getElementById("ClassBInitialBalSFC");
  var ClassBInterestRateBPSSFC  = document.getElementById("ClassBInterestRateBPSSFC");
  var ReserveRequiredSFC  = document.getElementById("ReserveRequiredSFC");
  var InvestmentPeriodEndSFC  = document.getElementById("InvestmentPeriodEndSFC");

  var LedgerAndEscrowCreatedSFC  = document.getElementById("LedgerAndEscrowCreatedSFC");
  var EscrowSuccessSFC  = document.getElementById("EscrowSuccessSFC");
  var EscrowFailSFC  = document.getElementById("EscrowFailSFC");
  var BondsAndWaterFallCreatedSFC  = document.getElementById("BondsAndWaterFallCreatedSFC");
  var BondsAndWaterFallCreatedSFC  = document.getElementById("BondsAndWaterFallCreatedSFC");
  var InvestorWithdrawnSFC  = document.getElementById("InvestorWithdrawnSFC");

  var TrustedPartySFC = document.getElementById("TrustedPartySCF");
  var OwnerSFC = document.getElementById("OwnerSFC");
  var OriginatorSFC = document.getElementById("OriginatorSFC");
  //<!--var PoolAddSFC = document.getElementById("PoolAddSFC");>
  var EscrowAddressSFC = document.getElementById("EscrowAddressSFC");
  var AssetLedgerAddressSCF = document.getElementById("AssetLedgerAddressSCF");
  var WaterFallAddressSFC = document.getElementById("WaterFallAddressSFC");
  var ClassABondAddressSFC = document.getElementById("ClassABondAddressSFC");
  var ClassBBondAddressSFC = document.getElementById("ClassBBondAddressSFC");


  issuer.then(function(value){return value.Securitization.call();})
      .then(function(value){sfc = SFContract.at(value);
                            return sfc.ReadNumbers.call();})
      .then(function(value){
                            OriginalPoolBalanceSFC.innerHTML  = value[0];
                            NumberOfLoansSFC.innerHTML  = value[1];
                            ClassAInitialBalSFC.innerHTML  = value[2];
                            ClassAInterestRateBPSSFC.innerHTML  = value[3];
                            ClassBInitialBalSFC.innerHTML  = value[4];
                            ClassBInterestRateBPSSFC.innerHTML  = value[5];
                            ReserveRequiredSFC.innerHTML  = value[6];
                            InvestmentPeriodEndSFC.innerHTML  = value[7];})
       .then(function(){return sfc.ReadState.call();})
       .then(function(value){
                           LedgerAndEscrowCreatedSFC.innerHTML = value[0];
                           EscrowSuccessSFC.innerHTML = value[1];
                           EscrowFailSFC.innerHTML = value[2];
                           BondsAndWaterFallCreatedSFC.innerHTML = value[3];})
       .then(function(){return sfc.ReadAddresses.call();})
       .then(function(value){
         TrustedPartySFC.innerHTML =value[2];
         OwnerSFC.innerHTML =value[3];
         OriginatorSFC.innerHTML =value[3];
         EscrowAddressSFC.innerHTML =value[7];
         AssetLedgerAddressSCF.innerHTML =value[8];
         WaterFallAddressSFC.innerHTML =value[9];
         ClassABondAddressSFC.innerHTML =value[10];
         ClassBBondAddressSFC.innerHTML =value[11];});
       }


function deploySFC()
{

var classAsize = parseInt(document.getElementById("classAsize").value);
var classAbps = parseInt(document.getElementById("classAbps").value);
var classBsize = parseInt(document.getElementById("classbsize").value);
var classBbps = parseInt(document.getElementById("classbbps").value);
var reserveRequired = parseInt(document.getElementById("reserveRequired").value);
var investmentPeriodEnd = parseInt(document.getElementById("investmentPeriodEnd").value);
var trustedParty = parseInt(document.getElementById("trustedParty").value);
var PoolBalance = parseInt(document.getElementById("PoolBalance").value);

var EscrowAddressSFC = document.getElementById("EscrowAddressSFC");
var AssetLedgerAddressSCF = document.getElementById("AssetLedgerAddressSCF");
var WaterFallAddressSFC = document.getElementById("WaterFallAddressSFC");
var ClassABondAddressSFC = document.getElementById("ClassABondAddressSFC");
var ClassBBondAddressSFC = document.getElementById("ClassBBondAddressSFC");

var statusp = document.getElementById("tstt");
//var poolbalance;

  								issuer.then(function(value){issuerinstance = value; return issuerinstance.TimeAddress.call();})
                      .then(function(value){TimeAddress =value;time = TimeSim.at(value);})
                      .then(function(value){return time.Now.call();})
                      .then(function(value){now = value;})
                      .then(function(value){return issuerinstance.getLoans.call();})
                      .then(function(value){loanaddresses = value;})
                      .then(function(){setStatusCreateSFC("Initiating transaction... (please wait)");
                                      return SFContract.new(loanaddresses,
                                                       PoolBalance,
                                                       loansnr,
                                                       classAsize,
                                                       classAbps,
                                                       classBsize,
                                                       classBbps,
                                                       reserveRequired,
                                                       +now +investmentPeriodEnd * 60*60*24,
                                                       trustedParty,
                                                       issuerinstance.address,
                                                       issuerinstance.address,
                                                       issuerinstance.address,
                                                       TimeAddress);})
                        .then(function(value) {
                          setStatusCreateSFC("SetSecuritization Contract Deployed!");
                        var sfcaddress = document.getElementById("sfcaddress");
                            sfcaddress.innerHTML = value.address;
                            sfcaddressval = value.address;
                            sfc = value;
                        return issuerinstance.SetSecuritization(sfcaddressval);})
                        .then(function(value){setStatusCreateSFC("Securitization Contract Registered");})
                        //.then(function(){})
                        .then(function(){return Escrow.new(classAsize,classBsize,reserveRequired,+now +investmentPeriodEnd * 60*60*24 ,
                                         trustedParty,sfcaddressval,issuerinstance.address,TimeAddress);})
                        .then(function(value){escrow = value ; escrowaddress = escrow.address; EscrowAddressSFC.innerHTML = value.address;})
                        .then(function(value){setStatusCreateSFC("Securitization & Escrow deployed");})
                        .then(function(){return AssetLedger.new(loanaddresses,
                                                                          PoolBalance,loansnr,sfcaddressval,TimeAddress);})
                        .then(function(value){ledger = value; ledgeraddress = ledger.address; AssetLedgerAddressSCF.innerHTML = value.address;})
                        .then (function(){return sfc.CreateEscrowAndLedger(escrowaddress,ledgeraddress);})
                        .then(function(value){setStatusCreateSFC("Securitization & Escrow & Ledger Deployed");})

                        .then(function(){return BondA.new(classAsize,sfcaddressval);})
                        .then(function(value){Abond = value; ClassABondAddressSFC.innerHTML = value.address;})
                        .then(function(){return BondB.new(classBsize,sfcaddressval);})
                        .then(function(value){Bbond = value; ClassBBondAddressSFC.innerHTML = value.address;})
                        .then(function(value){setStatusCreateSFC("Securitization & Escrow & Ledger & Bonds Deployed");})
                        .then(function(){return WaterFall.new(reserveRequired,classAsize,classAbps,classBsize,classBbps,
                          ledgeraddress,Abond.address,Bbond.address,sfcaddressval);})
                        .then(function(value){waterfall = value; WaterFallAddressSFC.innerHTML = value.address;})
                        .then(function(value){setStatusCreateSFC("Securitization &  Escrow & Ledger & Bonds & Waterfall Deployed");})
                        .then(function(){return sfc.CreateBondsAndWaterFall(Abond.address,Bbond.address,waterfall.address);})
                        .then(function(value){setStatusCreateSFC("All Contracts Deployed");})

                        .catch(function(e) {console.log(e); setStatusCreateSFC("Error Creating; see log.");});
                        /*
                        .then(function(){issuer.then(function(instance){return instance.SetSecuritization(sfcaddressval);})})
                        .then(function(value){scfadd = value; setStatusCreateSFC("SFC Transaction complete! and Connected to Issuer");})
                        .catch(function(e) {console.log(e); setStatusCreateSFC("Error Creating; see log.");});
                        */
ReadSFContract();
ReadEscrow ();
}


  /*

  function SFContract (address [2] accountAddresses ,uint originalPoolBalance,
                       uint numberOfLoans, uint classAInitialBal,
                       uint classAInterestRateBPS, uint classBInitialBal,
                       uint classBInterestRateBPS, uint reserveRequired,
                       uint investmentPeriodEnd,address trustedParty,
                       address originator, address excessFundsReceiver,
                      address pool,address time)

  */

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function setStatusPayin(message) {
  var statusp = document.getElementById("statuspayin");
  statusp.innerHTML = message;
};

function setStatusCreateSFC(message) {
  var statuspl = document.getElementById("statusproposeSCF");
  statuspl.innerHTML = message;
};



function nexttable()
{
loantablevalue = loantablevalue + 3;
PopulateTable(loantablevalue);
}

function prevtable()
{
loantablevalue = loantablevalue - 3;
if (loantablevalue < 0 ) loantablevalue =0;
PopulateTable(loantablevalue);
}

function PopulateTable(index)
{
	var indexval;
	var cell11 = document.getElementById("tablecell11");
	var cell12 = document.getElementById("tablecell12");
	var cell13 = document.getElementById("tablecell13");
	var cell21 = document.getElementById("tablecell21");
	var cell22 = document.getElementById("tablecell22");
	var cell23 = document.getElementById("tablecell23");
	var cell31 = document.getElementById("tablecell31");
	var cell32 = document.getElementById("tablecell32");
	var cell33 = document.getElementById("tablecell33");

  issuer.then(function(value){issuerinstance = value; return value.LoansNumber.call()})
   .then(function(value){loansnr = value;
   if (loansnr > index) {return issuerinstance.Loans.call(index);}
   cell11.innerHTML = "";
   cell12.innerHTML = "";
   cell13.innerHTML ="";
   return 0;})
  .then(function(value){
  cell11.innerHTML = value;
  loan1 = SmartLoan.at(value);return value;})
  .then(function(){return loan1.OriginalBalance.call();})
  .then(function(value){cell12.innerHTML = value;return value;})
  .then(function(){return loan1.CurrentBalance.call();})
  .then(function(value){cell13.innerHTML = value;return value;});



								issuer.then(function(value){issuerinstance = value; return value.LoansNumber.call()})
								 .then(function(value){loansnr = value;
								 if (loansnr > index) {return issuerinstance.Loans.call(index+1);}
								 cell21.innerHTML = "";
								 cell22.innerHTML = "";
								 cell23.innerHTML ="";
								 return 0;})
								.then(function(value){
								cell21.innerHTML = value;
								loan2 = SmartLoan.at(value);return value;})
								.then(function(){return loan2.OriginalBalance.call();})
								.then(function(value){cell22.innerHTML = value;return value;})
								.then(function(){return loan2.CurrentBalance.call();})
								.then(function(value){cell23.innerHTML = value;return value;});


								issuer.then(function(value){issuerinstance = value; return value.LoansNumber.call()})
								 .then(function(value){loansnr = value;
								 if (loansnr > index) {return issuerinstance.Loans.call(index+2);}
								 cell31.innerHTML = "";
								 cell32.innerHTML = "";
								 cell33.innerHTML ="";
								 return 0;})
								.then(function(value){
								cell31.innerHTML = value;
								loan3 = SmartLoan.at(value);return value;})
								.then(function(){return loan3.OriginalBalance.call();})
								.then(function(value){cell32.innerHTML = value;return value;})
								.then(function(){return loan3.CurrentBalance.call();})
								.then(function(value){cell33.innerHTML = value;return value;});

};


/*
function refreshBalance() {
  var meta = MetaCoin.deployed();

  meta.getBalance.call(account, {from: account}).then(function(value) {
    var balance_element = document.getElementById("balance");
	balance_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting balance; see log.");
  });
};
*/


function PayInstallment()
{
	setStatusPayin("Initiating transaction... (please wait)");

	loan.then(function(value){value.PayIn({from: account0, value: installment})})
	.then(function(value) {
    setStatusPayin("Transaction complete!");
	refreshBalance();
	GetLoanInfo();}).catch(function(e) {console.log(e); setStatusPayin("Error sending coin; see log.");});

};





function refreshBalance() {

  var uservar;
    var account0_element = document.getElementById("account0");
	account0_element.innerHTML = account0.valueOf();

  var sfcaddress = document.getElementById("sfcaddress");
  var sfcobal = document.getElementById("OriginalPoolBalance");
  /*
  issuer.AccountsToLoans[account0].call()
  .then{
	var LoanAddress_element = document.getElementById("LoanAddress");
	LoanAddress_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting account; see log.");
  });*/

/*
  issuer.TimeAddress.call().then(function(value) {
    var TimeAddress_element = document.getElementById("TimeAddress");
	TimeAddress_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting balance; see log.");
  });  */

  issuer.then(function(value){return value.Securitization.call();})
      .then(function(value){sfcaddress.innerHTML = value; return sfccontrct = SFContract.at(value);})
      .then(function(){return sfccontrct.OriginalPoolBalance.call();})
      .then(function(value){sfcobal.innerHTML = value;});

    issuer.then(function(value){return value.IssuerDirector.call()}).then(function(value) {
    var issuerdirector_element = document.getElementById("issuerdirector");
	issuerdirector_element.innerHTML = value.valueOf();
	testrpcaccount = value;

	if(testrpcaccount === account0)
{

}

else

{
	var link = document.getElementById('amount');
	link.style.display = 'none';

	link = document.getElementById('issuersection');
	link.style.display = 'none';

}
  }).catch(function(e) {
    console.log(e);
    setStatus("Error hiding; see log.");
  });

};

/*
function GetLoanInfo() {
	var issuer = Issuer.deployed();
	var OriginalBalance_element = document.getElementById("OriginalBalance");
			     OriginalBalance_element.innerHTML = issuer.valueOf();
	issuer.GetLoanAddress.call()
	.then(function(){var OriginalBalance_element = document.getElementById("OriginalBalance");
			     OriginalBalance_element.innerHTML = 1;//value.valueOf();
	      return issuer.GetLoanAddress.call();})

	.then(function(value)
	{	var loan = SmartLoan.at(value);
		loan.OriginalBalance.call()
		.then(function(value){
			     var OriginalBalance_element = document.getElementById("OriginalBalance");
			     OriginalBalance_element.innerHTML = value.valueOf();
			                 }
			 ).catch(function(e) {console.log(e); setStatus("Error getting account; see log.");});

	};*/
function GetLoanInfo()
{
	var html_element;
	html_element = document.getElementById("LoanAddress");

	issuer.then(function(value){return value.AccountsToLoans.call(account0.valueOf())})
	.then(function(value){

			html_element.innerHTML = value.valueOf();
			loan = SmartLoan.at(value);})

	.then(function(){return loan.OriginalBalance.call();})
	.then(function(value){html_element = document.getElementById("OriginalBalance");
						  html_element.innerHTML = value.valueOf();})

	.then(function(){return loan.CurrentBalance.call();})
	.then(function(value){html_element = document.getElementById("CurrentBalance");
						  html_element.innerHTML = value.valueOf();
						  if (value == 0){	link = document.getElementById('loansection');
											link.style.display = 'none';}
						  })

	.then(function(){return loan.IntPaidIn.call();})
	.then(function(value){html_element = document.getElementById("IntPaidIn");
						  html_element.innerHTML = value.valueOf();})

	.then(function(){return loan.PrinPaidIn.call();})
	.then(function(value){html_element = document.getElementById("PrinPaidIn");
						  html_element.innerHTML = value.valueOf();})
	.then(function(){return loan.MonthlyInstallment.call();})
	.then(function(value){html_element = document.getElementById("MonthlyInstallment");
						  html_element.innerHTML = value.valueOf()
						  installment = value;})
	.then(function(){return loan.InterestRateBasisPoints.call();})
	.then(function(value){html_element = document.getElementById("InterestRateBasisPoints");
						  html_element.innerHTML = value.valueOf();})

	.then(function(){return loan.OriginalTermMonths.call();})
	.then(function(value){html_element = document.getElementById("OriginalTermMonths");
						  html_element.innerHTML = value.valueOf();})
	.then(function(){return loan.RemainingTermMonths.call();})
	.then(function(value){html_element = document.getElementById("RemainingTermMonths");
						  html_element.innerHTML = value.valueOf();})
	.then(function(){return loan.NextPaymentDate.call();})
	.then(function(value){html_element = document.getElementById("NextPaymentDate");
						  html_element.innerHTML = value.valueOf();})
	.then(function(){return loan.PaymentsMade.call();})
	.then(function(value){html_element = document.getElementById("PaymentsMade");
						  html_element.innerHTML = value.valueOf();})
						  .then(function(){return loan.OverdueDays.call();})
	.then(function(value){html_element = document.getElementById("OverdueDays");
						  html_element.innerHTML = value.valueOf();})
	.then(function(value){html_element = document.getElementById("OriginalBalance");
						  html_element.innerHTML = value.valueOf();});



};





function fundAccount ()
{
web3.eth.sendTransaction({from:accounts[0], to:"account0", value: 100})
};


function createLoan() {
  var issuer = Issuer.deployed();

  var amount = parseInt(document.getElementById("amount").value);
  var receiver = document.getElementById("receiver").value;
  var interestrate = parseInt(document.getElementById("interestrate").value);
  var term = document.getElementById("term").value;

  setStatus("Initiating transaction... (please wait)");

  issuer.then(function(value){ return value.NewLoan(receiver, amount, interestrate,term, {from:account0})})
  .then(function(value) {
    setStatus("Transaction complete!");
	/*
    var loanAddress_element = document.getElementById("loanAddress");
	loanAddress_element.innerHTML = value.valueOf();*/
	refreshBalance();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin; see log.");
  });
};




window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {

	if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }
	loantablevalue=0;

    accounts = accs;
    account0 = accounts[0];
    refreshBalance();
	GetLoanInfo();
  ReadSFContract();
  ReadEscrow ();
	PopulateTable(0);

  });
}
