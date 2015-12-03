var observableArray = require( "data/observable-array" );
var _searches = new observableArray.ObservableArray();

/**
 * Add a new item to the array
 * 
 * @param  {item}
 */
function _refreshItems( items ) {
	var count = _searches.length;
	_searches.splice(0, count);
	_searches.push(items);
}

module.exports = {
	searches: _searches,
	refreshItems: function ( items ) {
		return _refreshItems(items);
	}
};