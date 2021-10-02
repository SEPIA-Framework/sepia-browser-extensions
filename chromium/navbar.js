function sepiaAddBrowserControls(){
	var controls = document.getElementById('sepiaFW-on-page-tab-controls');
	if (!controls){
		controls = document.createElement('div');
		controls.id = "sepiaFW-on-page-tab-controls";
	
		var closeButton = document.createElement('button');
		closeButton.id = "sepiaFW-on-page-close-btn";
		//closeButton.href = "javascript:window.open('','_self').close();";		//not possible!
		//var imgURL = chrome.extension.getURL("images/ctrl-close.svg");
		closeButton.onclick = closeTab;
		
		controls.appendChild(closeButton);
		document.body.appendChild(controls);
	}
}
function sepiaRemoveBrowserControls(){
	var controls = document.getElementById('sepiaFW-on-page-tab-controls');
	if (controls){
		document.body.removeChild(controls);
	}
}

function closeTab(){
	chrome.runtime.sendMessage({type: "sepiaFwCloseTab"});
}

chrome.storage.local.get(['useNavBar'], function(result){
	if (result.useNavBar || result.useNavBar == undefined){
		//default:
		sepiaAddBrowserControls();
	}
});

//Listen for events

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		//show/hide navbar
		if (request.type == "sepiaFwShowNavbar"){
			sepiaAddBrowserControls();
		}else if (request.type == "sepiaFwHideNavbar"){
			sepiaRemoveBrowserControls();
		}
	}
);

/*
document.addEventListener('DOMContentLoaded', function() {
	//since we trigger content.js on "document_end" we may not need this
});
*/