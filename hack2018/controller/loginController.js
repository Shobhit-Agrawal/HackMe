authorizeNet.controller("LoginController", ['$http', '$location', '$scope', 'pubSubFactory', 'UserService', 'user', 'AnetAPIService', function($http, $location, $scope, pubSubFactory, UserService, user, apiService) {
    $scope.username = "";
    $scope.password = "";
    $scope.showLoginForm = true;
    $scope.showForgotPasswordForm = true;
    
    
    $scope.login = function(username, password) {

        

        $scope.hideMenu();
        $scope.username = username;
        $scope.password = password;
        pubSubFactory.publishEvent("TOGGLE_LOADER");
        var response = apiService.login(username,password);
        response.then(function(result) {
            pubSubFactory.publishEvent("TOGGLE_LOADER");
            if (result.mobileDeviceLoginResponse.messages.resultCode === "Error") {
                $scope.isAuthError = true;
            } else {
                UserService.setSessionToken(result.mobileDeviceLoginResponse.sessionToken);
                UserService.setUser();
                pubSubFactory.publishEvent("ON_LOGIN_UPDATE");
            }
           


        });
    }
    $scope.finishedResetPassword = function() {
        $scope.showLoginForm = true;
        $scope.showForgotPasswordForm = true;
    };

}]);
