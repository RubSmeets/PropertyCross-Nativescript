var localStorage = require("../../shared/local-storage/local-storage");
var viewModelModule = require("./result-details-view-model");

var _page;
var _viewModel = viewModelModule.model;
/*------------------------------*/
/* Handler Functions
/*------------------------------*/

/**
 * Called when the result-details page is loaded
 */
function onLoaded( args ) {
	_page = args.object;
	var result = _page.navigationContext;

	//Bind page content to result details
	viewModelModule.initViewModel(result);
	_page.bindingContext = null;
	_page.bindingContext = _viewModel;

	_sortOutFavesButton(result);

	console.log("loaded!");
}

/**
 * Called when the page is navigated to
 */
function onNavigatedTo( args ) {
	console.log("navigated!");
}

function onFavesTap ( args ) {
	console.log("Tapped faves");
	var currResult = _page.navigationContext;
	var favourites = localStorage.getFavouritesArray();

	// Find if the currSearch is in the previousSearches
	var storedResultIndex = _findResultIndex(favourites, currResult);
	if(storedResultIndex !== null) {
		//Delete item from array
		favourites.splice(storedResultIndex, 1);
		_viewModel.isFavourite =  false;
	} else {
		//Add to array and update button
		favourites.push(currResult);
		_viewModel.isFavourite =  true;
	}

	//Sync the array with local storage file
	localStorage.syncFavourites(favourites);
}

function _sortOutFavesButton( currResult ) {
	var favourites = localStorage.getFavouritesArray();
	
	// Find if the currSearch is in the previousSearches
	var storedResultIndex = _findResultIndex(favourites, currResult);
	if(storedResultIndex !== null) {
		_viewModel.set("isFavourite", true);
	} else {
		_viewModel.set("isFavourite", false);
	}
}

function _findResultIndex( favourites, currResult ) {
	for (var i=0; i<favourites.length; i++) {
		if (favourites[i].guid === currResult.guid) {
			return i;
		}
	}
	return null;
}

exports.onLoaded = onLoaded;
exports.onNavigatedTo = onNavigatedTo;
exports.onFavesTap = onFavesTap;