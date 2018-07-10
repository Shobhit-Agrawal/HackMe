authorizeNet.factory('pubSubFactory', ['$rootScope', function ($rootScope) {
        // publish The Event notification
        var publishEvent = function (eName,msg) {
            $rootScope.$broadcast(eName,msg);
        };
        //subscribe to Event notification
        var subscribeEvent = function(eName,$scope, handler) {
            $scope.$on(eName, function(event) {
               handler(event);
            });
        };
        
        // return the publicly accessible methods
        return {
            publishEvent: publishEvent,
            subscribeEvent: subscribeEvent
        };
    }])