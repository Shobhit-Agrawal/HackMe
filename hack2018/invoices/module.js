"use strict";


var invoiceModule = angular.module("invoices", []);
invoiceModule.config(function($stateProvider, $urlRouterProvider) {


    $stateProvider
    // route for the settings page

    .state('invoice', {
        abstract: true,
        templateUrl: 'invoices/view/invoiceBase.html'
    })
        .state('invoice.dashboard', {
            url: "/invoice.dashboard",
            templateUrl: 'invoices/view/invoiceDashboard.html'
        })
        .state('invoice.CreateInvoices', {
            url: "/invoice.CreateInvoices",
            templateUrl: 'invoices/view/createInvoices.html'
        })
        .state('invoice.CreateInvoices2', {
            url: "/invoice.CreateInvoices2",
            templateUrl: 'invoices/view/createInvoices2.html'
        })
        .state('invoice.SearchInvoices', {
            url: "/invoice.SearchInvoices",
            templateUrl: 'invoices/view/searchInvoices.html'
            //controller  : 'aboutController'
        })
        .state('invoice.Settings', {
            url: "/invoice.Settings",
            templateUrl: 'invoices/view/invoiceSettings.html'
            //controller  : 'aboutController'
        })
        .state('invoice.Details', {
            url: "/invoice.DetailsInvoice",
            templateUrl: 'invoices/view/invoiceDetails.html'
            //controller  : 'aboutController'
        })
        .state('invoice.ItemManager', {
            url: "/invoice.ItemManager",
            templateUrl: 'invoices/view/itemManager.html'
            //controller  : 'aboutController'
        })
        .state('invoice.InvoiceList', {
            url: "/invoice.InvoiceList",
            templateUrl: 'invoices/view/invoiceList.html'
            //controller  : 'aboutController'
        })
    // route for the tools page

});

invoiceModule.filter('capitalize', function() {
    return function(input, scope) {
        if (input != null)
            input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
});
