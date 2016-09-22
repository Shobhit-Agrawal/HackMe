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
    var paymentURL = "http://accept-tv.azurewebsites.net/Server/templates/list/Catalog.xml";   //"templates/Index.xml";
           getDocument(paymentURL)
           

}

function showPaymentForm () {
            var paymentURL = "http://accept-tv.azurewebsites.net/Server/templates/showcase/paymentForm.xml";   //"templates/Index.xml";
            getDocument(paymentURL)
            setTimeout(function(){ var doc = getActiveDocument();
                doc.addEventListener("select", makeTransaction);
             }, 3000);

            
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
    
    navigationDocument.pushDocument(template);
    // body...
}


function showResponse(xobj) {
    var responseText = JSON.parse(xobj.responseText);
    const alertDocument = createDescriptiveAlertDocument('Order Placed, Thanks a lot!! /n Your transaction ID is:', (responseText.transactionResponse.transId));
        navigationDocument.presentModal(alertDocument);

}

function makeTransaction () {

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
    var str = target.getAttribute("type");
    console.log(target+"hello"+str)
    showPaymentForm();
    if( str === 'creditCard'){
        launchPlayer()

    }
    if( str === 'visaCheckout'){
        makeTransaction();
    }
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

