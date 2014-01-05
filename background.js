// Called when the user clicks on the browser action.
// !!! not implemented now !!!
chrome.browserAction.onClicked.addListener(function(tab) {
	  // No tabs or host permissions needed!
	  console.log('Turning ' + tab.url + ' red!');
	  chrome.tabs.executeScript({
	    code: 'document.body.style.backgroundColor="black"'
	  });
});