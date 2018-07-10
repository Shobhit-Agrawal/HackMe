
authorizeNet.controller('cardSwipeController', ['$scope','$window','pubSubFactory',function($scope,$window,pubSubFactory){
	$scope.statusText = "";
	$scope.stateCount = 0;
	$scope.showAuthorize = 'false';
	$scope.successMsg  = "";
	$scope.swipeBtnCls = "form-control col-xs-12 btn btn-custom";
	$scope.eventArr = [];
	$("#authorizePaymentPanelID").hide();
	$("#successMsgID").hide();
	$scope.resizeWindow = function(){
    	var evt = document.createEvent('UIEvents');
		evt.initUIEvent('resize', true, false,window,0);
		window.dispatchEvent(evt);
		
  }
 

	$scope.processData = function(event1,data){
		//alert(event1 +" " +data)
		/*if(data!==undefined){
			var x2js = new X2JS();
          	data = x2js.xml_str2json(data);
         }*/
		switch(event1){
				case 'cardreader.readerreadyforswipe' : // disable swipe button
					//$scope.swipeBtnCls = "form-control col-xs-12 btn btn-custom disabled";
					$("#swipeCardBtnID").attr('disabled', 'disabled');
					
					//$scope.resizeWindow();
					break;
				
				case 'cardreader.readertimedout' :// swipe timed out
					$scope.stopCardReader();
					//$scope.resizeWindow();
					break;	

				case 'cardreader.readerstarted' :// swipe happened 
					break;	
					
				case "cardreader.processedvalidswipe" : //stop swiper,
					$scope.stopCardReader();
					break;	

				
				case 'cardreader.data' :// start showing eSignature and Authorize button on press send transact command
					
					//$scope.swipeBtnCls = "form-control col-xs-12 btn btn-custom";
					$("#swipeCardBtnID").removeAttr('disabled');
					$("#swipeCardPanelID").hide();
					$("#authorizePaymentPanelID").show();
					////pubSubFactory.publishEvent("TOGGLE_LOADER");
					//$scope.showAuthorize = 'true';
					//$scope.resizeWindow();
					//alert(data);
					break;
				case 'transaction.response' :// transaction complete show good msg and transaction ID
					$("#successMsg").text($("#successMsg").text()+ data.split("transId")[1].split('}')[0]);
					$("#successMsgID").show();
					$("#swipeCardPanelID").show();
					$("#authorizePaymentPanelID").hide();
					$scope.payAmount = "";
					//pubSubFactory.publishEvent("TOGGLE_LOADER");
					break;

				case 'transaction.error' :// transaction  error, complete show a good msg 					
					$("#successMsg").text("Please try again:"+data);
					$("#successMsgID").show();
					$("#swipeCardPanelID").show();
					$("#authorizePaymentPanelID").hide();
					
					//pubSubFactory.publishEvent("TOGGLE_LOADER");
					break;


			}
			
	}
	$scope.startCardReader  =function(payAmount)
        {
        	////pubSubFactory.publishEvent("TOGGLE_LOADER");
        	if($window['ANET_CARD_READER'] != null || $window['ANET_CARD_READ'] != undefined)
            {
            	$scope.statusText += $scope.stateCount++ + "\n 1 Please swipe your card for $"+payAmount;
            	$window['ANET_CARD_READER'].startCardReader();
            }else
            {
            	$scope.statusText += "\n 2 Asked to start reader for $"+payAmount;
            }
        }
    $scope.stopCardReader  =function()
        {
        	////pubSubFactory.publishEvent("TOGGLE_LOADER");
        	if($window['ANET_CARD_READER'] != null || $window['ANET_CARD_READ'] != undefined)
            {
            	$scope.statusText += $scope.stateCount++ + "\n 22 Asked to Stop reader";
            	$window['ANET_CARD_READER'].stopCardReader();
            }else
            {
            	$scope.statusText +=  "\n  Asked to Stop reader.";
            }
        } 
    $scope.executeTransaction  = function(payment, name)
    {
    	//pubSubFactory.publishEvent("TOGGLE_LOADER");
        if($window['ANET_TRANSACTION_SYSTEM'] != null || $window['ANET_TRANSACTION_SYSTEM'] != undefined)
        {
            $window['ANET_TRANSACTION_SYSTEM'].doTransaction(payment);
        }else
        {
        	$scope.statusText += $scope.stateCount++ + "\n  Asked to do Transaction.";
        }
    }       

       
}]);



