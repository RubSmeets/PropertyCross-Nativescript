var utils = require("../utils/util");

/**
 * Search model constructor
 * 
 * @param {constructor arguments}
 */
function Search ( placeName, centre_point, displayName, totalResults ) {
	this.display_name =  centre_point ? utils.formatCoord(centre_point.coords, 2) : displayName;
	this.place_name = placeName;
	this.centre_point = centre_point;
	this.count = totalResults;
	this.searchTimeMS = new Date().getTime();
}

/**
 * Test property getter and setter
 */
// Object.defineProperty(Search.prototype, "searchTimeMS", {
// 	get: function () {
// 		return this.searchTimeMS;
// 	},
// 	set: function (value) {
// 		if (this.searchTimeMS !== value) {
// 			this.searchTimeMS = value;
// 		}
// 	},
// 	enumerable: true,
//     configurable: true
// });

/**
 * Test method for the Search class
 * 
 * @return {[type]}
 */
Search.prototype.updateTime = function () {
	this.searchTimeMS = new Date().getTime();
};

module.exports = Search;