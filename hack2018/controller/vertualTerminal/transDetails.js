authorizeNet.controller('transactionDetail', ['$scope','TransactionService','AnetAPIService',function($scope,TransactionService,apiService){
	$scope.transObject = TransactionService.getCurrentTransactionDetails();// will return a transaction object
	$scope.action;
	$scope.actionHandler = function() {
		if($scope.action==='Void'){
			apiService.voidCurrentTransaction(TransactionService.getCurrentTransID()).then(function(message){
				// this is where we want to give feedback to the user we actually did void the transaction //
				$scope.transObject.transactionStatus = "Voided";
				$scope.viewTransactionSuccessMessage = message;

			});
		}
		else{
			apiService.refundCurrentTransaction($scope.transObject).then(function(message){
				$scope.transObject.transactionStatus = "Refunded";
				$scope.viewTransactionSuccessMessage = message;
			});
		}
	}
	$scope.refundTransaction = function() { 

	}

}]);
/*
AVSResponse: "Y"
authAmount: "27.36"
authCode: "O5SBDH"
batch: Object
	batchId: "3469018"
	settlementState: "settledSuccessfully"
	settlementTimeLocal: "2014-06-02T17:30:41.553"
	settlementTimeUTC: "2014-06-03T00:30:41.553Z"
billTo: Object
	address: "123 Any Street"
	city: "Any City"
	firstName: "John"
	lastName: "Doe"
	state: "CA"
	zip: "94114"
marketType: "Retail"
order: Object
	description: "Widgets"
	invoiceNumber: "1401742608417"
payment: Object  
	creditCard: Object
		cardNumber: "XXXX1111"
		cardType: "Visa"
		expirationDate: "XXXX"
product: "Card Present"
recurringBilling: "false"
responseCode: "1"
responseReasonCode: "1"
responseReasonDescription: "Approval"
settleAmount: "27.36"
submitTimeLocal: "2014-06-02T13:56:50.963"
submitTimeUTC: "2014-06-02T20:56:50.963Z"
taxExempt: "false"
transId: "2214266322"
transactionStatus: "settledSuccessfully"
transactionType: "authCaptureTransaction"
*/
