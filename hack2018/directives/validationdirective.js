
authorizeNet.directive('validationdir', function() {
	function thecontroller($scope, $element, $attrs) {
		$scope.errjson = {
			"number": "Please enter a number", 
			"required": "This field is required", 
			"email": "Please enter a valid email", 
			"ccv": "Please enter a valid ccv", 
			"zip": "Please enter a valid zip", 
			"ccnum": "Please enter a valid credit card number", 
			"amount": "Please enter a valid amout."
		};
	}
	return {
		restrict: 'A',
		scope: {
			currelement: '=', 
			currelementvalue: '=', 
			inputtype: '=', 
			isreq: '=' 
		},
		
		templateUrl: 'view/validationdir.html',
		controller: thecontroller
	}
});



/*authorizeNet.directive('passwordValidate', function() {
	
		var regExpRules=[];
		regExpRules['creditCardNumber'] = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/
		regExpRules['number'] = /^[0-9]+$/;
		regExpRules['amount'] = /^[0-9]+$/;
		regExpRules['ccv'] = /^[0-9]{3,4}$/;
		
	
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
           ctrl.$parsers.unshift(function(viewValue) {
           scope.validationRules = attrs.validations.split(',');
           
            for(var i in scope.validationRules){
                if(!regExpRules[scope.validationRules[i]].test(viewValue)) {
                	ctrl.$setValidity('regexValidate', false);
                	return undefined
                }
                
            }

            ctrl.$setValidity('regexValidate', true);
            return viewValue
            });
        }
    };
});
*/

authorizeNet.directive('ccissuernameget', function() {
	function thecontroller($scope, $element, $attrs) {

		$scope.getCardIssuer = function(cardnum){

			var patt = new RegExp("^4[0-9]{12}(?:[0-9]{3})?$");
			var res = patt.test(cardnum);
			if(res){return "5px";} // visa

			var patt = new RegExp("^5[1-5][0-9]{14}$");
			var res = patt.test(cardnum);
			if(res){return "-50px";} // mastercard

			var patt = new RegExp("^3[47][0-9]{13}$");
			var res = patt.test(cardnum);
			if(res){return "-99px";} // amex

			var patt = new RegExp("^3(?:0[0-5]|[68][0-9])[0-9]{11}$");
			var res = patt.test(cardnum);
			if(res){return "Diners Club";}

			var patt = new RegExp("^6(?:011|5[0-9]{2})[0-9]{12}$");
			var res = patt.test(cardnum);
			if(res){return "-147px";} // discover

			var patt = new RegExp("^(?:2131|1800|35\d{3})\d{11}$");
			var res = patt.test(cardnum);
			if(res){return "JCB";}

			return "50px";
		}
	}
	return {
		restrict: 'A',
		scope: {
			currelementvalue: '=', 
			currelement: '='
		},
		template: '<div style="left:-5px; top: -30px; position:relative; float:right; display: inline-block;background: url(/assets/img/cardImages.jpg); background-position: {{getCardIssuer(currelementvalue)}} 0px; width: 46px; height:28px ;background-size:188px;background-repeat: no-repeat;outline:0;">', 
		controller: thecontroller
	}
});


angular.module('ng').filter('ccn', function () {
    return function (ccn) {
    	//$scope.cardDetails.cardNumber = (ccn.substr(0, 4) + "-" + ccn.substr(4, 4) + "-" + ccn.substr(8, 4) + "-" + ccn.substr(12, 4));
        return (ccn.substr(0, 4) + "-" + ccn.substr(4, 4) + "-" + ccn.substr(8, 4) + "-" + ccn.substr(12, 4));
    };
});



