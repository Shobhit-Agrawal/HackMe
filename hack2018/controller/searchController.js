authorizeNet.controller('searchController', ['$scope', '$state', 'pubSubFactory','TransactionService','AnetAPIService',function($scope,$state,pubSubFactory,TransactionService,apiService){
  
  $scope.startDate = (new Date(new Date().setDate(new Date().getDate()-8)));
  $scope.endDate = new Date();
  $scope.transactionType ="Settled";
  var myInterval;
 
  $scope.searchBtnHandler = function(){
    pubSubFactory.publishEvent("TOGGLE_LOADER");
    var promise;
    if($scope.transactionType==="Unsettled"){  // In case of Unsettled we can call the existing service
        promise = apiService.callUnsattledTransactionList();
        promise.then(function(transactionArr){
            $scope.myData =$scope.transactions= transactionArr;
            $scope.displayGrid = true;
            $scope.getPagedData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
            myInterval = setInterval(resizeWindow, 700);
           
            
        })
    }
    else{
      promise = apiService.searchTransactionList($scope.startDate.toISOString(),$scope.endDate.toISOString());
        promise.then(function(transactionArr){
          $scope.myData = $scope.transactions= transactionArr;
          $scope.displayGrid = true;
          myInterval = setInterval(resizeWindow, 700);
      })

    }

  }

  function resizeWindow(){
    	var evt = document.createEvent('UIEvents');
		evt.initUIEvent('resize', true, false,window,0);
		window.dispatchEvent(evt);
		pubSubFactory.publishEvent("TOGGLE_LOADER");
    clearInterval(myInterval);
  }


  $scope.getTransactionDetails = function(id){
    $scope.currTransaction = TransactionService.getTransaction(id);// will return a transaction object
    //Show details in a form 
  }
  

  
  $scope.selectItem = function(rowItem,event){
    TransactionService.setCurrentTransID(rowItem.entity.transId);
    apiService.callTransactionDetails(rowItem.entity.transId).then(function(transObject){
        $state.go("dashboard.transactionDetails");
        pubSubFactory.publishEvent("TOGGLE_LOADER");
    });
    
    pubSubFactory.publishEvent("TOGGLE_LOADER");
  }






   $scope.totalServerItems = 0;
  $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
  };
  $scope.pagingOptions = {
        pageSizes: [15,30],
        currentPage: 1,
        pageSize: 15
        
  };  
   var csvOpts = { columnOverrides: { obj: function (o) {
        return o.a + '|' + o.b;
  } } }  
 
  $scope.getPagedData = function (pageSize, page, searchText) {
    setTimeout(function () {
        var data;
        if (searchText) {
            var ft = searchText.toLowerCase();
             
                data = $scope.transactions.filter(function(item) {
                    return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                });
                $scope.setPagingData(data,page,pageSize);
                        
        } else {
           
                $scope.setPagingData($scope.transactions,page,pageSize);
           
        }
    }, 100);
  };
  
  $scope.setPagingData = function(data, page, pageSize){ 
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
  };
  $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
  }, true);
  $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
  }, true);
  
  $scope.gridData = { 
        data: 'myData',
        multiSelect:false,
        enablePaging: true,
        showFooter: true,
        totalServerItems:'totalServerItems',
        plugins: [new ngGridCsvExportPlugin(csvOpts)],
        pagingOptions: $scope.pagingOptions,
        afterSelectionChange:$scope.selectItem,
        columnDefs: [{field:'transId', displayName:'ID'}, {field:'submitTimeLocal', displayName:'Date'}, {field:'firstName', displayName:'First Name'},{field:'lastName', displayName:'Last Name'}, {field:'settleAmount', displayName:'Amount(USD)'}]
    };  

       
   $('.mydate').datepicker({
      format: 'mm-dd-yyyy'
    });
   
  
}]);
