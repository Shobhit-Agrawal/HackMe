/*
Copyright (C) 2016 Apple Inc. All Rights Reserved.
See LICENSE.txt for this sample’s licensing information

*/

import UIKit
import TVMLKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, TVApplicationControllerDelegate {
    // MARK: Properties
    
    var window: UIWindow?
    
    var appController: TVApplicationController?
    
    
    static let TVBaseURL = "http://accept-tv.azurewebsites.net/"
    //static let TVBaseURL = "http://localhost:8000/"
    
    static let TVBootURL = "\(AppDelegate.TVBaseURL)Server/js/application.js"
    //static let TVBootURL = "\(AppDelegate.TVBaseURL)js/application.js"

    // MARK: UIApplication Overrides
    //func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
     //   self.window = UIWindow(frame: UIScreen.mainScreen().bounds)
    
    
  
    
        func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
            
            self.window = UIWindow(frame: UIScreen.main.bounds)
        
        let appControllerContext = TVApplicationControllerContext()
        
        let javascriptURL = URL(string: AppDelegate.TVBootURL)
        
        appControllerContext.javaScriptApplicationURL = javascriptURL!
        appControllerContext.launchOptions["BASEURL"] = AppDelegate.TVBaseURL
        if let options = launchOptions {
            for (kind, value) in options {
                if let kindStr = kind as? String {
                    appControllerContext.launchOptions[kindStr] = value
                }
            }
        }
        
        self.appController = TVApplicationController(context: appControllerContext, window: self.window, delegate: self)
        
        return true
    }
    // MARK: TVApplicationControllerDelegate
    
    /*func appController(appController: TVApplicationController, didFinishLaunchingWithOptions options: [String: AnyObject]?) {
        print("\(#function) invoked with options: \(options)")
    }
    
    func appController(appController: TVApplicationController, didFailWithError error: NSError) {
        print("\(#function) invoked with shobhit: \(error)")
        
        let title = "Error Launching shobhit Application"
        let message = error.localizedDescription
        let alertController = UIAlertController(title: title, message: message, preferredStyle:.Alert )
        
        self.appController?.navigationController.presentViewController(alertController, animated: true, completion: { () -> Void in
            // ...
        })
    }
    
    func appController(appController: TVApplicationController, didStopWithOptions options: [String: AnyObject]?) {
        print("\(#function) invoked with options: \(options)")
    }*/
}
