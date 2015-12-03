/**
 * trims the leading and trailing spaces from string
 */
function trim( s ) {
	return s.replace(/^\s+|\s+$/g, "");
}

/**
 * Format coördinates to the given precision e.g.: 2,5454 with precision=2 --> 2,54
 */
function formatCoord ( coords, precision ) {
	var lat = precision ? coords.latitude.toFixed(precision) : coords.latitude;
	var lon = precision ? coords.longitude.toFixed(precision) : coords.longitude;
	return lat + "," + lon;
}

/**
 * Creates a URL parameter string from supplied parameters
 */
function stringifyURLparameters ( params ) {
	var name;
	var stringifyParams = "?";
	for (name in params) {
		if (params.hasOwnProperty(name)) {
			stringifyParams += name + "=" + params[name] + "&";
		}
	}
	return stringifyParams.slice(0,-1);
}

exports.trim = trim;
exports.formatCoord = formatCoord;
exports.stringifyURLparameters =stringifyURLparameters;