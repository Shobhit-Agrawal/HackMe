"use strict";

authorizeNet.controller('menuController', ['$scope','$rootScope','UserService','pubSubFactory','$state',function($scope,$rootScope,UserService,pubSubFactory,$state) {
    	$scope.isSubMenu = false;
        $scope.paymentLabel = $rootScope.isMobile === true?'Make Payment':'Virtual Terminal';
    	$scope.toggleSubMenu = function(){
    		$scope.isSubMenu = $scope.isSubMenu === true? false : true;
    		
    	}
        $scope.paymentHandler = function(){
            if($scope.isMobile){
                 $state.go("makePayment.choosePayment");
            }
            else{
                $state.go("makePayment.createTransactionNext");
            }
            
        }
        

/*
$scope.iconColor = ["blue", "blue", "blue", "blue", "blue"];
var i;
$scope.toggleIconColor = function(index){
	for(i=0;i<($scope.iconColor.length);i++){
		$scope.iconColor[i] = "blue";
	}
	$scope.iconColor[index] = "orange";
}
*/
    	
}]);
