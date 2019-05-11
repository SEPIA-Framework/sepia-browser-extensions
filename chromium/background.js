'use strict';

//Modify header (Part 1)

//Android mobile Chrome header (March 2019):
let customHeader = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Mobile Safari/537.36";

function reloadCustomUserAgent(){
	chrome.storage.local.get(['customUserAgentString'], function(result){
		if (result.customUserAgentString){
			customHeader = result.customUserAgentString;
		}else{
			customHeader = "";
		}
	});
}
reloadCustomUserAgent();

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(info){
		if (customHeader){
			//Page exceptions (we can't add this to request filter unfortunately)
			if ((info.url.indexOf('https://sepia-framework.github.io') >= 0) 
				|| (info.url.indexOf('spotify.com') >= 0 && customHeader.indexOf('Mobile') >=0)
				){
				return;
			}
			//Replace the User-Agent header
			var headers = info.requestHeaders;
			headers.forEach(function(header, i) {
				if (header.name.toLowerCase() == 'user-agent') { 
					header.value = customHeader;
				}
			});  
			return {requestHeaders: headers};
		}
    },
    // Request filter
    {
        urls: ['<all_urls>'],				//modify the headers for these pages
        types: ["main_frame", "sub_frame"]	//in the main window and frames
    },
    ["blocking", "requestHeaders"]
);

//Listen for events

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		//close active tab
		if (request.type == "sepiaFwCloseTab") {
			chrome.tabs.remove(sender.tab.id);
		
		//reload custom navigator
		}else if (request.type == "sepiaFwReloadCustomUserAgent") {
			reloadCustomUserAgent();
		}
	}
);