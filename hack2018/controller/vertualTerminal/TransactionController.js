authorizeNet.controller('TransactionController', ['$scope','$http','$state','TransactionService','pubSubFactory','AnetAPIService',function($scope,$http,$state,TransactionService,pubSubFactory,apiService){
  
   $scope.startDate = new Date().toISOString().substring(0, 10);
   $scope.endDate = new Date().toISOString().substring(0, 10);
   $scope.settledTransCount  = 0;
    $scope.refundTransCount = 0;
    $scope.unsettledTransCount = 0;
    $scope.voidTransCount = 0 ;
   var myInterval;



    $scope.setTransactionType = function(event) {
        $scope.currentTransType = event.target.textContent.split(" Transactions")[0];
        $scope.transactions = $scope.myData = getSelectedTransTypeArray();
        $scope.displayGrid = true;
        $state.go("dashboard.transactionList");
        pubSubFactory.publishEvent("TOGGLE_LOADER");
        $scope.getPagedData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        myInterval = setInterval(resizeWindow, 700);
    }

  function feedChartData(){
     var chart1 = {};
      chart1.type = "PieChart";
      //chart1.cssStyle = "height:200px; width:300px;";
      chart1.data = {"cols": [
          {id: "type", label: "Type", type: "string"},
          {id: "transactions", label: "Count", type: "number"}
      ], "rows": [
          {c: [
              {v: "Settled Transactions"},
              {v: $scope.settledTransCount},
            
          ]},
          {c: [
              {v: "Unsettled Transactions"},
              {v: $scope.unsettledTransCount},
             
          ]},
          {c: [
              {v: "Voided Transactions"},
              {v: $scope.voidTransCount},
             

          ]},
          {c: [
              {v: "Refunded Transactions"},
              {v:  $scope.refundTransCount},
             

          ]}
      ]};

      chart1.options = {
          "displayExactValues": true
      };

      chart1.formatters = {};

      return chart1;
  }  
  function getSelectedTransTypeArray(){
    
    switch($scope.currentTransType){
      case "Settled":
        return TransactionService.getSattledTransactionArr()
        
      case "Voided":
        return TransactionService.getVoidedTransactionArr();
        
      case "Unsettled":
        return TransactionService.getUnsattledTransactionArr();
        
      case "Refunded":
        return TransactionService.getRefundedTransactionArr();
        
    }
    
  }
  function updateSettledTransactionList(){
      pubSubFactory.publishEvent("TOGGLE_LOADER");
      var promise = apiService.callSattledTransactionList();
      promise.then(function(transactionArr){ 
        $scope.settledTransCount = TransactionService.getSattledTransactionArr().length;
        $scope.refundTransCount = TransactionService.getRefundedTransactionArr().length;//alert(transactionArr[0].transId); 
        updateUnsettledTransactionList();
        //$scope.displayGrid = true;
      })
  
  }
  function updateUnsettledTransactionList(){
      var promise1 = apiService.callUnsattledTransactionList();
      promise1.then(function(transactionArr){
        //alert(TransactionService.getUnsattledTransactionArr()[0].transId); 
        $scope.unsettledTransCount = TransactionService.getUnsattledTransactionArr().length;
       
        $scope.voidTransCount = TransactionService.getVoidedTransactionArr().length;
       
        pubSubFactory.publishEvent("TOGGLE_LOADER");
        $scope.dashBoardChart = feedChartData();
        
      },function(error){
          console.log(error);
         pubSubFactory.publishEvent("TOGGLE_LOADER");
      })
  }

  function updateDashboard(){
    updateSettledTransactionList();
  };
  updateDashboard();

 


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

  var csvOpts = { columnOverrides: { obj: function (o) {
        return o.a + '|' + o.b;
  } } }
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

       
  $scope.viewTransactionSuccessMessage = "";
  
  
}]);

