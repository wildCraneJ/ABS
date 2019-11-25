var Pool = artifacts.require("./Pool.sol");
var AssetLedger = artifacts.require("./AssetLedger.sol");
var Bond = artifacts.require("./Bond.sol");
var Escrow = artifacts.require("./Escrow.sol");
var SFContract = artifacts.require("./SFContract.sol");
var SmartLoan = artifacts.require("./SmartLoan.sol");
var TimeSim = artifacts.require("./TimeSim.sol");
var WaterFall = artifacts.require("./WaterFall.sol");
var BondA = artifacts.require("./BondA.sol");
var BondB = artifacts.require("./BondB.sol");


contract('Simulation:', function(accounts) {
  it("Simulating Transcation Flow", function(done) {
  //var pool = Pool.deployed();
	//var loan = SmartLoan.deployed();
	var sfc;
	var time;
	var escrow;
	var loan1;
	var loan2;
	var waterfall;
	var aBonds;
	var bBonds;
	var installent1;
	var installent2;
	var ClassABal;
	var ClassBBal;
	var loan1address;
	var loan2address;
	var pooladdress;
	var ledgerAddress;
	var aBondsAddress;
	var bBondsAddress;
	var waterfallAddress;
	var Period=0;
  var reserveTarget;

	function PeriodStep (payloan1,payloan2) {
	Period++;
    //move time forward by one month
	return time.Step()
  .then(function(){console.log("\n\n____________________________________________________________");})
  .then(function(){return time.Now.call();})
  .then(function(value){console.log(    "     PERIOD: "+Period+" TimeStamp (UNIX Months): "+value/(60*60*24*30));})
  .then(function(){console.log(    "____________________________________________________________");})

	.then(function(){console.log('\n'+"Paying in both loans...");})

	//pay loans installmemts
	.then(function(){if(payloan1) {return loan1.PayIn({value:installent1});}})
	.then(function(){if(payloan2) {return loan2.PayIn({value:installent2});}})
	.then(function(){return loan1.Read.call();})
	.then(function(value){console.log("Loan1: ODDys:" + value[0] + " CB:" + value[2] + " NxtPymtDt:" + value[3]/(60*60*24*30) +
														" Int:" + value[4] +" Prin:" + value[5] + " RTerm:" + value[9]+" Balance:" +value[10]); return loan2.Read.call();})
	.then(function(value){console.log("Loan2: ODDys:" + value[0] + " CB:" + value[2] + " NxtPymtDt:" + value[3]/(60*60*24*30) +
														" Int:" + value[4] +" Prin:" + value[5] + " RTerm:" + value[9]+" Balance:" +value[10]);})

	//Checkbalances
	.then(function(){return web3.eth.getBalance(ledgerAddress);})
	.then(function(value){console.log("Ledger balance:" + value);})

    //  Leger gets funds from loans

	.then(function(){console.log("\n\nDraw Funds From Loans Into Ledger...");return sfc.MoveFundsFromPoolIntoLedger();})
  .then(function(){console.log(    "----------------------------------------------");})
     //Checkbalances of loans and ledger
	.then(function(){return web3.eth.getBalance(loan1address);})
	.then(function(value){console.log("Loan1 balance                  : " + value);})
	.then(function(){return web3.eth.getBalance(loan2address);})
	.then(function(value){console.log("Loan2 balance                  : " + value);})
    .then(function(){return web3.eth.getBalance(ledgerAddress);})
	.then(function(value){console.log("Ledger balance                 : " + value);})
	//updated ledger data
    .then(function() {return ledger.PrincipalThisPeriod.call();})
	.then(function(value){console.log("PrincipalThisPeriod            : "+value);})
	.then(function() {return ledger.InterestThisPeriod.call();})
	.then(function(value){console.log("InterestThisPeriod             : "+value);})
	.then(function() {return ledger.RecoveriesThisPeriod.call();})
	.then(function(value){console.log("RecoveriesThisPeriod           : "+value);})
	.then(function() {return ledger.DefaultThisPeriod.call();})
	.then(function(value){console.log("DefaultThisPeriod              : "+value);})
	.then(function() {return ledger.PrincipalCum.call();})
	.then(function(value){console.log("PrincipalCum                   : "+value);})
	.then(function() {return ledger.InterestCum.call();})
	.then(function(value){console.log("InterestCum                    : "+value);})
	.then(function() {return ledger.RecoveriesCum.call();})
	.then(function(value){console.log("RecoveriesCum                  : "+value);})
	.then(function() {return ledger.DefaultCum.call();})
	.then(function(value){console.log("DefaultCum                     : "+value);})
	.then(function() {return ledger.LoansRepaid.call();})
	.then(function(value){console.log("LoansRepaid                    : "+value);})
	.then(function() {return ledger.CurrentlPoolBalance.call();})
	.then(function(value){console.log("CurrentlPoolBalance            : "+value);})
  .then(function(){console.log(     "----------------------------------------------");})


	//Move funds from Ledger to WaterFall
  .then(function(){console.log("\n\nMove Funds From Ledger To Waterfall...");return sfc.MoveFundsFromLedgerToWaterfall();})
  .then(function(){console.log(     "----------------------------------------------");})
  .then(function(){return web3.eth.getBalance(ledgerAddress);})
	.then(function(value){console.log("Ledger balance                 : " + value);})
	.then(function(){return web3.eth.getBalance(waterfallAddress);})
	.then(function(value){console.log("WaterFall balance              : " + value);})
	.then(function(){return waterfall.ReserveFundTarget.call();})
  .then(function(value){console.log("Reservefund target             : " +value);})
  .then(function(){return waterfall.ReserveFundAvailable.call();})
  .then(function(value){console.log("Reservefund available          : " +value);})
  .then(function(){return waterfall.AvailableFunds.call();})
  .then(function(value){console.log("AvailableFunds available          : " +value);})


	/*.then(function(){return waterfall.PoolA.call();})
    .then(function(value){console.log("\n-Waterfall info on pool-"+
	                                  "\nInterest from pool             : "  + value[0]+
									  "\nPrincipal from pool            : "  + value[1]+
									  "\nRecoveries from pool           : "  + value[2]+
									  "\nDefaults in pool               : "  + value[3]);})
	*/
	.then(function(){return waterfall.ClassA.call();})
    .then(function(value){console.log("\n-Waterfall info on Class A-"+
                                   	  "\nOriginal Balance               : "  + value[0]+
									  "\nCurrent Balance                : "  + value[1]+
									  "\nInterestrate (BPS)             : "  + value[2]+
									  "\nInterest due next period       : "  + value[3]+
									  "\nInterest available this period : "  + value[4]+
									  "\nPrincipal available this period: "  + value[5]);})

    .then(function(){return waterfall.ClassB.call();})
    .then(function(value){console.log("\n-Waterfall info on Class B-"+
	                                  "\nOriginal Balance               : "  + value[0]+
									  "\nCurrent Balance                : "  + value[1]+
									  "\nInterestrate (BPS)             : "  + value[2]+
									  "\nInterest due next period       : "  + value[3]+
									  "\nInterest available this period : "  + value[4]+
									  "\nPrincipal available this period: "  + value[5]);})
  .then(function(){console.log(     "----------------------------------------------");})

	//Move Funds from WaterFall to Bonds

  .then(function(){console.log("\n\nMove Funds from WaterFall to Bonds...");return sfc.MoveFundsIntoBonds();})
  .then(function(){console.log(     "----------------------------------------------");})
  .then(function(){return web3.eth.getBalance(waterfallAddress);})
	.then(function(value){console.log("WaterFall balance              : " + value);})
	.then(function(){return web3.eth.getBalance(aBondsAddress);})
	.then(function(value){console.log("ABonds balance on contract     : " + value);})
	.then(function(){return web3.eth.getBalance(bBondsAddress);})
	.then(function(value){console.log("BBonds balance on contract     : " + value);})



  .then(function(){return aBonds.CheckStatus.call(accounts[0]);})
  .then(function(value){console.log("\n-Class A Bonds-"+
                                    "\nBalance Of Bond Tokens Account : " + value[0]+
                                    "\nBalance Withdrawn Int          : " + value[1]+
                                    "\nBalance Withdrawn Prin         : " + value[2]+
                                    "\nTotal Balance Paid in Int      : " + value[3]+
                                    "\nTotal Balance Paid in Prin     : " + value[4]);})

    .then(function(){return bBonds.CheckStatus.call(accounts[0]);})
    .then(function(value){console.log("\n-Class B Bonds-"+
                                      "\nBalance Of Bond Tokens Account : " + value[0]+
                                      "\nBalance Withdrawn Int          : " + value[1]+
                                      "\nBalance Withdrawn Prin         : " + value[2]+
                                      "\nTotal Balance Paid in Int      : " + value[3]+
                                      "\nTotal Balance Paid in Prin     : " + value[4]);})
    .then(function(){console.log(     "----------------------------------------------");})

  }


	return Pool.deployed().then(function(instance){pool = instance; return instance.Owner.call(); })
	.then(function(value){console.log("\n\nDeploying high level conracts...\n"+
									  "Seed account              : " +value );pooladdress = value; return pool.DeployLoans();})
  .then(function(){return pool.DeploySFContract();})
  .then(function(){return pool.SFCAddress.call();})
	.then(function(value){console.log("SF contract deployed at   : " +value); SFCaddress = value; return sfc = SFContract.at(value);})
  .then(function(){return pool;})
	.then(function(){return pool.Loan1Address.call();})
	.then(function(value){console.log("Loan1 contract deployed at: " +value); loan1 = SmartLoan.at(value); loan1address=value; return pool.Loan2Address.call();})
	.then(function(value){console.log("Loan2 contract deployed at: " +value); loan2 = SmartLoan.at(value); loan2address=value; return pool.TimeAddress.call();})
	.then(function(value){console.log("Time contract deployed at : " +value); time = TimeSim.at(value);})
	.then(function(){console.log("----------------------------------------------------------------------");})
	.then(function(){return sfc.ReadNumbers.call();})
	.then(function(value){SFCnumbers=value; console.log("\n"+"---SF Contract---\n"+

									  "\n"+"SF Contract Inputs"+
									  "\n"+"OriginalPoolBalance       : " +value[0]+
									  "\n"+"NumberOfLoans             : " +value[1]+
									  "\n"+"ClassAInitialBal          : " +value[2]+
									  "\n"+"ClassAInterestRateBPS     : " +value[3]+
									  "\n"+"ClassBInitialBal          : " +value[4]+
									  "\n"+"ClassBInterestRateBPS     : " +value[5]+
									  "\n"+"ReserveRequired      	  : " +value[6]+
									  "\n"+"InvestmentPeriodEnd       : " +value[7]/(60*60*24*30));ClassABal=value[2];ClassBBal=value[4];
                    return sfc.ReadAddresses.call();})
	.then(function(value){
                        SFCAddresses=value;
        console.log("\n"+"SF Contract dependent contract addresses"+
									  "\n"+"AccountAddresses[0]       : "+value[0]+
									  "\n"+"AccountAddresses[1]       : "+value[1]+
									  "\n"+"TrustedParty              : "+value[2]+
									  "\n"+"Owner                     : "+value[3]+
									  "\n"+"Originator                : "+value[4]+
									  "\n"+"ExcessFundsReceiver       : "+value[5]+
									  "\n"+"Pool Address	          : "+value[6]+
								      "\n"+"Escrow Address            : "+value[7]+
									  "\n"+"AssetLedgerAddress        : "+value[8]+
			                       	  "\n"+"WaterFallAddress          : "+value[9]+
									  "\n"+"ClassABondAddress         : "+value[10]+
								      "\n"+"ClassBBondAddress         : "+value[11]+
								      "\n"+"TimeAddress               : "+value[12]); return sfc.ReadState.call();})

	.then(function(value){console.log("\n"+"SF Contract status"+
									  "\n"+"Ledger and Escrow created : " + value[0]+
									  "\n"+"Escrow Success            : " + value[1]+
									  "\n"+"Escrow Fail               : " + value[2]+
									  "\n"+"Bonds & Waterfall created : " + value[3]+
								"\n----------------------------------------------------------------------");})

	//Create Escrow And Ledger

  .then(function(){return escrow = Escrow.new(SFCnumbers[2],SFCnumbers[4],SFCnumbers[6],SFCnumbers[7],
                                              SFCAddresses[2],SFCAddresses[3],SFCAddresses[4],SFCAddresses[12]);})
.then(function(value){return escrowAddress = value.address;})
  /*
  .then(function(){return escrow = Escrow.new(SFCnumbers[2],SFCnumbers[4],SFCnumbers[6],SFCnumbers[7],
                                              SFCAddresses[2],SFCAddresses[3],SFCAddresses[4],SFCAddresses[12]);})
*/
  /*
  function Escrow (uint requiredFundsA, uint requiredFundsB,
                   uint reserveRequired, uint investmentPeriodEnd,
                   address trustedParty, address owner,
                   address originator, address time)

  */

.then(function(){return ledger = AssetLedger.new([SFCAddresses[0],SFCAddresses[1]],
                                                  SFCnumbers[0],SFCnumbers[1],
                                                  SFCAddresses[3],SFCAddresses[12]);})
/*
address [2] accountAddresses, uint originalPoolBalance,
                     uint numberOfLoans,address controller, address timeAddress
*/

  .then(function(value){return ledgerAddress = value.address;})
	.then (function(){return sfc.CreateEscrowAndLedger(escrowAddress,ledgerAddress);})//address escrowAddress, address ledgerAddress
  .then (function(){return sfc.EscrowAddress.call();})
	.then(function(value){console.log("\n"+"Deploying Escrow and Ledger contracts..."+"\n"+"Escrow at: "+value); escrow=Escrow.at(value); return sfc.AssetLedgerAddress.call();})
    .then(function(value){console.log("Ledger at: "+value+"\n"); ledger= AssetLedger.at(value); ledgerAddress = value;})
	.then (function(){console.log("Giving Ledger address to Escrow...");
       	              return escrow.SetLedger(ledgerAddress);})
	.then (function(){return pool.GetEscrowLedgerAddress ();})

	//Fullfill Escrow Requirements
	.then(function(){console.log("Investors paying for A and B bonds...");})
    .then(function(){return escrow.InvestorPayInA({value: ClassABal});})
	.then(function(){return escrow.InvestorPayInB({value: ClassBBal});})
	.then(function(value){console.log("Originator transfers ownership of Loans...");})//from: "+value);})
	.then(function(){return pool.NewOwner();})
  //.then(function(){return loan2.Transfer(ledgerAddress);})
	//.then(function(value){console.log("Originator transfers ownership of Loans... to: "+value);})
  //.then(function(){return loan2.LenderAddress.call();})
  //.then(function(value){console.log("Originator transfers ownership of Loans2... to: "+value);})
  //.then(function(){return loan2;})
  //.then(function(value){console.log(" Loans2address : "+value.address);})
	.then(function(){console.log("Ledger confirms transfer...");})
//.then(function(){return ledger.AccountAddress.call(0);})
//.then(function(value){console.log("ldegeraactddr[0]: "+value);})
//.then(function(){return ledger.AccountAddress.call(1);})
//.then(function(value){console.log("ldegeraactddr[1]: "+value);
//.then(function(){return ledger.OriginalNumberOfLoans.call();})
//.then(function(value){console.log("OriginalNumberOfLoans "+value);})
//.then(function(){return ledger.ThisAddress.call();})
//.then(function(value){console.log("ThisAddress "+value);})

  .then(function(){return ledger.PooTransferred();})
	.then(function(){return ledger.PoolTransfer.call();})
	.then(function(value){console.log("ledgerpooltransfer worked: "+value);})
	.then(function(){console.log("Escrow checks transfer...");})
	.then(function(){return escrow.PoolTransfer();})
  .then(function(){return escrow.ReserveRequired();})
  .then(function(value){reserveTarget= value; console.log("Reserve is beeing paid... paying: "+reserveTarget);})
	.then(function(){return escrow.PayReserve({value: reserveTarget});})
	.then(function(){console.log("Third party confirms validity of pool...");})
	.then(function(){return pool.EscrowTrustedParty();})
	.then(function(){console.log("----------------------------------------------------------------------");})

	//Check if Escrow is done
	.then(function(){return escrow.CheckState.call()})
	.then(function(value){console.log("\n"+"State of Escrow Contract "
	                                 +"\n"+"Investor Funds Received A : " + value[0] + "\n"
                                          +"Investor Funds Received B : " + value[1] + "\n"
                                          +"Pool Received             : " + value[2] + "\n"
                                          +"Reserve Received          : " + value[3] + "\n"
                                          +"Third Party Validation    : " + value[4] + "\n"
                                          +"Funding Period Over       : " + value[5] + "\n"
                                          +"Escrow Success            : " + value[6] + "\n"
                                          +"Escrow Fail               : " + value[7]  );})
    .then(function(){console.log("----------------------------------------------------------------------");})

	//.then(function(){console.log("SFContract checks Escrow...");})
	.then(function(){return sfc.CheckEscrow ();})

    //Create Bonds and WaterFall
	.then(function(){console.log(     "\nDeploying Bonds and WaterFall...");})


  /*
  .then(function(value){SFCnumbers=value; console.log("\n"+"---SF Contract---\n"+

                    "\n"+"SF Contract Inputs"+
                    "\n"+"OriginalPoolBalance       : " +value[0]+
                    "\n"+"NumberOfLoans             : " +value[1]+
                    "\n"+"ClassAInitialBal          : " +value[2]+
                    "\n"+"ClassAInterestRateBPS     : " +value[3]+
                    "\n"+"ClassBInitialBal          : " +value[4]+
                    "\n"+"ClassBInterestRateBPS     : " +value[5]+
                    "\n"+"ReserveRequired      	  : " +value[6]+
                    "\n"+"InvestmentPeriodEnd       : " +value[7]/(60*60*24*30));ClassABal=value[2];ClassBBal=value[4];
                    return sfc.ReadAddresses.call();})
  .then(function(value){
                        SFCAddresses=value;
        console.log("\n"+"SF Contract dependent contract addresses"+
                    "\n"+"AccountAddresses[0]       : "+value[0]+
                    "\n"+"AccountAddresses[1]       : "+value[1]+
                    "\n"+"TrustedParty              : "+value[2]+
                    "\n"+"Owner                     : "+value[3]+
                    "\n"+"Originator                : "+value[4]+
                    "\n"+"ExcessFundsReceiver       : "+value[5]+
                    "\n"+"Pool Address	          : "+value[6]+
                      "\n"+"Escrow Address            : "+value[7]+
                    "\n"+"AssetLedgerAddress        : "+value[8]+
                                "\n"+"WaterFallAddress          : "+value[9]+
                    "\n"+"ClassABondAddress         : "+value[10]+
                      "\n"+"ClassBBondAddress         : "+value[11]+
                      "\n"+"TimeAddress               : "+value[12]); return sfc.ReadState.call();})

  .then(function(value){console.log("\n"+"SF Contract status"+
                    "\n"+"Ledger and Escrow created : " + value[0]+
                    "\n"+"Escrow Success            : " + value[1]+
                    "\n"+"Escrow Fail               : " + value[2]+
                    "\n"+"Bonds & Waterfall created : " + value[3]+
                "\n----------------------------------------------------------------------");})


  waterfall
  WaterFallAccount = new WaterFall(ReserveRequired,ClassAInitialBal,
                                   ClassAInterestRateBPS ,ClassBInitialBal,
                                   ClassBInterestRateBPS,	AssetLedgerAccount,
                                   ClassABond,ClassBBond,this);
*/

  //bonds

  .then(function(){return aBonds = BondA.new(SFCnumbers[2],SFCaddress); })
  .then(function(value){return AbondsAddress= value.address;})
  .then(function(){console.log(     "\nDeployed BondsA...");})

  .then(function(){return   bBonds = BondB.new(SFCnumbers[4], SFCaddress); })
  .then(function(value){return BbondsAddress= value.address;})
  .then(function(){console.log(     "\nDeployed BondsB...");})

  .then(function(){ return waterfall = WaterFall.new(SFCnumbers[6],SFCnumbers[2],SFCnumbers[3],
                                            SFCnumbers[4],SFCnumbers[5], ledgerAddress, AbondsAddress,BbondsAddress,SFCaddress);})
  .then(function(value){waterFallAddress = value.address;})
  .then(function(){console.log(     "\nDeployed WaterFall...");})

	.then(function(){return sfc.CreateBondsAndWaterFall(AbondsAddress,BbondsAddress,waterFallAddress);})
  .then(function(){return sfc.WaterFallAddress.call();})
 	.then(function(value){console.log(     "Waterfall deployed at      : " + value); waterfallAddress = value; waterfall = WaterFall.at(value);})
	.then(function(){return sfc.ClassABondAddress.call();})
 	.then(function(value){console.log(     "A Bonds deployed at        : " + value); aBondsAddress = value; aBonds = BondA.at(value);})
  .then(function(){return sfc.ClassBBondAddress.call();})
	.then(function(value){console.log(     "B Bonds deployed at        : " + value); bBondsAddress = value; bBonds = BondB.at(value);})
  .then(function(){return aBonds.transfer(SFCaddress,SFCnumbers[2]);})
  .then(function(){return bBonds.transfer(SFCaddress,SFCnumbers[4]);})
    //.then(function(){return web3.eth.getBalance(waterfallAddress);})
	//.then(function(value){console.log("WaterFall balance:" + value);})
	.then(function(){console.log("----------------------------------------------------------------------");})

	.then(function(){console.log("\nSF contract final checks");})
	.then(function(){return sfc.ReadState.call();})
	.then(function(value){console.log(     "LedgerAndEscrowCreatedvalue : " + value[0]+
									  "\n"+"EscrowSuccessvalue          : " + value[1]+
										"\n"+"EscrowFailvalue           : " + value[2]+
										"\n"+"Bonds & Waterfall Created : " + value[3]);})

	//Investors Claim their Bonds
	.then(function(){console.log("\nInvestors Claiming their Bonds...");})
	.then(function(){return sfc.SendMeMyBonds();})
	.then(function(){return escrow.BalancesA(accounts[0]);})
	.then(function(value){console.log("Escrow says poolacount has:"+ value +" tokens");})

	//Check SmartLoans Status

	.then(function(){return loan2.Read.call();})
	.then(function(value){console.log("\n\nLoan1:"+"\nOverdueDays:" + value[0] + " OriginalBalance:" + value[1] + " CurrentBal:" + value[2] + " NextPaymentDate:" + value[3]/(60*60*24*30) +
														" Interst:" + value[4] +" Principal:" + value[5] +" Installmt:" + value[6] +" Interestrate BPS:" + value[7] +
                                                        " OriginalTerm:" + value[8] +" RemainTerm:" + value[9]+" Balance:" +value[10]); installent1 = value[6];Oterm = value[8]; return loan2.Read.call();})
	.then(function(value){console.log("\nLoan2:" +'\n' +"OverdueDays:"+ value[0] + " OriginalBalance:" + value[1] + " CurrentBal:" + value[2] + " NextPaymentDate:" + value[3]/(60*60*24*30) +
														" Interst:" + value[4] +" Principal:" + value[5] +" Installmt:" + value[6] +" Interestrate BPS:" + value[7] +
                                                        " OriginalTerm:" + value[8] +" RemainTerm:" + value[9]+" Balance:" +value[10]);installent2 = value[6]; if(Oterm< value[8]) Oterm=value[8];})

	.then(function(){console.log("\n\n\n----------------------------------------------------------------------");})
	.then(function(){console.log("------------------------SETUP COMPLETE: AMORTIZATION STARTS-----------");})
	.then(function(){console.log("----------------------------------------------------------------------\n\n\n");})

    //PeriodStep takes (bool,bool) to control whether (loan1,loan2) makes an installment

/*
   // 0% default
  .then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
  .then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
*/
  // default and back to payment
  /*.then(function(){return PeriodStep (false,false);})
  .then(function(){return PeriodStep (false,false);})
  .then(function(){return PeriodStep (false,false);})
  .then(function(){return PeriodStep (false,false);})
  .then(function(){return PeriodStep (false,false);})
  .then(function(){return PeriodStep (false,false);})
  .then(function(){return PeriodStep (false,false);})
  .then(function(){return PeriodStep (false,false);})
  .then(function(){return PeriodStep (false,false);})*/
  .then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
  .then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
	.then(function(){return PeriodStep (true,true);})
  .then(function(){return PeriodStep (true,true);})

  .then(function(){done();})
});

 });
