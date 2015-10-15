var observable = require('data/observable');
var json = {
	listTitle: 'Recent locations',
	searchText: '',
	errorMessage: '',
	isLoading: false
};
// create observable model that is sourced from a JSON object
var _model = new observable.Observable(json);
exports.model = _model;
