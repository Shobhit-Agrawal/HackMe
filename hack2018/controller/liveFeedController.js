authorizeNet.controller('LiveFeedController', ['$scope','$http','$state','AnetAPIService',function($scope,$http,$state,apiService){
  
     
    $scope.setTransactionType = function() {
       // $scope.currentTransType = event.target.textContent.split(" Transactions")[0];
        //$scope.transactions = $scope.myData = getSelectedTransTypeArray();
        //$scope.displayGrid = true;
        $state.go("liveFeed.liveFeedList");
        //pubSubFactory.publishEvent("TOGGLE_LOADER");
        //$scope.getPagedData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        //myInterval = setInterval(resizeWindow, 700);
    }
       
  $scope.viewTransactionSuccessMessage = "";
  
}]);

