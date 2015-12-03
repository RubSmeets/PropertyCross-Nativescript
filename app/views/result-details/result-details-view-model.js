var observableModule = require("data/observable");
var json = {
		guid: "",
		title: "",
		price: 0,
		property_type: "",
		img_url: "",
		thumb_url: "",
		summary: "",
		bedroom_number: 0,
		bathroom_number: 0,
		latitude: 0,
		longitude: 0,
		isFavourite: false
};
// create observable model that is sourced from a JSON object
var _viewModel = new observableModule.Observable(json);

function initViewModel(Property) {
	_viewModel.set("guid", Property.guid);
	_viewModel.set("title", Property.title);
	_viewModel.set("price", Property.price);
	_viewModel.set("property_type", Property.property_type);
	_viewModel.set("img_url", Property.img_url);
	_viewModel.set("thumb_url", Property.thumb_url);
	_viewModel.set("summary", Property.summary);
	_viewModel.set("bedroom_number", Property.bedroom_number);
	_viewModel.set("bathroom_number", Property.bathroom_number);
	_viewModel.set("latitude", Property.latitude);
	_viewModel.set("longitude", Property.longitude);
	_viewModel.set("isFavourite", Property.isFavourite);
}

exports.initViewModel = initViewModel;
exports.model = _viewModel;
