authorizeNet.service("merchantSettingsService", ['$http', 'deviceFactory',function($http, deviceFactory) {
 return {
    setDevices: function(data) {
      var deviceArr = [];
      var deviceMap = [];
      var count = 0;
      for (i in data)
      {
        deviceMap[data[i].transactionID]  = {};
        deviceMap[data[i].transactionID] = data[i];
        deviceArr[count++] = data[i];
      }
      deviceFactory.deviceMap = deviceMap;
      deviceFactory.deviceArr = deviceArr;
    },

    getAllDevices: function() {
     return deviceFactory.deviceArr;
    },
    getDevice:function(id){
      return deviceFactory.deviceMap[id];
    },
    setCurrentDeviceID:function(id){
      deviceFactory.currentSelDeviceID = id;
    },
    getCurrentDeviceObject:function(){
      return deviceFactory.deviceMap[deviceFactory.currentSelDeviceID];
    }

 }
}]);