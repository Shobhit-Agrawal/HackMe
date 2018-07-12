"use strict";

authorizeNet.controller('appController', ['$scope','$rootScope','UserService','pubSubFactory','user','$state','$location',function($scope,$rootScope,UserService,pubSubFactory,user,$state,$location){
        
       $scope.showMenu = false;
       $rootScope.isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
       $scope.isAuthenticated = UserService.isAuthenticated();
       $scope.AfterAuthClass = UserService.isAuthenticated() ? "col-xs-12 col-sm-8 col-md-9":"col-xs-12 col-sm-12 col-md-3";
       $scope.shadeshowhide = "shadeHide" 
       $scope.showLoader = false;
       $scope.menuShow = "hidden-xs";


       $scope.initApp = function () {
           $scope.user = user;
          
           $scope.isAuthenticated = false;
	       	if(! $scope.isAuthenticated) {
            $location.path("/login");
          
		        
		    }
		    else{
		    	UserService.setUser();
		    	$scope.userName = UserService.getUser().name;
          var currURLPath = $location.path();
          if(currURLPath==="" || currURLPath ==="/login"){
                $location.path("/dashboard.transactionType"); 
          }
		    }

       }
       var toggleLoader = function(){
       		$scope.showLoader  =  $scope.showLoader ===false ?  true  : false;
       }

        $scope.toggleMenu = function(){
        	$scope.showMenu = $scope.showMenu === "active" ? "" : "active";
        	$scope.menuShow = $scope.menuShow === "hidden-xs" ? "show" : "hidden-xs";
        	$scope.shadeshowhide = $scope.shadeshowhide === "shadeHide" ? "shadeShow" : "shadeHide";
        }
        $scope.hideMenu = function(){
          $scope.showMenu = "";
          $scope.menuShow = "hidden-xs";
          $scope.shadeshowhide = "shadeHide";
        }
        $scope.logout = function(){
        	UserService.endSession();
        //	pubSubFactory.publishEvent("ON_LOGIN_UPDATE");
        	$state.go("login");
        }
      
       

	    

	    var loginSuccessHandler = function(){
	    	$scope.AfterAuthClass = UserService.isAuthenticated() ? "col-xs-12 col-sm-8 col-md-9" : "col-xs-12 col-sm-12 col-md-3";
	    	$scope.isAuthenticated = UserService.isAuthenticated();
	    	$scope.userName = UserService.getUser().name;
	    	$state.go("dashboard.transactionType"); 
	    }
	    pubSubFactory.subscribeEvent("ON_LOGIN_UPDATE", $scope, loginSuccessHandler);
	    pubSubFactory.subscribeEvent("TOGGLE_LOADER", $scope, toggleLoader);

        

      // GLOBAL UI CONTROLS ///////////////////////////////////////////////////////////////////////////////////////////////////////////
      var vr = $rootScope.isMobile?"Make Payment":"Virtual Terminal";
      $scope.currentPageHeaderArr = ["Set Up", vr, "Transactions", "Settings"];
      $scope.currentPageIconArr = ["fa fa-cog", "fa fa-university", "fa fa-retweet", "fa fa-cog"];
      $scope.currentPageMenuIcon =  ["orange", "blue", "blue", "blue"];

      $scope.currentPageHeader = $scope.currentPageHeaderArr[0];
      $scope.currentPageIcon = $scope.currentPageIconArr[0];
      $scope.storedTabIndex = 0;

      $scope.togglePageHeader = function($index){
        if($index != $scope.storedTabIndex){
          $scope.currentPageHeader = $scope.currentPageHeaderArr[$index];
          $scope.currentPageIcon = $scope.currentPageIconArr[$index];
          $scope.currentPageMenuIcon[$index] = "orange";
          $scope.currentPageMenuIcon[$scope.storedTabIndex] = "blue";
          $scope.storedTabIndex = $index;
        }
      }

      // FAKE BRANDING TO SHOW THAT YOU CAN AT LEAST DO IT, THOUGH PROBABLY NOT LIKE THIS EXACTLY 
      $scope.customCSSoverrideid = "";
      $scope.changeBrand = function(value){
        if($scope.customCSSoverrideid == value){
          $scope.customCSSoverrideid = "";
        }else{
          $scope.customCSSoverrideid = value; // this is a unique id for a seperate CSS file with the branding, it is included in index.html

        }
      }


}]);
