'use strict';

let customUserAgentString = document.getElementById('custom-user-agent-string');
let storeButton = document.getElementById('store-changes');
let restoreDefault = document.getElementById('restore-default');
let setChromeMobile = document.getElementById('set-chrome-mobile');
let useNavbarButton = document.getElementById('use-navbar');

let chromeMobileHeader = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Mobile Safari/537.36";

//Restore settings
chrome.storage.local.get(['customUserAgentString', 'useNavBar'], function(result){
	//User-Agent
	if (result.customUserAgentString){
		customUserAgentString.value = result.customUserAgentString;
	}else{
		customUserAgentString.value = "";
	}
	//Navbar
	if (result.useNavBar){
		useNavbarButton.classList.add('active');
	}
});

storeButton.onclick = function(element){
	chrome.storage.local.set({customUserAgentString: customUserAgentString.value}, function(){
		console.log('User-Agent set to ' + customUserAgentString.value);
		//reload for background.js
		chrome.runtime.sendMessage({type: "sepiaFwReloadCustomUserAgent"});
	});
}
restoreDefault.onclick = function(element){
	customUserAgentString.value = window.navigator.userAgent;
	chrome.storage.local.remove(["customUserAgentString"], function(){
		console.log('Restored default user-agent');
		//reload for background.js
		chrome.runtime.sendMessage({type: "sepiaFwReloadCustomUserAgent"});
	});
}
setChromeMobile.onclick = function(element){
	customUserAgentString.value = chromeMobileHeader;
	chrome.storage.local.set({customUserAgentString: chromeMobileHeader}, function(){
		console.log('User-Agent set to ' + chromeMobileHeader);
		//reload for background.js
		chrome.runtime.sendMessage({type: "sepiaFwReloadCustomUserAgent"});
	});
}
useNavbarButton.onclick = function(element){
	if (this.classList.contains('active')){
		this.classList.remove('active');
		chrome.storage.local.set({useNavBar: false}, function(){
			console.log('Use Nav-Bar: false');
			//refresh for navbar.js (content script)
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				chrome.tabs.sendMessage(tabs[0].id, {type: "sepiaFwHideNavbar"});
			});
		});
	}else{
		this.classList.add('active');
		chrome.storage.local.set({useNavBar: true}, function(){
			console.log('Use Nav-Bar: true');
			//refresh for navbar.js (content script)
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				chrome.tabs.sendMessage(tabs[0].id, {type: "sepiaFwShowNavbar"});
			});
		});
	}
}

/*
storeButton.onclick = function(element){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.executeScript(
			tabs[0].id,
			{code: '... my fancy JS code ...'});
		}
	);
};
*/
