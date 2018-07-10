authorizeNet.controller('pageController', function($scope){
	$scope.searchinput = "value";

	$scope.searchButton = function(){
		//alert("pageController");
		
		alert($scope.searchinput);
	}

	$scope.refreshButton = function(){
		alert("refreshButton");
	}




});






