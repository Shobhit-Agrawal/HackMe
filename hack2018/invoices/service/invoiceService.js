invoiceModule.service("InvoiceService", ['$http', '$location', 'invoiceFactory',
    function($http, $location, invoiceFactory) {
        function setInvoices(data) {
            var invoiceArr = [];
            var invoiceMap = [];
            var count = 0;
            for (i in data) {
                invoiceMap[data[i].uniqueId] = {};
                invoiceMap[data[i].uniqueId] = data[i];
                invoiceArr[count++] = data[i];
            }
            invoiceFactory.invoiceMap = invoiceMap;
            invoiceFactory.invoiceArr = invoiceArr
        }

        return {
            setInvoices: function(data) {
                setInvoices(data)
            },

            getAllInvoices: function() {
                return invoiceFactory.invoiceArr;
            },
            getInvoiceByID: function(id) {
                return invoiceFactory.invoiceMap[id];
            },
            setCurrentInvoiceID: function(id) {
                invoiceFactory.currentSelInvoiceID = id;
            },

            getCurrentInvoiceDetails: function() {

                return $http.get("/mockService/invoiceDetails.json",{uniqueId:invoiceFactory.currentSelInvoiceID}).then(function(object) {
                    //$http.get("/mockService/transaction.json").then(function(object) {
                    // Success gives an json containing array of transaction objects 
                    invoiceFactory.currentInvoiceDetails = object.data;


                    //$scope.gridData = { data: 'transactions' };
                    // show list using this transactions array
                }, function() {
                    pubSubFactory.publishEvent("TOGGLE_LOADER");
                    // Failure show msg to refine search

                });





                return invoiceFactory.invoiceMap[invoiceFactory.currentSelInvoiceID];
            },
            createInvoice: function(Obj) {

            },
            searchInvoices: function(serchObj) {

                $http.get("/mockService/invoices.json").then(function(object) {
                    //$http.get("/mockService/transaction.json").then(function(object) {
                    // Success gives an json containing array of transaction objects 
                    setInvoices(object.data.invoices);


                    //$scope.gridData = { data: 'transactions' };
                    // show list using this transactions array
                }, function() {
                    pubSubFactory.publishEvent("TOGGLE_LOADER");
                    // Failure show msg to refine search

                });


                return invoiceFactory.invoiceArr;
            },
            setCurrentInvoiceType: function(invoiceType) {
                invoiceFactory.currentInvoiceType = invoiceType;
            },
            getCurrentInvoiceType: function() {
                return invoiceFactory.currentInvoiceType;
            }

        }
    }
]);
