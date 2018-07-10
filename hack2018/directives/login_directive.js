"use strict";

// Directives
authorizeNet.directive('loginPage', function() { 
	return { 
		restrict: 'A', 
		templateUrl: 'view/loginPage.html',
		controller:'LoginController'
	}; 
});

authorizeNet.directive('menu', function() { 
	return { 
		restrict: 'A', 
		templateUrl: 'view/menu.html' 
	}; 
});

authorizeNet.directive('forgotpassword', function() { 
	return { 
		restrict: 'A', 
		templateUrl: 'view/forgotPassword.html'
	}; 
});
authorizeNet.directive('headerbar', function() { 
 return { 
  restrict: 'A', 
  templateUrl: 'view/headerbar.html'
 }; 
});

authorizeNet.directive("centered", function() {
  return {
		restrict : "ECA",
		transclude : true,
		template : "<div class=\"angular-center-container\">\
						<div class=\"angular-centered\" ng-transclude>\
						</div>\
					</div>"
	};
})


authorizeNet.directive("loader", function() {
  return {
		restrict : "E",
		template : " <div  class=\"loaderContainer\">\
					    <div class=\"loaderbg\">Loading...</div>\
					    <div class=\"loader\"></div>\
					</div>"
	};
})



