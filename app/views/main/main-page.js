var vmModule = require("./main-view-model");
var viewModel = vmModule.model;
var viewModule = require("ui/core/view");
var utils = require("../../shared/utils/util");
var locationModule = require("location");
var appModule = require("application");
var constants = require("../../shared/utils/constants");
var nestoriaAPI = require("../../shared/nestoriaAPI");
var navigation = require("../../shared/navigation");
var localStorage = require("../../shared/local-storage/local-storage");
var Search = require("../../shared/models/Search");
var vmSearchModule = require("./searches-view-model");
var PropertyModel = require("../../shared/models/Property");
var platformModule = require("platform");

var _currPage;

/*------------------------------*/
/* Handler Functions
/*------------------------------*/

/**
 * Called when the page is loaded
 */
function onLoaded( args ) {
    var page = args.object;
    page.bindingContext = viewModel;

    // set the page
    _currPage = page;

	// Load favourites from local storage
	if(!localStorage.isLoaded()) {
		localStorage.loadFavourites();
		localStorage.loadPreviousSearches();
	}

	// For some reason we need to delay here
	setTimeout(_hideSoftKeyBoard, 50);

	// Wait on localstorage to be loaded first DIRTY!!!!
	setTimeout(resetMain, 100);

    console.log("loaded");
}

/**
 * Called when the page is navigated to
 */
function onNavigatedTo( args ) {
	console.log("NavigatedTo");
	// set the page
	_currPage = args.object;
}

/**
 * Called when the go-button is tapped
 */
function onGoTap( args ) {
	var searchText = viewModel.get("searchText");
	var values = {
		place_name: utils.trim(searchText)
	};
	_makeRequest(values);
}

/**
 * Called when text is submitted into the SearchBar
 */
// function onSearchSubmit( args ) {
// 	console.log("On submit");
// }

/**
 * Called when the My Location button is tapped
 */
function onMyLocationTap( args ) {
	var button = args.object;
	var locationOptions, values;

	// Check if geoloaction is enabled
	if (locationModule.LocationManager.isEnabled()) {
		console.log("LocationManager is Enabled");

		// Set the location options for our location request
		locationOptions = {
			desiredAccuracy: 50,
			maximumAge: 60000,
			timeout: 1000 // 5000
		};
		locationModule.getLocation(locationOptions).then(function (location) {
			// Format coordinates (move Belgium to UK) and make request
			console.log("location: " + location.latitude);
			values = {
				centre_point: {
					coords: {
						latitude: location.latitude + 0.6983,
						longitude: location.longitude - 4.9857
					}
				}
			};
			_makeRequest(values);
		}, function (error) {
		    // Set and show error message
			_showErrorMessage(constants.LOCATION_SERVICE_ERROR);
		});
	} else {
		console.log("LocationManager is not Enabled");
		// Set and show the error message
		_showErrorMessage(constants.LOCATION_DISABLED_ERROR);

		if (button.android) {
			// OPENS THE SETTINS TO ENABLE LOCATION SERVICES
			// do not forget to add android.permission.ACCESS_FINE_LOCATION in your manifest file
			(appModule.android.currentContext).startActivityForResult(new android.content.Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS), 0);
		} else if (button.ios) {
			console.log("Application run on iOS");
			if (platformModule.device.osVersion.indexOf("7") !== 0) {
				console.log("iOS version is greater or equal to 8.0");
				var iosLocationManager = CLLocationManager.alloc().init();
				iosLocationManager.requestWhenInUseAuthorization();
			}
		}
	}
}

/**
 * @param  {[type]}
 * @return {[type]}
 */
function onSearchItemTap( args ) {
	var listView = args.object;
	var tappedItem = listView.items.getItem(args.index);
	// Update searchBar text
	viewModel.set("searchText", tappedItem.place_name);
	// Make the request
	_makeRequest(tappedItem);
}

function onListFavesTap( args ) {
	var context = {};
	// navigate to favourites list
	_hideSoftKeyBoard();
	context.properties = localStorage.getFavouritesArray();
	navigation.goToResults(context);
}


/*------------------------------*/
/* Private Functions
/*------------------------------*/
/**
 * Executes a HTTP get request with the given parameters
 */
function _makeRequest( values ) {
	// Indicate that we are loading
	viewModel.set("isLoading", true);

	nestoriaAPI.getProperties(values)
		.then(function (response) {
			var result = response.content.toJSON();
			_onFirstResult(result.response, values);
			console.log("http callback ok");
		}, function (e) {
			console.log("Error occurred " + e);
		});
}

/**
 * Function that checks the response code on a successful
 * request and determines if the request should be saved
 * or not
 */
function _onFirstResult( response, values ) {
	var responseCode = response.application_response_code;
	var results;
	console.log(responseCode);

	// Indicate that we are DONE loading
	viewModel.set("isLoading", false);

	//one unambiguous location..
	if(responseCode === "100" || /* one unambiguous location */
		responseCode === "101" || /* best guess location */
		responseCode === "110" /* large location, 1000 matches max */) {
		//place_name is both display and search name for previous searches

		if(response.listings.length === 0) {
			_showErrorMessage(constants.NO_PROPERTIES_FOUND);
		} else {
			console.log("OK");
			// add to previous searches
			_addToPreviousSearches(response.locations[0].place_name, values.centre_point, response.locations[0].long_title, response.total_results);
			// Convert listings to Property Objects
			results = _convertToPropertyArray(response.listings, response.total_pages);
			// go to results
			_hideSoftKeyBoard();
			navigation.goToResults(results);
		}
	} else if(responseCode === "201" || /* unknown location */
		responseCode === "210" /* coordinate error */) {
		_showErrorMessage(constants.LOCATION_NOT_RECOGNISED);
	} else {
		//have a go at displaying "did you mean" locations
		if(response.locations) {
			// Update listView with suggested location
			_updateListViewSource(response.locations);
			_showTitleMessage(constants.SUGGESTED_LOCATION_TITLE);
		} else {
			_showErrorMessage(constants.LOCATION_NOT_RECOGNISED);
		}
	}
}

function _addToPreviousSearches( placeName, centre_point, displayName, totalResults ) {
	var currSearch = new Search(placeName, centre_point, displayName, totalResults);
	var previousSearches = localStorage.getPreviousSearchesArray();

	// Find if the currSearch is in the previousSearches
	var oldSearchIndex = _findPreviousSearchIndex(previousSearches, currSearch);
	if(oldSearchIndex !== null) {
		// remove from array
		previousSearches.splice(oldSearchIndex, 1);
	} else {
		// remove last element from array
		if(previousSearches.length >= 5) { previousSearches.pop(); }
	}

	// Add new search to first position of array
	previousSearches.splice(0, 0, currSearch);

	// Sync the new array in localstorage
	localStorage.syncPreviousSearches(previousSearches);
}

/**
 * Function that resets the UI of the landing page (main-page)
 */
function resetMain( ) {
	var previousSearches = localStorage.getPreviousSearchesArray();

	// Hide error message
	_hideErrorMessage();

	// Show the recent searches (Update the view-model of our list)
	_updateListViewSource(previousSearches);
	_showTitleMessage(constants.RECENT_LOCATION_TITLE);

	console.log("reset");
}

/*------------------------------*/
/* Utility Functions
/*------------------------------*/
function _isArray( value ) {
	return (Object.prototype.toString.call( value ) === "[object Array]");
}

function _convertToPropertyArray( listings, totalPages ) {
	var results;
	var properties = [];
	var property;

	for(var i=0; i<listings.length; i++) {
		property = new PropertyModel(listings[i]);
		properties.push(property);
	}

	results = {
		properties: properties,
		totalPages: totalPages
	};
	return results;
}

function _findPreviousSearchIndex( previousSearches, currSearch ) {
	for (var i=0; i<previousSearches.length; i++) {
		if (previousSearches[i].place_name === currSearch.place_name) {
			return i;
		}
	}
	return null;
}

function _sortArray( array ) {
	array.sort(function(x, y){
	    return y.searchTimeMS - x.searchTimeMS;
	});
}

/**
 * Function for showing the error message
 *
 * @param the current page
 */
function _showTitleMessage ( message ) {
	var listTitleLabel = viewModule.getViewById(_currPage, "mainListTitle");
	
	// Hide error message
	_hideErrorMessage();

	// Update list title label with message
	viewModel.set("listTitle", message);

	// Check if allready visible
	if (!listTitleLabel._isVisible) { listTitleLabel.visibility = "visible"; }

	// Show list view
	_showListView();
}

function _hideTitleMessage () {
	var listTitleLabel = viewModule.getViewById(_currPage, "previousSearchesList");
	if (listTitleLabel._isVisible) { listTitleLabel.visibility = "collapsed"; }
}

function _showListView () {
	var listView = viewModule.getViewById(_currPage, "previousSearchesList");
	if(!listView._isVisible) { listView.visibility = "visible"; }
}

function _hideListView () {
	var listView = viewModule.getViewById(_currPage, "mainListTitle");
	if(listView._isVisible) { listView.visibility = "collapsed"; }
}

function _updateListViewSource ( items ) {
	var listView = viewModule.getViewById(_currPage, "previousSearchesList");
	vmSearchModule.refreshItems(items);
	listView.items = vmSearchModule.searches;
}

function _hideSoftKeyBoard () {
	var searchBar = viewModule.getViewById(_currPage, "searchBar");
	// Disable softkeyboard
	if (searchBar.ios) {
		searchBar.ios.endEditing(true);
	} else if (searchBar.android) {
		searchBar.android.clearFocus();
	}
}

/**
 * Function for showing the error message
 *
 * @param the current page
 */
function _showErrorMessage ( message ) {
	var errorLabel = viewModule.getViewById(_currPage, "mainErrorMessage");
	
	// Hide List and List Title
	_hideTitleMessage();
	_hideListView();

	// Set message on error label
	viewModel.set("errorMessage", message);

	// Check if allready visible
	if (!errorLabel._isVisible) { errorLabel.visibility = "visible"; }
}

/**
 * Function for hiding the error message
 *
 * @param the current page
 */
function _hideErrorMessage () {
	var errorLabel = viewModule.getViewById(_currPage, "mainErrorMessage");
	// Check if allready hidden
	if (errorLabel._isVisible) { errorLabel.visibility = "collapsed"; }
}

exports.onLoaded = onLoaded;
exports.onNavigatedTo = onNavigatedTo;
exports.onGoTap = onGoTap;
exports.onSearchSubmit = onGoTap;	//May use the same handler as the go button
exports.onMyLocationTap = onMyLocationTap;
exports.onSearchItemTap = onSearchItemTap;
exports.onListFavesTap = onListFavesTap;
