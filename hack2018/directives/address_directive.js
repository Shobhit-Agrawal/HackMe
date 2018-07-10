authorizeNet.directive('addressform', function() {
    return {
        restrict: 'A',
        scope: {
            mycurrmodel: '=',
            currform: '='
        },

        templateUrl: 'view/addressform.html'
    }
});
