authorizeNet.service("TransactionService", ['$http', '$location', 'transactionFactory',function($http, $location, transactionFactory) {
 return {
    setSattledTransactions: function(transactionList) {
     
      transactionFactory.sattledTransactionsMap = [];
      transactionFactory.sattledTransactionsArr = [];
      transactionFactory.refundedTransactionArr = []; 

      for (var i=0,refundCount=0;i<transactionList.length; i++)
      {
        if(transactionList[i].transactionStatus === "refundSettledSuccessfully" ){
  
          transactionFactory.refundedTransactionArr[refundCount++] = transactionList[i];
        }

        transactionFactory.sattledTransactionsMap[transactionList[i].transId]  = {};
        transactionFactory.sattledTransactionsMap[transactionList[i].transId] = transactionList[i];
        transactionFactory.sattledTransactionsArr[i] = transactionList[i];
      }
      
    },

    setUnsettledTransactions: function(transactionList) {

      transactionFactory.unsattledTransactionArr=[];
      transactionFactory.unsattledTransactionMap=[];
      transactionFactory.voidedTransactionArr=[];
        
      for (var i=0,voidcount=0;i<transactionList.length; i++)
      {
        if(transactionList[i].transactionStatus === "voided" ){
            transactionFactory.voidedTransactionArr[voidcount++] = transactionList[i];
        }
        transactionFactory.unsattledTransactionMap[transactionList[i].transId]  = {};
        transactionFactory.unsattledTransactionMap[transactionList[i].transId] = transactionList[i];
        transactionFactory.unsattledTransactionArr[i] = transactionList[i];
      }
    
    },
    setSearchedTransactions: function(transactionList) {
      transactionFactory.searchedTransactionArr=transactionList;
    },


    getSattledTransactionArr: function(){
      return transactionFactory.sattledTransactionsArr;
    },

    getUnsattledTransactionArr: function(){
      return transactionFactory.unsattledTransactionArr;
    },

    getRefundedTransactionArr: function(){
       return transactionFactory.refundedTransactionArr;
    },
    getVoidedTransactionArr: function(){
       return transactionFactory.voidedTransactionArr;
    },

    getSattledTransactionMap:function(id){
      return transactionFactory.sattledTransactionsMap[id];
    },
    getSearchedTransactionArr:function(){
      return transactionFactory.searchedTransactionArr;
    },
    setCurrentTransID:function(id){
      transactionFactory.currentSelTransID = id;
    },
    getCurrentTransID:function(){
      return  transactionFactory.currentSelTransID;
    },
    setCurrentTransType: function (trasactionType){
    	transactionFactory.currentTransType = trasactionType;
    },
    setCurrentTransactionDetails:function(obj){
      transactionFactory.currentTransactionObject = obj;
    },
    getCurrentTransactionDetails:function(){
      return transactionFactory.currentTransactionObject;
    }

 }
}]);