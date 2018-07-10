invoiceModule.controller('invoiceController', ['$scope', '$rootScope', '$http', '$state', '$compile', 'InvoiceService', 'pubSubFactory','invoiceFactory',
    function($scope, $rootScope, $http, $state, $compile, InvoiceService, pubSubFactory,invoiceFactory) {
        $rootScope.isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

        $scope.searchInvoice = {
            invoiceID: "",
            dateRangeStart: "",
            dateRangeEnd: "",
            recipientEmail: "",
            recipientName: "",
            status: "",
            businessName: ""

        };
        $scope.createInvoice = {
            email: "",
            invoiceNumber: "",
            dateOfIssue: "",
            discount: "",
            firstName: "",
            lastName: ""
        };
        $scope.invoiceLineItems = [];
        

        /* Item Class */

        function Item() {
            this.itemID = "", this.itemName = "adfadf", this.description = "", this.quantity = "0", this.unitPrice = "0.00";
        }

        $scope.currLineItem = new Item();
        $scope.searchInvoice.dateRangeStart = new Date().toISOString().substring(0, 10);
        $scope.searchInvoice.dateRangeEnd = new Date().toISOString().substring(0, 10);

        $scope.showInvoiceListByStatus = function(event) {
            pubSubFactory.publishEvent("TOGGLE_LOADER"); //start showing loader
            InvoiceService.setCurrentInvoiceType($scope.currentSelectedInvoiceStatus = event.target.textContent.split("Invoices")[0]);

            $state.go("invoice.InvoiceList");
        }

        $scope.addlineitem = function() {

            if ($rootScope.isMobile) {
                $scope.invoiceLineItems[$scope.invoiceLineItems.length] = $scope.currLineItem;
                $scope.currLineItem = new Item();
            } else {
                $scope.invoiceLineItems[$scope.invoiceLineItems.length] = new Item();
            }
            $scope.computeAndDisplayLineItemTotal();
        }
        $scope.showdropdown = function(index) {
            $("#dropdown" + index).toggle();
        }

        $scope.initDashBoard = function() {

            var searchInvoice = {
                invoiceID: "",
                dateRangeStart: new Date('April 13,2014'),
                dateRangeEnd: new Date('May 13,2014'),
                recipientEmail: "",
                recipientName: "",
                status: "",
                businessName: ""
            }
            $scope.invoices = InvoiceService.searchInvoices(searchInvoice);

        }

        $scope.searchBtnHandler = function() {
            pubSubFactory.publishEvent("TOGGLE_LOADER");

            $scope.callService();

            $scope.displayGrid = true;
        }

        $scope.callService = function() {
            $http.get("/mockService/invoices.json", {
                rangeStart: $scope.startDate,
                rangeEnd: $scope.endDate
            }).then(function(object) {
                // Success gives an json containing array of transaction objects 
                InvoiceService.setInvoices(object.data.invoices);
                $scope.invoices = InvoiceService.getAllInvoices(); // will return array of objects
                setTimeout(resizeWindow, 500);
            }, function() {
                pubSubFactory.publishEvent("TOGGLE_LOADER");
                // Failure show msg to refine search

            });
        }


        function resizeWindow() {
            var evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
            pubSubFactory.publishEvent("TOGGLE_LOADER");
        }
        $scope.showInvoiceDetails = function(id) {
            InvoiceService.setCurrentInvoiceID(id);
            $state.go("invoice.Details");
        }

        $scope.initInvoiceDetails = function() {
             
            var promise = InvoiceService.getCurrentInvoiceDetails();
            promise.then(function(){
                $scope.currSelectedInvoiceDetails = invoiceFactory.currentInvoiceDetails;  
            });
        }

        /* >>>>>>>>>>>Invoice List Section Controller >>>>>>>>>>>>>>>>>>>>*/
        $scope.initInvoiceList = function() {
            pubSubFactory.publishEvent("TOGGLE_LOADER"); //start showing loader
            $scope.invoices = InvoiceService.getAllInvoices(); //showFilteredList(InvoiceService.getCurrentInvoiceType());
        }


        $scope.selectItem = function(rowItem, event) {
            $scope.showInvoiceDetails(rowItem.entity.uniqueId);
        }

        var csvOpts = {
            columnOverrides: {
                obj: function(o) {
                    return o.a + '|' + o.b;
                }
            }
        }

        $scope.filterOptions = {
            filterText: InvoiceService.getCurrentInvoiceType()
        };

        $scope.filteredInvoiceList = {
            data: 'invoices',
            multiSelect: false,
            showFooter: true,
            plugins: [new ngGridCsvExportPlugin(csvOpts)],
            afterSelectionChange: $scope.selectItem,
            filterOptions: $scope.filterOptions,
            columnDefs: [{
                field: 'invoiceID',
                displayName: 'ID'
            }, {
                field: 'invoiceDate',
                displayName: 'Invoice Date'
            }, {
                field: 'dueDate',
                displayName: 'Due Date'
            }, {
                field: 'customerEmail',
                displayName: 'Cust Email'
            }, {
                field: 'amount',
                displayName: 'Amount(USD)'
            }]
        };

        $scope.addressOpen = false;
        $scope.openAddresss = function(index){
            if($scope.addressOpen == false){
                $scope.addressOpen = true;
            }else{
                $scope.addressOpen = false;
            }

        }


        // VIEW INVOICE ///////////////////////////////////////////////
        $scope.printInvoice = function(){
            $(".hidden-xs").css( "display", "none" );
            window.print();
            $(".hidden-xs").css( "display", "block" );
        }

        $scope.computeAndDisplayLineItemTotal = function(){
          var theLineItemTotal = 0; var i;
          for(i=0; i<$scope.invoiceLineItems.length; i++){
            theLineItemTotal = theLineItemTotal + ($scope.invoiceLineItems[i]['unitPrice'] * $scope.invoiceLineItems[i]['quantity']);
          }
          $scope.lineItemTotalCalc = theLineItemTotal.toFixed(2);
        }



        
        /// EDIT LINE ITEM //////////////////////////////////////////////////
        $scope.thecurrentindexforediting = 0;
        $scope.editLineItem = function(index){
            $scope.selectedLineItem = $scope.invoiceLineItems[index];
            $scope.selectedLineItemBackup = angular.copy($scope.invoiceLineItems[index]);
            $scope.thecurrentindexforediting = index;
            $("#editLineItemButton").click();
        }
        $scope.cancelEditLineItem = function(){
            $scope.invoiceLineItems[$scope.thecurrentindexforediting] = $scope.selectedLineItemBackup;
        }

        // INVOICE SETTINGS CONTROLLER ////////////////////////////////
        $scope.fileSelectEvent = function() {

        };

        $scope.invoiceSettings = {
            businessName: "",
            address: "",
            firstName: "",
            phone: "",
            lastName: "",
            email: "",
            website: "",
            fax: "",
            filePath: "",
            filePath: ""
        };


        /// ITEM MANAGER ////////////////////////////////////////

        $scope.itemList = [{
            "item": "Item1",
            "description": "This is item 1",
            "unitCost": "1.00"
        }, {
            "item": "Item2",
            "description": "This is item 2",
            "unitCost": "2.00"
        }, {
            "item": "Item3",
            "description": "This is item 3",
            "unitCost": "3.00"
        }, {
            "item": "Item4",
            "description": "This is item 4",
            "unitCost": "4.00"
        }];

        $scope.itemManager = {
            item: "a",
            description: "",
            unitCost: ""
        };
        $scope.InsertNotUpdate = true;

        $scope.clickItem = function(inrow) {
            $scope.itemManager.item = $scope.itemList[inrow.rowIndex].item;
            $scope.itemManager.description = $scope.itemList[inrow.rowIndex].description;
            $scope.itemManager.unitCost = $scope.itemList[inrow.rowIndex].unitCost;
            $scope.InsertNotUpdate = false;
        }

        $scope.clearItemInputs = function() {
            $scope.itemManager.item = "";
            $scope.itemManager.description = "";
            $scope.itemManager.unitCost = "";
        }

        $scope.gridData = {
            data: 'itemList',
            multiSelect: false,
            afterSelectionChange: function(row) {
                $scope.clickItem(row);
            },
            columnDefs: [{
                field: 'item',
                displayName: 'Item'
            }, {
                field: 'description',
                displayName: 'Description'
            }, {
                field: 'unitCost',
                displayName: 'Unit Cost'
            }]
        };

    }
]);
