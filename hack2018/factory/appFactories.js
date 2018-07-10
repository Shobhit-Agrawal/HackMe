authorizeNet.factory("user", function() {
    return {
        user: {}
    }
});
authorizeNet.factory("transactionFactory", function() {
    return {
        transactionsMap: [],
        transactionsArr:[],

        sattledTransactionsArr:[],
        sattledTransactionsMap:[],

        refundedTransactionArr:[],

        unsattledTransactionArr:[],
        unsattledTransactionMap:[],
        
        voidedTransactionArr:[],
        searchedTransactionArr:[],

        currentSelTransID:"",
        currentTransactionObject:{}
    }
});
authorizeNet.factory("deviceFactory", function() {
    return {
        deviceMap: [],
        deviceArr:[],
        currentSelDeviceID:"",
        currentTransType:"",
    }
});

authorizeNet.factory('AuthInterceptor', function ($window, $q, $location,pubSubFactory) {
    return {
        request: function(config) {
            
            config.headers = config.headers || {};
            if ($window.sessionStorage.getItem('token')) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.getItem('token');
            }
            return config || $q.when(config);
        },
        response: function(response) {
            
            if (response.status === 401) {
                // TODO: Redirect user to login page.
                $location.path("/login");
            }
             
           
            return response || $q.when(response);
        }
    };
});