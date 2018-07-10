invoiceModule.directive('invoicelineitem', function($rootScope) {
    return {
        restrict: 'E',
        templateUrl: ($rootScope.isMobile ? 'invoices/view/lineItemMobile.html' : 'invoices/view/lineItemDesktop.html')
    }
});

invoiceModule.directive("invoiceList", ['$rootScope',
    function($rootScope) {
        return {
            restrict: "A",
            templateUrl: ($rootScope.isMobile ? 'invoices/view/mobileInvoiceList.html' : 'invoices/view/desktopInvoiceList.html')
        };
    }
])

//$scope.lineitemlen
