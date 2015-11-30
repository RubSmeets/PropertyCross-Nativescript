var httpModule = require("http");
var utils = require("./utils/util");
var constants = require("./utils/constants");

var _parameters

function _getProperties( values ) {
	//console.log("Coords: " + values.centre_point.coords.longitude + " " + values.centre_point.coords.latitude);

	// Create parameters for request
	_parameters = {
		place_name: values.place_name || "",
		centre_point: values.centre_point && utils.formatCoord(values.centre_point.coords, 5),
		country : "uk",
		pretty : "1",
		action : "search_listings",
		encoding : "json",
		page: 1,
		listing_type : "buy"
	}
	return _makeRequestWithParams();
}

function _loadMoreProperties( pageCount ) {
	//Update page count
	_parameters.page = pageCount;
	//Make request
	return _makeRequestWithParams();
}

function _makeRequestWithParams( ) {
	var stringifiedParams;

	stringifiedParams = utils.stringifyURLparameters(_parameters);
	console.log(stringifiedParams);

	return _getFromNestoriaAPI(constants.BASE_URL+stringifiedParams);
}

/**
 * Specify the request options for a GET request and
 * perform request
 */
function _getFromNestoriaAPI( url ) {
	var requestOptions = {
		method: "GET",
		url: url,
		headers: {
			"Content-Type": "application/json"
		}
	};
	return _callNestoriaAPI(requestOptions);
}

/**
 * Specify the request options for a POST request and
 * perform request
 */
function _postToNestoriaAPI( url, postBody ) {
	var requestOptions = {
		method: "POST",
		url: url,
		headers: {
			"Content-Type": "application/json"
		},
		content: JSON.stringify(postBody)
	};
	return _callNestoriaAPI(requestOptions);
}

/**
 * Perform the HTTP request
 */
function _callNestoriaAPI(requestOptions) {
	// fetch can also be used http://docs.nativescript.org/ApiReference/fetch/HOW-TO.html
	return httpModule.request(requestOptions);
}

module.exports = {
	getProperties: function ( values ) {
		return _getProperties(values);
	},
	loadMoreProperties: function ( pageCount ) {
		return _loadMoreProperties(pageCount);
	}
};