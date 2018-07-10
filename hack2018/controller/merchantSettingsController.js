authorizeNet.controller('merchantSettingsController', ['$scope','$http','$state','merchantSettingsService','pubSubFactory','TransactionService',function($scope,$http,$state,merchantSettingsService,pubSubFactory,TransactionService){
 
   $http.get("/mockService/merchantSettings.json", {rangeStart: "hello", rangeEnd: "me"}).then(
   		function(object) {
		// Success gives an json containing array of transaction objects 
			merchantSettingsService.setDevices(object.data.devices);
			$scope.devices = merchantSettingsService.getAllDevices(); // will return array of objects
			// pubSubFactory.publishEvent("TOGGLE_LOADER");

			$scope.displayGrid = true;
			setTimeout(resizeWindow,500);
		}, function() { 


	});	

   $scope.init = function (){
    pubSubFactory.publishEvent("TOGGLE_LOADER");

   }
 
    $scope.selectItem = function(rowItem,event){
    	TransactionService.setCurrentTransID(rowItem.entity.transactionID);
    	$state.go("transactionDetails");
    }

    function resizeWindow(){
    	var evt = document.createEvent('UIEvents');
		evt.initUIEvent('resize', true, false,window,0);
		window.dispatchEvent(evt);
        pubSubFactory.publishEvent("TOGGLE_LOADER");
    }
  
	$scope.gridData = { 
        data: 'devices',
        multiSelect:false,
       
        columnDefs: [ 
		
		{field:'id', width: 50,  displayName:'ID'},
        {field:'PhoneNumber',  displayName:'Phone Number'}, {field:'DeviceIdentifier',  displayName:'Device Identifier'},  {field:'status', displayName:'Status'}]
    };

	
  
}]);
