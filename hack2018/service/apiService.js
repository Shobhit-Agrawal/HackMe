authorizeNet.service('AnetAPIService', ['$http','$q','UserService','TransactionService',function($http,$q,UserService,TransactionService) {
 
  

  // SET 1 
 // var deviceID = "ubdyl84855";
 // var transactionKey = "62dxDzq622H5BVGh";  
 // var apiKey = "62b2QKaV";
 // var sURL="https://qajadcp1d.vposdownload.qa.intra/xml/v1/request.api";
  
 // SET 2
  var apiKey="3UD6a5wF";  
  var transactionKey = "3vw4SRuE98P8hd57";
  var deviceID = "354455042072015";
  var sURL="https://apitest.authorize.net/xml/v1/request.api";  

  var batchListSattled = [];
  var batchListUnsattled = [];
  var respReceivedCount = 0;
  function callServer(xml,deferred){ 
    var deferred = $q.defer();
      $http({
        method: 'POST',
        url: sURL,
        data: xml
        }).then(function(result) {
          var x2js = new X2JS();
          deferred.resolve( x2js.xml_str2json(result.data));
        }, function(error) {
              //return error;
              deferred.reject(error);
           });
      // Return the promise to the controller
      return deferred.promise;
  }
  function getSattledBatchIds(startDate, endDate){
       
        
        var reqStr = "<?xml version='1.0' encoding='UTF-8'?><getSettledBatchListRequest xmlns='AnetApi/xml/v1/schema/AnetApiSchema.xsd'><merchantAuthentication><name>"+apiKey+"</name><transactionKey>"+transactionKey+"</transactionKey></merchantAuthentication><includeStatistics>true</includeStatistics><firstSettlementDate>"+startDate+"</firstSettlementDate><lastSettlementDate>"+endDate+"</lastSettlementDate></getSettledBatchListRequest>";
        return callServer(reqStr);
  }
  var myService = {
    login:function(userid,pwd){
        var reqStr = "<?xml version='1.0' encoding='UTF-8'?><mobileDeviceLoginRequest xmlns='AnetApi/xml/v1/schema/AnetApiSchema.xsd' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'><merchantAuthentication><name>" + userid + "</name><password>" + pwd + "</password><mobileDeviceId>" + deviceID + "</mobileDeviceId></merchantAuthentication></mobileDeviceLoginRequest>";
        return callServer(reqStr);
    },
    
    callSattledTransactionList: function(){
        // STEP 1 Get Batch IDs
        // STEP 2 Get Transaction List of all batches.
         var startDate = (new Date(new Date().setDate(new Date().getDate()-8))).toISOString();
        var endDate = new Date().toISOString();
        var response = getSattledBatchIds(startDate,endDate);
        var transResponseArrays=[];  // it hold all the transaction arrays 
        var transDeferred = $q.defer();
        
        response.then(function(result) {
           if (result.getSettledBatchListResponse.messages.resultCode === "Error") {
                  // TO DO error handling logging.
            } else {
              if(result.getSettledBatchListResponse.batchList!=undefined){
                 var resBatchList;
                if(result.getSettledBatchListResponse.batchList.batch.batchId!=undefined) // if a single batch comes
                {
                  resBatchList = [result.getSettledBatchListResponse.batchList.batch];
                }
                else{ // or a array of batch comes
                 resBatchList  = result.getSettledBatchListResponse.batchList.batch;
                }
                batchListSattled = []; // refreshing the batchListSattled 
                for(var i in resBatchList)
                {
                    batchListSattled.push(resBatchList[i].batchId);
                     var reqStr = "<getTransactionListRequest xmlns='AnetApi/xml/v1/schema/AnetApiSchema.xsd'><merchantAuthentication><name>"+apiKey+"</name><transactionKey>"+transactionKey+"</transactionKey></merchantAuthentication><batchId>"+resBatchList[i].batchId+"</batchId></getTransactionListRequest>"
                     var deferred = $q.defer();
                     callServer(reqStr).then(function(result){
                        if(result.getTransactionListResponse == undefined || result.getTransactionListResponse.messages.resultCode === "Error") {
                              // TO DO error handling logging.
                              transResponseArrays.push([]);
                        } else {
                           transResponseArrays.push(result.getTransactionListResponse.transactions.transaction instanceof Array?result.getTransactionListResponse.transactions.transaction : [result.getTransactionListResponse.transactions.transaction]);
                            //transResponseArrays.push(result.getTransactionListResponse.transactions.transaction);
                            if(transResponseArrays.length === batchListSattled.length){
                                transResponseArrays =  transResponseArrays.reduce(function(a, b){return a.concat(b);  });
                                TransactionService.setSattledTransactions(transResponseArrays)
                                transDeferred.resolve(TransactionService.getSattledTransactionArr());
                            }
                            
                        }
                     });
                 }
               }else{
                transDeferred.resolve([]);
               }

            }
        });
        
        return transDeferred.promise;

    },
    callUnsattledTransactionList: function(){
       var reqStr = "<getUnsettledTransactionListRequest xmlns='AnetApi/xml/v1/schema/AnetApiSchema.xsd'><merchantAuthentication><name>"+apiKey+"</name><transactionKey>"+transactionKey+"</transactionKey></merchantAuthentication></getUnsettledTransactionListRequest>"
       var deferredUnsattled = $q.defer();
       callServer(reqStr).then(function(result){
          if(result.getUnsettledTransactionListResponse.messages.resultCode === "Error") {
                // TO DO error handling logging.
                deferredUnsattled.reject(result);
          } else {
                  TransactionService.setUnsettledTransactions(result.getUnsettledTransactionListResponse.transactions.transaction)
                  deferredUnsattled.resolve(TransactionService.getUnsattledTransactionArr());
             
          }
       });
      return deferredUnsattled.promise;
    },
    callTransactionDetails : function(transId){
      // transId = "2214266322";
       var reqStr = "<getTransactionDetailsRequest xmlns='AnetApi/xml/v1/schema/AnetApiSchema.xsd'><merchantAuthentication><name>"+apiKey+"</name><transactionKey>"+transactionKey+"</transactionKey></merchantAuthentication><transId>"+transId+"</transId></getTransactionDetailsRequest>"
       var deferredUnsattled = $q.defer();
       callServer(reqStr).then(function(result){
          if(result.getTransactionDetailsResponse.messages.resultCode === "Error") {
                // TO DO error handling logging.
          } else {
                  TransactionService.setCurrentTransactionDetails(result.getTransactionDetailsResponse.transaction)
                  deferredUnsattled.resolve(TransactionService.getCurrentTransactionDetails());
             
          }
       });
      return deferredUnsattled.promise;

    },
    submitTransaction : function(cardDetails, billingInfo, shippingInfo){
       var reqStr = "<createTransactionRequest xmlns='AnetApi/xml/v1/schema/AnetApiSchema.xsd'><merchantAuthentication><name>"+apiKey+"</name><transactionKey>"+transactionKey+"</transactionKey></merchantAuthentication><transactionRequest><transactionType>authCaptureTransaction</transactionType><amount>"+cardDetails.amount+"</amount><payment><creditCard><cardNumber>"+cardDetails.cardNumber+"</cardNumber><expirationDate>122016</expirationDate><cardCode>"+cardDetails.cardCode+"</cardCode></creditCard></payment>       <poNumber>"+billingInfo.invoiceId+"</poNumber><billTo><firstName>"+billingInfo.firstName+"</firstName><lastName>"+billingInfo.lastName+"</lastName><company>"+billingInfo.company+"</company><address>"+billingInfo.address+"</address><city>"+billingInfo.city+"</city><state>"+billingInfo.state+"</state><zip>"+billingInfo.zip+"</zip><country>"+billingInfo.country+"</country></billTo>       <shipTo><firstName>"+shippingInfo.firstName+"</firstName><lastName>"+shippingInfo.lastName+"</lastName><company>"+shippingInfo.company+"</company><address>"+shippingInfo.address+"</address><city>"+shippingInfo.city+"</city><state>"+shippingInfo.state+"</state><zip>"+shippingInfo.zip+"</zip><country>"+shippingInfo.country+"</country></shipTo><retail><marketType>2</marketType><deviceType>1</deviceType></retail><transactionSettings><setting><settingName>testRequest</settingName><settingValue>false</settingValue></setting></transactionSettings></transactionRequest></createTransactionRequest>";
       var deferredUnsattled = $q.defer();
       callServer(reqStr).then(function(result){
          if(result.createTransactionResponse.messages.resultCode === "Error") {
                // TO DO error handling logging OR Reporting in Right channel.
                deferredUnsattled.resolve(result.createTransactionResponse.transactionResponse.errors.error.errorText);
          } else {
                  
                 // TransactionService.setCurrentTransactionDetails(result.getTransactionDetailsResponse.transaction)
                  deferredUnsattled.resolve(result.createTransactionResponse.transactionResponse.transId+"  : "+result.createTransactionResponse.transactionResponse.messages.message.description);
             
          }
       });
      return deferredUnsattled.promise;

    },
    searchTransactionList:function(startDate,endDate){
      // STEP 1 Get Batch IDs
        // STEP 2 Get Transaction List of all batches.
        var response = getSattledBatchIds(startDate,endDate);
        var transResponseArrays=[];  // it hold all the transaction arrays 
        var transDeferred = $q.defer(startDate,endDate);
        
        response.then(function(result) {
           if (result.getSettledBatchListResponse.messages.resultCode === "Error") {
                  // TO DO error handling logging.
            } else {
                if(result.getSettledBatchListResponse.batchList!=undefined){
                  var resBatchList;
                  if(result.getSettledBatchListResponse.batchList.batch.batchId!=undefined) // if a single batch comes
                  {
                    resBatchList = [result.getSettledBatchListResponse.batchList.batch];
                  }
                  else{ // or a array of batch comes
                   resBatchList  = result.getSettledBatchListResponse.batchList.batch;
                  }
                   batchListSattled = []; // refreshing the batchListSattled 
                   for(var i in resBatchList)
                   {
                      batchListSattled.push(resBatchList[i].batchId);
                       var reqStr = "<getTransactionListRequest xmlns='AnetApi/xml/v1/schema/AnetApiSchema.xsd'><merchantAuthentication><name>"+apiKey+"</name><transactionKey>"+transactionKey+"</transactionKey></merchantAuthentication><batchId>"+resBatchList[i].batchId+"</batchId></getTransactionListRequest>"
                       var deferred = $q.defer();
                       callServer(reqStr).then(function(result){
                          if(result.getTransactionListResponse.messages.resultCode === "Error") {
                                // TO DO error handling logging.
                          } else {
                             transResponseArrays.push(result.getTransactionListResponse.transactions.transaction instanceof Array?result.getTransactionListResponse.transactions.transaction : [result.getTransactionListResponse.transactions.transaction]);
                             if(transResponseArrays.length === batchListSattled.length){
                                  transResponseArrays =  transResponseArrays.reduce(function(a, b){return a.concat(b);  });
                                  TransactionService.setSearchedTransactions(transResponseArrays)
                                  transDeferred.resolve(TransactionService.getSearchedTransactionArr());
                              }
                          }
                       });
                    }
                }
             else{
                   transDeferred.resolve([]);
             }
            }
        });
        
        return transDeferred.promise;
     

    },
    voidCurrentTransaction : function(transId){
      var reqStr = "<createTransactionRequest xmlns='AnetApi/xml/v1/schema/AnetApiSchema.xsd'><merchantAuthentication><name>"+apiKey+"</name><transactionKey>"+transactionKey+"</transactionKey></merchantAuthentication><transactionRequest><transactionType>voidTransaction</transactionType><refTransId>"+transId+"</refTransId></transactionRequest></createTransactionRequest>"
       var deferredUnsattled = $q.defer();
       callServer(reqStr).then(function(result){
          if(result.createTransactionResponse.messages.resultCode === "Error") {
                // TO DO error handling logging.
                 deferredUnsattled.resolve(result.createTransactionResponse.messages.message.text);
          } else {
                 
                  deferredUnsattled.resolve(result.createTransactionResponse.transactionResponse.messages.message.description);
             
          }
       });
      return deferredUnsattled.promise;

    },
    refundCurrentTransaction: function(transObject){
       var reqStr = "<createTransactionRequest xmlns='AnetApi/xml/v1/schema/AnetApiSchema.xsd'><merchantAuthentication><name>"+apiKey+"</name><transactionKey>"+transactionKey+"</transactionKey></merchantAuthentication><transactionRequest><transactionType>refundTransaction</transactionType><amount>"+transObject.authAmount+"</amount>    <payment><creditCard><cardNumber>"+transObject.payment.creditCard.cardNumber.substring(transObject.payment.creditCard.cardNumber.length-4,transObject.payment.creditCard.cardNumber.length)+"</cardNumber><expirationDate>XXXX</expirationDate></creditCard></payment><refTransId>"+transObject.transId+"</refTransId></transactionRequest></createTransactionRequest>"
       var deferred = $q.defer();
       callServer(reqStr).then(function(result){
          if(result.createTransactionResponse.messages.resultCode === "Error") {
                // TO DO error handling logging.
                //var msg = result.createTransactionResponse.messages.message.text;
                  deferred.resolve(result.createTransactionResponse.transactionResponse.errors.error.errorText);
          } else {
                 
                  deferred.resolve(result.createTransactionResponse.transactionResponse.messages.message.description);
             
          }
       });
      return deferred.promise;

    }

  };
  return myService;
}]);

