var vmListModule = require("./search-results-list-view-model");
var vmModule = require("./search-results-view-model");
var vmModel = vmModule.model;
var viewModule = require("ui/core/view");
var navigation = require("../../shared/navigation");

/*------------------------------*/
/* Handler Functions
/*------------------------------*/

/**
 * Called when the search_result page is loaded
 */
function onLoaded( args ) {
	var page = args.object;
	var listView;

	if(page.navigationContext !== undefined) {
		if(page.navigationContext.length === 0) vmModel.set("isEmpty", true);
		else vmModel.set("isEmpty", false);

		page.bindingContext = vmModel;

		// init observable array
		vmListModule.initArray(page.navigationContext);

		// bind observable array to list context
		listView = viewModule.getViewById(page, "resultsListview");
		listView.items = vmListModule.properties;
	}
	console.log('loaded!');
}

/**
 * Called when the page is navigated to
 */
function onNavigatedTo( args ) {
	page = args.object;
	console.log('navigated!');
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
	// ???? how will i do this?
}

exports.onLoaded = onLoaded;
exports.onNavigatedTo = onNavigatedTo;
exports.onListViewItemTap = onListViewItemTap;
exports.onlistViewLoadMoreItems = onlistViewLoadMoreItems;