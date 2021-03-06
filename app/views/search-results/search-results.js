var vmListModule = require("./search-results-list-view-model");
var vmModule = require("./search-results-view-model");
var vmModel = vmModule.model;
var viewModule = require("ui/core/view");
var navigation = require("../../shared/navigation");
var nestoriaAPI = require("../../shared/nestoriaAPI");

var _totalPages;
var _pageCount = 2;
var _isLoading = false;
/*------------------------------*/
/* Handler Functions
/*------------------------------*/

/**
 * Called when the search_result page is loaded
 */
function onLoaded( args ) {
	var page = args.object;
	var navigationContext = page.navigationContext;
	var listView;

	if(navigationContext !== undefined) {
		if(navigationContext.properties.length !== 0) { vmModel.set("isEmpty", false); }
		else { vmModel.set("isEmpty", true); }

		page.bindingContext = vmModel;

		// Set the total amount of pages
		_totalPages = navigationContext.totalPages;

		// init observable array
		vmListModule.initArray(navigationContext.properties);

		// bind observable array to list context
		listView = viewModule.getViewById(page, "resultsListview");
		listView.items = vmListModule.properties;
	}
	console.log("loaded!");
}

/**
 * Called when the page is navigated to
 */
function onNavigatedTo( args ) {
	var page = args.object;
	console.log("navigated!");
}

/**
 * The item tap event handler
 * 
 * @param  {arguments associated with tap event}
 */
function onListViewItemTap( args ) {
	console.log("item tapped");
	var listView = args.object;
	navigation.goToResultDetails(listView.items.getItem(args.index));
}

function onlistViewLoadMoreItems ( args ) {
	console.log("Load more");

	if(_pageCount < _totalPages) {
		if(!_isLoading) {
			_isLoading = true;
			nestoriaAPI.loadMoreProperties(_pageCount)
				.then(function (response) {
					var result = response.content.toJSON();
					//Update page count
					_pageCount++;
					//Add new listings to array
					vmListModule.pushItem(result.response.listings);
					//Reset isLoading
					_isLoading = false;

					console.log("http callback ok " + _pageCount);
				}, function (e) {
					console.log("Error occurred " + e);
				});
		}
	}
}

exports.onLoaded = onLoaded;
exports.onNavigatedTo = onNavigatedTo;
exports.onListViewItemTap = onListViewItemTap;
exports.onlistViewLoadMoreItems = onlistViewLoadMoreItems;