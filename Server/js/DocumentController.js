/*
Copyright (C) 2016 Apple Inc. All Rights Reserved.
See LICENSE.txt for this sample’s licensing information
*/

// Registry of attribute name used to define the URL to template (e.g. documentURL or menuBarDocumentURL)
// to controller type (e.g. DocumentController or MenuBarController)
const attributeToController = {};
const attributeKeys = [];

function registerAttributeName(type, func) {
    attributeToController[type] = func;
    attributeKeys.push(type);
}

function resolveControllerFromElement(elem) {
    for (var i = 0, key; i < attributeKeys.length; i++) {
        key = attributeKeys[i];
        if (elem.hasAttribute(key)) {
            return {
                type: attributeToController[key],
                url: elem.getAttribute(key)
            };
        }
    }
}



function DocumentController(documentLoader, documentURL, loadingDocument) {
    this.handleEvent = this.handleEvent.bind(this);
    this._documentLoader = documentLoader;
    documentLoader.fetch({
        url: documentURL,
        success: function(document) {
            // Add the event listener for document
            this.setupDocument(document);
            // Allow subclass to do custom handling for this document
            this.handleDocument(document, loadingDocument);
        }.bind(this),
        error: function(xhr) {
            const alertDocument = createLoadErrorAlertDocument(documentURL, xhr, false);
            this.handleDocument(alertDocument, loadingDocument);
        }.bind(this)
    });
}

registerAttributeName('documentURL', DocumentController);

DocumentController.prototype.setupDocument = function(document) {
    document.addEventListener("select", this.handleEvent);
    document.addEventListener("play", this.handleEvent);
    document.addEventListener("change", function(event){console.log("Helloooooooooooooooooooooooooooooooooooooo")});//this.makeTransaction
    //document.addEventListener("highlight", this.handleMenu);
};

DocumentController.prototype.handleDocument = function(document, loadingDocument) {
    if (loadingDocument) {
        navigationDocument.replaceDocument(document, loadingDocument);
    } else {
        navigationDocument.pushDocument(document);
    }
};

function launchPlayer() {  
   var player = new Player();  
   var playlist = new Playlist();  
   var mediaItem = new MediaItem("video", "http://trailers.apple.com/movies/focus_features/9/9-clip_480p.mov");  
   player.playlist = playlist;  
   player.playlist.push(mediaItem);  
   player.present();
   //player.play() 
}

DocumentController.prototype.handleMenu = function (event) {
    const alertDocument = createAlertDocument("Shobhit", "here", false);
    this.handleDocument(alertDocument, false);
}

function showPayType (){
    var paymentURL = "http://localhost:9001/templates/showcase/paymentForm.xml";   //"templates/Index.xml";
           getDocument(paymentURL)
           

}

function showPaymentForm () {
            var paymentURL = "http://localhost:9001/templates/showcase/paymentForm.xml";   //"templates/Index.xml";
            getDocument(paymentURL)
}
function getDocument(url) {
    var templateXHR = new XMLHttpRequest();
    templateXHR.responseType = "document";
    templateXHR.addEventListener("load", function() {pushDoc(templateXHR.responseXML);}, false);
    templateXHR.open("GET", url, true);
    templateXHR.send();
    return templateXHR;
}
function pushDoc(template) {
    
    navigationDocument.presentModal(template);
    // body...
}


function showResponse(xobj) {
    var responseText = JSON.parse(xobj.responseText);
    const alertDocument = createDescriptiveAlertDocument('Chandra Response:', JSON.stringify(responseText));
        navigationDocument.presentModal(alertDocument);

}

DocumentController.prototype.makeTransaction = function() {

    var json = {
            "createTransactionRequest": {
                "merchantAuthentication": {
                    "name": "8zw38TXp",
                    "transactionKey": "29L3e238quN7yqQT"
                },
                "refId": "123456",
                "transactionRequest": {
                    "transactionType": "authCaptureTransaction",
                    "amount": 10,
                    "payment": {
                        "creditCard": {
                            "cardNumber": "5424000000000015",
                            "expirationDate": "1220",
                            "cardCode": "125"
                        }
                    }
                }
            }
        }
        var xobj = null, endPoint = "https://apitest.authorize.net/xml/v1/request.api";
            xobj = new XMLHttpRequest();
        xobj.open("post", endPoint, true);
        
           
        
        xobj.onload = function() {
            setTimeout(function() {showResponse(xobj), 2000});
        };

        xobj.send(JSON.stringify(json));
    }

    

DocumentController.prototype.handleEvent = function(event) {
    const target = event.target;
    var loadingDocument;
    showPayType();
    //launchPlayer()
    //makeTransaction();
  //  typeof Accept.dispatchData;
    //const alertDocument = createDescriptiveAlertDocument('', typeof Accept.dispatchData);
     //   navigationDocument.presentModal(alertDocument);
    //showPaymentForm();
    //launchPlayer();
    //const alertDocument = createAlertDocument('shobhit', 'Play video file here', false);
           // this.handleDocument(alertDocument, loadingDocument);

    /*const controllerOptions = resolveControllerFromElement(target);
    if (controllerOptions) {
        const controllerClass = controllerOptions.type;
        const documentURL = controllerOptions.url;
        var loadingDocument;
        if (!controllerClass.preventLoadingDocument) {
            loadingDocument = createLoadingDocument();
            navigationDocument.pushDocument(loadingDocument);
        }
        // Create the subsequent controller based on the atribute and its value. Controller would handle its presentation.
        new controllerClass(this._documentLoader, documentURL, loadingDocument);
    }
    else if (target.tagName === 'description') {
        // Handle description tag, if no URL was specified
        const body = target.textContent;
        const alertDocument = createDescriptiveAlertDocument('', body);
        navigationDocument.presentModal(alertDocument);
    }*/
};

var Accept = (function() {

    'use strict';
    var response = {
        "messages" : {
            "resultCode" : "Ok",
            "message" : []
        }
    };
   
    var bootstrapError = [];
    // TEST
  
    
    
    var messageUtility = (function() {
        var messageInfo = {
            "E_WC_01" : "Please include Accept.js library from cdn.",
            "E_WC_02" : "A HTTPS connection is required.",
            "E_WC_03" : "Accept.js is not loaded correctly.",
            "E_WC_04" : "Please provide mandatory field to library.",
            "E_WC_05" : "Please provide valid credit card number.",
            "E_WC_06" : "Please provide valid expiration month.",
            "E_WC_07" : "Please provide valid expiration year.",
            "E_WC_08" : "Expiration date must be in the future.",
            "E_WC_09" : "Fingerprint hash should not be blank.",
            "E_WC_10" : "Please provide valid apiloginid.",
            "E_WC_11" : "Please provide valid timestamp in utc.",
            "E_WC_12" : "Sequence attribute should not be blank.",
            "E_WC_13" : "Invalid Fingerprint.",
            "E_WC_14" : "Accept.js encryption failed.",
            "E_WC_15" : "Please provide valid CVV.",
            "E_WC_16" : "Please provide valid Zip code.",
            "E_WC_17" : "Please provide valid card holder name.",
            "E_WC_18" : "Client key is required."
                
        };
        return {
            messageInfo : messageInfo
        };
    })();

    /**
     * Used to handshake with Accept js library to validate proper loading of script .
     */
    function handshake() {
        var evt = document.createEvent("Event");
        evt.initEvent("handshake", true, false);
        document.getElementsByTagName("body")[0].dispatchEvent(evt);
    }

    /**
     * Method is single point entry to validate all mandatory and optional field before encryption getting started .
     * 
     * @private
     * @param card data passed from merchant .  
     * @param callback method name from merchant .  
     * @return response as success or failure with array of error object which contains error code and error description for all errors.  .
     * 
     */
    function validateField(args, callback) {
            if (args === undefined || args.cardData === undefined || args.authData === undefined || callback === undefined) {
                pushFailStatus("E_WC_04", messageUtility.messageInfo.E_WC_04);
            } else {
                validateCreditCard(args);
                validateExpiryYear(args);
                validateExpiryMonth(args);
                validateApiLoginID(args);

                do { // Check for if Client key is not present
                    if(args.authData.clientKey !== undefined && args.authData.clientKey.length === 0){
                        pushFailStatus("E_WC_18", messageUtility.messageInfo.E_WC_18);
                    }
                    else if(args.authData.clientKey !== undefined){
                        // If Client Key is present don't throw any exception.
                           break;
                    }
                    else if(args.authData.fingerprint !== undefined){ // if client key is not present look for fingerprint 
                        validateFingerPrintData(args.authData.fingerprint);
                    }
                    else{ // if noting present throw error of client key
                        pushFailStatus("E_WC_18", messageUtility.messageInfo.E_WC_18);
                    }
                }
                while(false);
                validateOptionalData(args.cardData);
            }
    }
    
    /**
     * @private 
     * @param fingerprint value that need to be validated  .
     * 
     * return true if passed value is undefined or blank else false.
     * 
     */
    function validateFingerPrintData(obj){
        var fingerPrintAttribute = { 
                timestamp : 'E_WC_11',
                sequence : 'E_WC_12',
                hashValue : 'E_WC_09',
                amount : 'E_WC_13'};
        for (var prop in fingerPrintAttribute){
            if (obj.hasOwnProperty(prop) === false || obj[prop].length <= 0){
                pushFailStatus(fingerPrintAttribute[prop], messageUtility.messageInfo[fingerPrintAttribute[prop]]);
            }
        }           
    }
    
    /**
     * @private 
     * @param Optional  value that need to be validated  .
     * 
     * return true if passed value is valid else false.
     */
    function validateOptionalData(obj){
        var cardAttribute = {
                  'cardCode' : { "errorCode":"E_WC_15", "regex":"^([0-9]{3,4})$" },
                  'zip' :      { "errorCode":"E_WC_16", "regex":"^.{1,20}$" },
                  'fullName' : { "errorCode":"E_WC_17", "regex":"^.{1,64}$" }    
                };
        
        for (var prop in cardAttribute){
            if (obj.hasOwnProperty(prop) && obj[prop].length !== 0){
                var regex = new RegExp(cardAttribute[prop].regex, 'g');
                if (!(obj[prop]).match(regex)){
                    pushFailStatus(cardAttribute[prop].errorCode, messageUtility.messageInfo[cardAttribute[prop].errorCode]);
                }
            }
        }           
    }
    
    /**
     * @private 
     * @param card data passed from merchant .
     * 
     * Update error array with error code and error message if amount validation failed.
     * 
     */
    function validateAmount(args){
        var regExp = /^\d+(\.\d{1,2})?$/ ;
        if(args.authData.fingerprint.amount === undefined || args.authData.fingerprint.amount.length <= 0 || !(regExp.test(args.authData.fingerprint.amount)) || args.authData.fingerprint.amount <= 0){
            pushFailStatus("E_WC_13", messageUtility.messageInfo.E_WC_13);
        }
    }
    

    /**
     * Method is validating if card number is valid or not .
     * 
     * @private
     * @param card data passed from merchant .  
     */
    function validateCreditCard(args) {
        // Now remove any spaces from the credit card number
        var cardNumber = ((args.cardData.cardNumber !== undefined)) ? args.cardData.cardNumber.replace(/[\. ,:-]+/g, "") : "";
        // Check that the number is numeric
        var cardNumberRegex = /^[0-9]{13,16}$/;
        // Ensure that the user has provided a credit card number
        if ((!cardNumberRegex.exec(cardNumber))) {
            pushFailStatus("E_WC_05", messageUtility.messageInfo.E_WC_05);
            return;
        }
        else{
            // The Luhn Algorithm.
            var nCheck = 0,
                nDigit = 0,
                bEven = false;
            cardNumber = cardNumber.replace(/\D/g, "");

            for (var n = cardNumber.length - 1; n >= 0; n--) {
                var cDigit = cardNumber.charAt(n);
                nDigit = parseInt(cDigit, 10);
                if (bEven) {
                    if ((nDigit *= 2) > 9)
                        nDigit -= 9;
                }
                nCheck += nDigit;
                bEven = !bEven;
            }
            if ((nCheck % 10) !== 0) {
                pushFailStatus("E_WC_05", messageUtility.messageInfo.E_WC_05);
                return;
            }
        }
    }

    /**
     * Method used to maintain unique array element.
     * 
     * @private
     * @param  bootstrapError 
     * @param  errorCode.    
     */
    function bootstrapErrorContains(bootstrapError, errorCode) {
        var i = bootstrapError.length;
        while (i--) {
            if (bootstrapError[i].code == errorCode) {
                return true;
            }
        }
        return false;
    }

    /**
     * Method used to push error code and error message in array.
     * 
     * @private
     * @param errorCode . 
     * @param errorMessage .    
     */
    function pushFailStatus(errorCode, errorMessage) {
        response.messages.resultCode = "Error";
        response.messages.message.push({
            "code" : errorCode,
            "text" : errorMessage
        });

    }
    /**
     * Method used to push error code and error message in bootstrap Array.
     * 
     * @private
     * @param errorCode . 
     * @param errorMessage . 
     */
    function pushBootstrapError(errorCode, errorMessage) {
        bootstrapError.push({
            "code" : errorCode,
            "text" : errorMessage
        });
    }

    /**
     * Used to push error code and error message in array if expiration month validation failed .
     * 
     * @private
     * @param card data passed from merchant . 
     * 
     */
    function validateExpiryMonth(args) {
        var month;
        if (args.cardData.month !== undefined) {
            month = args.cardData.month.length === 1 ? "0" + args.cardData.month : args.cardData.month;
            args.cardData.month = month;
        }
        // Check that the number is numeric
        var expMonthRegex =/^(0[1-9]|1[012])$/;
        // Ensure that the user has provided a credit card expiry month
        if ((month === undefined) || (!expMonthRegex.exec(month))) {
            pushFailStatus("E_WC_06", messageUtility.messageInfo.E_WC_06);
            return;
        }
    }

    /**
     * Method is validating if expiry year is valid or not .
     * 
     * @private
     * @param card data passed from merchant . 
     * 
     */
    function validateExpiryYear(args) {
        var year, month, expYearRegex = /\b([0-9]{2}(?:[0-9]{2})?)\b/, expMonthRegex =/^(0[1-9]|1[012])$/;
        if (args.cardData.month !== undefined) {
            month = args.cardData.month.length === 1 ? "0" + args.cardData.month : args.cardData.month;
        }
        if (args.cardData.year !== undefined) {
            year = args.cardData.year;
        }
        // Ensure that the user has provided a credit card expiry year
        if ((year === undefined) || (!expYearRegex.exec(year))) {
            pushFailStatus("E_WC_07", messageUtility.messageInfo.E_WC_07);
            return;
        } else if (month !== undefined &&(expMonthRegex.exec(month))) {
            var today, someday;
            today = new Date();
            year = year.length == 2 ? 20 + year : year;
            someday = new Date(year, month, 0);
            someday.setHours(23,59,59,999);
            if (someday < today) {
                pushFailStatus("E_WC_08", messageUtility.messageInfo.E_WC_08);
                return;
            }
        }
    }

    /**
     * Method is validating user login id as its mandatory field .
     * 
     * @private
     * @param card data passed from merchant . 
     */
    function validateApiLoginID(args) {
        if (!(args.authData.hasOwnProperty("apiLoginID") && args.authData.apiLoginID !== undefined && args.authData.apiLoginID.length !== 0 && args.authData.apiLoginID.length < 255))
            pushFailStatus("E_WC_10", messageUtility.messageInfo.E_WC_10);

    }

    /**
     * Generate timestamp in UTC form .
     * 
     * @private
     * @return current timestamp in UTC form.
     */
    function getCurrentTimeStamp() {
        return Math.floor(Date.now() / 1000);
    }

    /**
     * Method is constructing Json object which need to be send to Aner server for encryption .
     * 
     * @private
     * @param dataObject contain all card data send by merchant. 
     * @return Constructed Json object.
     * 
     */
    function constructCardData(dataObject) {
        var cardOptionalAttribute = {
          '0' : { "key":"cardCode" },
          '1' : { "key":"zip" },
          '2' : { "key":"fullName" }    
        };
        
        try {
            var data = {
                "type" : "TOKEN",
                "id" : new Guid().newGuid(),
                "token" : {
                    "cardNumber" : dataObject.cardData.cardNumber,
                    "expirationDate" : dataObject.cardData.month + dataObject.cardData.year
                }
            };
            for (var prop in cardOptionalAttribute){
                if (dataObject.cardData.hasOwnProperty(cardOptionalAttribute[prop].key) && dataObject.cardData[cardOptionalAttribute[prop].key].length > 0)
                    data.token[cardOptionalAttribute[prop].key] = dataObject.cardData[cardOptionalAttribute[prop].key];
            }
            return data;
        } catch (e) {
            console.log("AcceptCore:constructCardData:" + e.message);
            throw {
                code : "E_WC_14",
                text : messageUtility.messageInfo.E_WC_14
            };
        }
    }

    /**
     * Method used to handle response from Anet server .
     * 
     * @private
     * @param xobj contain response. 
     * @param callback.
     * 
     */
    function encryptResponse(xobj, callback) {
        try {
            var responseText = JSON.parse(xobj.responseText);
            if (undefined !== responseText.messages.resultCode && undefined !== responseText.messages.message && responseText.messages.message.length >= 1) {
                for ( var error in responseText.messages.message) {
                    switch (responseText.messages.message[error].code) {
                    case "I00001":
                        responseText.messages.message[error].code = "I_WC_01";
                        break;
                    case "E00001":
                        responseText.messages.message[error].code = "E_WC_15";
                        break;
                    case "E00003":
                        responseText.messages.message[error].code = "E_WC_16";
                        break;
                    case "E00007":
                        responseText.messages.message[error].code = "E_WC_17";
                        break;
                    case "E00096":
                        responseText.messages.message[error].code = "E_WC_13";
                        break;
                    }
                }
                //window[callback](responseText);
            } else {
                response.messages.resultCode = "Error";
                pushFailStatus("E_WC_14", messageUtility.messageInfo.E_WC_14);
                //window[callback](response);
            }
        } catch (e) {
            response.messages.resultCode = "Error";
            pushFailStatus("E_WC_14", messageUtility.messageInfo.E_WC_14);
            //window[callback](response);
        }

    }

    /**
     * Method is used to send encryption request to Anet server .
     * 
     * @private
     * @param args contain all card data .
     * @param callback method name.
     * 
     */
    function createEncryptRequest(args, callback) {
        var xobj = null, endPoint = "https://downloadvposcad.labwebapp.com/xml/v1/request.api";
        if (typeof XDomainRequest != "undefined") {
            xobj = new XDomainRequest();
        } else {
            xobj = new XMLHttpRequest();
        }
        xobj.open("post", endPoint, true);
        if (typeof XDomainRequest == "undefined") {
            xobj.setRequestHeader("Content-Type",
                    "application/json; charset=utf-8");
        }
        xobj.onload = function() {
            setTimeout(function() {
                encryptResponse(xobj, callback), 2000});
        };

        var encryptRequest = {
            "securePaymentContainerRequest" : {
                "merchantAuthentication" : {
                    "name" : args.authData.apiLoginID,
                },
                "data" : constructCardData(args)
            }
        };
        
        if (args.authData.hasOwnProperty("clientKey")){
            encryptRequest.securePaymentContainerRequest.merchantAuthentication.clientKey = args.authData.clientKey;
        }
        else{
            encryptRequest.securePaymentContainerRequest.merchantAuthentication.fingerPrint = {
                    "hashValue" : args.authData.fingerprint.hashValue,
                    "sequence" : args.authData.fingerprint.sequence,
                    "timestamp" : args.authData.fingerprint.timestamp,
                    "amount" : args.authData.fingerprint.amount
                };
        }
        xobj.send(JSON.stringify(encryptRequest));
    }

    /**
     * Main method which merchant will call to encrypt credit card data .
     * 
     * @private
     * @param args card data passed by merchant .
     * @param callback method name from merchant
     * 
     */
     function dispatchData(
            args, callback) {
        response = {
            "messages" : {
                "resultCode" : "Ok",
                "message" : []
            }
        };
        if (bootstrapError.length > 0) {
            response = {
                "messages" : {
                    "resultCode" : "Error",
                    "message" : bootstrapError
                }
            };
            //window[callback](response);
        } else {
            validateField(args, callback); // validate the Input fields
            if (response.messages.resultCode === "Ok") {
                try {
                    createEncryptRequest(args, callback);
                } catch (e) {
                    pushFailStatus("E_WC_14",messageUtility.messageInfo.E_WC_14);
              //      window[callback](response);
                }
            } else {
                //window[callback](response);
            }
        }
    }


    return {
        dispatchData: dispatchData
    };
    
})();
