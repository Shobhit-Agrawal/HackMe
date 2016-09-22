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
   var mediaItem = new MediaItem("video", "http://accept-tv.azurewebsites.net/Server/resources/video/9-clip_480p.mov");  
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
    navigationDocument.dismissModal();
    var responseText = JSON.parse(xobj.responseText);

    const alertDocument = createDescriptiveAlertDocument('Order Placed. Thank you!', (responseText.transactionResponse.transId));

   
        navigationDocument.presentModal(alertDocument);

}

function makeTransaction () {

     const alertDocument1 = createLoadingDocument("Placing Order...");
         navigationDocument.presentModal(alertDocument1);  

    var json = {
            "createTransactionRequest": {
                "merchantAuthentication": {
                    "name": "5KP3u95bQpv",
                    "transactionKey": "346HZ32z3fP4hTG2"
                },
                "refId": "123456",
                "transactionRequest": {
                    "transactionType": "authCaptureTransaction",
                    "amount": 15,
                    "payment": {
                        "creditCard": {
                            "cardNumber": "4111111111111111",
                            "expirationDate": "1220",
                            "cardCode": "125"
                            }
                        },
                    "order":{
                "invoiceNumber": "INV#1234",
                "description":"SEATTLE RIOT CAP"
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
    var str = target.getAttribute("id");
    
    if( str === 'WatchMeID'){
        launchPlayer()

    }
    else{
        showPaymentForm();
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

