
authorizeNet.controller('createTransactionController', ['$scope','$window','AnetAPIService','pubSubFactory',function($scope,$window,apiService,pubSubFactory){


   $('#ctdatepicker').datepicker({
      format: 'mm-dd-yyyy'
    });

	$scope.currentTab = 1;
	$scope.isSameAsBilling =  false;
	//$scope.payAmount =0;
	$scope.statusText = "";
	$scope.stateCount = 0;
	$scope.showAuthorize = false;
	$scope.successMsg  = "hello";
	$scope.swipeBtnCls = "form-control col-xs-12 btn btn-custom";

	$scope.shippingInfo = {
		firstName:"", 
		lastName:"", 
		comapny:"", 
		address:"",
		city:"",
		state:"",
		zip:"",
		country:""
	};
	
	$scope.billingInfo = {
		invoiceId:"hello", 
		description:"Hi New Item", 
		customerid:"", 
		firstName:"", 
		lastName:"", 
		company:"", 
		address:"", 
		city:"", 
		state:"", 
		zip:"", 
		country:"", 
		phone:"",
		fax:"", 
		email:""
	};

	$scope.fakeData = function(){
		$scope.shippingInfo = {
			firstName:"Charles", 
			lastName:"Scharf", 
			company:"abc Inc.", 
			address:"10800 NE 8th Street", 
			city:"Bellevue", 
			state:"WA", 
			zip:"98012", 
			country:"USA"
		};
		
		$scope.billingInfo = {
			invoiceId:"21343465", 
			description:"Gift for configuring demo app.", 
			customerid:"41234545", 
			firstName:"Niel", 
			lastName:"Buckley", 
			company:"Visa Inc.", 
			address:"10800 NE 8th Street", 
			city:"Bellevue", 
			state:"WA", 
			zip:"98012", 
			country:"USA", 
			phone:"4258592365",
			fax:"4258592365", 
			email:"rtaneja@visa.com"
		};
		$scope.cardDetails = {
			cardNumber:"4007000000027", 
			expDate:"122021", 
			amount:"24.23", 
			cardCode:"123"
		};
	}

	
	$scope.cardDetails = {
		cardNumber:"", 
		expDate:"", 
		amount:"", 
		cardCode:""
	};


	$scope.modalMessageForSuccess = "Transaction was successfull!";
	$scope.submitTransaction = function() {
		 pubSubFactory.publishEvent("TOGGLE_LOADER");
		var response = apiService.submitTransaction($scope.cardDetails,$scope.shippingInfo,$scope.billingInfo);
		response.then(function(transactionId){
			 pubSubFactory.publishEvent("TOGGLE_LOADER");
			$('#infoModal').modal();
		});
	};


	$scope.setShippingAsBilling = function(isSameAsBilling){
		if(isSameAsBilling === true)
		{
			$scope.shippingInfo.firstName ="";
			$scope.shippingInfo.lastName = "";
			$scope.shippingInfo.comapny = "";
			$scope.shippingInfo.address = "";
			$scope.shippingInfo.city = "";
			$scope.shippingInfo.state = "";
			$scope.shippingInfo.zip = "";
			$scope.shippingInfo.country = "";
		}
		else{
			$scope.shippingInfo.firstName = $scope.billingInfo.firstName;
			$scope.shippingInfo.lastName = $scope.billingInfo.lastName;
			$scope.shippingInfo.company = $scope.billingInfo.company;
			$scope.shippingInfo.address = $scope.billingInfo.address;
			$scope.shippingInfo.city = $scope.billingInfo.city;
			$scope.shippingInfo.state = $scope.billingInfo.state;
			$scope.shippingInfo.zip = $scope.billingInfo.zip;
			$scope.shippingInfo.country = $scope.billingInfo.country;
		}
	};
		     

       
}]);



