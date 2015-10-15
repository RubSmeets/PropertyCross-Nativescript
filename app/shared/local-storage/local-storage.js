var fs = require("file-system");
var constants = require("../utils/constants");

var _privateFolder = fs.knownFolders.currentApp();
var _localSearchesFolder = _privateFolder.getFolder(constants.RECENT_SEARCHES_FOLDER);
var _localFavoritesFolder = _privateFolder.getFolder(constants.FAVOURITES_FOLDER);
var _favourites = [];
var _previousSearches = [];
var _isLoaded = false;

/**
 * @param  {[type]}
 * @return {[type]}
 */
function _syncFavourites ( favourites ) {
	var favouritesFile = _getFavouritesFile();
	favouritesFile.writeText(JSON.stringify(favourites))
		.then(function (args) {
			console.log("file written");
		}, function (error) {
			console.log("file failed")
		});
}

/**
 * 
 * @return {the contents of the favourites folder}
 */
function _loadFavourites () {
	var favouritesFile = _getFavouritesFile();
	favouritesFile.readText()
		.then(function (content) {
				if(content) _favourites = JSON.parse(content);
				_isLoaded = true;
				console.log("Loaded favourites");
			}, function ( error ) {
				console.log("read file failed");
			});
}

function _getFavouritesFile () {
	var fullPath = fs.path.join(_localFavoritesFolder.path, constants.FAVOURITES_STORAGE_FILE);
	var favouritesFile = fs.File.fromPath(fullPath);

	return favouritesFile;
}

/**
 * @param  {[type]}
 * @return {[type]}
 */
function _syncPreviousSearches ( previousSearches ) {
	var searchesFile = _getPreviousSearchesFile();
	searchesFile.writeText(JSON.stringify(previousSearches))
		.then(function (args) {
			console.log("file written");
		}, function (error) {
			console.log("file failed");
		});
}

/**
 * 
 * @return {the contents of the favourites folder}
 */
function _loadPreviousSearches() {
	var searchesFile = _getPreviousSearchesFile();
	searchesFile.readText()
		.then(function (content) {
				if(content) _previousSearches = JSON.parse(content);
				_isLoaded = true;
				console.log("Loaded previous searches");
			}, function ( error ) {
				console.log("read file failed");
			});
}

function _getPreviousSearchesFile () {
	var fullPath = fs.path.join(_localSearchesFolder.path, constants.SEARCHES_STORAGE_FILE);
	var searchesFile = fs.File.fromPath(fullPath);

	return searchesFile;
}

function _deleteSearchesFile () {
	var oldSearchesFile = _localSearchesFolder.getFile(constants.SEARCHES_STORAGE_FILE);
	oldSearchesFile.remove()
		.then(function (result) {
			console.log("successfully removed");
		}, function (error) {
			console.log("something went wrong while removing");
		})
}

module.exports = {
	isLoaded: function () {
		return _isLoaded;
	},
	getFavouritesArray: function () {
		return _favourites;
	},
	getPreviousSearchesArray: function () {
		return _previousSearches;
	},
	syncFavourites: function ( favourites ) {
		return _syncFavourites(favourites);
	},
	loadFavourites: function () {
		return _loadFavourites();
	},
	syncPreviousSearches: function( previousSearches ) {
		return _syncPreviousSearches(previousSearches);
	},
	loadPreviousSearches: function () {
		return _loadPreviousSearches();
	},
	// for development purposes only
	deleteSearchesFile: function() {
		return _deleteSearchesFile();
	}
};