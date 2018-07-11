	"use strict";
if ( 'function' !== typeof Array.prototype.reduce ) {
  Array.prototype.reduce = function( callback /*, initialValue*/ ) {
    'use strict';
    if ( null === this || 'undefined' === typeof this ) {
      throw new TypeError(
         'Array.prototype.reduce called on null or undefined' );
    }
    if ( 'function' !== typeof callback ) {
      throw new TypeError( callback + ' is not a function' );
    }
    var t = Object( this ), len = t.length >>> 0, k = 0, value;
    if ( arguments.length >= 2 ) {
      value = arguments[1];
    } else {
      while ( k < len && ! k in t ) k++; 
      if ( k >= len )
        throw new TypeError('Reduce of empty array with no initial value');
      value = t[ k++ ];
    }
    for ( ; k < len ; k++ ) {
      if ( k in t ) {
         value = callback( value, t[k], k, t );
      }
    }
    return value;
  };
}

//screen.lockOrientation('landscape');
var authorizeNet = angular.module("authorizeNet",['ui.router','ngAnimate','ngGrid','ui.bootstrap','ui.mask','googlechart']);//,'invoices'
authorizeNet.config(function($stateProvider,$urlRouterProvider) {
	 $urlRouterProvider.otherwise("login");

	

	$stateProvider
	
		.state('about', {
			url:"/about",
			templateUrl : 'view/about.html'
			//controller  : 'aboutController'
		})
		
		// route for the tools page
		.state('login',{
			url:"/login",
			templateUrl:'view/loginPage.html',
			
		})
		.state('createTransactionAccordian',{
			url:"/createTransactionAccordian",
			templateUrl:'view/virtualTerminal/createTransactionAccordian.html'
		})
		.state('createTransactionTabs',{
			url:"/createTransactionTabs",
			templateUrl:'view/virtualTerminal/createTransactionTabs.html'
		})
		.state('searchTransaction',{
			url:"/searchTransaction",
			templateUrl:'view/virtualTerminal/searchTransaction.html',
			controller:'searchController'
			
			
		})
		.state('mobileDeviceManagement',{
			url:"/mobileDeviceManagement",
			templateUrl:'view/settings/MobileDeviceManagementPage.html'
		})
		.state('branding',{
			url:"/branding",
			templateUrl:'view/settings/Branding.html'
		})
		.state('translate',{
			url:"/translate",
			templateUrl:'view/settings/Translate.html'
		})
		.state('hackDashboard',{
			url:"/hackDashboard",
			templateUrl:'view/hackDashboard.html'
		})
		.state('liveFeed',{
			abstract: true,
			templateUrl:'view/liveFeed/liveFeed.html'
//controller:'liveFeedController'
		})
		.state('liveFeed.liveFeedList',{
			url:"/liveFeedList",
			templateUrl:'view/liveFeed/liveFeedList.html'
		})
		.state('liveFeed.liveFeedType',{
			url:"/liveFeed.liveFeedType",
			templateUrl:'view/liveFeed/liveFeedType.html'
		})
		.state('fraud',{
			abstract: true,
			templateUrl:'view/fraud/fraud.html'
//controller:'liveFeedController'
		})
		.state('fraud.fraudList',{
			url:"/fraud.fraudList",
			templateUrl:'view/fraud/fraud.html'
		})
		.state('fraud.fraudDetails',{
			url:"/fraud.fraudDetails",
			templateUrl:'view/fraud/fraudDetails.html'
		})
		.state('dailySummary',{
			url:"/dailySummary",
			templateUrl:'view/dailySummary.html'
		})
		.state('OAuthLogin',{
			url:"/oAuthLogin",
			templateUrl:'view/OAuthLogin.html'
		})
		.state('setUp',{
			url:"/setUp",
			templateUrl:'view/setUp.html'
		})
		.state('mintSettings',{
			url:"/mintSettings",
			templateUrl:'view/settings.html'
		})
		.state('pageSetup',{
			url:"/pageSetup",
			templateUrl:'view/pageSetup.html',
			controller:'pageSetupController'
		})				
		.state('dashboard.transactionDetails',{
			url:"/details",
			templateUrl:'view/virtualTerminal/transactionDetails.html'
		})
		.state('dashboard',{
			abstract: true,
			templateUrl:'view/dashboard/dashboard.html',
			controller:'TransactionController'
		})
			.state('dashboard.transactionType',{
			url:"/dashboard.transactionType",
			templateUrl:'view/dashboard/transactionType.html'
		})
		.state('dashboard.transactionList',{
			url:"/transactionList",
			templateUrl:'view/dashboard/transactionList.html'
		})
		.state('makePayment',{
			abstract: true,
			templateUrl:'view/virtualTerminal/makePaymentBase.html',
			controller:'createTransactionController'
		})
		.state('makePayment.choosePayment',{
			url:"/makePayment.choosePayment",
			templateUrl:'view/virtualTerminal/choosePayment.html'
		})
		.state('makePayment.payByCard',{
			url:"/makePayment.payByCard",
			templateUrl:'view/virtualTerminal/payByCard.html'
		})
		.state('makePayment.createTransactionNext',{
			url:"/makePayment.createTransactionNext",
			templateUrl:'view/virtualTerminal/createTransactionNext.html'
		})
});



// Register AuthInterceptor.
authorizeNet.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});

authorizeNet.config(function($httpProvider) {

  $httpProvider.defaults.headers.post['Content-Type'] =  'text/xml';
    
  //  $http.defaults.useXDomain = true;
//	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

function sendtoNative(msg) {
	if(window.JSToAndroidInterface !==undefined && msg.indexOf('handShake') === -1 ){
			window.JSToAndroidInterface.sendMessage(msg);
	}
	else if (window.webkit !== undefined)
			window.webkit.messageHandlers.iosMessenger.postMessage(msg);
	//else alert("Andorid and iOS Not found");
}


