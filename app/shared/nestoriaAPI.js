var httpModule = require("http");

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
	getProperties: function ( url ) {
		return _getFromNestoriaAPI(url);
	}
};