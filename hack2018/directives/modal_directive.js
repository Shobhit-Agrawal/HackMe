
authorizeNet.directive('modaldirective', function() {
	return {
		restrict: 'A',
        link: function (scope, element, attrs) {
            scope.message = attrs["message"],
            scope.buttontype = attrs["buttontype"],
            scope.modalid = attrs["modalid"]
        },
        controller: function($scope, $element){
			$scope.modalmethod = function(message){
				$scope.modalmessage = message;
			}
	    },
		templateUrl: 'view/modal.html',
	}
});





authorizeNet.directive('infomodal', function() {
  return {
    restrict: 'E',
    scope:{
    	mxessage: '=',
    },
    templateUrl: 'view/infomodal.html',
  }
});



