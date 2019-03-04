/*
Note: 

This script is not used at the moment. It is supposed to set the window.navigator.userAgent string, but
to make this work with user-defined values of userAgent it does not work reliably because storage loading is
async. and will not necessary finish before the document finishes loading ...
Either we can hard-code the userAgent (see below) or we need to do a fancy write-to-session-storage-and-reload-page
trick which is a bad "solution" in my opinion. 

For now I'll just leave it out assuming that pages that read the window.navigator value will handle screen-sizes 
differently anyways (the main purpose of changing the userAgent was to get the mobile page) so changing the
request header should be enough (see background.js).

In case you want to hard-code the userAgent add this to the content-scripts in manifest.js:
{
	"matches": ["<all_urls>"],
	"exclude_matches": ["https://sepia-framework.github.io/*"],
	"run_at": "document_start",
	"js": ["navigator.js"]
}
*/

var navigatorRewriteCode =  '(' + function() {
    'use strict';
    
	//We need to do a bit of work because Navigator is read-only
	var navigator = window.navigator;
    var modifiedNavigator;
    if ('userAgent' in Navigator.prototype){
        //Chrome 43+
        modifiedNavigator = Navigator.prototype;
    }else{
        //older Chrome
        modifiedNavigator = Object.create(navigator);
        Object.defineProperty(window, 'navigator', {
            value: modifiedNavigator,
            configurable: false,
            enumerable: false,
            writable: false
        });
    }
    //Pretend to be...
	var customUserAgent = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Mobile Safari/537.36";
	//var customAppVersion = "5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Mobile Safari/537.36";
	//var customPlatform = "Linux; Android 6.0; Nexus 5 Build/MRA58N";
    
	Object.defineProperties(modifiedNavigator, {
        userAgent: {
			value: customUserAgent,
            configurable: false,
            enumerable: true,
            writable: false
        }/*,
        appVersion: {
            //value: navigator.appVersion.replace(/\([^)]+\)/, customAppVersion),
			value: customAppVersion,
            configurable: false,
            enumerable: true,
            writable: false
        },
        platform: {
            value: customPlatform,
            configurable: false,
            enumerable: true,
            writable: false
        }*/
    });
} + ')();';

var s = document.createElement('script');
s.textContent = navigatorRewriteCode;
document.documentElement.appendChild(s);
s.remove();