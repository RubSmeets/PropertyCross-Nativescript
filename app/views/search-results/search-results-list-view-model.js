var observableArray = require( "data/observable-array" );
var _properties = new observableArray.ObservableArray();

/**
 * Initialize the observable array with multiple items
 * 
 * @param  {array of items}
 */
function _initArray( items ) {
	var count = _properties.length;
	_properties.splice(0, count);
	_properties.push(items);
}

/**
 * Add a new item to the array
 * 
 * @param  {item}
 */
function _pushItem( item ) {
	_properties.push(item);
}

module.exports = {
	properties: _properties,
	pushItem: function ( item ) {
		return _pushItem(item);
	},
	initArray: function ( items ) {
		return _initArray(items);
	}
};